import { z } from "zod";

/**
 * Story setup — what the user picks before chapter 1.
 */
export const StorySetupSchema = z.object({
  genre: z.enum([
    "fantasy",
    "scifi",
    "mystery",
    "horror",
    "romance",
    "adventure",
    "slice-of-life",
    "absurd",
  ]),
  protagonist: z.string().min(1).max(60),
  opening: z.string().min(1).max(280),
  voice: z.string().default("mimo-storyteller-warm"),
  art_style: z
    .enum(["watercolor", "noir-ink", "studio-ghibli", "pixel", "oil-painting", "minimal-line"])
    .default("watercolor"),
});
export type StorySetup = z.infer<typeof StorySetupSchema>;

/**
 * What the Storyteller agent (reasoner) emits per chapter.
 *
 * - `text` is what the Narrator reads aloud.
 * - `image_prompt` is fed verbatim to the Illustrator (multimodal).
 * - `branches` are the three next-action choices shown to the user;
 *   each one becomes the user_choice context for the next chapter.
 * - `is_ending` lets the model close the arc when it feels right.
 */
export const ChapterSchema = z.object({
  index: z.number().int().min(1),
  title: z.string().min(1).max(120),
  text: z.string().min(40).max(2000),
  image_prompt: z.string().min(8).max(400),
  branches: z.array(z.string().min(2).max(120)).length(3),
  is_ending: z.boolean().default(false),
});
export type Chapter = z.infer<typeof ChapterSchema>;

/**
 * A fully resolved chapter — the Storyteller's payload + the artefacts
 * produced by the Illustrator and Narrator.
 */
export const ResolvedChapterSchema = ChapterSchema.extend({
  image_data_url: z.string().url().or(z.string().startsWith("data:")).or(z.string().startsWith("/")),
  audio_data_url: z.string().url().or(z.string().startsWith("data:")).or(z.string().startsWith("/")),
  generated_at: z.string(),
  source: z.enum(["live", "mock"]),
});
export type ResolvedChapter = z.infer<typeof ResolvedChapterSchema>;

/**
 * Request payload for /api/start (chapter 1) and /api/continue (chapter 2+).
 */
export const StartRequestSchema = z.object({
  setup: StorySetupSchema,
  api_key: z.string().optional(),
});
export type StartRequest = z.infer<typeof StartRequestSchema>;

export const ContinueRequestSchema = z.object({
  setup: StorySetupSchema,
  history: z.array(ChapterSchema),
  user_choice: z.string().min(2).max(160),
  api_key: z.string().optional(),
});
export type ContinueRequest = z.infer<typeof ContinueRequestSchema>;

/**
 * Server-Sent Event payloads. Every chapter emits the sequence:
 *   chapter_start → chapter_text → image_ready → audio_ready → chapter_done
 * with optional `error` at any point.
 */
export type StreamEvent =
  | { type: "chapter_start"; index: number; source: "live" | "mock" }
  | { type: "chapter_text"; chapter: Chapter }
  | { type: "image_ready"; index: number; image_data_url: string }
  | { type: "audio_ready"; index: number; audio_data_url: string }
  | { type: "chapter_done"; chapter: ResolvedChapter }
  | { type: "error"; message: string };
