import api from "@/lib/axios";

export interface ChatSource {
  id: number;
  title: string | null;
  url: string;
  published_at: string | null;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

export type StreamEvent =
  | { type: "token"; content: string }
  | { type: "sources"; sources: ChatSource[] };

export async function sendMessage(
  message: string,
  sessionId?: string,
): Promise<ChatResponse> {
  const response = await api.post<ChatResponse>("/chat", {
    message,
    session_id: sessionId,
  });
  return response.data;
}

export async function* sendMessageStream(
  message: string,
  sessionId?: string,
): AsyncGenerator<StreamEvent> {
  const base =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${base}/chat/stream`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message, session_id: sessionId }),
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;

      try {
        const parsed = JSON.parse(data) as StreamEvent;
        yield parsed;
      } catch {
        // skip malformed lines
      }
    }
  }
}
