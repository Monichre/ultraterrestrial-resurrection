#!/usr/bin/env python3
"""Folderize every canonical still into extractions/<slug>/ with extraction files.

Reads:  notes/stills-pixel-sample.json (rebased), notes/stills-rebase-report.json
Writes: extractions/<slug>/ folders (image moved + source.md + design-tokens.md [+
        inherited design.md / image-to-prompt.md]), notes/folderize-manifest.json,
        and a path-rebased notes/stills-pixel-sample.json.

Canonical-dupe rule: byte-identical groups get ONE folderized copy. Semantic
name-derived clusters (le:/mj:/root:) beat location clusters (dir:); within
dir: members, curated design-lab/vision dirs beat drop zones. Non-canonical
copies stay in place, unfolderized, listed in the manifest.
"""

from __future__ import annotations

import json
import shutil
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path("/Users/liamellis/Desktop/disclosure-design-references")
NOTES = ROOT / "notes"
OUT = ROOT / "extractions"
TODAY = "2026-08-13"

# cluster -> (gold_slug, homogeneous, take)
CLUSTER_MAP = {
    "dir:design/mock-ups": ("mixed-mockup-plates", False, "UUID/Generated/IMG/imgi plates: dark desk, vortex HUD, phone UI, paper docs — mixed drop zone"),
    "mj:A_sketched_line_drawing_of_Prometheus_the_Titan_a": ("prometheus-line-studies", True, "Identity line drawings; hairline grid; dark + paper registers"),
    "dir:design/design-lab/textures/textures/monochrome": ("monochrome-height-luma-maps", True, "Height/luma/speckle maps; near-black technical, not UI chrome"),
    "mj:httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs": ("hud-line-geometry", True, "Line/geometry HUD variants; mixed dark field + paper"),
    "dir:design/design-lab/dossier-art": ("dossier-art-covers", True, "Manila folders, Socorro/Roswell covers, noir files"),
    "mj:httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4": ("bust-starfield-construction", True, "Classical bust + starfield + construction overlay"),
    "mj:httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome": ("daedalus-line-geometry", True, "Daedalus/line geometry; DEDALUS bar; teal construction"),
    "dir:design/design-lab/ui-mockups": ("research-desk-ui", True, "Product desk SoT (v2/v3, theory, living canvas, ledger)"),
    "mj:httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI": ("volleks-sphere-forest", True, "Dark sphere / forest / VOLLEKS; blue–amber split"),
    "dir:design/design-lab/textures": ("nebula-dotgrid-textures", True, "Nebula scanline, dot-grid, paper tooth siblings"),
    "mj:1._imagine_Crumpled_dot-grid_engineering_journal_": ("crumpled-dotgrid-journal", True, "Dot-grid engineering journal, crumpled paper"),
    "mj:1._imagine_dot-grid_engineering_journal_page._Pap": ("dotgrid-journal-page", True, "Journal page, paper tooth"),
    "mj:httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w": ("line-geometry-bwpx", True, "Line/geometry sibling batch"),
    "mj:httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8": ("hud-reverse-batch", True, "Reverse-prompt HUD batch"),
    "mj:imagine_case_file_research_dossier_on_person_of_i": ("case-file-dossier-covers", True, "Person-of-interest covers; archival stamps"),
    "mj:1._imagine_dot-grid_engineering_journal_page_hand": ("hand-annotated-journal", True, "Hand-annotated journal"),
    "mj:Help_me_design_spy-lab_meets_AI-war_room_moodboar": ("spy-lab-war-room-moodboard", True, "Evidence wall, manila + stamp red"),
    "mj:httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo": ("prometheus-geometry-mix", True, "Prometheus/geometry mix"),
    "mj:httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ": ("construction-light-variant", True, "Lighter construction variant"),
    "mj:httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat": ("near-black-element-collage", True, "Near-black element collage"),
    "dir:design/design-lab/mood-references": ("photo-mood-collages", True, "Photo collages (Rive/Seoul/coast/forest) — mood only"),
    "dir:design/design-lab/document-system/assets": ("paper-system-assets", True, "Paper tooth asset duplicates"),
    "dir:design/design-lab/textures/textures": ("debut-light-paper", True, "Debut light paper duplicates"),
    "dir:design/design-lab/textures/textures/paper": ("debut-twill-paper", True, "Debut twill duplicates"),
    "dir:design/paper": ("paper-grain-textures", True, "Groove + inflicted grid paper"),
    "le:Generate_the_grid_based_design_with_a_geometric_li": ("geometric-grid-hud", True, "Grid HUD with geometric line figure"),
    "mj:httpss.mj.run8kto5yFzLuA_httpss.mj.runUZd2SaizyJo": ("line-batch-8kto", True, "Line batch"),
    "mj:httpss.mj.runDHycsUHpR3w_httpss.mj.runDgchVxycRAk": ("line-batch-dhyc", True, "Line batch"),
    "mj:httpss.mj.runpC26JKid3xA_httpss.mj.runbPCsrT4C1do": ("line-batch-pc26", True, "Line batch"),
    "mj:httpss.mj.runV7TOfpZZ8fc_httpss.mj.run90TFM6ZbOgE": ("line-batch-v7to", True, "Line batch"),
    "mj:1._imagine_1978_NASA_dossier_cover_stamped_RECEIV": ("nasa-dossier-1978", True, "Magenta RECEIVED stamp — decorative"),
    "mj:A_potrait_of_Prometheus_the_Titan_and_demi_god_in": ("prometheus-portrait-arrow", True, "Titan portrait + arrow"),
    "mj:httpss.mj.run4lJsYuU87_I_The_resplendent_Mind_of_": ("resplendent-mind-plate", True, "Cosmic mind plate"),
    "mj:httpss.mj.run6YMM4u3OHRk_Help_me_design_spy-lab_m": ("spy-lab-variant-6ymm", True, "Spy-lab variant"),
    "mj:httpss.mj.runHJ9pS-yZ_R4_httpss.mj.runomtqEPCbNrc": ("line-batch-hj9p", True, "Line batch"),
    "mj:httpss.mj.runMZMhansvdqw_A_sketched_line_drawing_": ("prometheus-sketch-sibling", True, "Prometheus sketch sibling"),
    "mj:httpss.mj.runPyHLQPbERzM_Add_an_ethereal_cosmic_b": ("ethereal-cosmic-background", True, "Ethereal cosmic background"),
    "mj:httpss.mj.runPzHS2D693k4_httpss.mj.runsjmQUspjdoU": ("bust-geometry-reverse", True, "Bust/geometry reverse"),
    "mj:httpss.mj.runvXtf5VcgeXU_httpss.mj.runAT2ktC5DWjo": ("geometry-sibling-vxtf", True, "Geometry sibling"),
    "mj:httpss.mj.runvXtf5VcgeXU_Make_more_line_and_geome": ("near-black-geometry", True, "Near-black geometry"),
    "mj:imagine_A_double-exposure_illustration_of_an_astr": ("astronaut-double-exposure", True, "High-key paper illustration"),
    "mj:Interior_of_the_ancient_Martian_pyramid--vast_hal": ("martian-pyramid-interior", True, "Interior vast hall, cinematic"),
    "mj:Marcus_Aurelius_poses_contemplatively_late_in_his": ("marcus-aurelius-dusk", True, "Contemplative bust, dusk field"),
    "mj:The_ruined_Face_and_pyramid_bathed_in_a_sickly_gr": ("ruined-face-pyramid", True, "Sickly green/orange ruins"),
    "dir:vision/storyboards": ("spacetime-storyboards", True, "Spacetime / temporal-compare concepts"),
    "root:numbered-webp": ("paper-scan-stills", False, "Paper/scan stills — mixed"),
    "dir:design/design-lab/textures/research-shells": ("roswell-demo-shells", True, "Roswell demo shell"),
    "dir:design/design-lab/visual-language": ("visual-language-report", True, "VL report + archive territory map"),
    "le:A_vintage_document_with_the_text_ULTRATERRESTRIAL_": ("vintage-ultraterrestrial-document", True, "Archival document lettering"),
    "le:I_once_brought_you_fire._Now_I_bring_you_Disclosur": ("fire-disclosure-identity", True, "Fire identity plate"),
    "mj:1._imagine_dot-grid_engineering_journal_page_hand-d": ("journal-crop-handd", True, "Journal crop"),
    "mj:A_sketched_line_drawing_of_Prometheus_the_Titan_and": ("volluid-sphere-statues", True, "VOLLUID sphere + statues + grid"),
    "dir:design/design-lab/gateway": ("gateway-hero-explainer", True, "Hero + process explainer (teal→red ladder)"),
    "dir:design/design-lab/process-refs": ("globe-hud-process-refs", True, "Globe HUD + instruction layers"),
    "le:Generate_ethereal_landing_page_featuring_this_quot": ("ethereal-quote-landing", True, "Quote landing"),
    "le:The_most_merciful_thing_in_the_world_I_think_is_th": ("lovecraft-dossier-split", True, "Lovecraft dossier split"),
    "le:2026_dystopian_cosmic_dread_and_the_weight_of_exis": ("dystopian-cosmic-dread", True, "Eye-storm cinematic"),
    "le:2026_dystopian_scene._dark_cosmic_dread_and_the_we": ("dystopian-2052-scene", True, "2052 / THE OLD ONS COMING"),
    "le:httpss.mj.runH5VQtrfnHkg_httpss.mj.run1BwB8ICKGdU_": ("split-classical-bust", True, "Split classical bust"),
    "dir:design/brand-bible/09_CANVAS_STUDIES": ("plate-047-brand-bible", True, "Brand-bible paper plate (SoT)"),
    "le:Design_an_old_faded_page_from_the_Roswell_Clauson_": ("roswell-clauson-page", True, "Faded Clauson page"),
    "root:other:liam_algorithmic_self_portrait_seed_004.png": ("algorithmic-self-portrait", True, "Dark seed-004 portrait"),
    "le:httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_ht": ("bust-nebula-hud-le", True, "Bust + nebula HUD (Liam_Ellis)"),
    "le:The_most_merciful_thing_in_the_world_I_think_is_the_": ("merciful-split-page", True, "Black/cream Lovecraft split page"),
    "le:USS_Theodore_Roosevelt_UFO_Encounter_Metallic_sphe": ("uss-roosevelt-sphere", True, "Metallic sphere encounter"),
    "mj:httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_h": ("volleks-forest-sphere-sibling", True, "VOLLEKS forest-sphere sibling"),
    "mj:httpss.mj.runsZhUawvy0ak_Make_more_line_and_geometr": ("daedalus-hatched-bust", True, "DEDALUS hatched bust"),
    "dir:vision/prototypes": ("interface-gallery-overview", True, "Interface gallery overview"),
    "le:Generate_the_grid_based_design_with_a_geometric_line": ("geometric-line-hud-extra", True, "Extra HUD still"),
}

# curated-dir priority for dir:-clustered dupe members (lower wins)
DIR_PRIORITY = [
    "vision/", "design/design-lab/ui-mockups/", "design/design-lab/visual-language/",
    "design/design-lab/dossier-art/", "design/design-lab/gateway/",
    "design/design-lab/process-refs/", "design/brand-bible/", "design/paper/",
    "3d-space-canvas-references/", "document-references/", "design/mock-ups/",
    "design/design-lab/textures/", "design/design-lab/document-system/",
]

CANON_DEFAULTS = """## Canon defaults — not observable in a still

These come from the assembling-components canon (`references/token-validation-rules.md`,
`references/anydesign-token-rename-map.md`), not from the pixels. 4px spacing base.

| Token | Value | Provenance |
| --- | --- | --- |
| `--spacing-xs` / `--spacing-sm` / `--spacing-md` / `--spacing-lg` / `--spacing-xl` | 4px / 8px / 16px / 24px / 32px | canon default |
| `--radius-sm` / `--radius-md` / `--radius-lg` | 4px / 8px / 12px | canon default |
| `--shadow-sm` / `--shadow-md` | `0 1px 2px rgb(0 0 0 / 0.06)` / `0 2px 8px rgb(0 0 0 / 0.12)` | canon default |
| `--duration-fast` / `--duration-normal` / `--duration-slow` | 150ms / 200ms / 300ms | canon default |
| `--z-dropdown` … `--z-toast` | 1000 … 1080 | canon default |
"""


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def luma_of(h: str) -> float:
    r, g, b = hex_to_rgb(h)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a: str, b: str) -> float:
    def rl(h: str) -> float:
        def ch(c: int) -> float:
            c = c / 255.0
            return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
        r, g, b = hex_to_rgb(h)
        return 0.2126 * rl2(r) + 0.7152 * rl2(g) + 0.0722 * rl2(b)
    def rl2(c: int) -> float:
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    la, lb = rl(a), rl(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def dir_priority(path: str) -> int:
    for i, prefix in enumerate(DIR_PRIORITY):
        if path.startswith(prefix):
            return i
    return len(DIR_PRIORITY)


def pick_canonical(group: list[str], cluster_of: dict[str, str]) -> str:
    def score(p: str) -> tuple:
        c = cluster_of[p]
        semantic = 0 if (c.startswith("le:") or c.startswith("mj:") or c.startswith("root:")) else 1
        return (semantic, dir_priority(p), len(p), p)
    return sorted(group, key=score)[0]


def assign_tokens(rec: dict) -> dict:
    """Deterministic token roles from pixel data (FolderizeStills pseudocode)."""
    sw = list(rec.get("swatches") or [])
    pool = {s["hex"] for s in sw}
    pool.add(rec["median"])
    pool.add(rec["dominant"])
    pool = sorted(pool)
    dark = rec.get("mean_luma", 128) < 110
    by_luma = sorted(pool, key=luma_of)
    bg_primary = by_luma[0] if dark else by_luma[-1]
    bg_l = luma_of(bg_primary)
    rest = [h for h in by_luma if h != bg_primary]
    bg_secondary = min(rest, key=lambda h: abs(luma_of(h) - bg_l)) if rest else bg_primary
    text_primary = max(pool, key=lambda h: contrast(h, bg_primary))
    tp_l, bg_l2 = luma_of(text_primary), luma_of(bg_primary)
    target = bg_l2 + 0.6 * (tp_l - bg_l2)
    text_secondary = min(pool, key=lambda h: abs(luma_of(h) - target))
    sat_of = {s["hex"]: s["sat"] for s in sw}
    near_bg = sorted(pool, key=lambda h: abs(luma_of(h) - bg_l2))[: max(1, len(pool) // 2)]
    border_primary = min(near_bg, key=lambda h: sat_of.get(h, 0.0))
    accent = None
    candidates = [s for s in sw if s["sat"] >= 0.25 and s["share"] <= 0.30]
    if candidates:
        accent = max(candidates, key=lambda s: s["sat"])["hex"]
    used = {bg_primary, bg_secondary, text_primary, text_secondary, border_primary, accent}
    chart = [s["hex"] for s in sorted(sw, key=lambda s: -s["share"])
             if s["hex"] not in used and s["sat"] >= 0.20]
    return {
        "polarity": "dark" if dark else "light",
        "bg_primary": bg_primary, "bg_secondary": bg_secondary,
        "text_primary": text_primary, "text_secondary": text_secondary,
        "border_primary": border_primary, "accent": accent, "chart": chart[:4],
        "contrast_text_bg": round(contrast(text_primary, bg_primary), 2),
    }


def design_tokens_md(slug: str, rec: dict, tier: str, gold_slug: str) -> str:
    t = assign_tokens(rec)
    sw_rows = "\n".join(
        f"| `{s['hex']}` | {round(s['share'] * 100, 1)}% | {s['sat']} | {s['luma']} |"
        for s in rec.get("swatches", [])
    )
    accent_row = (
        f"| `--color-primary` | `{t['accent']}` | highest-sat swatch, sat ≥ 0.25, share ≤ 0.30 | ⚠️ medium |"
        if t["accent"]
        else "| `--color-primary` | — | omitted: no swatch with sat ≥ 0.25 and share ≤ 0.30 (chroma-scarce or chroma-flooded frame) | — |"
    )
    chart_rows = "\n".join(
        f"| `--chart-color-{i+1}` | `{h}` | remaining saturated swatch, share order | ⚠️ medium |"
        for i, h in enumerate(t["chart"])
    )
    css_lines = [
        f"  --color-bg-primary: {t['bg_primary']};",
        f"  --color-bg-secondary: {t['bg_secondary']};",
        f"  --color-text-primary: {t['text_primary']};",
        f"  --color-text-secondary: {t['text_secondary']};",
        f"  --color-border-primary: {t['border_primary']};",
    ]
    if t["accent"]:
        css_lines.append(f"  --color-primary: {t['accent']};")
    css_lines += [f"  --chart-color-{i+1}: {h};" for i, h in enumerate(t["chart"])]
    css_lines += [
        "  --spacing-xs: 4px; --spacing-sm: 8px; --spacing-md: 16px; --spacing-lg: 24px; --spacing-xl: 32px;",
        "  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;",
        "  --duration-fast: 150ms; --duration-normal: 200ms; --duration-slow: 300ms;",
    ]
    return f"""---
title: design-tokens — {slug}
description: Pixel-grounded token sheet for {slug} (Pillow median-cut sample + assembling-components canon).
type: note
created: {TODAY}
author: agent
tags: [folderize, design-tokens, {tier}]
---

# Design tokens — `{slug}`

Source still: `./{slug}.{rec['format'].lower() if rec.get('format') else 'png'}` · {rec.get('width')}×{rec.get('height')} · {rec.get('format')} · polarity **{t['polarity']}** (mean luma {rec.get('mean_luma')}).
Method: Pillow median-cut quantize (8 colors) on a 160px thumb, 5 deduped swatches — `notes/sample-stills.py`. Tier: **{tier}**{'' if tier == 'gold' else f' (cluster rep: [{gold_slug}](../{gold_slug}/))'}.

## 1. Colors — observed in the pixels

| Token | Value | Role basis | Confidence |
| --- | --- | --- | --- |
| `--color-bg-primary` | `{t['bg_primary']}` | {'darkest' if t['polarity'] == 'dark' else 'lightest'} of dominant/median/swatches | ✅ high |
| `--color-bg-secondary` | `{t['bg_secondary']}` | nearest-luma neighbor of bg-primary | ⚠️ medium |
| `--color-text-primary` | `{t['text_primary']}` | max-contrast swatch vs bg-primary ({t['contrast_text_bg']}:1) | ✅ high |
| `--color-text-secondary` | `{t['text_secondary']}` | swatch ~60% between bg and text luma | ⚠️ medium |
| `--color-border-primary` | `{t['border_primary']}` | lowest-sat swatch near bg luma | ⚠️ medium |
{accent_row}
{chart_rows}

Raw swatches (share = area):

| Hex | Share | Sat | Luma |
| --- | --- | --- | --- |
{sw_rows}

Median `{rec.get('median')}` · dominant `{rec.get('dominant')}` · chroma peak `{rec.get('chroma_peak')}`.

## 2. Typography

Not observable from a still at this fidelity — apply `prompts/fonts.md` only if the gold
`design.md` names a face. Canon fallback: `--font-sans: system-ui, sans-serif`;
mono reserved for code/technical labels.

## 3–7. Spacing · borders · shadows · motion · z-index

{CANON_DEFAULTS}

## CSS

```css
:root {{
{chr(10).join(css_lines)}
}}
```
"""


def batch_source_md(slug: str, rec: dict, gold_slug: str, take: str, homogeneous: bool) -> str:
    sw = ", ".join(f"`{s['hex']}` ({round(s['share']*100,1)}%)" for s in rec.get("swatches", []))
    inherit_note = (
        f"Cluster is homogeneous (same prompt / same set) — the take below is inherited from the gold rep [{gold_slug}](../{gold_slug}/) and is very likely accurate for this frame."
        if homogeneous
        else f"Cluster is MIXED — the take below describes the gold rep [{gold_slug}](../{gold_slug}/), which may not match this frame. Trust the pixel facts, not the take."
    )
    return f"""---
title: source — {slug}
description: Provenance + pixel facts for {slug}. Vision not yet per-image; cluster-inherited take marked honestly.
type: note
created: {TODAY}
author: agent
tags: [folderize, source, batch]
---

# Source — `{slug}`

> **Provenance: cluster-inherited.** This still was not individually vision-read.
> {inherit_note}

## Pixel facts (measured, this exact file)

- {rec.get('width')}×{rec.get('height')} {rec.get('format')} · {round(rec.get('bytes', 0)/1024)} KB · mean luma {rec.get('mean_luma')} ({'dark' if rec.get('mean_luma', 128) < 110 else 'light'} register)
- median `{rec.get('median')}` · dominant `{rec.get('dominant')}` · chroma peak `{rec.get('chroma_peak')}`
- swatches: {sw}

## Cluster take (inherited)

{take}

## aesthetics.md thinkingprocess — status per heading

Applied per `prompts/aesthetics.md`; values marked *inherited* come from the cluster rep, *measured* from this file's pixels, *pending* needs a per-image vision pass.

- **Aspects/Subjects/Motifs**: *inherited* — {take}
- **Adjectives**: *pending*
- **Display/Medium/Usage-Context**: *inherited from filename/cluster* — Midjourney/design-lab still
- **Genres/Styles**: *pending*
- **Color Palette**: *measured* — see pixel facts above and `design-tokens.md`
- **Composition**: *pending*
- **Emotional Impact**: *pending*
- **Other Details**: original filename `{rec.get('orig_name', '')}`

Upgrade path: vision-read this frame and rewrite in the full shorthand paragraph per `prompts/aesthetics.md` (100–150 words, code block).
"""


def inherited_design_md(slug: str, gold_slug: str, take: str) -> str:
    return f"""---
title: design — {slug} (inherited)
description: Cluster-inherited design notes. The full per-image design.md lives with the gold cluster rep.
type: note
created: {TODAY}
author: agent
tags: [folderize, design, inherited]
---

# Design — `{slug}` (cluster-inherited)

This frame belongs to a homogeneous cluster. The full `prompts/output-template.md`
analysis (identity → tokens → components → composition → reconstruction → do/don't →
open questions) was written once for the cluster representative and applies here:

→ **[{gold_slug}/design.md](../{gold_slug}/design.md)**

Cluster take: {take}

Per-file tokens in this folder (`design-tokens.md`) are measured from THIS file's
pixels and override the rep's palette where they differ. If a future vision pass shows
this frame diverging from the rep, promote this file to a full design.md and say so.
"""


def inherited_prompt_md(slug: str, gold_slug: str, take: str) -> str:
    return f"""---
title: image-to-prompt — {slug} (inherited)
description: Cluster-inherited generative prompt. Canonical prompt lives with the gold cluster rep.
type: note
created: {TODAY}
author: agent
tags: [folderize, image-to-prompt, inherited]
---

# Image-to-prompt — `{slug}` (cluster-inherited)

Homogeneous cluster: one canonical reverse-engineered prompt (SUBJECT / STYLE /
COMPOSITION / LIGHTING / PALETTE / MOOD / BACKGROUND / AVOID + natural-language
version, per `prompts/element-copy.md`) covers the set:

→ **[{gold_slug}/image-to-prompt.md](../{gold_slug}/image-to-prompt.md)**

Cluster take: {take}

Swap this frame's measured palette (`design-tokens.md`) into the PALETTE block when
regenerating this specific variant.
"""


def gold_stub(title: str, slug: str, kind: str) -> str:
    return f"""---
title: {title} — {slug}
description: GOLD tier — pending vision pass {TODAY}.
type: note
created: {TODAY}
author: agent
tags: [folderize, {kind}, gold, pending-vision]
---

# {title} — `{slug}`

> PENDING VISION — stub written by folderize scaffold, replaced by the gold pass.
"""


def main() -> int:
    data = json.loads((NOTES / "stills-pixel-sample.json").read_text(encoding="utf-8"))
    report = json.loads((NOTES / "stills-rebase-report.json").read_text(encoding="utf-8"))
    recs = {r["path"]: r for r in data["stills"] if r.get("ok")}
    cluster_of = {r["path"]: r["cluster"] for r in data["stills"] if r.get("ok")}

    # canonical dupe resolution
    canonical_of_group: dict[str, str] = {}
    dupe_left_in_place: dict[str, str] = {}  # left path -> canonical path
    for group in report["dupe_groups"]:
        members = [p for p in group if p in recs]
        if not members:
            continue
        canon = pick_canonical(members, cluster_of)
        canonical_of_group[canon] = canon
        for p in members:
            if p != canon:
                dupe_left_in_place[p] = canon

    folderize_paths = [p for p in recs if p not in dupe_left_in_place]

    # group by cluster, pick gold rep (vision_sampled first, then max bytes)
    by_cluster: dict[str, list[str]] = defaultdict(list)
    for p in folderize_paths:
        by_cluster[cluster_of[p]].append(p)

    manifest: dict[str, dict] = {}
    slug_seen: set[str] = set()
    gold_reps: list[dict] = []

    for cluster, paths in sorted(by_cluster.items()):
        slug, homogeneous, take = CLUSTER_MAP.get(cluster, (None, False, ""))
        if slug is None:
            slug = "cluster-" + "".join(c if c.isalnum() else "-" for c in cluster)[:60].strip("-").lower()
        rep = sorted(paths, key=lambda p: (not recs[p].get("vision_sampled"), -recs[p].get("bytes", 0), p))[0]
        ordered = sorted(paths)
        n = 1
        for p in ordered:
            if p == rep:
                s = slug
                tier = "gold"
            else:
                n += 1
                s = f"{slug}-{n:02d}"
                tier = "batch"
            assert s not in slug_seen, f"slug collision: {s}"
            slug_seen.add(s)
            manifest[p] = {
                "folder": f"extractions/{s}", "slug": s, "tier": tier, "cluster": cluster,
                "homogeneous": homogeneous, "vision": "self" if (tier == "gold") else "cluster-inherited",
                "vision_sampled_prior": bool(recs[p].get("vision_sampled")),
            }
            if p == rep:
                gold_reps.append({"slug": s, "path": p, "cluster": cluster, "take": take})

    OUT.mkdir(exist_ok=True)
    written = {"folders": 0, "moves": 0, "tokens": 0, "source": 0, "design": 0, "prompt": 0}
    new_path_of: dict[str, str] = {}

    for old_path, m in sorted(manifest.items()):
        rec = recs[old_path]
        slug = m["slug"]
        folder = OUT / slug
        folder.mkdir(parents=True, exist_ok=True)
        ext = Path(old_path).suffix.lower().lstrip(".")
        new_rel = f"extractions/{slug}/{slug}.{ext}"
        dst = folder / f"{slug}.{ext}"
        src = ROOT / old_path
        if src.exists() and not dst.exists():
            shutil.move(str(src), str(dst))
            written["moves"] += 1
        rec["orig_name"] = Path(old_path).name
        new_path_of[old_path] = new_rel
        m["new_path"] = new_rel

        slug_take = CLUSTER_MAP.get(m["cluster"], (slug, False, ""))[2]
        (folder / "design-tokens.md").write_text(
            design_tokens_md(slug, rec, m["tier"], CLUSTER_MAP.get(m["cluster"], (slug,))[0]),
            encoding="utf-8")
        written["tokens"] += 1

        if m["tier"] == "gold":
            (folder / "source.md").write_text(gold_stub("Source", slug, "source"), encoding="utf-8")
            (folder / "design.md").write_text(gold_stub("Design", slug, "design"), encoding="utf-8")
            (folder / "image-to-prompt.md").write_text(gold_stub("Image-to-prompt", slug, "image-to-prompt"), encoding="utf-8")
            written["source"] += 1
            written["design"] += 1
            written["prompt"] += 1
        else:
            (folder / "source.md").write_text(
                batch_source_md(slug, rec, CLUSTER_MAP.get(m["cluster"], (slug,))[0], slug_take, m["homogeneous"]),
                encoding="utf-8")
            written["source"] += 1
            if m["homogeneous"]:
                (folder / "design.md").write_text(
                    inherited_design_md(slug, CLUSTER_MAP.get(m["cluster"], (slug,))[0], slug_take), encoding="utf-8")
                (folder / "image-to-prompt.md").write_text(
                    inherited_prompt_md(slug, CLUSTER_MAP.get(m["cluster"], (slug,))[0], slug_take), encoding="utf-8")
                written["design"] += 1
                written["prompt"] += 1
        written["folders"] += 1

    # rebase pixel-sample paths to extraction folders
    for rec in data["stills"]:
        p = rec["path"]
        if p in new_path_of:
            rec["path"] = new_path_of[p]
            rec["folder"] = manifest[p]["folder"]
            rec["slug"] = manifest[p]["slug"]
            rec["tier"] = manifest[p]["tier"]
        elif p in dupe_left_in_place:
            rec["dupe_of"] = new_path_of[dupe_left_in_place[p]]
            rec["tier"] = "dupe-unfolderized"
    data["folderized"] = TODAY
    data["missing_from_disk"] = report["missing"]
    (NOTES / "stills-pixel-sample.json").write_text(json.dumps(data, indent=2), encoding="utf-8")

    manifest_doc = {
        "generated": TODAY,
        "layout": "extractions/<slug>/",
        "counts": {
            "images_on_disk": report["current_on_disk"],
            "folders": written["folders"],
            "gold": len(gold_reps),
            "batch": written["folders"] - len(gold_reps),
            "dupes_left_in_place": len(dupe_left_in_place),
            "missing": len(report["missing"]),
        },
        "gold_reps": gold_reps,
        "dupes": [
            {"left_in_place": p, "canonical_folder": manifest[dupe_left_in_place[p]]["folder"],
             "canonical_path": new_path_of[dupe_left_in_place[p]]}
            for p in sorted(dupe_left_in_place)
        ],
        "missing": report["missing"],
        "entries": {m["new_path"]: {**{k: v for k, v in m.items() if k != "new_path"}, "old_path": p}
                    for p, m in sorted(manifest.items(), key=lambda kv: kv[1]["new_path"])},
    }
    (NOTES / "folderize-manifest.json").write_text(json.dumps(manifest_doc, indent=1), encoding="utf-8")

    # verify
    bad = [m["new_path"] for m in manifest.values() if not (ROOT / m["new_path"]).exists()]
    no_tokens = [m["new_path"] for m in manifest.values() if not (ROOT / m["folder"] / "design-tokens.md").exists()]
    print(json.dumps({"written": written, "gold": len(gold_reps), "dupes_left": len(dupe_left_in_place),
                      "missing_files_after_move": bad[:5], "folders_missing_tokens": no_tokens[:5],
                      "verify_ok": not bad and not no_tokens}, indent=1))
    return 0 if not bad and not no_tokens else 1


if __name__ == "__main__":
    sys.exit(main())
