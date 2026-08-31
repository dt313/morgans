class ContextService:
    @staticmethod
    def build(articles) -> str:
        contexts = []

        for i, article in enumerate(articles, start=1):
            topics = ", ".join(article.topics or [])

            contexts.append(
                f"""
[NEWS {i}]
Article ID: {article.id}
Title: {article.korean_title}
Vietnamese Title: {article.vietnamese_title or ""}
Korean Summary: {article.korean_summary or ""}
Vietnamese Summary: {article.vietnamese_summary or ""}
Topics: {topics}
Published At: {article.published_at}
URL: {article.url}
""".strip()
            )

        return "\n\n".join(contexts)


context_service = ContextService()
