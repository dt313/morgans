import json
from typing import TypedDict

from src.core.logger import get_logger
from src.llm.factory import get_llm

logger = get_logger(__name__)


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

    async def summarize(self, title, content):

        prompt = f"""
        You are a professional Korean news processing and translation AI.

        Your task is to process a Korean news article and produce:
        1. A Vietnamese title
        2. A Korean summary
        3. A Vietnamese translation of the Korean summary
        4. Important Korean topics

        IMPORTANT:
        - First, identify and ignore meaningless or non-news content.
        - Only use meaningful information from the actual news article.
        - Do not invent, infer, assume, or add information that is not explicitly stated.
        - Return ONLY a valid JSON object.
        - Do NOT use Markdown code fences.
        - Do NOT add any explanation outside the JSON object.

        MEANINGLESS CONTENT

        Ignore the following content when processing the article:

        - Advertisements and promotional content
        - Subscription or membership notices
        - Cookie/privacy notices
        - Copyright notices
        - Social media sharing buttons or text
        - "Related articles" / "Recommended articles"
        - Navigation menus
        - Reporter contact information
        - Video player metadata
        - Unrelated image captions
        - Repeated text
        - Website UI text
        - Footer/header content unrelated to the article
        - SEO keywords
        - Automatically generated metadata
        - Unrelated links
        - Any text that does not contribute meaningful information to the news story

        OUTPUT SCHEMA

        {{
            "vietnamese_title": "...",
            "korean_summary": "...",
            "vietnamese_summary": "...",
            "topics": []
        }}

        RULES

        1. Vietnamese title

        - Translate the Korean news title into natural Vietnamese.
        - Keep the original meaning.
        - Do not add information.
        - Do not sensationalize the title.
        - Preserve names of people, companies, organizations, and locations.
        - Do not translate proper nouns when they should remain unchanged.

        2. Korean summary

        - Write a concise summary in natural Korean.
        - 3-5 sentences.
        - Include only the most important facts.
        - Preserve important:
        - People
        - Organizations
        - Companies
        - Locations
        - Dates
        - Numbers
        - Events
        - Do not add opinions.
        - Do not make assumptions.
        - Do not hallucinate.
        - Do not repeat the same information.
        - Do not include meaningless website content.

        3. Vietnamese summary

        - Translate ONLY the Korean summary into natural Vietnamese.
        - Do not summarize the original article independently.
        - Do not add information.
        - Preserve all important facts from the Korean summary.
        - Preserve names, organizations, locations, dates, and numbers.
        - Do not add opinions or explanations.

        4. Topics

        - Extract 3-5 important Korean keywords.
        - Prefer specific entities and subjects such as:
        - People
        - Companies
        - Organizations
        - Locations
        - Important events
        - Important technologies
        - Important issues
        - Avoid generic keywords such as:
        - 뉴스
        - 기사
        - 한국
        - 오늘
        unless they are genuinely important to the article.

        5. Invalid article

        If the article does not contain meaningful news content, return:

        {{
            "vietnamese_title": null,
            "korean_summary": null,
            "vietnamese_summary": null,
            "topics": []
        }}

        6. FINAL REQUIREMENTS

        - Ignore meaningless content before summarization.
        - Do not translate meaningless content.
        - Do not include advertisements or website boilerplate.
        - Do not mention that content was removed.
        - Do not explain your processing.
        - Return ONLY valid JSON.

        KOREAN TITLE:
        {title}

        ARTICLE:
        {content}
        """

        result = await self.llm.generate(prompt)
        logger.debug("RAW RESULT: %s", repr(result))
        return json.loads(result)


llm_summarize = LLMSummarize()
