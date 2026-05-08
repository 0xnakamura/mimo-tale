import OpenAI from "openai";
import { TTS_MODEL, DEFAULT_VOICE } from "./mimo";
import { Chapter, StorySetup } from "./schemas";

export type NarratorResult = {
  audio_data_url: string;
  source: "mimo-tts" | "mock";
};

/**
 * Narrator — TTS agent that reads a chapter aloud.
 *
 * Uses the OpenAI-compatible audio.speech endpoint. MiMo TTS returns an
 * audio stream; we collect it into a base64 data URL so the browser can
 * play it directly without a follow-up fetch.
 *
 * On any error (endpoint not provisioned, key tier limit, etc.) we fall
 * back to a tiny silent WAV so the pipeline still emits a valid audio
 * artefact and the UI render path stays unchanged.
 */
export async function generateAudioLive(
  client: OpenAI,
  args: { chapter: Chapter; setup: StorySetup; model?: string; voice?: string },
): Promise<NarratorResult> {
  const voice = args.voice || args.setup.voice || DEFAULT_VOICE;
  try {
    const resp = await client.audio.speech.create({
      model: args.model || TTS_MODEL,
      voice: voice as any,
      input: args.chapter.text,
      response_format: "mp3",
    });
    const buf = Buffer.from(await resp.arrayBuffer());
    return {
      audio_data_url: `data:audio/mpeg;base64,${buf.toString("base64")}`,
      source: "mimo-tts",
    };
  } catch {
    return { audio_data_url: silentWav(), source: "mock" };
  }
}

/**
 * Tiny 0.4-second silent WAV. Lets the AudioPlayer render a real, playable
 * track in mock mode without shipping any binary asset in the repo.
 */
export function silentWav(): string {
  // Hand-rolled 16-bit PCM WAV header for ~0.4s of silence at 8 kHz.
  const sampleRate = 8000;
  const numSamples = sampleRate * 0.4;
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);
  // samples already zero-initialised
  const bytes = new Uint8Array(buffer);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = typeof btoa === "function" ? btoa(bin) : Buffer.from(bytes).toString("base64");
  return `data:audio/wav;base64,${b64}`;
}
