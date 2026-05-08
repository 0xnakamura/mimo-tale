"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Compact audio player with a scrubbable progress bar.
 * Designed for chapter narration: one track per chapter card.
 */
export function AudioPlayer({ src, label }: { src: string; label: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setPosition(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    const target = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - target.left) / target.width;
    if (a && Number.isFinite(a.duration)) {
      a.currentTime = ratio * a.duration;
      setPosition(a.currentTime);
    }
  };

  const fmt = (s: number) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const ratio = duration ? position / duration : 0;

  return (
    <div className="flex items-center gap-3 bg-bg-soft/60 border border-line rounded-md px-3 py-2">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause narration" : "Play narration"}
        className="size-9 rounded-full bg-accent text-parchment hover:bg-accent-soft flex items-center justify-center transition"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4 translate-x-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] uppercase tracking-wider font-mono text-ink-muted truncate">
          {label}
        </div>
        <div
          className="h-1.5 rounded bg-line cursor-pointer mt-1 overflow-hidden"
          onClick={seek}
          role="slider"
          aria-valuenow={Math.floor(ratio * 100)}
        >
          <div
            className="h-full bg-accent-glow transition-[width] duration-150"
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>
      <div className="text-xs font-mono text-ink-dim tabular-nums w-16 text-right">
        {fmt(position)} / {fmt(duration)}
      </div>
    </div>
  );
}
