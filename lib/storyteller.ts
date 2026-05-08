import OpenAI from "openai";
import { Chapter, ChapterSchema, StorySetup } from "./schemas";
import { REASONER_MODEL } from "./mimo";

/**
 * Storyteller — the reasoner agent that authors one chapter at a time.
 *
 * Constraints encoded in the prompt:
 *   - Chapter 1 must hook with sensory detail and a concrete inciting scene.
 *   - Each chapter ends on a real choice — three branches that meaningfully
 *     diverge, written as second-person imperatives ("You step into the…").
 *   - Branches must be playable: no "The story ends" unless `is_ending=true`.
 *   - Around chapter 5–7 the model is allowed to start landing the arc and
 *     emit `is_ending=true` on a satisfying climax.
 *
 * Output is enforced via OpenAI JSON-mode + a one-shot zod repair pass.
 */
const SYSTEM_PROMPT = `You are a literary storyteller writing an interactive illustrated audiobook.

You will be given:
- the genre, the protagonist's name, and the user's opening idea
- the full history of chapters so far (your own previous work)
- the user's chosen branch from the last chapter

Write the NEXT chapter. Hard rules:

1. Stay in the same point of view (default: tight third-person past tense, unless the opening idea clearly demands first or second).
2. Each chapter is one tight scene: 110–220 words. Sensory, concrete, no exposition dumps.
3. End with a real fork — three branches the reader could take. Each branch is a short imperative (3–10 words) that meaningfully changes the next scene.
4. Branches must NOT be variations of the same action. Diverge: try / refuse / something unexpected.
5. \`image_prompt\` is a vivid, art-director-grade visual description of the chapter's most striking moment — NO dialog, NO names of people unless they are visually iconic. Mention lighting, palette, framing, and the requested art style.
6. \`title\` is a short evocative phrase, not a summary.
7. After 4 chapters of build-up you may set \`is_ending: true\` on a chapter that resolves the central tension. When you do, the three branches become epilogue flavours (e.g. "Walk away in silence", "Burn the letter", "Sleep, and dream of it again").

Output format: STRICT JSON matching this schema. No prose outside JSON:
{
  "index": <int>,
  "title": "<string>",
  "text": "<string, 110-220 words>",
  "image_prompt": "<string, single rich visual sentence>",
  "branches": ["<string>", "<string>", "<string>"],
  "is_ending": <bool>
}`;

function buildUserPrompt(args: {
  setup: StorySetup;
  history: Chapter[];
  userChoice?: string;
  nextIndex: number;
}): string {
  const { setup, history, userChoice, nextIndex } = args;
  const historyBlock = history.length
    ? history
        .map(
          (c) =>
            `--- Chapter ${c.index}: ${c.title} ---\n${c.text}\n[branches offered: ${c.branches
              .map((b: string) => `"${b}"`)
              .join(", ")}]`,
        )
        .join("\n\n")
    : "(none yet — this is chapter 1)";

  return `GENRE: ${setup.genre}
PROTAGONIST: ${setup.protagonist}
ART_STYLE (use this in image_prompt): ${setup.art_style}
OPENING IDEA: ${setup.opening}

PREVIOUS CHAPTERS:
${historyBlock}

USER'S CHOSEN BRANCH FOR THIS CHAPTER: ${userChoice ?? "(n/a — write chapter 1)"}

Write chapter ${nextIndex} now. JSON only.`;
}

/**
 * Live path: call MiMo reasoner with JSON-mode, validate with zod, repair once.
 */
export async function generateChapterLive(
  client: OpenAI,
  args: {
    setup: StorySetup;
    history: Chapter[];
    userChoice?: string;
    nextIndex: number;
    model?: string;
  },
): Promise<Chapter> {
  const { setup, history, userChoice, nextIndex, model } = args;
  const userPrompt = buildUserPrompt({ setup, history, userChoice, nextIndex });

  const callOnce = async (extraNudge: string | null) => {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];
    if (extraNudge) {
      messages.push({ role: "user", content: extraNudge });
    }
    const resp = await client.chat.completions.create({
      model: model || REASONER_MODEL,
      temperature: 0.85,
      response_format: { type: "json_object" },
      messages,
    });
    const raw = resp.choices[0]?.message?.content || "{}";
    return JSON.parse(raw);
  };

  let parsed: unknown;
  try {
    parsed = await callOnce(null);
  } catch (e) {
    // JSON.parse failed — one retry asking the model to fix it
    parsed = await callOnce(
      "Your previous reply was not valid JSON. Re-emit ONLY the JSON object, no markdown fences, no commentary.",
    );
  }

  const parsed1 = ChapterSchema.safeParse({ ...(parsed as object), index: nextIndex });
  if (parsed1.success) return parsed1.data;

  // One repair attempt: feed the validation error back to the model
  const repairNudge = `Your previous reply did not match the schema. Errors:
${JSON.stringify(parsed1.error.issues, null, 2)}

Re-emit a corrected JSON object that satisfies the schema. JSON only.`;
  const retry = await callOnce(repairNudge);
  const parsed2 = ChapterSchema.parse({ ...(retry as object), index: nextIndex });
  return parsed2;
}
