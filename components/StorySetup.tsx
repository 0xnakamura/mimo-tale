"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Field, Input, Select, Textarea } from "./ui/Input";
import type { StorySetup } from "@/lib/schemas";

const GENRES: StorySetup["genre"][] = [
  "fantasy",
  "scifi",
  "mystery",
  "horror",
  "romance",
  "adventure",
  "slice-of-life",
  "absurd",
];

const ART_STYLES: StorySetup["art_style"][] = [
  "watercolor",
  "noir-ink",
  "studio-ghibli",
  "pixel",
  "oil-painting",
  "minimal-line",
];

const PRESETS: Array<{ label: string; data: StorySetup }> = [
  {
    label: "The Lantern at the Threshold",
    data: {
      genre: "fantasy",
      protagonist: "Vasha",
      opening:
        "A long, faintly luminous feather is left on the threshold of the cottage. The wind has stopped. It's near midnight.",
      voice: "mimo-storyteller-warm",
      art_style: "watercolor",
    },
  },
  {
    label: "Last Train, Wrong City",
    data: {
      genre: "mystery",
      protagonist: "Aroon",
      opening:
        "I fell asleep on the express. Got off at my stop. The platform sign is in a language I have never seen before.",
      voice: "mimo-storyteller-warm",
      art_style: "noir-ink",
    },
  },
  {
    label: "The Recipe My Grandmother Couldn't Read",
    data: {
      genre: "slice-of-life",
      protagonist: "Mei",
      opening:
        "She left me a single index card. The ingredients are in three languages and one of them isn't human.",
      voice: "mimo-storyteller-warm",
      art_style: "studio-ghibli",
    },
  },
];

export function StorySetupForm({ onStart }: { onStart: (s: StorySetup) => void }) {
  const [setup, setSetup] = useState<StorySetup>(PRESETS[0].data);

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted mb-2">
          mimo-tale · interactive illustrated audiobook
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink-DEFAULT mb-3">
          Tell a story you've never read.
        </h1>
        <p className="text-ink-muted text-sm md:text-base max-w-lg mx-auto">
          Pick a genre, name your protagonist, and seed the opening. Each chapter
          is reasoned, illustrated, and narrated by Xiaomi&nbsp;MiMo&nbsp;V2.5.
        </p>
      </div>

      <form
        className="space-y-5 bg-bg-soft/40 backdrop-blur p-6 md:p-8 rounded-xl border border-line shadow-page"
        onSubmit={(e) => {
          e.preventDefault();
          onStart(setup);
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Genre">
            <Select
              value={setup.genre}
              onChange={(e) =>
                setSetup({ ...setup, genre: e.target.value as StorySetup["genre"] })
              }
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Art style">
            <Select
              value={setup.art_style}
              onChange={(e) =>
                setSetup({ ...setup, art_style: e.target.value as StorySetup["art_style"] })
              }
            >
              {ART_STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Protagonist" hint="any name; second-person works too">
          <Input
            value={setup.protagonist}
            onChange={(e) => setSetup({ ...setup, protagonist: e.target.value })}
            placeholder="e.g. Vasha"
            maxLength={60}
          />
        </Field>

        <Field label="Opening idea" hint="one sentence is enough; the model fills in">
          <Textarea
            value={setup.opening}
            onChange={(e) => setSetup({ ...setup, opening: e.target.value })}
            placeholder="The wind has stopped. Something is at the door."
            maxLength={280}
          />
        </Field>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                type="button"
                key={p.label}
                onClick={() => setSetup(p.data)}
                className="text-xs font-mono px-2.5 py-1 rounded border border-line text-ink-muted hover:text-accent-glow hover:border-accent/60 transition"
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button type="submit" variant="primary">
            Begin chapter 1 →
          </Button>
        </div>
      </form>
    </div>
  );
}
