import json

from collections.abc import AsyncIterator
from sqlalchemy.ext.asyncio import AsyncSession

from src.llm.factory import get_llm
from src.utils.context_builder import context_service
from src.services.retrieval_service import retrieval_service


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

    def _build_prompt(self, question: str, context: str) -> str:
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

            User Question:
            {question}

            News Context:
            {context}

            Now answer the user's question directly.

            Answer:
            """.strip()

    async def chat(
        self,
        db: AsyncSession,
        question: str,
    ):
        articles = await retrieval_service.search(
            db=db,
            query=question,
            limit=5,
        )

        if not articles:
            return {
                "answer": "관련된 뉴스를 찾지 못했습니다.",
                "sources": [],
            }

        context = context_service.build(articles)
        prompt = self._build_prompt(question, context)

        llm_client = get_llm()
        answer = await llm_client.generate(prompt, response_format="text")

        return {
            "answer": answer,
            "sources": self._build_sources(articles),
        }

    async def chat_stream(
        self,
        db: AsyncSession,
        question: str,
    ) -> AsyncIterator[str]:
        articles = await retrieval_service.search(
            db=db,
            query=question,
            limit=5,
        )

        if not articles:
            data = json.dumps({"type": "sources", "sources": []})
            yield f"data: {data}\n\n"
            yield "data: [DONE]\n\n"
            return

        sources = self._build_sources(articles)
        context = context_service.build(articles)
        prompt = self._build_prompt(question, context)

        llm_client = get_llm()
        async for token in llm_client.generate_stream(prompt):
            data = json.dumps({"type": "token", "content": token})
            yield f"data: {data}\n\n"

        data = json.dumps({"type": "sources", "sources": sources})
        yield f"data: {data}\n\n"
        yield "data: [DONE]\n\n"


chat_service = ChatService()
