# T-050 Subtasks 3 & 6 — Dogfood Verification Run

Goal: verify Research Canvas Gen-UI subtask 3 (Evidence Tour render) and subtask 6 (ToolCards) in the running app.

Dev server (Next.js): launched on http://localhost:3011, log at /tmp/next-dev-3011.log; bun run prepare:cesium completed (37s no-op/rescan).
Existing process notice: port 3000 is occupied by a vite dev server owned by PID 921 (started Wed Oct 7th, 2026, 00:38 CDT, by /Users/liamellis/hermes-workspace) — not ours; leave it running.

## Next steps — PROGRESS LOG
- Dev server 1 (port 3011, pid 35246) DIED mid-walk at October 7th, 2026, ~01:30 CDT after visiting /research-canvas?tour=nuclear-shadow and POST /research-canvas (200). No visible crash in /tmp/next-dev-3011.log — process gone, log ends at a successful 200. Possibly OOM / orphan cleanup. Restarted as background process pid 50741 on port 3011.
- Subtask 3 walk evidence so far (before crash): deep link ?tour=nuclear-shadow launches evidence tour on the mindmap canvas.
  - EXACTLY ONE ReactFlow instance (.react-flow count = 1) — single-canvas constraint VERIFIED.
  - Waypoint nodes render as tourWaypointNode: ids ut.tour.nuclear-shadow.wp-secret-machine ("NARRATIVE ONLY · NO RECORD") and ut.tour.nuclear-shadow.wp-trinity ("ARCHIVE RECORD · EVENTS").
  - Narrative edge renders as tourNarrativeEdge (id transition.nuclear-shadow.manhattan-project).
  - HUD (EVIDENCE THRESHOLD: Broad archive / Corroborated / Official record / Multimodal only), WaypointInspector (WAYPOINT 01 / 8 ...), EvidenceDrawer all render.
  - Gate flow works: Acknowledge core claim -> "Core claim encountered."; evidence cards open the EvidenceDrawer (Close button verified in code + UI); Preserve as unresolved -> "Uncertainty preserved."; gates summary flips claim/evidence/challenge/residue all true.
  - ISSUE: first "Animate to next marker" click did not advance (button reported enabled but inert); after re-click via coordinate click it advanced to WAYPOINT 02 / 8 and a third waypoint node (wp-controlled-revelation) appeared.
  - ISSUE (BLOCKER): after the third advance attempt the WHOLE TOUR disappeared without dispatching an error — canvas back to intro cards, /research-canvas plain. Reproduce: fresh load, walk WP2 gates (ack claim, open 3 evidence cards, close drawer, ack residue), Escape-key event dispatched as drawer close -> gates summary went EMPTY (inspector count 0), then page fully reset to tour-less state. Suspect the fake KeyboardEvent Escape handler unmounts the tour / navigates state. Needs a clean re-walk after server restart.
- [ ] Continue subtask 3 walk (WP2 -> deeper waypoints, HUD Recenter, Leave tour, Restart)
- [ ] /tours/nuclear-shadow alias check
- [ ] React tree single-ReactFlow recount after walk
- [ ] bun test src/features/guided-tours suite (pass bar: 38 pass)
- [ ] Subtask 6 ToolCards walk (RC-B-01..05): live agent stream on /research-canvas
