"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useLanguage } from "@/hooks/use-language";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

function formatTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function ArticleAudioPlayer({ articleId }: { articleId: string }) {
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "playing" | "paused" | "error"
  >("idle");
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  const src = `${API_BASE}/articles/${articleId}/audio?language=${language}`;

  const reset = useCallback(() => {
    setStatus("idle");
    setElapsed(0);
    setDuration(0);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    reset();
  }, [src, reset]);

  const start = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setStatus("loading");
    audio.src = src;
    audio
      .play()
      .then(() => setStatus("playing"))
      .catch(() => {
        setStatus("error");
        reset();
      });
  };

  const togglePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (status === "playing") {
      audio.pause();
      setStatus("paused");
    } else {
      audio.play().then(() => setStatus("playing"));
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    reset();
  };

  const active = status === "playing" || status === "paused";
  const progress = duration > 0 ? Math.min(1, elapsed / duration) : 0;

  return (
    <div className="audio-player" data-active={active}>
      <audio
        ref={audioRef}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration || 0)
        }
        onEnded={reset}
        preload="none"
      />
      {status === "error" ? (
        <span className="audio-error">Audio unavailable</span>
      ) : (
        <button
          className="audio-toggle"
          onClick={status === "idle" ? start : togglePause}
          aria-label={
            status === "playing" ? "Pause reading" : "Read article aloud"
          }
        >
          {status === "playing" ? (
            <Icon name="pause" size={16} />
          ) : (
            <Icon name="audio" size={16} />
          )}
          <span>
            {status === "loading" ? "Loading…" : active ? "Reading" : "Listen"}
          </span>
        </button>
      )}
      {active && (
        <div className="audio-progress-row">
          <span className="audio-time">{formatTime(elapsed)}</span>
          <div
            className="audio-progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div
              className="audio-progress-fill"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="audio-time">{formatTime(duration)}</span>
          <button
            className="audio-stop"
            onClick={stop}
            aria-label="Stop reading"
          >
            <Icon name="stop" size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
