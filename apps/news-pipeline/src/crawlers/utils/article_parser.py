import trafilatura


class ArticleContentFetcher:
    def fetch(self, url: str) -> str | None:
        """
        Tải trang từ url và trích xuất nội dung text chính.
        Trả về None nếu không tải được hoặc không trích xuất được.
        """
        downloaded = trafilatura.fetch_url(url)
        if downloaded is None:
            return None

        text = trafilatura.extract(
            downloaded,
            include_comments=False,
            include_tables=True,
            favor_recall=True,  # ưu tiên lấy được nhiều nội dung hơn, tránh trả None
        )
        return text


article_content_parser = ArticleContentFetcher()
