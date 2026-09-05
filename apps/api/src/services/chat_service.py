import json
import re

from collections.abc import AsyncIterator
from sqlalchemy.ext.asyncio import AsyncSession

from src.llm.factory import get_llm
from src.utils.context_builder import context_service
from src.services.retrieval_service import retrieval_service
from src.services.chat_memory import chat_memory
from src.services.intent_service import classify_intent
from src.services.time_filter import TimeFilter, detect_lang, parse_time_filter
from datetime import datetime


_OFF_TOPIC_PATTERNS = re.compile(
    r"không có (bài viết|thông tin)(\s+nào|\s+gì|\s+về)|"
    r"không tìm thấy (bài viết|thông tin)|"
    r"không đủ thông tin|"
    r"no articles? (found|available|match)|"
    r"no information (about|for)|"
    r"not (enough|found|available)|"
    r"找不到|"
    r"찾지 못했습니다|"
    r"충분한 정보|"
    r"관련된 뉴스를 찾지 못",
    re.IGNORECASE,
)


def _is_no_info_answer(answer: str) -> bool:
    return _OFF_TOPIC_PATTERNS.search(answer) is not None


OFF_TOPIC_ANSWER = (
    "Xin lỗi, tôi không có thông tin để trả lời câu hỏi này. "
    "Tôi chỉ có thể trợ giúp về các tin tức trong nguồn dữ liệu của mình."
)

_NO_NEWS_MESSAGES = {
    "vi": "Không có tin tức hôm nay trong nguồn dữ liệu.",
    "ko": "오늘 뉴스가 없습니다.",
    "en": "No news available for today.",
}
_NO_YESTERDAY_MESSAGES = {
    "vi": "Không có tin tức hôm qua trong nguồn dữ liệu.",
    "ko": "어제 뉴스가 없습니다.",
    "en": "No news available for yesterday.",
}
_NO_RELATED_MESSAGES = {
    "vi": "Không tìm thấy tin tức liên quan trong nguồn dữ liệu.",
    "ko": "관련된 뉴스를 찾지 못했습니다.",
    "en": "No related news found in the data source.",
}
_NO_RELATED_DEFAULT = "관련된 뉴스를 찾지 못했습니다."


def _no_news_message(query: str, time_filter: TimeFilter | None) -> str:
    lang = detect_lang(query)
    if time_filter is None:
        return _NO_RELATED_MESSAGES.get(lang, _NO_RELATED_DEFAULT)
    today = datetime.now(time_filter.start.tzinfo).date()
    if time_filter.start.date() == today:
        return _NO_NEWS_MESSAGES.get(lang, _NO_RELATED_DEFAULT)
    return _NO_YESTERDAY_MESSAGES.get(lang, _NO_RELATED_DEFAULT)


def _format_history(history: list[dict[str, str]]) -> str:
    if not history:
        return "None"
    lines = [f"{m['role']}: {m['content']}" for m in history]
    return "\n".join(lines)


class ChatService:
    def _build_sources(self, articles) -> list[dict]:
        return [
            {
                "id": article.id,
                "title": article.korean_title,
                "url": article.url,
                "published_at": article.published_at.isoformat()
                if article.published_at
                else None,
            }
            for article in articles
        ]

    def _build_prompt(
        self, question: str, context: str, history: list[dict[str, str]] | None = None
    ) -> str:
        conversation = _format_history(history or [])
        return f"""
            You are a multilingual Korean news AI assistant.

            Your task is to answer the user's question using ONLY the
            provided news context.

            IMPORTANT RULES:
            - Use ONLY the information provided in the news context.
            - Do not use outside knowledge.
            - Do not invent or assume facts.
            - Do not repeat the prompt or the news context.
            - Answer clearly, naturally, and concisely.
            - Detect the language of the user's question.
            - Answer in the SAME LANGUAGE as the user's question.
            - If the user asks in Vietnamese, answer in Vietnamese.
            - If the user asks in Korean, answer in Korean.
            - If the user asks in English, answer in English.
            - If the user asks in another language, answer in that language.
            - Preserve names, numbers, dates, organizations, and other factual
            information accurately.
            - If the provided context does not contain enough information to
            answer the question, clearly state that there is not enough
            information in the provided news context.
            - Do not use information from your general knowledge to fill missing
            information.
            - Use the previous conversation below, if any, to understand the
            context of follow-up questions (pronouns, references, etc.).

            Previous Conversation:
            {conversation}

            User Question:
            {question}

            News Context:
            {context}

            Now answer the user's question directly.

            Answer:
            """.strip()

    def _build_speech_prompt(
        self, message: str, history: list[dict[str, str]] | None = None
    ) -> str:
        conversation = _format_history(history or [])
        return f"""
            You are a multilingual Korean news AI assistant.

            The user sent a casual message (greeting, thanks, small talk).
            Respond warmly and briefly, in the SAME LANGUAGE as the user's
            message. Do not mention news articles or sources. You may invite
            the user to ask about the latest news.

            Conversation History:
            {conversation}

            User Message:
            {message}

            Reply:
            """.strip()

    async def chat(
        self,
        db: AsyncSession,
        question: str,
        session_id: str | None = None,
    ):
        history = chat_memory.history(session_id) if session_id else []
        if session_id:
            chat_memory.add_user_message(session_id, question)

        llm_client = get_llm()
        intent = await classify_intent(question, history)

        if intent.get("off_topic"):
            answer = OFF_TOPIC_ANSWER
            if session_id:
                chat_memory.add_assistant_message(session_id, answer)
            return {"answer": answer, "sources": []}

        if intent.get("speech_mode"):
            prompt = self._build_speech_prompt(question, history)
            answer = await llm_client.generate(prompt, response_format="text")
            if session_id:
                chat_memory.add_assistant_message(session_id, answer)
            return {"answer": answer, "sources": []}

        return await self._answer_news(
            db=db, question=question, history=history, session_id=session_id
        )

    async def _answer_news(
        self,
        db: AsyncSession,
        question: str,
        history: list[dict[str, str]] | None,
        session_id: str | None,
    ) -> dict:
        time_filter = parse_time_filter(question)

        articles = await retrieval_service.search(
            db=db,
            query=question,
            limit=5,
            time_filter=time_filter,
        )

        if not articles:
            answer = _no_news_message(question, time_filter)
            if session_id:
                chat_memory.add_assistant_message(session_id, answer)
            return {"answer": answer, "sources": []}

        context = context_service.build(articles)
        prompt = self._build_prompt(question, context, history)

        llm_client = get_llm()
        answer = await llm_client.generate(prompt, response_format="text")

        if session_id:
            chat_memory.add_assistant_message(session_id, answer)

        sources = (
            self._build_sources(articles) if not _is_no_info_answer(answer) else []
        )

        return {
            "answer": answer,
            "sources": sources,
        }

    async def chat_stream(
        self,
        db: AsyncSession,
        question: str,
        session_id: str | None = None,
    ) -> AsyncIterator[str]:
        history = chat_memory.history(session_id) if session_id else []
        if session_id:
            chat_memory.add_user_message(session_id, question)

        llm_client = get_llm()
        intent = await classify_intent(question, history)

        sources: list[dict] = []

        if intent.get("off_topic"):
            answer = OFF_TOPIC_ANSWER
            if session_id:
                chat_memory.add_assistant_message(session_id, answer)
            async for item in self._yield_answer(answer, sources):
                yield item
            return

        if intent.get("speech_mode"):
            prompt = self._build_speech_prompt(question, history)
            collected: list[str] = []
            async for token in llm_client.generate_stream(prompt):
                collected.append(token)
                data = json.dumps({"type": "token", "content": token})
                yield f"data: {data}\n\n"
            answer = "".join(collected)
            if session_id:
                chat_memory.add_assistant_message(session_id, answer)
            async for item in self._yield_sources_and_done(sources):
                yield item
            return

        time_filter = parse_time_filter(question)
        articles = await retrieval_service.search(
            db=db, query=question, limit=5, time_filter=time_filter
        )

        if not articles:
            answer = _no_news_message(question, time_filter)
            if session_id:
                chat_memory.add_assistant_message(session_id, answer)
            async for item in self._yield_answer(answer, []):
                yield item
            return

        sources = self._build_sources(articles)
        context = context_service.build(articles)
        prompt = self._build_prompt(question, context, history)

        collected = []
        async for token in llm_client.generate_stream(prompt):
            collected.append(token)
            data = json.dumps({"type": "token", "content": token})
            yield f"data: {data}\n\n"

        if session_id:
            chat_memory.add_assistant_message(session_id, "".join(collected))

        final_answer = "".join(collected)
        yield_sources = [] if _is_no_info_answer(final_answer) else sources
        async for item in self._yield_sources_and_done(yield_sources):
            yield item

    async def _yield_answer(self, answer: str, sources: list[dict]):
        data = json.dumps({"type": "token", "content": answer})
        yield f"data: {data}\n\n"
        async for item in self._yield_sources_and_done(sources):
            yield item

    async def _yield_sources_and_done(self, sources: list[dict]):
        data = json.dumps({"type": "sources", "sources": sources})
        yield f"data: {data}\n\n"
        yield "data: [DONE]\n\n"


chat_service = ChatService()
