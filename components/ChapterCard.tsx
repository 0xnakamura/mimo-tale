"use client";

import { Sparkles, Image as ImageIcon, AudioLines } from "lucide-react";
import type { ResolvedChapter } from "@/lib/schemas";
import { AudioPlayer } from "./AudioPlayer";
import { BranchPicker } from "./BranchPicker";

type Stage = "idle" | "reasoning" | "illustrating" | "narrating" | "ready" | "error";

export function ChapterCard({
  chapter,
  stage,
  isLast,
  onPick,
  onRestart,
}: {
  chapter: ResolvedChapter | null;
  stage: Stage;
  isLast: boolean;
  onPick: (branch: string) => void;
  onRestart: () => void;
}) {
  if (!chapter) {
    return <ChapterSkeleton stage={stage} />;
  }

  return (
    <article className="animate-page-turn bg-bg-soft border border-line rounded-2xl shadow-page overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <figure className="relative aspect-square md:aspect-auto md:min-h-[420px] bg-bg-muted overflow-hidden border-b md:border-b-0 md:border-r border-line">
          {chapter.image_data_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={chapter.image_data_url}
              alt={chapter.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-ink-dim">
              <ImageIcon className="size-12 opacity-30" />
            </div>
          )}
          <div className="absolute top-3 left-3 px-2 py-1 rounded bg-bg/80 backdrop-blur text-[10px] font-mono uppercase tracking-wider text-ink-muted border border-line">
            ch.{chapter.index.toString().padStart(2, "0")} · {chapter.source}
          </div>
        </figure>

        <div className="p-6 md:p-8 flex flex-col">
          <header className="mb-4">
            <h2 className="font-serif text-2xl md:text-3xl text-ink-DEFAULT mb-1.5 leading-tight">
              {chapter.title}
            </h2>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-ink-dim">
              <Sparkles className="size-3" /> reasoner · multimodal · tts
            </div>
          </header>

          <div className="font-serif text-[15px] md:text-base text-ink-soft leading-relaxed whitespace-pre-wrap mb-5 flex-1">
            {chapter.text}
          </div>

          <div className="mb-5">
            <AudioPlayer
              src={chapter.audio_data_url}
              label={`Narration · chapter ${chapter.index}`}
            />
          </div>

          {isLast && (
            <BranchPicker
              branches={chapter.branches}
              isEnding={chapter.is_ending}
              onPick={onPick}
              onRestart={onRestart}
            />
          )}
        </div>
      </div>
    </article>
  );
}

function ChapterSkeleton({ stage }: { stage: Stage }) {
  const phases = [
    { key: "reasoning", label: "Storyteller (reasoner)", icon: Sparkles },
    { key: "illustrating", label: "Illustrator (multimodal)", icon: ImageIcon },
    { key: "narrating", label: "Narrator (TTS)", icon: AudioLines },
  ];
  const order: Stage[] = ["reasoning", "illustrating", "narrating", "ready"];
  const currentIdx = Math.max(0, order.indexOf(stage));

  return (
    <article className="bg-bg-soft border border-line rounded-2xl p-8 shadow-page animate-fade-in">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-muted mb-5">
        generating chapter ·
      </p>
      <ul className="space-y-3">
        {phases.map((p, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx && stage !== "ready" && stage !== "error";
          const Icon = p.icon;
          return (
            <li
              key={p.key}
              className={`flex items-center gap-3 text-sm ${
                done ? "text-accent-glow" : active ? "text-ink-DEFAULT animate-pulse-soft" : "text-ink-dim"
              }`}
            >
              <span
                className={`size-7 rounded-full grid place-items-center border ${
                  done
                    ? "bg-accent/20 border-accent"
                    : active
                    ? "border-accent-glow"
                    : "border-line"
                }`}
              >
                <Icon className="size-3.5" />
              </span>
              <span className="font-serif">{p.label}</span>
              {active && <span className="ml-auto text-[11px] font-mono uppercase">working…</span>}
              {done && <span className="ml-auto text-[11px] font-mono uppercase">done</span>}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
