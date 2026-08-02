from src.llm.factory import get_llm
import json
from typing import TypedDict


class SummarizeRequest(TypedDict):
    article_id: int
    content: str


class SummarizeResponse(TypedDict):
    article_id: int
    korean_summary: str
    vietnamese_summary: str
    topics: list[str]


class LLMSummarize:
    def __init__(self):
        self.llm = get_llm()

    async def summarize(self, content):

        prompt = f"""
            You are a professional Korean news summarization AI.

            Process this Korean news article.

            Return ONLY JSON.

            Schema:

            {{
                "korean_summary": "...",
                "vietnamese_summary": "...",
                "topics": []
            }}

            Rules:

            - Keep article_id unchanged.
            - Korean summary:
            - 3-5 sentences
            - factual only
            - no opinions
            - no hallucination

            - Vietnamese summary:
            - translate ONLY Korean summary

            - topics:
            - 3-5 Korean keywords
            - prefer people, companies, organizations, locations

            If article is invalid:
            - korean_summary = null
            - vietnamese_summary = null
            - topics = []

            Article:

            {content}
            """

        result = await self.llm.generate(prompt)
        print("================ RAW RESULT ================")
        print(repr(result))
        print("===========================================")
        return json.loads(result)


llm_summarize = LLMSummarize()
