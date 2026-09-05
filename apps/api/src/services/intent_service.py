import json
import re

from src.llm.factory import get_llm


def _extract_json(text: str) -> dict:
    """Best-effort extraction of a JSON object from an LLM text response."""
    text = text.strip()
    fenced = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    if fenced:
        text = fenced.group(1)
    start = text.find("{")
    if start == -1:
        return {}
    depth = 0
    end = len(text)
    for i in range(start, len(text)):
        if text[i] == "{":
            depth += 1
        elif text[i] == "}":
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    try:
        return json.loads(text[start:end])
    except (json.JSONDecodeError, ValueError):
        return {}


async def classify_intent(
    question: str,
    history: list[dict[str, str]] | None = None,
) -> dict[str, bool]:
    """Use the LLM to decide how to handle the user's message.

    Returns a dict with the keys:
      - speech_mode: bool  -> greeting / thanks / small talk (free-form reply)
      - needs_news: bool   -> asks about the news (use retrieval + sources)
      - off_topic: bool    -> unrelated to news and not small talk
    """
    conversation = (
        "\n".join(f"{m['role']}: {m['content']}" for m in (history or [])) or "None"
    )

    prompt = f"""
        You are a routing classifier for a news AI assistant that only answers
        questions based on provided news articles.

        Given the conversation history and the latest user message, classify it
        into exactly one of these categories:

        1. speech_mode = true: The message is a greeting, thanks, goodbye or
           casual small talk (e.g. "hello", "hi", "thanks", "bye", "how are you").
        2. needs_news = true: The message is asking about news, current events,
           an article, a topic, or anything the assistant should answer using
           news context. This includes follow-up questions referring to a
           previously discussed news topic (check the history).
        3. off_topic = true: The message is a real question/task but entirely
           unrelated to news and not small talk (e.g. "write me python code",
           "what is 5+5", math, coding, general knowledge, personal help).

        Reply with a single JSON object with exactly these boolean keys:
        {{ "speech_mode": bool, "needs_news": bool, "off_topic": bool }}

        Conversation History:
        {conversation}

        Latest User Message:
        {question}

        JSON:
        """.strip()

    llm_client = get_llm()
    try:
        raw = await llm_client.generate(prompt, response_format="json")
    except Exception:
        # On failure, default to treating it as a news question.
        return {"speech_mode": False, "needs_news": True, "off_topic": False}

    data = _extract_json(raw)
    return {
        "speech_mode": bool(data.get("speech_mode", False)),
        "needs_news": bool(data.get("needs_news", False)),
        "off_topic": bool(data.get("off_topic", False)),
    }
