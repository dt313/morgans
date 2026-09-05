import threading

from collections import OrderedDict


class ChatMemory:
    """In-memory per-session conversation history (not persisted to DB).

    Safe for concurrent access via a lock. Keeps a maximum of
    ``max_turns`` exchanges (each exchange = user + assistant message)
    per session, evicting the oldest first.
    """

    def __init__(self, max_turns: int = 8):
        self._max_turns = max_turns
        self._sessions: dict[str, OrderedDict] = {}
        self._lock = threading.Lock()

    def _ensure(self, session_id: str) -> OrderedDict:
        if session_id not in self._sessions:
            self._sessions[session_id] = OrderedDict()
        return self._sessions[session_id]

    def history(self, session_id: str) -> list[dict[str, str]]:
        with self._lock:
            return list(self._ensure(session_id).values())

    def add_user_message(self, session_id: str, content: str) -> None:
        with self._lock:
            session = self._ensure(session_id)
            session[f"user:{len(session) + 1}"] = {
                "role": "user",
                "content": content,
            }
            self._prune(session)

    def add_assistant_message(self, session_id: str, content: str) -> None:
        with self._lock:
            session = self._ensure(session_id)
            session[f"assistant:{len(session)}"] = {
                "role": "assistant",
                "content": content,
            }
            self._prune(session)

    def clear(self, session_id: str) -> None:
        with self._lock:
            self._sessions.pop(session_id, None)

    def _prune(self, session: OrderedDict) -> None:
        """Keep at most max_turns pairs of user/assistant messages."""
        max_messages = self._max_turns * 2
        while len(session) > max_messages:
            session.popitem(last=False)


chat_memory = ChatMemory()
