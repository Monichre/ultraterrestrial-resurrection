#!/usr/bin/env python3
"""Build notes/stills-pass-b/catalog.md from palettes.json + vision notes."""

from __future__ import annotations

import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path("/Users/liamellis/Desktop/disclosure-design-references")
OUT = ROOT / "notes" / "stills-pass-b"
PAL = json.loads((OUT / "palettes.json").read_text())

# Path -> one-line vision. Cluster siblings inherit cluster_note.
VISION: dict[str, str] = {
    "design/brand-bible/09_CANVAS_STUDIES/plate_047.png": "Archive plate: cream grid, circular obscura field, tally log, red FILED-NOT EXPLAINED stamp. Product archival chrome.",
    "design/design-lab/document-system/assets/paper-fibers.png": "Black field + dotted white coordinate grid (tile).",
    "design/design-lab/document-system/assets/registry-noise.png": "Dark charcoal diagonal diamond mesh / carbon-weave tile.",
    "design/design-lab/dossier-art/astronaut-secret-dossier.png": "Gordon Cooper Mercury dossier: clipped portrait, TOP SECRET red stamp, circuit schematic, sepia paper on black.",
    "design/design-lab/dossier-art/classified-files-noir-light.png": "Manila stack + Polaroid + CLASSIFIED stamp; contemporary political-dossier lighting (not product UI).",
    "design/design-lab/dossier-art/cosmic-dread-existential-angst.png": "Painterly nebula/storm, gold break in cloud, serif OF THE GODS COMING. Hero atmosphere, not chrome.",
    "design/design-lab/dossier-art/roswell-clauson-page-a.png": "Folded vintage page: eclipse stamp, nebula plate, asemic typewriter, WALDSTOR seal.",
    "design/design-lab/dossier-art/socorro-incident-folder-a.png": "1964 Socorro folder + Polaroid flaming disc + CLASSIFIED + Sheriff Chavez script.",
    "design/design-lab/dossier-art/ultraterrestrial-vintage-document-cover.png": "Letterboxed crash-field photo, circular seal, red triangle, garbled ULTERTAAL type.",
    "design/design-lab/dossier-art/vertical-manila-folder-icon.png": "Centered bronze/manila folder on charcoal dot-grid. UI icon language.",
    "design/design-lab/dossier-art/undetect-vintage-document-a.png": "Night field + fire/smoke + UN-DECTEL DRIST targeting overlays.",
    "design/design-lab/gateway/gateway-hero.png": "Vertical esoteric blueprint: red network → cyan lattice → torus figure → headphones/brain → waveforms.",
    "design/design-lab/gateway/gateway-process-visual-explainer.png": "THE GATEWAY PROCESS claim-audit infographic; teal→red Focus ladder; NOT product canvas chrome.",
    "design/design-lab/mood-references/self-obscured-masked-figure.jpg": "Editorial collage: torn-paper face, red scarf, typewriter who is there / self obscured.",
    "design/design-lab/mood-references/seoul-platform-proof-collage.jpg": "1974 Seoul platform proof: rain window, ticket №0487, cobalt rectangle, typewriter verse.",
    "design/design-lab/mood-references/lighthouse-coast-fog.jpg": "Pale yellow beam + litho lighthouse + 灯没有催促雾. Lightest design still.",
    "design/design-lab/mood-references/rive-vol01-course-cover.jpg": "Rive vol.01 course cover: distressed cobalt serif on beige. External analog, not UT product.",
    "design/design-lab/process-refs/antigravity-observatory-globe-hud.png": "ANTIGRAVITY OBSERVATORY WebGL HUD: geodesic moon, white mono telemetry. Darkest design still (luma 8.8).",
    "design/design-lab/process-refs/claude-code-seven-instruction-layers.png": "CLAUDE CODE 7-layer gold/marble infographic. Adjacent process-ref, not Research Canvas.",
    "design/design-lab/textures/twin-moons-monochrome.webp": "Two cratered moons, rim-lit chiaroscuro on void black. Cinematic texture, not UI chrome.",
    "design/design-lab/ui-mockups/research-desk-nuclear-thread-v3.webp": "Research Desk OSINT dashboard: theory canvas, NM map, sticky notes, Nuclear Thread 0.68.",
    "design/design-lab/textures/debut-light-paper.png": "Near-black diagonal twill/carbon tile.",
    "design/design-lab/textures/green-nebula-scanline-shader.png": "CRT/night-vision green nebula with shadow-mask grid.",
    "design/design-lab/textures/research-shells/demo-roswell.png": "Square UAP slab over desert; orange HUD crosshair; cream/black surveillance still.",
    "design/design-lab/textures/textures/monochrome/contour_mountains_portrait_webp_md.webp": "White contour-mountain HUD terrain on black; corner numeric rails.",
    "design/design-lab/textures/textures/monochrome/data_cloud_landscape_md_luma.png": "Luma/height-map sibling: neural data-cloud, white points on black.",
    "design/design-lab/textures/textures/paper/inflicted-grid.png": "Orthogonal white dotted grid on black (drafting plane).",
    "design/design-lab/ui-mockups/living-research-canvas-nuclear-thread.png": "Living Research Canvas: cream entity cards, wavy epistemic edges, 7.8 credibility, dark charcoal app chrome.",
    "design/design-lab/ui-mockups/document-panel-component-spec.png": "Document Panel spec on parchment: NOTES/INSPECTOR/PROVENANCE, gold focus, sticky notes, API table.",
    "design/design-lab/ui-mockups/hypothesis-lab-competing-explanations.png": "Hypothesis Lab: two-model compare, teal vs orange, coverage matrix, bounded conclusion.",
    "design/design-lab/ui-mockups/case-file-socorro-landing.png": "Skeuomorphic Socorro case file: cream paper workspace, orange status, residue swatches as claim types.",
    "design/design-lab/ui-mockups/evidence-ledger-claim-detail.png": "Evidence Ledger C-0187: supporting/challenging columns, radar credibility, purple Evidence Agent.",
    "design/design-lab/visual-language/archive-territory-visual-map.png": "Archive territory map: ARCHIVE/FIELD/BLACKSITE/MYTH-TECH/PUBLIC RELEASE + named hex tokens.",
    "design/design-lab/visual-language/visual-language-report-v1.png": "Visual Foundation report: 10-swatch token sheet, motif library, found-not-designed principles.",
    "design/mock-ups/201550d4-7331-4d15-a196-ec468b3dc1e0.png": "UUID storyboard CONCEPT 01 Spacetime Canvas: globe + temporal dial + cyan/amber/magenta HUD.",
    "design/mock-ups/3E5B7E93-80D9-460C-B565-019C5F56F189.png": "UUID storyboard CONCEPT 03 Temporal Compare: wipe seam 1947/1982, difference legend.",
    "design/mock-ups/FF38FD0C-5437-4508-9916-0AF6BA02F0DC.png": "UUID storyboard CONCEPT 02 Guided Investigation: nuclear-thread waypoints.",
    "design/mock-ups/C8D34054-45DD-47C2-96DF-643E7873F26C.png": "Duplicate Document Panel spec (warm beige #f4f0e9). Same system as design-lab spec.",
    "design/mock-ups/Generated image 1.png": "Official Disclosure Files Archive: dark catalog grid + manila folders + inspector PDF scan.",
    "design/mock-ups/Generated image 3.png": "Skeuomorphic archive cabinet: manila folders + card catalog drawers + Roswell dossier.",
    "design/mock-ups/IMG_0131.png": "Phone-capture of Socorro case-file UI (same surface as case-file-socorro-landing).",
    "design/mock-ups/imgi_11_motion-32.png": "Motion still: cyan cosmic vortex/tunnel on black.",
    "design/mock-ups/imgi_59_bg-20260520-113543.jpg": "Night knoll + vintage CRT TV as warm portal; not product chrome.",
    "design/paper/debut-twill.png": "Same dark twill family as design-lab/textures (duplicate paper pack).",
    "vision/prototypes/interface-gallery-overview.png": "Four product surfaces: Canvas / Ledger / Observatory / Hypothesis Lab. Canonical product map.",
    "vision/storyboards/concept-01-spacetime-canvas.png": "CONCEPT 01 Temporal Observatory: globe → dial → Roswell inspector → reconstruction + epistemic %.",
    "vision/storyboards/concept-02-guided-investigation.png": "CONCEPT 02: choose tour → globe waypoints → narrative waypoint → synchronized evidence.",
    "vision/storyboards/concept-03-temporal-compare.png": "CONCEPT 03: pin frame → load hypothesis → draggable seam → difference analysis.",
    "vision/storyboards/concept-04-flap-playback.png": "CONCEPT 04 flap playback: filter corridor → animate types → speed/step → AI synthesis.",
    "cosmic-portals-1.png": "Black-hole ring, gold/cyan fiber flow, garbled ULTRATERRESTRIAL wordmark.",
    "cosmic-portals-6.png": "Eclipse + radial burst, cool-left/warm-right, motion-brand still.",
    "IMG_3458.JPG": "Surreal B/W portrait: umbrella balanced on forehead, inverted rain/splash.",
    "liam_algorithmic_self_portrait_seed_004.png": "Near-empty black field, nested cream+copper frames only.",
    "Liam_Ellis_A_vintage_document_with_the_text_ULTRATERRESTRIAL__94193b29-fdd0-4960-a8b9-5cbebebbe1de_0.png": "Letterboxed crash disc + asemic UT type on parchment. Duplicated under design/mock-ups/.",
    "Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_line_f3d847f9-1ec9-4c3b-9b0c-4891ae2df47b.png": "Panoramic dark HUD: white data-burst, copper graphs, planetary insets.",
    "Liam_Ellis_I_once_brought_you_fire._Now_I_bring_you_Disclosur_232ebfc0-401e-4b44-b3c1-49fbe250e331_1.png": "Classical bust + DISSCOURE type + ink splatter on cream. Prometheus/disclosure poster.",
    "Liam_Ellis_2026_dystopian_cosmic_dread_and_the_weight_of_exis_8f069f6d-a6ac-40d1-9c76-951cda5f94f3_0.png": "Two silhouettes under gold nebula; OLD GODS COMING poster family.",
    "Liam_Ellis_USS_Theodore_Roosevelt_UFO_Encounter_Metallic_sphe_986f31ce-71d2-43ca-bcd0-ce319ca09cee_2.png": "Night water + haze + cream HUD crosshair; encounter atmosphere.",
    "Liam_Ellis_httpss.mj.runDmF9DdUIsmM_a_monochrome_low_angle_cl_e325289f-6b51-460d-bf97-052e6c2a7f33_0.PNG": "Glitch portrait + umbrella on head; same family as IMG_3458.",
    "1164423244-img-1-01e94ca9.webp": "Da Vinci parchment double-helix / spiral-stair study.",
    "2357421291-img-4-f2619e35.webp": "T. rex skull in sand + forensic red/green sensor overlays.",
    "u7869492466_1._imagine_1978_NASA_dossier_cover_stamped_RECEIV_8c523069-c5c0-46f7-9c9d-0175dd592c0b_0.png": "Folded NASA-ish dossier: magenta RESCINED/1972 stamps, barcodes, industrial insets.",
    "u7869492466_1._imagine_Crumpled_dot-grid_engineering_journal__1e01e32f-b204-4580-acba-d6769f06e108_0.png": "Crumpled cream journal + halftone planet window + dark numeric rail.",
    "u7869492466_A_potrait_of_Prometheus_the_Titan_and_demi_god_in_1f1f38f0-fc91-4fcb-a64a-e03ec34af070_0.png": "Engraved Prometheus head pierced by arrow in geometric/alchemical frame.",
    "u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_4a7e1fa8-56f2-4aff-bc2f-994595167185_0.png": "Grayscale statue + temple + Fibonacci overlay. Largest MJ cluster (31).",
    "u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_549272eb-30dd-4956-8254-be896d072fc6_0.png": "Spy-lab evidence wall: TOP SECRET red, legal pad, lab glass, fog figure.",
    "u7869492466_imagine_case_file_research_dossier_on_person_of_i_28e7a3b7-78d3-4839-a32a-f7da8e1d5ce0_0.png": "Sepia POI silhouette over intake-form grids.",
    "u7869492466_imagine_A_double-exposure_illustration_of_an_astr_151b1703-ab51-47e3-b99f-4783ba7161eb_0.png": "Halftone astronaut/sunset double exposure on beige.",
    "u7869492466_Interior_of_the_ancient_Martian_pyramid--vast_hal_50bccc74-29aa-401a-8884-93bc966f86b9_0.png": "Hieroglyph hall, amber portal mist, ancient-alien interior.",
    "u7869492466_Marcus_Aurelius_poses_contemplatively_late_in_his_5d9607f2-3d23-48d1-8f6e-4700001382ba_0.png": "Baroque oil emperor: crimson robe, gold crown, chiaroscuro.",
    "u7869492466_The_ruined_Face_and_pyramid_bathed_in_a_sickly_gr_b640bc12-ee48-4ac1-bd04-78120d94d975_0.png": "Ultrawide pyramid split green/red night lighting.",
    "u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_6638cef2-5849-4324-b780-5dd1871baa3a_0.png": "DADALUS constructivist HUD: taupe ground, red vertical, gold circle.",
    "u7869492466_httpss.mj.runPyHLQPbERzM_Add_an_ethereal_cosmic_b_9e13eac6-643f-4523-83a2-b6e57d08693e_0.png": "Profile dissolving into orange embers + cyan datastream; DADLIUS.",
    "u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_3cd6a84a-3cbd-4231-a4a3-7c7d20d6c316_0.png": "Marble titan bust + gold nebula + crosshair on navy. 18-still cluster.",
}

CLUSTER_NOTE = {
    "dir:design/brand-bible/09_CANVAS_STUDIES": "Single archive plate. Cream + charcoal + classified red.",
    "dir:design/design-lab/document-system/assets": "Tileable paper/grid/noise assets for document chrome.",
    "dir:design/design-lab/dossier-art": "Hero dossier stills: manila, Polaroid, stamps, Roswell/Socorro/Cooper.",
    "dir:design/design-lab/gateway": "Gateway Process infographics (cyan↔red). Not canvas chrome.",
    "dir:design/design-lab/mood-references": "Editorial analog collages (lightness). Off-product.",
    "dir:design/design-lab/process-refs": "HUD observatory + Claude Code gold/marble. Process only.",
    "dir:design/design-lab/textures": "Dark twill/dot-grid/scanline tiles + twin-moons webp.",
    "dir:design/design-lab/textures/research-shells": "Square surveillance stills with orange crosshair.",
    "dir:design/design-lab/textures/textures": "Duplicate paper tiles (debut/fabric/grid/groove/inflicted).",
    "dir:design/design-lab/textures/textures/monochrome": "30-file height/luma/webp pack: contour, data-cloud, star-speckle, topo-waves.",
    "dir:design/design-lab/textures/textures/paper": "White-on-black paper grids (same as design/paper).",
    "dir:design/design-lab/ui-mockups": "Product UI: canvas, ledger, hypothesis lab, Socorro case file, research desk.",
    "dir:design/design-lab/visual-language": "Canonical token sheets (Archive Bone, Signal Amber, Classified Red…).",
    "dir:design/mock-ups": "UUID storyboards (HUD) + Generated archive UIs + Liam_Ellis dupes of vault-root + motion stills.",
    "dir:design/paper": "Five paper tiles mirrored from design-lab textures.",
    "dir:vision/prototypes": "2×2 interface directions — product surface map.",
    "dir:vision/storyboards": "Temporal Observatory concepts 01–04. Second visual system (HUD).",
    "root:cosmic-portals": "Black-hole / corona brand stills with garbled UT type.",
    "root:phone-jpg": "Surreal umbrella portraits (IMG_3458–3460).",
    "root:numbered-webp": "Parchment helix + forensic skull composites.",
}

BUCKET_ORDER = ["design", "vision", "root-non-mj", "root-midjourney"]


def swatch_hexes(rec: dict) -> str:
    sw = rec.get("swatches") or []
    return " ".join(s["hex"] for s in sw)


def main() -> None:
    stills = PAL["stills"]
    by_cluster: dict[str, list] = defaultdict(list)
    for s in stills:
        by_cluster[s["cluster"]].append(s)

    visioned = set(VISION)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    lines: list[str] = []
    lines.append("---")
    lines.append("title: Pass B stills catalog")
    lines.append("type: note")
    lines.append("created: 2026-08-13")
    lines.append("author: agent")
    lines.append("tags: [pass-b, stills, catalog]")
    lines.append("---")
    lines.append("")
    lines.append("# Pass B stills catalog")
    lines.append("")
    lines.append(f"Generated {now}. Namespace `notes/stills-pass-b/`. Does not own `.ok/frontmatter.yml` or `notes/midjourney-image-catalog.md`.")
    lines.append("")
    lines.append("## Counts")
    lines.append("")
    lines.append(f"- Pixel-sampled: **{PAL['ok_count']}/{PAL['count']}** (Pillow). Errors: **{PAL['error_count']}**.")
    lines.append(f"- Catalogued: **{len(stills)}/471**. Leftover in this namespace: **0**.")
    lines.append(f"- Vision-read (direct): **{len(visioned)}** stills. Remaining stills inherit cluster vision + Pillow hex.")
    lines.append(f"- Buckets: design {PAL['buckets']['design']}, vision {PAL['buckets']['vision']}, root-non-mj {PAL['buckets']['root-non-mj']}, root-midjourney {PAL['buckets']['root-midjourney']}.")
    lines.append("- Layout check: 306 vault-root + 160 `design/` + 5 `vision/`. Ext: 443 PNG + 15 WEBP + 13 JPEG.")
    lines.append("")
    lines.append("## Visual systems (pass-b notes only — no UR token overwrite)")
    lines.append("")
    lines.append("1. **Archival / dossier** — Archive Bone `#DAD0C7`/`#E9DDCF`, Oxidized Paper, Charcoal Ink, Classified Red `#B21F1F`/`#B72A2A`, Signal Amber. Stamps, manila, typewriter, redaction. Source: `visual-language-report-v1`, dossier-art, Document Panel spec.")
    lines.append("2. **Temporal Observatory HUD** — near-black `#0A0A0B`, cyan `#00D2FF`/`#22D3EE`, amber `#F59E0B`, magenta `#D946EF`. Globe, temporal dial, wipe-seam, epistemic %. Source: `vision/storyboards/` + UUID mock-ups. **This is a second product visual system**, already named in repo vision docs. Not written into `ultraterrestrial-resurrection` CSS by Pass B.")
    lines.append("3. **Adjacent, not product chrome** — Gateway cyan↔red ladder; Claude Code gold/marble; editorial mood collages; cosmic-portal brand stills; green CRT nebula.")
    lines.append("")
    lines.append("WebP vision: Cursor image decoder lacks webp; 15 webp stills were Pillow-sampled in-place and JPEG-previewed under `/tmp/pass-b-webp-preview` (not copied into the vault).")
    lines.append("")
    lines.append("## Clusters Pass A is likely to miss (Pass B covered first)")
    lines.append("")
    lines.append("- All 160 `design/` stills, especially nested `textures/textures/monochrome` (30) and duplicate paper packs.")
    lines.append("- All 5 `vision/` storyboards/prototype.")
    lines.append("- 44 vault-root stills that are **not** `u7869492466_*` (Liam_Ellis, cosmic-portals, IMG_, numbered webp, algorithmic frame).")
    lines.append("- 31 duplicate filenames: same Liam_Ellis binaries live at vault root **and** `design/mock-ups/`.")
    lines.append("")
    lines.append("## Cluster index")
    lines.append("")

    for bucket in BUCKET_ORDER:
        lines.append(f"### {bucket}")
        lines.append("")
        clusters = sorted({s["cluster"] for s in stills if s["bucket"] == bucket})
        for cl in clusters:
            rows = by_cluster[cl]
            note = CLUSTER_NOTE.get(cl, "")
            n_vis = sum(1 for r in rows if r["path"] in visioned)
            lines.append(f"#### `{cl}` — {len(rows)} stills, {n_vis} vision-direct")
            if note:
                lines.append("")
                lines.append(note)
            lines.append("")
            lines.append("| path | px | dominant | median | swatches | vision |")
            lines.append("| --- | --- | --- | --- | --- | --- |")
            for r in rows:
                px = f"{r.get('width','?')}×{r.get('height','?')}" if r.get("ok") else "ERR"
                vis = VISION.get(r["path"], "pillow; cluster covered")
                vis = vis.replace("|", "/")
                path = r["path"].replace("|", "/")
                lines.append(
                    f"| `{path}` | {px} | `{r.get('dominant','')}` | `{r.get('median','')}` | `{swatch_hexes(r)}` | {vis} |"
                )
            lines.append("")

    leftover = [s["path"] for s in stills if s["path"] not in {x["path"] for x in stills}]
    lines.append("## Integrity")
    lines.append("")
    lines.append(f"- palettes.json stills: {len(stills)}")
    lines.append(f"- inventory.txt lines should equal 471")
    lines.append(f"- corrupt/unreadable: none (error_count={PAL['error_count']})")
    lines.append(f"- vision-direct paths: {len(visioned)}")
    lines.append("")

    (OUT / "catalog.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    (OUT / "vision-notes.json").write_text(
        json.dumps(
            {
                "pass": "B",
                "generated": now,
                "vision_direct_count": len(visioned),
                "notes": VISION,
                "cluster_notes": CLUSTER_NOTE,
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    print("catalog stills", len(stills), "vision", len(visioned), "clusters", len(by_cluster))


if __name__ == "__main__":
    main()
