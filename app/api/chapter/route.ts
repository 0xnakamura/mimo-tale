import { NextRequest } from "next/server";
import { runChapter } from "@/lib/orchestrator";
import {
  ContinueRequestSchema,
  StartRequestSchema,
  StreamEvent,
} from "@/lib/schemas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Single endpoint for both starting and continuing a story.
 *
 * If `history` is empty / absent, this is chapter 1.
 * Otherwise, `user_choice` must be present and is the branch the user picked.
 *
 * Streams Server-Sent Events:
 *   chapter_start → chapter_text → image_ready → audio_ready → chapter_done
 * (image_ready and audio_ready may arrive in either order, in parallel.)
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const isStart = !(body as any)?.history?.length;
  const parsed = isStart
    ? StartRequestSchema.safeParse(body)
    : ContinueRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: StreamEvent) => {
        const line = `data: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(line));
      };

      try {
        const setup = parsed.data.setup;
        const apiKey = parsed.data.api_key;
        const history = isStart ? [] : (parsed.data as any).history;
        const userChoice = isStart ? undefined : (parsed.data as any).user_choice;

        await runChapter({ setup, history, userChoice, apiKey, emit });
      } catch (e) {
        emit({ type: "error", message: (e as Error).message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no", // disable nginx buffering when self-hosted
      connection: "keep-alive",
    },
  });
}
