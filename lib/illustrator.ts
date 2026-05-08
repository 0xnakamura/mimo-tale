import OpenAI from "openai";
import { VISION_MODEL } from "./mimo";
import { Chapter, StorySetup } from "./schemas";

export type IllustratorResult = {
  image_data_url: string;
  source: "mimo-image" | "mimo-vision-svg" | "mock";
};

function styledPrompt(chapter: Chapter, setup: StorySetup): string {
  return `${chapter.image_prompt}. Art style: ${setup.art_style}. Cinematic composition, rich palette, no text, no watermark.`;
}

/**
 * Live path. Tries the OpenAI-style image endpoint first; if the MiMo plan
 * only exposes vision (image-in / text-out), generates a stylised SVG from
 * the prompt so the pipeline never breaks.
 */
export async function generateImageLive(
  client: OpenAI,
  args: { chapter: Chapter; setup: StorySetup; model?: string },
): Promise<IllustratorResult> {
  const prompt = styledPrompt(args.chapter, args.setup);
  try {
    // OpenAI-compatible images.generate
    const resp = await (client.images as any).generate({
      model: args.model || VISION_MODEL,
      prompt,
      size: "1024x1024",
      response_format: "b64_json",
    });
    const b64 = resp?.data?.[0]?.b64_json;
    if (b64) {
      return { image_data_url: `data:image/png;base64,${b64}`, source: "mimo-image" };
    }
  } catch {
    // Fall through to SVG
  }
  return { image_data_url: svgPlaceholder(args.chapter, args.setup), source: "mimo-vision-svg" };
}

const PALETTES: Record<string, [string, string, string]> = {
  watercolor: ["#f4ecd8", "#d96846", "#2a1f12"],
  "noir-ink": ["#0e0e10", "#9aa3af", "#e5e7eb"],
  "studio-ghibli": ["#cfe8d4", "#f3a673", "#3d4d2f"],
  pixel: ["#1a1a2e", "#e94560", "#f5f5f5"],
  "oil-painting": ["#2c1810", "#c97b3c", "#e8c474"],
  "minimal-line": ["#fafafa", "#111111", "#888888"],
};

/**
 * Deterministic poster-style SVG generated from the chapter prompt.
 * Used in mock mode and as a graceful fallback when image generation fails.
 */
export function svgPlaceholder(chapter: Chapter, setup: StorySetup): string {
  const [bg, accent, ink] = PALETTES[setup.art_style] || PALETTES.watercolor;
  const title = escapeXml(chapter.title).slice(0, 40);
  const subtitle = `Chapter ${chapter.index} · ${escapeXml(setup.genre)}`;
  const seed = (chapter.title + chapter.index).split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  // pseudo-random but deterministic shapes from seed
  const circles = Array.from({ length: 6 }, (_, i) => {
    const r = ((seed * (i + 3)) % 280) + 60;
    const cx = ((seed * (i + 7)) % 900) + 60;
    const cy = ((seed * (i + 11)) % 900) + 60;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${accent}" opacity="${0.05 + (i % 4) * 0.04}"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${bg}"/>
  ${circles}
  <rect x="80" y="800" width="864" height="2" fill="${ink}" opacity="0.3"/>
  <text x="80" y="900" font-family="Georgia, serif" font-size="64" font-weight="700" fill="${ink}">${title}</text>
  <text x="80" y="950" font-family="Georgia, serif" font-size="24" fill="${ink}" opacity="0.7">${subtitle}</text>
  <text x="80" y="120" font-family="Georgia, serif" font-size="20" fill="${ink}" opacity="0.5">mimo-tale</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
