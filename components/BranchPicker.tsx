"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "./ui/Button";

export function BranchPicker({
  branches,
  isEnding,
  onPick,
  onRestart,
}: {
  branches: string[];
  isEnding: boolean;
  onPick: (branch: string) => void;
  onRestart: () => void;
}) {
  if (isEnding) {
    return (
      <div className="border-t border-line pt-5 mt-2">
        <p className="font-serif italic text-ink-muted mb-4">
          The arc lands here. Continue with an epilogue beat — or start a brand new tale.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          {branches.map((b, i) => (
            <Button key={i} variant="branch" onClick={() => onPick(b)}>
              <span className="text-[11px] font-mono uppercase text-accent mr-2">epilogue</span>
              {b}
            </Button>
          ))}
        </div>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-accent-glow transition mt-3"
        >
          <RotateCcw className="size-3" /> Tell another story
        </button>
      </div>
    );
  }

  return (
    <div className="border-t border-line pt-5 mt-2">
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-3">
        what next? pick one →
      </p>
      <div className="space-y-2">
        {branches.map((b, i) => (
          <Button key={i} variant="branch" onClick={() => onPick(b)}>
            <span className="text-[11px] font-mono text-accent mr-2 tabular-nums">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="flex-1">{b}</span>
            <ArrowRight className="size-4 text-ink-dim shrink-0" />
          </Button>
        ))}
      </div>
    </div>
  );
}
