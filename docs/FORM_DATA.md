# 📋 Form Data — Xiaomi MiMo 100T Grant

> **Form URL:** <https://100t.xiaomimimo.com/>
> **Deadline:** 2026-05-28 00:00 Beijing time (UTC 2026-05-27 16:00) · ~20 days left
>
> Field labels below are an **exact match** to the live form. Pre-flight
> all the proof files, then paste each field in one sitting.

---

## 🚨 Pre-flight checklist (do these BEFORE opening the form)

- [ ] **Bind email to Xiaomi ID** at <https://id.mi.com> (FAQ items 04 + 09)
- [ ] **Push `mimo-tale` to GitHub** as a public MIT repo
- [ ] **Get a real MiMo key** at <https://platform.xiaomimimo.com> (SwiftRouter usage doesn't show on the official billing dashboard reviewers will check)
- [ ] **Run mimo-tale once with a live key** so billing > 0 for proof file 01
- [ ] **Capture 5 proof files** (commands at the bottom of this doc)

---

## 01 · YOUR EMAIL ⚠ required

> *"An email you check for review results and Token activation codes.
> Recommend your GitHub-linked email"*

Paste your email. Use the **same address that's bound to your Xiaomi ID**.

```
<your-github-linked-email@example.com>
```

---

## 02 · WHICH AGENT TOOL DO YOU USE MOST ⚠ required

Click button: **`Windsurf`**

> *(Cascade is the agent inside Windsurf — that's the build environment
> for `mimo-tale` from scaffold to live test.)*

Other options on the form (for reference, do **not** click): OpenClaw,
Claude Code, Codex, Hermes Agent, OpenCode, KiloCode, Cursor, Aider,
Cline, Other.

---

## 03 · PRIMARY MODEL SERIES YOU USE ⚠ required

Click button: **`MiMo`**

> *(`mimo-tale` is designed around all three MiMo V2.5 pillars:
> reasoner + multimodal + TTS. Other models are not used.)*

Other options on the form: Claude, GenLM, GPT, DeepSeek, Douban,
MiniMax, Other.

---

## 04 · DESCRIBE WHAT YOU'VE BUILT WITH AGENTS OR AI-DRIVEN WORKFLOWS ⚠ required

> *"Include 1. The core problem your project solves; 2. Core logic flow
> (e.g., loop-chain reasoning, multi-agent collaboration)."*
>
> **Limit:** 1,200 chars · **Recommended:** 100+ words

### 🟢 Primary block · `mimo-tale` (1046 chars / 157 words)

```
I built mimo-tale (github.com/<you>/mimo-tale, MIT) on Windsurf using Cascade as the build agent and Xiaomi MiMo V2.5 as the runtime model. Problem: AI story generators stop at "a wall of text" — readers want a multimodal artefact, not a prose dump.

Logic flow — one SSE round-trip per chapter to /api/chapter, three agents under one OpenAI-compatible client:

1. Storyteller (mimo-v2.5-reasoner, JSON-strict + zod repair pass): emits one 110-220 word scene, an art-director-grade image_prompt, three branches that meaningfully diverge, and is_ending=true when the arc lands.
2. Illustrator (mimo-v2.5-vision): renders a 1024x1024 image of the scene; deterministic styled SVG fallback if the plan tier doesn't expose images.
3. Narrator (mimo-v2.5-tts): streams an mp3 narration; silent-WAV fallback so the UI never breaks.

Three pillars, one MiMo key, single baseURL swap on the OpenAI SDK. Mock mode is first-class so demos and CI run with zero credentials. Stack: Next.js 14 + TypeScript + Tailwind + SSE + Zustand persisted to localStorage.
```

### 🟡 Backup block · compact (779 chars / 113 words)

If the form's counter glitches or you want headroom, use this:

```
I built mimo-tale (github.com/<you>/mimo-tale, MIT) on Windsurf using Cascade as the build agent and Xiaomi MiMo V2.5 as the runtime. Problem: AI story generators stop at "a wall of text" — readers want a multimodal artefact.

Logic flow — one SSE round-trip per chapter, three agents on one OpenAI-compatible MiMo client:

1. Storyteller (mimo-v2.5-reasoner, JSON-strict + zod repair pass): one 110-220 word scene + 3 diverging branches + is_ending flag.
2. Illustrator (mimo-v2.5-vision): 1024x1024 chapter image, with styled-SVG fallback.
3. Narrator (mimo-v2.5-tts): mp3 narration, with silent-WAV fallback.

Three pillars, one key, single baseURL swap. Mock mode is first-class — demos and CI run with zero credentials. Stack: Next.js 14, TypeScript, Tailwind, SSE, Zustand.
```

### 🔵 Alternative project · `orbiter` (1174 chars / 173 words)

If you'd rather submit `orbiter` (the autonomous PR bot) — its block is in `~/CascadeProjects/orbiter/docs/SUBMISSION_PASTE.md`. Both are valid; pick **one** primary submission.

---

## 05 · PROOF OF USAGE & IMPACT 🟡 optional but high-impact

> *"Improves approval odds, Token Plan quota, and credit amount.
> You can upload: 1. AI platform billing screenshots (past 30 days);
> 2. Terminal logs or agent workflow screenshots / recordings (preferably
> for the project described above); 3. GitHub project links or live
> demo URLs."*
>
> **Constraints:** jpg / jpeg / png / gif / webp / mp4 / mov · max 5 files.

Upload these **5 files in this order** — quality > quantity.

| # | Filename | Status | Notes |
|---|----------|--------|-------|
| 1 | `01_billing.png` | ⚠ **TODO** — needs live MiMo key | Screenshot of MiMo billing dashboard at <https://platform.xiaomimimo.com> (last 30 days). **Must come from a real `platform.xiaomimimo.com` key, not SwiftRouter.** |
| 2 | `02_demo.mp4` | 🟡 **mock-version ready** at `docs/img/demo.mp4` (24 s, 1280×800, 1.1 MB) | Re-record in **live mode** with a real MiMo key for the actual submission so the SVG fallback becomes a real `mimo-v2.5-vision` render. Command: `node scripts/record-demo.mjs` |
| 3 | `03_chapter_card.png` | 🟡 **mock candidate ready** at `docs/img/03_chapter_card_candidate.png` | Re-capture in live mode. Frame 14s of `demo.mp4` is the cleanest hero shot. |
| 4 | `04_three_pillars.png` | ⚠ **TODO** — needs live MiMo key | DevTools Network tab filtered to `api.xiaomimimo.com`, showing **three** distinct endpoints in one chapter: `chat/completions`, `images/generations`, `audio/speech`. The unambiguous proof of all-three-pillars usage. |
| 5 | `05_architecture.png` | 🟢 **OK from mock** | Either render the README architecture diagram as PNG, or screenshot `lib/orchestrator.ts` lines showing `Promise.all([illustratorTask, narratorTask])`. |

### Bonus screenshots already captured

These are not part of the 5-file submission slot, but make great supporting images for the README / GitHub repo:

| File | What it shows |
|------|---------------|
| `docs/img/06_setup_form.png` | Setup form with preset selected — clean "starting point" shot |
| `docs/img/07_multi_chapter.png` | Multi-chapter scrolled view — proves continuity & branching across chapters |
| `docs/img/demo.gif` | 720-wide animated GIF, 3.8 MB — embeds directly in the README hero block |

### Honesty rule

If a screenshot was taken in mock or fallback mode, **suffix the filename with `_mock`** (e.g. `02_demo_mock.mp4`). Reviewers explicitly evaluate real MiMo usage — mislabeling fallback artefacts as live undermines the submission. The live-required files are 01, 02, 03, and 04.

---

## 🔗 GITHUB PROJECT LINK OR LIVE PRODUCT DEMO URL

Paste **at least one**, ideally both:

```
https://github.com/<you>/mimo-tale
```

```
https://mimo-tale.netlify.app
```

> Live demo URL is optional but **strongly improves the proof package**.
> One-click deploy via the existing `netlify.toml` — push the repo, then
> `netlify deploy --prod` (or just connect via the Netlify UI).

---

## 🎬 Capture commands — copy-pasteable

### `01_billing.png`

```
1. Login at https://platform.xiaomimimo.com
2. Settings / Billing → Usage tab
3. Filter to "Last 30 days"
4. Browser screenshot (Cmd+Shift+4 / Win+Shift+S / Print Screen)
```

### `02_demo.mp4`

```bash
# Start mimo-tale in live mode with a real platform.xiaomimimo.com key
cd ~/CascadeProjects/mimo-tale
npm run dev
# → http://localhost:3000

# Use any screen recorder (OBS / built-in OS recorder / Quicktime).
# Suggested playthrough (~75 s):
#   1. Click preset "The Lantern at the Threshold" (5 s)
#   2. Click "Begin chapter 1" (5 s)
#   3. Wait for the 3-phase skeleton, then chapter card lands (~15 s)
#   4. Click branch "A" (5 s)
#   5. Repeat for chapters 2 and 3 (~30 s)
#   6. Show the epilogue / is_ending state (~10 s)
# Trim to 60-90 s.
```

### `03_chapter_card.png`

```bash
# At any chapter, browser-screenshot the <article> element.
# In Chrome DevTools: ⋮ → More tools → Capture node screenshot.
```

### `04_three_pillars.png`

```bash
# 1. Open mimo-tale in browser, open DevTools, switch to Network tab.
# 2. Filter: "api.xiaomimimo.com"
# 3. Trigger one chapter generation.
# 4. After chapter_done lands, screenshot the network panel.
#    Required rows visible:
#      POST /v1/chat/completions   (storyteller)
#      POST /v1/images/generations (illustrator)
#      POST /v1/audio/speech       (narrator)
```

### `05_architecture.png`

```bash
# Option A: render the README architecture diagram as an image
#   (use https://kroki.io or just a code-block screenshot from the README).
# Option B: code screenshot of lib/orchestrator.ts lines 60-95
#   showing the Promise.all([illustratorTask, narratorTask]) block.
```

---

## ✅ TL;DR — what to do right now

```
1. Get a real MiMo API key at platform.xiaomimimo.com
2. Push ~/CascadeProjects/mimo-tale to GitHub as a public MIT repo
3. Run mimo-tale live once → some billing usage shows up
4. Capture 5 proof files using the commands above
5. Open https://100t.xiaomimimo.com/, paste each section, click Submit
```

---

## ⚠ Reminders

- **Rotate your SwiftRouter key** — it was pasted in chat earlier.
- The form lets you re-submit if you don't get an approval email in 3 days (FAQ 06).
- The campaign closes **2026-05-28 00:00 Beijing time**.
