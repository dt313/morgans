"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Icon } from "@/components/ui/icon";
import { sendMessageStream, type ChatSource } from "@/services/chat-service";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const assistantId = crypto.randomUUID();
    const THINKING = "…";
    let accumulated = "";
    let hasStreamed = false;

    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: THINKING,
      },
    ]);

    try {
      for await (const event of sendMessageStream(text)) {
        if (event.type === "token" && event.content) {
          if (!hasStreamed) {
            hasStreamed = true;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: accumulated + event.content }
                  : m,
              ),
            );
            accumulated += event.content;
          } else {
            accumulated += event.content;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: accumulated } : m,
              ),
            );
          }
        } else if (event.type === "sources") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, sources: event.sources } : m,
            ),
          );
        }
      }

      if (!hasStreamed) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: accumulated || "No response received." }
              : m,
          ),
        );
      }
    } catch {
      setMessages((prev) => {
        const exists = prev.find((m) => m.id === assistantId);
        if (exists) {
          return prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: accumulated || "Sorry, something went wrong." }
              : m,
          );
        }
        return [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none sm:inset-auto sm:bottom-5 sm:right-5 sm:flex sm:flex-col sm:items-end sm:pointer-events-auto"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {isOpen && (
        <div
          className={`pointer-events-auto flex h-full w-full flex-col overflow-hidden bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-none sm:mb-3 sm:rounded-xl sm:border sm:border-[#e6e6e6] sm:transition-[width,height] sm:duration-200 ${
            isExpanded
              ? "sm:h-[min(100dvh-96px,700px)] sm:w-[640px]"
              : "sm:h-[min(72dvh,520px)] sm:w-[380px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-[#e6e6e6] bg-[#f9f9f9] px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#1a8917] text-white">
                <Icon name="chat" size={16} />
              </span>
              <div className="min-w-0">
                <h3 className="m-0 truncate text-sm font-semibold text-[#242424]">
                  News AI
                </h3>
                <p className="m-0 text-[11px] text-[#6b6b6b]">
                  Ask about any news
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => setIsExpanded((v) => !v)}
                className="hidden size-7 place-items-center rounded-full border border-[#e6e6e6] bg-white text-[#3d3d3d] transition-colors hover:bg-[#f3f3f3] sm:grid"
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 9 3 3m0 0h6M3 3v6M15 15l6 6m0 0h-6m6 0v-6" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 3H3v6M21 3l-6 6M15 21h6v-6M3 21l6-6" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="grid size-7 place-items-center rounded-full border-0 bg-transparent text-[#6b6b6b] transition-colors hover:bg-[#f3f3f3] hover:text-[#242424]"
                title="Close"
              >
                <Icon name="close" size={17} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="mb-2 text-3xl">📰</span>
                <p className="m-0 text-sm font-semibold text-[#242424]">
                  What&apos;s happening in the news?
                </p>
                <p className="mt-1 text-xs text-[#6b6b6b]">
                  Ask me anything about today&apos;s articles
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1a8917] text-white"
                      : "bg-[#f5f5f5] text-[#242424]"
                  }`}
                >
                  {msg.role === "assistant" &&
                  msg.content === "…" &&
                  isLoading ? (
                    <span className="inline-flex gap-1">
                      <span
                        className="inline-block size-1.5 animate-bounce rounded-full bg-[#999]"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="inline-block size-1.5 animate-bounce rounded-full bg-[#999]"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="inline-block size-1.5 animate-bounce rounded-full bg-[#999]"
                        style={{ animationDelay: "300ms" }}
                      />
                    </span>
                  ) : msg.role === "assistant" ? (
                    <span className="prose-chat">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="m-0 last:mb-0">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="my-1.5 list-disc pl-5">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="my-1.5 list-decimal pl-5">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="my-0.5">{children}</li>
                          ),
                          h1: ({ children }) => (
                            <h1 className="m-0 mt-2 mb-1 text-base font-bold">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="m-0 mt-2 mb-1 text-[15px] font-bold">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="m-0 mt-2 mb-1 text-sm font-bold">
                              {children}
                            </h3>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-bold">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic">{children}</em>
                          ),
                          code: ({ children }) => (
                            <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[12px]">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="my-1.5 overflow-x-auto rounded-lg bg-[#f0f0f0] p-2 font-mono text-[12px]">
                              {children}
                            </pre>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#247b22] underline underline-offset-2 hover:text-[#1a8917]"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                      {isLoading &&
                        !msg.sources &&
                        msg.content ===
                          messages[messages.length - 1]?.content && (
                          <span
                            className="ml-0.5 inline-block w-1.5 animate-pulse bg-[#242424]"
                            style={{ height: 14, verticalAlign: "text-bottom" }}
                          />
                        )}
                    </span>
                  ) : (
                    <p className="m-0 whitespace-pre-wrap">{msg.content}</p>
                  )}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 border-t border-[#e6e6e6] pt-2">
                      <p className="m-0 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#6b6b6b]">
                        Sources
                      </p>
                      {msg.sources.map((src) => (
                        <a
                          key={src.id}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate text-[11px] text-[#247b22] no-underline hover:underline"
                        >
                          {src.title ?? src.url}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages.length === 0 && (
              <div className="mb-3 flex justify-start">
                <div className="rounded-xl bg-[#f5f5f5] px-3.5 py-2.5 text-[13px]">
                  <span className="inline-flex gap-1">
                    <span
                      className="inline-block size-1.5 animate-bounce rounded-full bg-[#999]"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="inline-block size-1.5 animate-bounce rounded-full bg-[#999]"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="inline-block size-1.5 animate-bounce rounded-full bg-[#999]"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-[#e6e6e6] px-3 py-2.5"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the news..."
              disabled={isLoading}
              className="flex-1 rounded-lg border border-[#e6e6e6] bg-[#f9f9f9] px-3 py-2 text-[13px] text-[#242424] outline-none transition-colors placeholder:text-[#999] focus:border-[#1a8917]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="grid size-9 place-items-center rounded-lg border-0 bg-[#1a8917] text-white transition-all hover:bg-[#146f12] disabled:opacity-40"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Toggle button - only shown when chat is closed */}
      <button
        onClick={() => setIsOpen(true)}
        className={`pointer-events-auto fixed bottom-5 right-5 z-10 flex size-14 items-center justify-center rounded-full border-0 bg-[#1a8917] text-white shadow-[0_4px_16px_rgba(26,137,23,0.35)] transition-all hover:bg-[#146f12] hover:shadow-[0_6px_20px_rgba(26,137,23,0.45)] hover:scale-105 active:scale-95 ${
          isOpen ? "hidden" : "flex"
        }`}
      >
        <Icon name="chat" size={24} />
      </button>
    </div>
  );
}
