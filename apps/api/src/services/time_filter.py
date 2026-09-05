"""Parse temporal constraints (e.g. "today") out of a user query.

Only calendar-day resolution is supported, anchored to Asia/Seoul. The
resulting range is ``[start, end)`` so that microseconds at ``23:59:59.999``
are included cleanly.
"""

import re

from dataclasses import dataclass
from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

KST = ZoneInfo("Asia/Seoul")

_TODAY_PATTERN = re.compile(r"(hôm\s+nay|오늘|today)", re.IGNORECASE)
_YESTERDAY_PATTERN = re.compile(r"(hôm\s+qua|어제|yesterday)", re.IGNORECASE)
_LANG_PATTERN = re.compile(r"(hôm\s+nay|hôm\s+qua)")
_KO_PATTERN = re.compile(r"(오늘|어제)")
_EN_PATTERN = re.compile(r"(today|yesterday)", re.IGNORECASE)


@dataclass(frozen=True)
class TimeFilter:
    start: datetime
    end: datetime


def detect_lang(query: str) -> str:
    """Best-effort language hint (vi/ko/en) from the matched time phrase."""
    if _LANG_PATTERN.search(query):
        return "vi"
    if _KO_PATTERN.search(query):
        return "ko"
    if _EN_PATTERN.search(query):
        return "en"
    return "vi"


def parse_time_filter(query: str) -> TimeFilter | None:
    """Return a calendar-day KST range if the query mentions today/yesterday."""
    now = datetime.now(KST)
    today_start = datetime.combine(now.date(), time.min, tzinfo=KST)

    is_yesterday = _YESTERDAY_PATTERN.search(query) is not None
    has_time_hint = _TODAY_PATTERN.search(query) is not None or is_yesterday
    if not has_time_hint:
        return None

    if is_yesterday:
        start = today_start - timedelta(days=1)
    else:
        start = today_start

    return TimeFilter(start=start, end=start + timedelta(days=1))
