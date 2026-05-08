"use client";

import { useEffect, useState } from "react";
import { KeyRound, X } from "lucide-react";
import { Button } from "./ui/Button";
import { Field, Input } from "./ui/Input";

export function ApiKeyButton({
  apiKey,
  onChange,
}: {
  apiKey: string;
  onChange: (k: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(apiKey);

  useEffect(() => setDraft(apiKey), [apiKey, open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-accent-glow transition"
      >
        <KeyRound className="size-3.5" />
        {apiKey ? "key set · live mimo" : "no key · mock mode"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md bg-bg-soft border border-line rounded-xl shadow-page p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl">MiMo API Key</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-ink-muted hover:text-ink-DEFAULT"
                aria-label="close"
              >
                <X className="size-5" />
              </button>
            </header>
            <p className="text-sm text-ink-muted mb-5">
              Paste a key from{" "}
              <a
                href="https://platform.xiaomimimo.com"
                target="_blank"
                rel="noreferrer"
                className="text-accent-glow underline underline-offset-2"
              >
                platform.xiaomimimo.com
              </a>
              . It&apos;s kept in your browser only and forwarded to MiMo from
              the server route. Leave blank to use deterministic mock mode.
            </p>
            <Field label="Key" hint="sk-...">
              <Input
                type="password"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="sk-..."
                autoFocus
                spellCheck={false}
              />
            </Field>
            <div className="flex gap-2 justify-end mt-5">
              <Button
                variant="secondary"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
              >
                Clear (use mock)
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onChange(draft.trim());
                  setOpen(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
