# Canvas Style Contract

Visual contract for the brainstorming companion (the "canvas"). Any agent rendering
screens MUST follow this so screens stay visually consistent across the session.

## How the server works
- Write **content fragments** (no `<html>`, `<head>`, `<body>`). The server wraps them
  in a dark-theme frame and injects all interactive JS.
- Write each screen to the live `screen_dir` (passed per session). Server serves the
  newest file by mtime.
- **Never reuse filenames.** Semantic names: `platform-comparison.html`,
  `schema.html`, `pipeline.html`. Iterations get `-v2`, `-v3` suffixes.
- Use the `Write` tool — never `cat`/heredoc.

## Frame-provided classes (do NOT redefine)
- Clickable choices: `.options` > `.option[data-choice]` > `.letter` + `.content` (h3 + p).
  Add `onclick="toggleSelect(this)"`. Add `data-multiselect` on `.options` for multi.
- Visual designs: `.cards` > `.card[data-choice]` > `.card-image` + `.card-body`.
- `.mockup` > `.mockup-header` + `.mockup-body`; `.split` for side-by-side.
- `.pros-cons` > `.pros` / `.cons`.
- Wireframe blocks: `.mock-nav`, `.mock-sidebar`, `.mock-content`, `.mock-button`,
  `.mock-input`, `.placeholder`.
- Typography: `h2` = page title, `h3` = section heading, `.subtitle`, `.section`, `.label`.

## Established diagram palette (custom, inline `<style>` per screen)
Category border colors (use rgba borders + faint matching bg `rgba(...,.05)`):
- **Sources / inputs** → blue `rgba(120,170,255,.45)`
- **Processing / pipeline** → purple `rgba(190,160,255,.5)`
- **Stores / databases** → orange `rgba(255,180,120,.5)`
- **Consumers / outputs** → green-teal `rgba(120,230,180,.55)`
- **Dead / broken / deprecated** → `border-style:dashed; opacity:.65`

Tag pills (small, rounded): `.tag.live` (green text #7fe6b4), `.tag.dead`
(red #ff9a9a), `.tag.py` (blue #9ec1ff).

Conventions:
- Box: `border:1px solid <category>; border-radius:11px; padding:13px 15px;
  background:rgba(255,255,255,.035)`. `h4` title (14px), `p` (11.5px, opacity .72).
- Flow diagrams read **left→right** with arrow columns (`→`) or top→down (`↓`) between stages.
- `.stage` = small uppercase letter-spaced label above each band (opacity .5).
- `.note` = bottom callout paragraph (12px, opacity .62) — use for "what this buys you".
- `.mini` = monospace flow line on dark bg for code-ish data paths.

## Every screen MUST
1. Open with an `h2` title + a `.subtitle` framing the question.
2. End with the decision/question stated plainly. If it's a choice, make options
   **clickable** (`data-choice` + `toggleSelect`).
3. Keep to 2–4 options max per screen.
4. After writing to `screen_dir`, mirror to the archive dir + update INDEX.md (see
   archive routine in the agent brief), then `git add` the archived copy.
