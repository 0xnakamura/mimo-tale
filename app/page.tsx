"use client";

import { useState } from "react";
import { BookOpen, Github } from "lucide-react";
import { useStoryStore } from "@/lib/store";
import { runChapterClient } from "@/lib/runStory";
import type { StorySetup } from "@/lib/schemas";
import { StorySetupForm } from "@/components/StorySetup";
import { ChapterCard } from "@/components/ChapterCard";
import { ApiKeyButton } from "@/components/ApiKeyDialog";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const {
    setup,
    chapters,
    stage,
    generating,
    apiKey,
    error,
    setSetup,
    setApiKey,
    beginChapter,
    setStage,
    appendChapter,
    patchLastImage,
    patchLastAudio,
    setError,
    reset,
  } = useStoryStore();

  const [pendingIdx, setPendingIdx] = useState<number | null>(null);

  async function generate(args: { setupArg: StorySetup; userChoice?: string }) {
    const nextIdx = chapters.length + 1;
    setPendingIdx(nextIdx);
    beginChapter(nextIdx);

    const history = chapters.map(
      ({ image_data_url, audio_data_url, generated_at, source, ...c }) => c,
    );

    try {
      const stream = runChapterClient({
        setup: args.setupArg,
        history,
        userChoice: args.userChoice,
        apiKey: apiKey || undefined,
      });

      for await (const ev of stream) {
        if (ev.type === "chapter_text") {
          setStage(nextIdx, "illustrating");
        } else if (ev.type === "image_ready") {
          setStage(nextIdx, "narrating");
          // we don't have the chapter in the list yet; cached on chapter_done
        } else if (ev.type === "audio_ready") {
          // no-op until chapter_done
        } else if (ev.type === "chapter_done") {
          appendChapter(ev.chapter);
        } else if (ev.type === "error") {
          setError(ev.message);
        }
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPendingIdx(null);
    }
  }

  function onStart(s: StorySetup) {
    setSetup(s);
    void generate({ setupArg: s });
  }

  function onPick(branch: string) {
    if (!setup) return;
    void generate({ setupArg: setup, userChoice: branch });
  }

  const showSetupForm = !setup || chapters.length === 0;
  const lastIdx = chapters.length;

  return (
    <main className="container max-w-3xl mx-auto px-4 py-8 md:py-12">
      <Header apiKey={apiKey} onApiKey={setApiKey} onReset={reset} hasStory={!!setup && chapters.length > 0} />

      {error && (
        <div className="mb-6 px-4 py-3 rounded-md bg-bg-panel border border-accent/40 text-sm text-ink-DEFAULT animate-slide-up">
          <span className="text-accent-glow font-mono uppercase text-[11px] mr-2">error</span>
          {error}
        </div>
      )}

      {showSetupForm && !generating ? (
        <StorySetupForm onStart={onStart} />
      ) : (
        <div className="space-y-8">
          {chapters.map((c) => (
            <ChapterCard
              key={c.index}
              chapter={c}
              stage={stage[c.index] || "ready"}
              isLast={c.index === lastIdx && !generating}
              onPick={onPick}
              onRestart={reset}
            />
          ))}
          {generating && pendingIdx !== null && (
            <ChapterCard
              chapter={null}
              stage={stage[pendingIdx] || "reasoning"}
              isLast={false}
              onPick={onPick}
              onRestart={reset}
            />
          )}
        </div>
      )}
    </main>
  );
}

function Header({
  apiKey,
  onApiKey,
  onReset,
  hasStory,
}: {
  apiKey: string;
  onApiKey: (k: string) => void;
  onReset: () => void;
  hasStory: boolean;
}) {
  return (
    <header className="flex items-center justify-between mb-10">
      <div className="flex items-center gap-2">
        <BookOpen className="size-5 text-accent-glow" />
        <span className="font-serif text-lg">mimo-tale</span>
      </div>
      <nav className="flex items-center gap-5">
        {hasStory && (
          <Button variant="ghost" onClick={onReset}>
            New tale
          </Button>
        )}
        <ApiKeyButton apiKey={apiKey} onChange={onApiKey} />
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="text-ink-muted hover:text-ink-DEFAULT transition"
        >
          <Github className="size-4" />
        </a>
      </nav>
    </header>
  );
}
