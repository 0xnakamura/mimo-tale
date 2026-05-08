# Form paste sheet — Xiaomi MiMo 100T grant

> One block per form field. Copy each block verbatim into the matching
> form input on <https://100t.xiaomimimo.com/>. Replace the `<…>`
> placeholder before submitting.

---

## 01 · YOUR EMAIL

```
<your-github-linked-email@example.com>
```

> Must match the email bound to your Xiaomi ID at <https://id.mi.com>.
> If they don't match yet, bind first (FAQ items 04 + 09 on the form).

---

## 02 · WHICH AGENT TOOL DO YOU USE MOST

Click button: **`Windsurf`**

> *(Cascade is the agent inside Windsurf — that's how this repo was built.)*

---

## 03 · PRIMARY MODEL SERIES YOU USE

Click button: **`MiMo`**

> *(mimo-tale is designed around all three MiMo V2.5 pillars:
> reasoner + multimodal + TTS. Other models are not used.)*

---

## 04 · DESCRIBE WHAT YOU'VE BUILT

**Paste this block** (≤ 1 200 chars, ≥ 100 words):

```
Project: mimo-tale -- github.com/<you>/mimo-tale (MIT)

Problem: AI story generators stop at "a wall of text". mimo-tale treats every chapter as a multimodal artefact -- prose, illustration, and narration generated together, with a real fork at the end the reader steers.

Logic flow -- one SSE round-trip per chapter to /api/chapter:

1. Storyteller (mimo-v2.5-reasoner, JSON-strict + zod repair pass): emits one 110-220 word scene, an art-director-grade image_prompt, three branches that meaningfully diverge, and is_ending when the arc is ready to land.
2. Illustrator (mimo-v2.5-vision): renders a 1024x1024 image of the scene; falls back to a deterministic styled SVG when the plan tier doesn't expose images.
3. Narrator (mimo-v2.5-tts): streams an mp3 narration with a configurable voice; falls back to a 0.4s silent WAV so the UI never shows a broken player.

Three pillars, one OpenAI-compatible key, single baseURL swap. Mock mode is first-class so demos and CI run with zero credentials. Stack: Next.js 14 + TypeScript + Tailwind, Server-Sent Events for progressive render, Zustand persisted to localStorage.
```

> If the form's counter shows ≥ 1 200, swap `--` for `—` (typographic
> version, ~1 165 chars). Both versions are kept in
> `docs/grant-submission.md`.

---

## 05 · PROOF OF USAGE & IMPACT

**Form constraint:** max 5 files. Accepted formats:
**`jpg / jpeg / png / gif / webp / mp4 / mov`** (no zip, no pdf).

Upload these **5 files in this order** — quality > quantity:

| # | File | Format | What to capture |
|---|------|--------|-----------------|
| 1 | `01_billing.png` | PNG | Screenshot of MiMo platform billing dashboard at <https://platform.xiaomimimo.com>, last 30 days, with the project tag visible |
| 2 | `02_demo.mp4` | MP4 | 60–90s screen recording of a complete 4-chapter playthrough: setup form → chapter 1 streams in → branch click → chapter 2 → epilogue |
| 3 | `03_chapter_card.png` | PNG | Hero shot of a single rendered chapter card: illustration + title + prose + audio player + 3 branch buttons |
| 4 | `04_three_pillars.png` | PNG | Network tab of DevTools showing three distinct MiMo endpoints hit during one chapter: chat/completions (reasoner), images/generations (multimodal), audio/speech (TTS) |
| 5 | `05_mock_mode.png` | PNG | Side-by-side: live-mode chapter card vs mock-mode chapter card, proving zero-credential reviewer experience |

> **Be honest about provenance.** If a screenshot was taken in mock
> mode, label the filename `_mock`. The grant evaluates real MiMo
> usage; mislabelling mock artefacts as live undermines the submission.
> Live-mode files (`02_demo.mp4`, `03_chapter_card.png`,
> `04_three_pillars.png`) should come from a run with a real
> `MIMO_API_KEY` set.

---

## GITHUB PROJECT LINK OR LIVE DEMO URL

```
https://github.com/<you>/mimo-tale
```

Optional second link if you deploy:

```
https://mimo-tale.netlify.app
```

Pre-submission polish on the repo:

- [ ] Repo is **public** with `LICENSE` file (MIT)
- [ ] Pin `mimo-tale` on your GitHub profile
- [ ] Top-of-README hero GIF: convert `02_demo.mp4` → 15 s GIF, add as `docs/hero.gif`
- [ ] Tagged `v0.1.0` release with `02_demo.mp4` attached as a release asset
- [ ] Live demo URL on Netlify (one-click via `netlify.toml`)

---

## Final pre-submit checklist

- [ ] Email bound to Xiaomi ID at <https://id.mi.com>
- [ ] Email placeholder `<your-github-linked-email@example.com>` replaced
- [ ] At least one **live** mimo-tale run logged with real MiMo V2.5 spend
- [ ] 5 proof files prepared in correct formats
- [ ] Submitted before **2026-05-28 00:00 Beijing time** (UTC 2026-05-27 16:00)

---

## How to capture each proof file (commands)

### `01_billing.png`
1. Login at <https://platform.xiaomimimo.com>
2. Navigate to billing/usage dashboard
3. Filter to last 30 days
4. Browser screenshot

### `02_demo.mp4`

Record with any screen recorder while running:

```bash
npm run dev
# → http://localhost:3000
# Click "The Lantern at the Threshold" preset → Begin chapter 1
# Wait for chapter to land, click branch A
# Continue until is_ending fires (~4-5 chapters)
```

Trim to 60–90s.

### `03_chapter_card.png`
Crop a single chapter card from the demo recording, or:

```bash
# at any chapter, browser screenshot the article element
```

### `04_three_pillars.png`

1. Open DevTools → Network tab → filter `XHR/fetch`
2. Trigger one chapter generation
3. Filter requests to `api.xiaomimimo.com` — should see three:
   - `chat/completions`  (reasoner)
   - `images/generations` (multimodal)
   - `audio/speech` (TTS)
4. Screenshot the network panel.

### `05_mock_mode.png`

```bash
# terminal 1: live mode
MIMO_API_KEY=sk-... npm run dev -- -p 3000

# terminal 2: mock mode
MIMO_FORCE_MOCK=1 npm run dev -- -p 3001
```

Open both, generate chapter 1 in each, screenshot side by side.

---

## TL;DR — what to do right now

1. **Replace `<your-github-linked-email@example.com>`** in this file
2. **Capture the 5 proof files** (commands above)
3. **Open** <https://100t.xiaomimimo.com/>
4. **Paste each section** into its matching form field
5. **Click Submit**
