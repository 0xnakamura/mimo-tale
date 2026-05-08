"use client";

import { Chapter, ResolvedChapter, StorySetup, StreamEvent } from "./schemas";

/**
 * Client-side SSE consumer for /api/chapter. Yields a typed stream of
 * `StreamEvent` so the UI store can react to each phase as it lands.
 */
export async function* runChapterClient(args: {
  setup: StorySetup;
  history: Chapter[];
  userChoice?: string;
  apiKey?: string;
  signal?: AbortSignal;
}): AsyncGenerator<StreamEvent, ResolvedChapter | null, void> {
  const { setup, history, userChoice, apiKey, signal } = args;

  const body = history.length
    ? { setup, history, user_choice: userChoice || "(continue the story)", api_key: apiKey }
    : { setup, api_key: apiKey };

  const resp = await fetch("/api/chapter", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!resp.ok || !resp.body) {
    const text = await resp.text().catch(() => "");
    yield { type: "error", message: `HTTP ${resp.status}: ${text}` };
    return null;
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let resolved: ResolvedChapter | null = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by \n\n
    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const line = frame.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;
      const json = line.slice(6).trim();
      if (!json) continue;
      try {
        const event = JSON.parse(json) as StreamEvent;
        if (event.type === "chapter_done") resolved = event.chapter;
        yield event;
      } catch {
        // ignore malformed frames
      }
    }
  }

  return resolved;
}
