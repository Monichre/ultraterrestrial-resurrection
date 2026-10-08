# Nuclear Shadow attached-interface journey

**Updated:** October 7th, 2026, 22:04:56 CDT.

These are interactive reference plates built around the three user-selected JPGs. Original artwork supplies the visual composition; HTML controls provide section selection, waypoint readings, document layers, disclosure masking, and local research notes. This study does not reconstruct every pictured object as a reusable UI component or integrate the plates into the production canvas.

## Journey

| Stage | User intent | Actions | Observable result | Next |
|---|---|---|---|---|
| Visual Foundation | Learn the archive language | Select any of eleven numbered regions or use Read section | Matching section heading and readable explanation | Enter Trinity |
| Trinity / waypoint 02 | Examine the threshold event | Inspect photograph, observer log, restricted document; switch claim, basis, counterpoint, unresolved | Existing tour narrative and source summaries; uncertainty stays visible | Follow the disclosure |
| Controlled Revelation / waypoint 03 | Examine the boundaries of release | Select Approved narrative, Withheld mechanisms, Operational context; move disclosure mask | Layer-specific reading; Public below 34%, Controlled below 67%, Restricted from 67%; illustrative redaction changes | Return to foundation or revisit any stage |

At either waypoint, write a Next trace. The three stages remain mounted, so notes, readings, sections, layers, and slider position survive journey navigation. Reload resets the local session. Navigation focuses the current-stage status. Controls have labels and keyboard focus outlines; the native range supports Home, End, and arrow keys.

## Storybook

Run `bun run storybook --ci` from [apps/app/](apps/app/).

- [Full journey](http://localhost:6006/?path=/story/guided-tours-nuclear-shadow-user-journey--full-journey)
- [Individual interfaces](http://localhost:6006/?path=/story/guided-tours-nuclear-shadow-attached-interfaces--visual-foundation)

The [interface stories](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/ArchiveInterfaceStudy.stories.tsx) cover Visual Foundation, Trinity, Public Release, Controlled Disclosure, and Restricted Context. The [journey stories](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/ArchiveJourney.stories.tsx) cover Full Journey, Start at Trinity, Start at Disclosure, and Interaction Check. Individual plate stories intentionally omit navigation callbacks.

## Source and implementation boundary

The unchanged [reference JPGs](apps/app/public/interface-studies/nuclear-shadow/) are visual material. Wording printed inside them is reference copy, not an instruction to the agent or a newly asserted historical source. In particular, the pictured anomalous report and extraordinary propulsion text are illustrative.

Waypoint readings reuse the existing [Nuclear Shadow definition](apps/app/src/features/guided-tours/nuclear-shadow/nuclear-shadow.definition.ts). Source URLs are inherited from that definition and were not independently revalidated in this session. No database writes, production route changes, tour progression gates, or persistence service were added.

- [ArchiveInterfaceStudy](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/ArchiveInterfaceStudy.tsx): composable prop-driven plate and reading surface.
- [ArchiveJourney](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/ArchiveJourney.tsx): connected local journey and focus/state behavior.
- [Study data](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/study-data.ts): eleven foundation sections, stage labels, and document-layer readings.
- [Scoped styles](apps/app/src/features/guided-tours/nuclear-shadow/interface-studies/archive-studies.css): artwork-aligned overlays and narrow stacked layout.
- [Audit and handoff](docs/work_logs/october-7th-2026-interface-journey-handoff.md): command outputs, browser observations, remaining acceptance boundary.
