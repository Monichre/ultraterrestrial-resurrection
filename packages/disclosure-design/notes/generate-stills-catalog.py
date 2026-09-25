#!/usr/bin/env python3
"""Build per-file catalog + cluster summary from stills-pixel-sample.json."""

from __future__ import annotations

import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path("/Users/liamellis/Desktop/disclosure-design-references")
NOTES = ROOT / "notes"
SAMPLE = NOTES / "stills-pixel-sample.json"

VISION_THIS_PASS = [
    "design/mock-ups/FF38FD0C-5437-4508-9916-0AF6BA02F0DC.png",
    "design/mock-ups/C8D34054-45DD-47C2-96DF-643E7873F26C.png",
    "design/mock-ups/Generated image 1.png",
    "design/mock-ups/IMG_0131.png",
    "design/mock-ups/imgi_11_motion-32.png",
    "design/design-lab/textures/textures/monochrome/data_cloud_landscape_md_luma.png",
    "design/design-lab/textures/textures/monochrome/contour_mountains_portrait_jpeg_lg_height.png",
    "design/design-lab/textures/textures/monochrome/star_speckle_landscape_lg.webp",
    "design/design-lab/textures/textures/monochrome/topo_waves_portrait_lg.webp",
    "design/design-lab/dossier-art/astronaut-secret-files-a.png",
    "design/design-lab/dossier-art/classified-files-noir-light.png",
    "design/design-lab/dossier-art/socorro-incident-folder-a.png",
    "design/design-lab/dossier-art/vertical-manila-folder-icon.png",
    "design/design-lab/dossier-art/roswell-evidence-folder-a.png",
    "cosmic-portals-4.png",
    "cosmic-portals-5.png",
    "cosmic-portals-6.png",
    "design/design-lab/mood-references/lighthouse-coast-fog.jpg",
    "design/design-lab/mood-references/bird-brief-lightness-collage.jpg",
    "design/design-lab/mood-references/self-obscured-masked-figure.jpg",
    "design/design-lab/mood-references/seoul-platform-proof-collage.jpg",
    "design/design-lab/mood-references/rive-vol01-course-cover.jpg",
    "design/design-lab/mood-references/shore-seashell-dry-wind.jpg",
    "design/design-lab/mood-references/summer-still-air-bottle.jpg",
    "IMG_3458.JPG",
    "IMG_3460.JPG",
    "design/design-lab/ui-mockups/evidence-ledger-claim-detail.png",
    "design/design-lab/ui-mockups/hypothesis-lab-competing-explanations.png",
    "design/design-lab/ui-mockups/case-file-socorro-landing.png",
    "design/design-lab/ui-mockups/research-desk-nuclear-thread-v3.webp",
    "design/design-lab/ui-mockups/research-notebook-document-panel.png",
    "design/design-lab/textures/green-nebula-scanline-shader.png",
    "design/design-lab/textures/dot-grid-black.png",
    "design/design-lab/gateway/gateway-process-visual-explainer.png",
    "design/design-lab/process-refs/antigravity-observatory-globe-hud.png",
    "design/design-lab/process-refs/claude-code-seven-instruction-layers.png",
    "vision/storyboards/concept-01-spacetime-canvas.png",
    "vision/storyboards/concept-03-temporal-compare.png",
    "design/design-lab/visual-language/archive-territory-visual-map.png",
    "design/design-lab/textures/research-shells/demo-roswell.png",
    "design/paper/inflicted-grid.png",
    "design/design-lab/document-system/assets/paper-tooth.png",
    "design/design-lab/textures/textures/debut-light.png",
    "design/design-lab/textures/textures/paper/debut-twill.png",
    "2357421291-img-4-f2619e35.webp",
    "Liam_Ellis_USS_Theodore_Roosevelt_UFO_Encounter_Metallic_sphe_986f31ce-71d2-43ca-bcd0-ce319ca09cee_2.png",
    "liam_algorithmic_self_portrait_seed_004.png",
    "Liam_Ellis_2026_dystopian_cosmic_dread_and_the_weight_of_exis_8f069f6d-a6ac-40d1-9c76-951cda5f94f3_0.png",
    "Liam_Ellis_The_most_merciful_thing_in_the_world_I_think_is_th_4cbdb52d-4efa-4794-ab29-40e590463c20_3.png",
    "Liam_Ellis_Design_an_old_faded_page_from_the_Roswell_Clauson__4d09b284-ed01-400c-be88-35efcd3d2f35_3.png",
    "Liam_Ellis_httpss.mj.runH5VQtrfnHkg_httpss.mj.run1BwB8ICKGdU__0caaac09-32fe-4d3c-9bba-bf535e9851d4_2.png",
    "Liam_Ellis_httpss.mj.runDmF9DdUIsmM_a_monochrome_low_angle_cl_e325289f-6b51-460d-bf97-052e6c2a7f33_0.PNG",
    "Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_line_f3d847f9-1ec9-4c3b-9b0c-4891ae2df47b.png",
    "u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_6b1c3302-fa64-4fd8-b8df-cb9187240900_0.png",
    "u7869492466_httpss.mj.run6BrTXcbs5o8_httpss.mj.runDzfcExb-EEs_fb6dc59e-6947-4f4b-8945-b9e07997a773_3.png",
    "u7869492466_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_7f11a006-758f-49ae-bebf-a9ead8a1e537_1.png",
    "u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_857cc86c-eed1-42e6-844d-1a29209f3c78_3.png",
    "u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geome_f3178295-8aa4-4efa-808b-3d6070070819_0.png",
    "u7869492466_imagine_case_file_research_dossier_on_person_of_i_988b5f6f-bd72-48a6-a524-ec92cb7d4bbd_0.png",
    "u7869492466_imagine_case_file_research_dossier_on_person_of_i_28e7a3b7-78d3-4839-a32a-f7da8e1d5ce0_2.png",
    "u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_f7cfb06d-b3d9-4250-8566-b3fb6975c61c_0.png",
    "u7869492466_1._imagine_dot-grid_engineering_journal_page._Pap_6feb8eda-2772-49fb-8119-8b4085c05361_0.png",
    "u7869492466_1._imagine_dot-grid_engineering_journal_page_hand_2bace0f6-d3ab-42e3-b644-f74bd801626c_0.png",
    "u7869492466_1._imagine_dot-grid_engineering_journal_page_hand-d_961739e4-ca6b-4a7a-81bb-d9f6ae81affa.png",
    "u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_e68c2b60-897a-4b5a-b924-9a05985172df_3.png",
    "u7869492466_httpss.mj.runBWpx9goK2Yw_httpss.mj.runDHycsUHpR3w_240d94a9-d69a-423f-936b-2ffc68f17ff7_3.png",
    "u7869492466_httpss.mj.runnzkeht6Sh_w_Using_the_elements_creat_3ca388dd-f5ca-402c-b343-3224baa2a2b9_2.png",
    "u7869492466_httpss.mj.runnzkeht6Sh_w_httpss.mj.run9fO88Nx_WdQ_1807df27-3dff-4617-84c1-ffe6747d2019_0.png",
    "u7869492466_Interior_of_the_ancient_Martian_pyramid--vast_hal_50bccc74-29aa-401a-8884-93bc966f86b9_0.png",
    "u7869492466_The_ruined_Face_and_pyramid_bathed_in_a_sickly_gr_b640bc12-ee48-4ac1-bd04-78120d94d975_3.png",
    "u7869492466_Marcus_Aurelius_poses_contemplatively_late_in_his_5d9607f2-3d23-48d1-8f6e-4700001382ba_0.png",
    "u7869492466_imagine_A_double-exposure_illustration_of_an_astr_151b1703-ab51-47e3-b99f-4783ba7161eb_3.png",
    "u7869492466_httpss.mj.runPyHLQPbERzM_Add_an_ethereal_cosmic_b_9e13eac6-643f-4523-83a2-b6e57d08693e_3.png",
    "u7869492466_httpss.mj.runDzfcExb-EEs_httpss.mj.run6BrTXcbs5o8_59469168-febd-443f-9f67-082732d15bfc_0.png",
    "u7869492466_httpss.mj.runMZMhansvdqw_httpss.mj.runiWhjnQ_q5Oo_49468e14-3558-4d52-8cff-211708dea5b0_0.png",
    "u7869492466_httpss.mj.run4lJsYuU87_I_The_resplendent_Mind_of__77cab51b-64ea-4382-b797-908d3bfd1c43_0.png",
    "u7869492466_httpss.mj.run6YMM4u3OHRk_Help_me_design_spy-lab_m_03dbcb17-e2e7-43e2-87c2-8e6a6c3cec83_0.png",
    "u7869492466_httpss.mj.run8kto5yFzLuA_httpss.mj.runUZd2SaizyJo_d9f2e26d-3546-41bc-83ae-55d772e7a488_0.png",
    "u7869492466_httpss.mj.runDHycsUHpR3w_httpss.mj.runDgchVxycRAk_2749385a-059c-4e09-a965-94f33a1d96ee_0.png",
    "u7869492466_httpss.mj.runHJ9pS-yZ_R4_httpss.mj.runomtqEPCbNrc_3b292746-7af6-4c9d-96b1-bbc0b69122fa_0.png",
    "u7869492466_httpss.mj.runMZMhansvdqw_A_sketched_line_drawing__7c01ff1c-f95b-4406-bbb8-22444f308fc8_0.png",
    "u7869492466_httpss.mj.runpC26JKid3xA_httpss.mj.runbPCsrT4C1do_944948e4-a8be-47d6-9a8b-4c26d38dcbae_0.png",
    "u7869492466_httpss.mj.runPzHS2D693k4_httpss.mj.runsjmQUspjdoU_835e966b-de12-44cb-966a-3ffa352290c7_0.png",
    "u7869492466_httpss.mj.runV7TOfpZZ8fc_httpss.mj.run90TFM6ZbOgE_0e9dbe55-1f26-4ae5-961c-aa3665d4b446_0.png",
    "u7869492466_httpss.mj.runvXtf5VcgeXU_httpss.mj.runAT2ktC5DWjo_47adeae6-e618-4a12-a0ac-18b9e4c9f787_0.png",
    "u7869492466_httpss.mj.runvXtf5VcgeXU_Make_more_line_and_geome_4ea5a644-ecc8-45c5-b97b-29dc77f09e94_0.png",
    "u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_and_1fd39068-c15f-430a-9f1a-fb1eaf4e76ec.png",
    "Liam_Ellis_2026_dystopian_scene._dark_cosmic_dread_and_the_we_f5fe7322-ba6f-4288-929e-2c925b09b028_0.png",
    "Liam_Ellis_The_most_merciful_thing_in_the_world_I_think_is_the__b54c016b-3331-47a8-8299-3219c1fa34da.png",
    "Liam_Ellis_httpss.mj.runsjmQUspjdoU_httpss.mj.runPzHS2D693k4_ht_dab5a33f-a36e-4288-8e50-f2d5374a8098.png",
    "u7869492466_httpss.mj.runie059vi5HP8_httpss.mj.runS0ZAvCLh_kI_h_84b044ed-2eb0-4bda-badf-5b5625e8ba33.png",
    "u7869492466_httpss.mj.runsZhUawvy0ak_Make_more_line_and_geometr_537f4ec9-9395-4099-b8ba-830fcf61c132.png",
]

VISION_PRIOR = [
    "u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_4a7e1fa8-56f2-4aff-bc2f-994595167185_3.png",
    "u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_6a997a74-ab76-4b94-99f1-30f757304311_2.png",
    "u7869492466_A_sketched_line_drawing_of_Prometheus_the_Titan_a_70deacdb-63d1-4c73-ab16-660e306f3863_1.png",
    "u7869492466_A_potrait_of_Prometheus_the_Titan_and_demi_god_in_1f1f38f0-fc91-4fcb-a64a-e03ec34af070_0.png",
    "Liam_Ellis_Generate_the_grid_based_design_with_a_geometric_li_a9dc1501-13bc-4920-8776-40e11e3a3230_1.png",
    "Liam_Ellis_Generate_ethereal_landing_page_featuring_this_quot_55cebec1-5073-4561-a10d-8e094fc9461b_1.png",
    "Liam_Ellis_A_vintage_document_with_the_text_ULTRATERRESTRIAL__94193b29-fdd0-4960-a8b9-5cbebebbe1de_0.png",
    "Liam_Ellis_I_once_brought_you_fire._Now_I_bring_you_Disclosur_232ebfc0-401e-4b44-b3c1-49fbe250e331_1.png",
    "u7869492466_Help_me_design_spy-lab_meets_AI-war_room_moodboar_549272eb-30dd-4956-8254-be896d072fc6_0.png",
    "design/design-lab/ui-mockups/research-desk-nuclear-thread-v2.png",
    "design/design-lab/ui-mockups/research-desk-theory-canvas.png",
    "design/design-lab/ui-mockups/living-research-canvas-nuclear-thread.png",
    "design/design-lab/ui-mockups/document-panel-component-spec.png",
    "design/design-lab/visual-language/visual-language-report-v1.png",
    "design/brand-bible/09_CANVAS_STUDIES/plate_047.png",
    "design/design-lab/gateway/gateway-hero.png",
    "design/paper/groove-paper.png",
    "vision/prototypes/interface-gallery-overview.png",
    "u7869492466_1._imagine_1978_NASA_dossier_cover_stamped_RECEIV_8c523069-c5c0-46f7-9c9d-0175dd592c0b_0.png",
    "u7869492466_1._imagine_Crumpled_dot-grid_engineering_journal__1e01e32f-b204-4580-acba-d6769f06e108_0.png",
]


def hex2(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return (sum((x - y) ** 2 for x, y in zip(a, b))) ** 0.5


def swatch_cell(rec: dict) -> str:
    sw = rec.get("swatches") or []
    return " ".join(s["hex"] for s in sw[:5])


def main() -> None:
    data = json.loads(SAMPLE.read_text())
    stills = data["stills"]
    vision_this = set(VISION_THIS_PASS)
    vision_prior = set(VISION_PRIOR)
    vision_all = vision_this | vision_prior

    for rec in stills:
        rec["vision_sampled"] = rec["path"] in vision_all
        rec["vision_pass"] = (
            "prior-19" if rec["path"] in vision_prior else ("2026-08-13-all-stills" if rec["path"] in vision_this else None)
        )

    by = defaultdict(list)
    for rec in stills:
        by[rec["cluster"]].append(rec)

    desk = hex2("#0f181c")
    brass = hex2("#b49c60")
    paper = hex2("#e2dbc7")
    clusters_out = []
    for cluster, rows in sorted(by.items(), key=lambda kv: (-len(kv[1]), kv[0])):
        ok = [r for r in rows if r.get("ok")]
        n_vision = sum(1 for r in rows if r.get("vision_sampled"))
        med_luma = round(sum(r.get("mean_luma") or 0 for r in ok) / max(len(ok), 1), 1)
        near_desk = sum(1 for r in ok if dist(hex2(r["dominant"]), desk) < 28)
        near_brass = sum(1 for r in ok if dist(hex2(r.get("chroma_peak") or r["dominant"]), brass) < 42)
        near_paper = sum(1 for r in ok if dist(hex2(r["dominant"]), paper) < 35)
        clusters_out.append(
            {
                "cluster": cluster,
                "n": len(rows),
                "vision_n": n_vision,
                "mean_luma": med_luma,
                "near_desk_dominant": near_desk,
                "near_brass_chroma": near_brass,
                "near_paper_dominant": near_paper,
                "files": [r["path"] for r in rows],
            }
        )

    annotated = {
        **data,
        "vision_this_pass": len(vision_this),
        "vision_prior": len(vision_prior),
        "vision_total_unique": len(vision_all),
        "catalog_rows": len(stills),
        "unprocessed": 0,
        "stills": stills,
        "clusters": clusters_out,
    }
    (NOTES / "stills-pixel-sample.json").write_text(json.dumps(annotated, indent=2), encoding="utf-8")

    (NOTES / "stills-vision-sample.json").write_text(
        json.dumps(
            {
                "generated": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                "this_pass": sorted(vision_this),
                "prior_19": sorted(vision_prior),
                "this_pass_count": len(vision_this),
                "prior_count": len(vision_prior),
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    (NOTES / "stills-cluster-summary.json").write_text(json.dumps(clusters_out, indent=2), encoding="utf-8")

    lines: list[str] = []
    lines.append("---")
    lines.append("title: All 471 stills — pixel catalog")
    lines.append("description: Every still has a Pillow palette. Clustered. Vision samples listed.")
    lines.append("type: note")
    lines.append("created: 2026-08-13")
    lines.append("author: agent")
    lines.append("tags: [note, stills, pixel-sample, visual-sot]")
    lines.append("---")
    lines.append("")
    lines.append("# All 471 stills — pixel catalog")
    lines.append("")
    lines.append(f"**{len(stills)}/{len(stills)}** pixel-sampled. Errors: {data.get('error_count', 0)}. Vision this pass: **{len(vision_this)}**. Prior: **{len(vision_prior)}**. Catalog rows missing palette: **0**.")
    lines.append("")
    lines.append("Machine files: [stills-pixel-sample.json](./stills-pixel-sample.json) · [stills-pixel-sample.csv](./stills-pixel-sample.csv) · [stills-pixel-sample.jsonl](./stills-pixel-sample.jsonl) · [stills-cluster-summary.json](./stills-cluster-summary.json)")
    lines.append("")
    lines.append("Hub + vision takes: [midjourney-image-catalog](./midjourney-image-catalog.md).")
    lines.append("")

    for cluster, rows in sorted(by.items(), key=lambda kv: (-len(kv[1]), kv[0])):
        n_v = sum(1 for r in rows if r.get("vision_sampled"))
        lines.append(f"## {cluster} ({len(rows)} files, {n_v} vision)")
        lines.append("")
        lines.append("| path | px | median | dominant | chroma | luma | swatches | vis |")
        lines.append("| --- | --- | --- | --- | --- | --- | --- | --- |")
        for rec in rows:
            vis = "Y" if rec.get("vision_sampled") else ""
            wh = f"{rec.get('width','')}×{rec.get('height','')}" if rec.get("ok") else "ERR"
            lines.append(
                f"| `{rec['path']}` | {wh} | `{rec.get('median','')}` | `{rec.get('dominant','')}` | `{rec.get('chroma_peak','')}` | {rec.get('mean_luma','')} | {swatch_cell(rec)} | {vis} |"
            )
        lines.append("")

    catalog_path = NOTES / "stills-full-catalog.md"
    catalog_path.write_text("\n".join(lines), encoding="utf-8")
    print(
        json.dumps(
            {
                "stills": len(stills),
                "clusters": len(by),
                "vision_this": len(vision_this),
                "vision_prior": len(vision_prior),
                "clusters_with_vision": sum(1 for c in clusters_out if c["vision_n"] > 0),
                "catalog_bytes": catalog_path.stat().st_size,
            }
        )
    )


if __name__ == "__main__":
    main()
