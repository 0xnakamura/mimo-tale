import { buildMimoClient, shouldUseMock } from "./mimo";
import { generateChapterLive } from "./storyteller";
import { generateImageLive, svgPlaceholder } from "./illustrator";
import { generateAudioLive, silentWav } from "./narrator";
import { mockChapter } from "./mock";
import {
  Chapter,
  ResolvedChapter,
  StorySetup,
  StreamEvent,
} from "./schemas";

/**
 * Drives one chapter end-to-end: reasoner → multimodal → TTS, emitting
 * Server-Sent Events as each phase completes so the UI can render
 * progressively. Stays out of any framework: callers pass in an `emit`
 * callback and decide how to ship events to the client.
 */
export async function runChapter(args: {
  setup: StorySetup;
  history: Chapter[];
  userChoice?: string;
  apiKey?: string;
  emit: (event: StreamEvent) => void;
}): Promise<ResolvedChapter> {
  const { setup, history, userChoice, apiKey, emit } = args;
  const nextIndex = history.length + 1;

  const useMock = shouldUseMock(apiKey);
  emit({ type: "chapter_start", index: nextIndex, source: useMock ? "mock" : "live" });

  // 1. Storyteller (reasoner)
  let chapter: Chapter;
  if (useMock) {
    chapter = mockChapter({ setup, index: nextIndex });
  } else {
    const client = buildMimoClient({ apiKey });
    if (!client) {
      // Should never happen since shouldUseMock would have caught it, but
      // type-narrow for the compiler.
      chapter = mockChapter({ setup, index: nextIndex });
    } else {
      try {
        chapter = await generateChapterLive(client, {
          setup,
          history,
          userChoice,
          nextIndex,
        });
      } catch (e) {
        emit({
          type: "error",
          message: `Storyteller failed: ${(e as Error).message}. Falling back to mock chapter so the run continues.`,
        });
        chapter = mockChapter({ setup, index: nextIndex });
      }
    }
  }
  emit({ type: "chapter_text", chapter });

  // 2. Illustrator (multimodal) and 3. Narrator (TTS) — fire in parallel,
  // emit each independently as soon as it lands so the UI can render
  // the image while the audio is still encoding.
  const illustratorTask = (async () => {
    if (useMock) return svgPlaceholder(chapter, setup);
    const client = buildMimoClient({ apiKey });
    if (!client) return svgPlaceholder(chapter, setup);
    try {
      const r = await generateImageLive(client, { chapter, setup });
      return r.image_data_url;
    } catch (e) {
      emit({ type: "error", message: `Illustrator failed: ${(e as Error).message}` });
      return svgPlaceholder(chapter, setup);
    }
  })();

  const narratorTask = (async () => {
    if (useMock) return silentWav();
    const client = buildMimoClient({ apiKey });
    if (!client) return silentWav();
    try {
      const r = await generateAudioLive(client, { chapter, setup });
      return r.audio_data_url;
    } catch (e) {
      emit({ type: "error", message: `Narrator failed: ${(e as Error).message}` });
      return silentWav();
    }
  })();

  const [imageDataUrl, audioDataUrl] = await Promise.all([
    illustratorTask.then((url) => {
      emit({ type: "image_ready", index: nextIndex, image_data_url: url });
      return url;
    }),
    narratorTask.then((url) => {
      emit({ type: "audio_ready", index: nextIndex, audio_data_url: url });
      return url;
    }),
  ]);

  const resolved: ResolvedChapter = {
    ...chapter,
    image_data_url: imageDataUrl,
    audio_data_url: audioDataUrl,
    generated_at: new Date().toISOString(),
    source: useMock ? "mock" : "live",
  };
  emit({ type: "chapter_done", chapter: resolved });
  return resolved;
}
