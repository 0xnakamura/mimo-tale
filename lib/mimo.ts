import OpenAI from "openai";

/**
 * The MiMo platform is OpenAI-compatible — we only need to swap the base URL.
 *
 * Reads creds from the explicit `apiKey` arg first (so a per-request override
 * from the in-app Settings modal wins), then falls back to env.
 *
 * Returns `null` if no key is available; callers must handle this by routing
 * to the deterministic mock path. That keeps the dev / demo / grant-review
 * experience usable without a credential.
 */
export function buildMimoClient(opts: { apiKey?: string; baseUrl?: string } = {}): OpenAI | null {
  const apiKey = opts.apiKey || process.env.MIMO_API_KEY || "";
  const baseURL = opts.baseUrl || process.env.MIMO_BASE_URL || "https://api.xiaomimimo.com/v1";
  if (!apiKey) return null;
  return new OpenAI({ apiKey, baseURL });
}

/**
 * Centralised place for the model ids. Matches the three MiMo V2.5 pillars
 * advertised on https://mimo.xiaomi.com — reasoner, multimodal, TTS.
 */
export const REASONER_MODEL = process.env.MIMO_REASONER_MODEL || "mimo-v2.5-reasoner";
export const VISION_MODEL = process.env.MIMO_VISION_MODEL || "mimo-v2.5-vision";
export const TTS_MODEL = process.env.MIMO_TTS_MODEL || "mimo-v2.5-tts";

export const DEFAULT_VOICE = process.env.MIMO_TTS_VOICE || "mimo-storyteller-warm";

/**
 * Convenience: should this request use the mock path?
 *
 * Trips when:
 *   1. caller didn't pass an apiKey AND env MIMO_API_KEY is empty, or
 *   2. MIMO_FORCE_MOCK is set to anything truthy
 */
export function shouldUseMock(callerKey?: string): boolean {
  if (process.env.MIMO_FORCE_MOCK && process.env.MIMO_FORCE_MOCK !== "0" && process.env.MIMO_FORCE_MOCK !== "false") {
    return true;
  }
  if (callerKey && callerKey.length > 0) return false;
  if (process.env.MIMO_API_KEY && process.env.MIMO_API_KEY.length > 0) return false;
  return true;
}
