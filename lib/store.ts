"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResolvedChapter, StorySetup } from "./schemas";

type GenerationStage =
  | "idle"
  | "reasoning"
  | "illustrating"
  | "narrating"
  | "ready"
  | "error";

type StageMap = Record<number, GenerationStage>;

type StoreState = {
  setup: StorySetup | null;
  chapters: ResolvedChapter[];
  stage: StageMap;
  generating: boolean;
  apiKey: string;
  error: string | null;

  setSetup: (setup: StorySetup) => void;
  setApiKey: (key: string) => void;
  beginChapter: (index: number) => void;
  setStage: (index: number, stage: GenerationStage) => void;
  appendChapter: (chapter: ResolvedChapter) => void;
  patchLastImage: (index: number, dataUrl: string) => void;
  patchLastAudio: (index: number, dataUrl: string) => void;
  setError: (message: string | null) => void;
  reset: () => void;
};

export const useStoryStore = create<StoreState>()(
  persist(
    (set) => ({
      setup: null,
      chapters: [],
      stage: {},
      generating: false,
      apiKey: "",
      error: null,

      setSetup: (setup) => set({ setup, chapters: [], stage: {}, error: null }),
      setApiKey: (apiKey) => set({ apiKey }),
      beginChapter: (index) =>
        set((s) => ({
          generating: true,
          error: null,
          stage: { ...s.stage, [index]: "reasoning" },
        })),
      setStage: (index, stage) =>
        set((s) => ({ stage: { ...s.stage, [index]: stage } })),
      appendChapter: (chapter) =>
        set((s) => ({
          chapters: [...s.chapters, chapter],
          generating: false,
          stage: { ...s.stage, [chapter.index]: "ready" },
        })),
      patchLastImage: (index, image_data_url) =>
        set((s) => ({
          chapters: s.chapters.map((c) =>
            c.index === index ? { ...c, image_data_url } : c,
          ),
        })),
      patchLastAudio: (index, audio_data_url) =>
        set((s) => ({
          chapters: s.chapters.map((c) =>
            c.index === index ? { ...c, audio_data_url } : c,
          ),
        })),
      setError: (error) => set({ error, generating: false }),
      reset: () =>
        set({
          setup: null,
          chapters: [],
          stage: {},
          generating: false,
          error: null,
        }),
    }),
    {
      name: "mimo-tale-store-v1",
      // don't persist the api key by default — user re-pastes per session
      partialize: (s) => ({ setup: s.setup, chapters: s.chapters }),
    },
  ),
);
