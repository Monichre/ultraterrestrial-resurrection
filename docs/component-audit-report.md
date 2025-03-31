# Component Audit Report

**Generated:** 3/30/2025, 11:30:23 PM

## Overview

- **Total Components:** 550
- **Large Components (>300 lines):** 72
- **Small Components (<10 lines):** 4
- **Consolidation Candidates:** 103 groups
- **Refactoring Candidates:** 75 components

## Component Categories

| Category | Count | Average Size |
|----------|-------|-------------|
| other | 147 | 4.84 KB |
| ui | 90 | 3.72 KB |
| animated | 63 | 4.03 KB |
| note | 41 | 2.49 KB |
| cards | 23 | 5.48 KB |
| hud-interface | 20 | 14.52 KB |
| uap-dashboard | 17 | 4.25 KB |
| backgrounds | 16 | 1.73 KB |
| globes | 10 | 5.07 KB |
| menus | 10 | 8.25 KB |
| sci-fi | 8 | 34.53 KB |
| sci-fi-hud | 8 | 2.81 KB |
| toolbars | 8 | 5.23 KB |
| chat-interface | 8 | 2.58 KB |
| prompts | 8 | 2.09 KB |
| timelines | 6 | 2.48 KB |
| prompt-kit | 6 | 4.46 KB |
| cult-ui | 5 | 11.87 KB |
| status-ui | 5 | 9 KB |
| icons | 3 | 113.67 KB |
| navbar | 3 | 5.85 KB |
| ai-inputs | 3 | 6.68 KB |
| canvas | 3 | 1.24 KB |
| cursors | 2 | 2.72 KB |
| drawers | 2 | 6.35 KB |
| search | 2 | 3.09 KB |
| data-display | 2 | 5.71 KB |
| mindmap-search-ui | 2 | 12.88 KB |
| layouts | 2 | 4.47 KB |
| 9-ui | 1 | 2.58 KB |
| buttons | 1 | 1.32 KB |
| GridAnimation | 1 | 1.36 KB |
| animated-workflow | 1 | 5.47 KB |
| app-sidebar | 1 | 4.53 KB |
| draggable-stack | 1 | 4.93 KB |
| earth | 1 | 2.41 KB |
| glitch-fx | 1 | 2.33 KB |
| graph-paper | 1 | 3.67 KB |
| location-visualization | 1 | 1.98 KB |
| loggers | 1 | 672 Bytes |
| moon | 1 | 1.6 KB |
| multistep-loader | 1 | 4.08 KB |
| reactbits | 1 | 33.99 KB |
| shader | 1 | 972 Bytes |
| side-panel | 1 | 2.88 KB |
| sightings | 1 | 16.69 KB |
| tabs | 1 | 3.09 KB |
| ufo | 1 | 3.16 KB |
| vertical-progress-ui | 1 | 2.05 KB |
| video | 1 | 410 Bytes |
| pages | 1 | 113 Bytes |
| world-map | 1 | 5.12 KB |
| sightings-timeseries | 1 | 10.08 KB |
| clones | 1 | 858 Bytes |
| launchpad | 1 | 8.73 KB |
| dom | 1 | 730 Bytes |

## Large Components

| Component | Lines | Category |
|-----------|-------|----------|
| engineer | 3922 | sci-fi |
| icons | 2625 | icons |
| sightings-globe | 2383 | other |
| InfiniteMenu | 1423 | reactbits |
| CirclesHud3 | 1155 | hud-interface |
| CirclesHud2 | 1128 | hud-interface |
| CirclesHud | 935 | hud-interface |
| HudDash | 839 | hud-interface |
| old | 832 | other |
| chatgpt-version | 811 | other |
| mindmap-bottom-menu | 786 | menus |
| GlitchySurveillanceUi | 694 | hud-interface |
| sidebar | 678 | ui |
| nodes | 671 | other |
| CardsPlayerHolo2 | 668 | hud-interface |
| Carousel | 617 | animated |
| CardsPlayerHolo | 605 | hud-interface |
| space-hud | 603 | uap-dashboard |
| 3d-graph | 544 | other |
| DnaVisualization | 530 | other |
| expandable | 509 | cult-ui |
| SpaceCard | 492 | hud-interface |
| animated-beam-multiple-outputs | 480 | animated |
| sightings-ai-insights | 470 | sightings |
| floating-panel | 468 | cult-ui |
| animated-beam-multiple-inputs | 467 | animated |
| SequentialEdge | 464 | other |
| card | 452 | cult-ui |
| sparkles | 435 | animated |
| HudInterface | 435 | hud-interface |
| AnimatedHudInterface | 434 | hud-interface |
| HudDash | 425 | hud-interface |
| SiblingEdge | 425 | other |
| entity-card | 413 | cards |
| dialog | 412 | animated |
| drawing-board | 411 | other |
| use-visualization-layers | 405 | other |
| section | 404 | other |
| response-stream | 395 | prompt-kit |
| timeline | 394 | other |
| mindmap-side-menu | 394 | menus |
| gallery-flow | 388 | animated |
| ai-assisted-search-interface | 373 | other |
| session-notes | 373 | status-ui |
| codepen-globe | 370 | uap-dashboard |
| topic-group-card | 366 | cards |
| SightingsTimeSeries | 365 | sightings-timeseries |
| model-action-toolbar | 362 | menus |
| entity-quick-menu | 361 | mindmap-search-ui |
| drawing-board__d3 | 360 | other |
| spherical-connection-graph | 355 | other |
| chart | 354 | ui |
| bento-cards | 349 | ui |
| popover | 347 | cult-ui |
| sightings-globe-refactored | 344 | other |
| quick-load-button | 341 | mindmap-search-ui |
| full-site-nav | 331 | navbar |
| useRenderListItem | 329 | other |
| animated-arc-group-layer | 329 | other |
| markdown-content | 326 | ui |
| ModelActionToolbar | 323 | toolbars |
| minimal-vertical-menu | 320 | sci-fi |
| ExpandableCardStandardLayout | 320 | ui |
| useModelNodes | 319 | other |
| command-mind-map-menu | 315 | ui |
| entity-group-card-bg | 309 | cards |
| threejs-globe | 306 | globes |
| topic-card | 303 | cards |
| alt-globe | 301 | globes |
| HudUapInterface | 301 | uap-dashboard |
| session-notes | 301 | status-ui |
| useGroupNode | 301 | other |

## Consolidation Candidates

### accordion-icons Group

**Reason:** Similar naming pattern and 100% overall similarity

**Components:**

- `src/components/animated/accordion-icons.tsx`
- `src/components/animated/accordion-variant.tsx`
- `src/components/animated/dialog-basic-1.tsx`
- `src/components/animated/dialog-image.tsx`

### animated-beam-multiple-inputs Group

**Reason:** Similar naming pattern and 100% overall similarity

**Components:**

- `src/components/animated/animated-beam/animated-beam-multiple-inputs.tsx`
- `src/components/animated/animated-beam/animated-beam-multiple-outputs.tsx`
- `src/components/animated/animated-beam/animated-beam.tsx`
- `src/components/animated/animated-list/animated-list.tsx`
- `src/components/animated/animated-modal/AnimatedModal.tsx`
- `src/components/animated/animated-tabs/AnimatedTabs.tsx`
- `src/components/animated/animated-wrappers/AnimatedComponent.tsx`
- `src/components/animated/core/animated-background.tsx`

### circuit-pulse Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/animated/animated-beam/circuit-pulse.tsx`
- `src/components/animated/blur-fade/BlurFade.tsx`
- `src/components/animated/radar/Radar.tsx`
- `src/components/animated/text-effect/hyper-text.tsx`

### animated-card-background-hover Group

**Reason:** Similar naming pattern and 100% overall similarity

**Components:**

- `src/components/animated/animated-card-background-hover.tsx`
- `src/components/animated/animated-tabs-hover.tsx`
- `src/components/animated/animated-tabs.tsx`
- `src/components/animated/segmented-control.tsx`

### FadeIn Group

**Reason:** Similar naming pattern and 90% overall similarity

**Components:**

- `src/components/animated/animated-wrappers/FadeIn.tsx`
- `src/components/animated/animated-wrappers/SlideFadeIn.tsx`
- `src/components/animated/animated-wrappers/SlideIn.tsx`

### BlurIn Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/animated/blur-in/BlurIn.tsx`
- `src/components/animated/lamp-effect/lamp-effect.tsx`
- `src/components/animated/number-ticker/NumberTicker.tsx`

### accordion Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/animated/core/accordion.tsx`
- `src/components/animated/core/cursor.tsx`
- `src/components/animated/page-transition.tsx`
- `src/components/animated/transition.tsx`

### cursor-1 Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/animated/cursor-1.tsx`
- `src/components/animated/cursor-2.tsx`
- `src/components/animated/cursor-3.tsx`

### Gallery Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/animated/gallery/Gallery.tsx`
- `src/components/animated/gallery/gallery-flow.tsx`
- `src/components/animated/text-effect/TextEffect.tsx`

### RadarLayout Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/animated/radar/RadarLayout.tsx`
- `src/components/animated/radar/radar-pulse-beams.tsx`

### Static Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/animated/static/Static.tsx`
- `src/components/animated/text-effect/glitch-text.tsx`
- `src/components/animated/text-effect/sparkle-text.tsx`

### text-scramble Group

**Reason:** Similar naming pattern and 87% overall similarity

**Components:**

- `src/components/animated/text-effect/text-scramble/text-scramble.tsx`
- `src/components/animated/text-effect/text-shimmer.tsx`

### tracing-beam Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/components/animated/tracing-beam/tracing-beam.tsx`
- `src/components/animated/transition-panel-card.tsx`
- `src/components/animated/transition-panel-tabs.tsx`

### AnimatedGridPattern Group

**Reason:** Similar naming pattern and 87% overall similarity

**Components:**

- `src/components/backgrounds/animated-grid-pattern/AnimatedGridPattern.tsx`
- `src/components/backgrounds/dot-pattern.tsx`
- `src/components/backgrounds/stars-background.tsx`

### BackgroundStatic Group

**Reason:** Similar naming pattern and 71% overall similarity

**Components:**

- `src/components/backgrounds/background-static/BackgroundStatic.tsx`
- `src/components/backgrounds/backgrounds.tsx`

### dot-grid-background Group

**Reason:** Similar naming pattern and 100% overall similarity

**Components:**

- `src/components/backgrounds/dot-grid-background.tsx`
- `src/components/backgrounds/shooting-stars/stars-background.tsx`

### grid-background Group

**Reason:** Similar naming pattern and 100% overall similarity

**Components:**

- `src/components/backgrounds/grid-background.tsx`
- `src/components/backgrounds/matrix-background/MatrixBackground.tsx`
- `src/components/backgrounds/shooting-stars/shooting-stars-background.tsx`
- `src/components/sci-fi-hud/canvas-background.tsx`

### meteors Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/backgrounds/meteors.tsx`
- `src/components/backgrounds/shooting-stars/ShootingStars.tsx`

### chat-sidebar Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/components/chat-sidebar.tsx`
- `src/features/case-files/case-file/case-file-evidence/evidence-detail-sidebar.tsx`

### mindmap-cursor Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/cursors/mindmap-cursor.tsx`
- `src/components/cursors/neon-cursor.tsx`
- `src/components/ui/canvas-cursor/blob-cursor.tsx`

### admin-dashboard-globe Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/globes/cobe-globes/admin-dashboard-globe.tsx`
- `src/components/globes/cobe-globes/cobe-globe.tsx`
- `src/features/data-viz/components/globes/globe.tsx`
- `src/features/data-viz/components/globes/mapbox-globe.tsx`

### AnimatedHudInterface Group

**Reason:** Similar naming pattern and 87% overall similarity

**Components:**

- `src/components/hud-interface/AnimatedHudInterface.tsx`
- `src/components/hud-interface/HudInterface.tsx`

### CardsPlayerHolo Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/components/hud-interface/CardsPlayerHolo.stories.tsx`
- `src/components/hud-interface/CardsPlayerHolo.tsx`
- `src/components/hud-interface/CardsPlayerHolo2.stories.tsx`
- `src/components/hud-interface/CardsPlayerHolo2.tsx`

### CirclesHud Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/components/hud-interface/CirclesHud.tsx`
- `src/components/hud-interface/CirclesHud2.stories.tsx`
- `src/components/hud-interface/CirclesHud2.tsx`
- `src/components/hud-interface/CirclesHud3.stories.tsx`
- `src/components/hud-interface/CirclesHud3.tsx`
- `src/components/uap-dashboard/space-hud/space-hud.tsx`

### GlitchySurveillanceUi Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/hud-interface/GlitchySurveillanceUi.tsx`
- `src/components/hud-interface/HudCard.tsx`
- `src/components/hud-interface/HudCard2.tsx`
- `src/components/hud-interface/SpaceCard.tsx`
- `src/components/hud-interface/TextScrambleEffect.tsx`

### HudCard Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/components/hud-interface/HudCard.stories.tsx`
- `src/components/hud-interface/HudDash.tsx`
- `src/components/hud-interface/SpaceCard.stories.tsx`

### connection-icon Group

**Reason:** Similar naming pattern and 100% overall similarity

**Components:**

- `src/components/icons/connection-icon.tsx`
- `src/components/icons/terminal-icon.tsx`

### AddNoteFloatingPanel Group

**Reason:** Similar naming pattern and 76% overall similarity

**Components:**

- `src/components/note/AddNoteFloatingPanel.tsx`
- `src/components/note/AddNotePopover.tsx`

### brain-comparison Group

**Reason:** Similar naming pattern and 76% overall similarity

**Components:**

- `src/components/sci-fi/brain-comparison.tsx`
- `src/components/sci-fi/brain-visualization.tsx`
- `src/components/sci-fi-hud/comparison.tsx`

### brain-scanner Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/sci-fi/brain-scanner.tsx`
- `src/components/sci-fi-hud/scanner.tsx`

### right-ui Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/sci-fi-hud/right-ui.tsx`
- `src/components/sci-fi-hud/side-ui.tsx`

### animated-search-input Group

**Reason:** Similar naming pattern and 93% overall similarity

**Components:**

- `src/components/search/animated-search-input.tsx`
- `src/components/search/search-input.tsx`

### terminal-display Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/terminal-display.tsx`
- `src/components/uap-dashboard/terminal-display.tsx`

### test Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/test.tsx`
- `src/features/3d/dna-visualization/DnaVisualization.tsx`
- `src/features/admin/Admin.tsx`
- `src/features/ai/components/entity-menu.tsx`
- `src/features/ai/components/mindmap-entity-loader-card.tsx`
- `src/features/case-files/folder/folder-flyout.tsx`
- `src/features/data-viz/sightings/components/sightings-globe-settings.tsx`
- `src/features/data-viz/sightings/useTimeSeriesAnimation.tsx`
- `src/features/mindmap/components/example-client-component.tsx`
- `src/features/mindmap/edges/button-edge.tsx`
- `src/features/mindmap/edges/data-edge.tsx`
- `src/features/mindmap/nodes/AnnotationNode.tsx`
- `src/features/mindmap/nodes/animated-node.tsx`
- `src/features/mindmap/nodes/testimony-node.tsx`

### ThreeDTimeline Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/timelines/3d-timeline/ThreeDTimeline.tsx`
- `src/components/timelines/3d-timeline/ThreeDTimelineExample.tsx`
- `src/components/timelines/draggable-timeline/draggable-timeline.tsx`
- `src/components/timelines/timeline/Timeline.tsx`

### ModelActionToolbar Group

**Reason:** Similar naming pattern and 84% overall similarity

**Components:**

- `src/components/toolbars/ModelActionToolbar.tsx`
- `src/components/toolbars/animated-toolbar.tsx`
- `src/components/toolbars/dynamic-toolbar/DynamicToolbar.tsx`
- `src/components/toolbars/mini-toolbar/MiniToolbar.tsx`
- `src/components/toolbars/motion-dynamic-toolbar.tsx`

### toolbar-expandable Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/toolbars/toolbar-expandable.stories.tsx`
- `src/components/toolbars/toolbar-expandable.tsx`

### alternative-globe Group

**Reason:** Similar naming pattern and 92% overall similarity

**Components:**

- `src/components/uap-dashboard/alternative-globe.tsx`
- `src/components/uap-dashboard/codepen-globe.tsx`
- `src/components/uap-dashboard/globe.tsx`

### sightings-visualization Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/uap-dashboard/sightings-visualization.tsx`
- `src/components/uap-dashboard/tech-section.tsx`

### accordion Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/ui/accordion.tsx`
- `src/components/ui/pagination.tsx`

### alert-dialog Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/ui/alert-dialog.tsx`
- `src/components/ui/alert.tsx`
- `src/components/ui/dialog.tsx`

### badge Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/ui/badge.tsx`
- `src/components/ui/button/button.tsx`

### animated-button Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/ui/button/animated-button.tsx`
- `src/components/ui/button/animated-menu-button.tsx`
- `src/components/ui/button/create-button.tsx`
- `src/components/ui/button/delete-button/DeleteButton.tsx`
- `src/components/ui/button/share-button.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/tooltip/animated-tooltip.tsx`

### ExpandableCard Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/ui/card/ExpandableCard.tsx`
- `src/components/ui/card/card-stack/card-stack.tsx`
- `src/components/ui/card/card.tsx`
- `src/components/ui/card/expandable-card/ExpandableCardGridLayout.tsx`
- `src/components/ui/card/expandable-card/ExpandableCardStandardLayout.tsx`
- `src/components/ui/card/expandable-card.tsx`
- `src/components/ui/card/graph-node-card.tsx`
- `src/components/ui/card/hover-card/hover-card.tsx`
- `src/components/ui/card/hover-card.tsx`
- `src/components/ui/card/pill-card/PillCard.tsx`
- `src/components/ui/card/pill-card.tsx`
- `src/components/ui/card/shift-card.tsx`
- `src/components/ui/card/stars-card.tsx`
- `src/components/ui/card/text-reveal-card.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/expandable-card.tsx`
- `src/components/ui/hover-card.tsx`

### toggle-entity-input-with-search Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/ui/card/toggle-entity-input-with-search.tsx`
- `src/components/ui/toggle.tsx`

### chart Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/components/ui/chart.tsx`
- `src/components/ui/chat/chat-bubble.tsx`
- `src/components/ui/chat/chat-input.tsx`
- `src/components/ui/chat/chat-message-area.tsx`
- `src/components/ui/chat/chat-message-list.tsx`
- `src/components/ui/chat/chat-message.tsx`

### markdown-content Group

**Reason:** Similar naming pattern and 93% overall similarity

**Components:**

- `src/components/ui/chat/markdown-content.tsx`
- `src/components/ui/markdown.tsx`

### scroll-area Group

**Reason:** Similar naming pattern and 100% overall similarity

**Components:**

- `src/components/ui/chat/scroll-area.tsx`
- `src/components/ui/scroll-area.tsx`
- `src/components/ui/textarea.tsx`

### command-mind-map-menu Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/ui/command/command-mind-map-menu.tsx`
- `src/components/ui/command.tsx`
- `src/components/ui/context-menu.tsx`
- `src/components/ui/dropdown-menu.tsx`

### direction-aware-tabs Group

**Reason:** Similar naming pattern and 76% overall similarity

**Components:**

- `src/components/ui/direction-aware-tabs/direction-aware-tabs.tsx`
- `src/components/ui/tabs.tsx`

### site-header Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/ui/header/site-header.tsx`
- `src/components/ui/slider.tsx`

### input-otp Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/ui/input-otp.tsx`
- `src/components/ui/input.tsx`

### menubar Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/components/ui/menubar.tsx`
- `src/components/ui/sidebar.tsx`

### radio-group Group

**Reason:** Similar naming pattern and 76% overall similarity

**Components:**

- `src/components/ui/radio-group.tsx`
- `src/components/ui/toggle-group.tsx`

### resizable Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/components/ui/resizable.tsx`
- `src/components/ui/table.tsx`

### tooltip Group

**Reason:** Similar naming pattern and 100% overall similarity

**Components:**

- `src/components/ui/tooltip/tooltip.tsx`
- `src/components/ui/tooltip.tsx`

### 3d-card Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/3d/3d-card/3d-card.tsx`
- `src/features/3d/3d-pin/3d-pin.tsx`

### section Group

**Reason:** Similar naming pattern and 76% overall similarity

**Components:**

- `src/features/3d/3d-timeline-journey/section.tsx`
- `src/features/3d/visualizations/diagram/graph-visualization.tsx`

### useAssetLoader Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/3d/3d-timeline-journey/utils/useAssetLoader.tsx`
- `src/features/3d/visualizations/graph/useModelNodes.tsx`
- `src/features/case-files/case-file/case-file-evidence/animated-folder.tsx`
- `src/features/data-viz/sightings/hooks/use-map-initialization.tsx`
- `src/features/data-viz/sightings/sightings-loader.tsx`
- `src/features/mindmap/hooks/useAnimateNodes.tsx`
- `src/features/mindmap/hooks/useAutoLayoutAlt.tsx`
- `src/features/mindmap/hooks/useExpandCollapse.tsx`
- `src/features/mindmap/hooks/useGroupNode.tsx`
- `src/features/mindmap/hooks/useRootNodesHierarchy.tsx`
- `src/features/mindmap/hooks/useSyncChildNodePositions.tsx`
- `src/features/r3f/templates/Shader/Shader.jsx`
- `src/features/r3f/templates/hooks/usePostprocess.jsx`

### command-menu Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/features/3d/drawing-board/command-menu.tsx`
- `src/features/3d/drawing-board/entity-menu.tsx`

### drawing-board Group

**Reason:** Similar naming pattern and 91% overall similarity

**Components:**

- `src/features/3d/drawing-board/drawing-board.tsx`
- `src/features/3d/drawing-board/drawing-board__d3.tsx`

### nodes Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/features/3d/drawing-board/nodes.tsx`
- `src/features/3d/visualizations/diagram/basic-nodes.tsx`
- `src/features/3d/visualizations/diagram/nodes.tsx`

### ScrollThrough3dWrapper Group

**Reason:** Similar naming pattern and 71% overall similarity

**Components:**

- `src/features/3d/scroll-through-3d/ScrollThrough3dWrapper.tsx`
- `src/features/3d/scroll-through-3d/ScrollThroughThreeD.tsx`
- `src/features/r3f/templates/Scroll.jsx`

### model Group

**Reason:** Similar naming pattern and 90% overall similarity

**Components:**

- `src/features/3d/scroll-through-3d/model.tsx`
- `src/features/3d/ufos/ufo/ufo-model.tsx`

### Scene Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/features/3d/ufos/ufo/Scene.jsx`
- `src/features/3d/ufos/ufo-alt/Scene.jsx`

### 3d-grid Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/features/3d/visualizations/3d-grid/3d-grid.tsx`
- `src/features/3d/visualizations/diagram/3d-graph.tsx`
- `src/features/case-files/canvas/canvas-grid/canvas-grid.tsx`

### spherical-connection-graph Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/3d/visualizations/diagram/spherical-connection-graph.tsx`
- `src/features/3d/visualizations/graph/rtf-graph.tsx`

### actions Group

**Reason:** Similar naming pattern and 100% overall similarity

**Components:**

- `src/features/ai/actions/actions.tsx`
- `src/features/ai/api/actions.tsx`

### chat-bottombar Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/features/ai/components/chat-interface/chat-bottombar.tsx`
- `src/features/ai/components/chat-interface/chat-layout.tsx`
- `src/features/ai/components/chat-interface/chat-list.tsx`
- `src/features/ai/components/chat-interface/chat-sidebar.tsx`
- `src/features/ai/components/chat-interface/chat-textarea.tsx`
- `src/features/ai/components/chat-interface/chat-topbar.tsx`

### PromptInput Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/features/ai/components/prompts/PromptInput.tsx`
- `src/features/ai/components/prompts/PromptState.tsx`
- `src/features/ai/components/prompts/PromptUI.tsx`

### UserPromptMessage Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/ai/components/prompts/UserPromptMessage.tsx`
- `src/features/mindmap/components/note/hooks/useAIState.tsx`
- `src/features/mindmap/components/note/hooks/useSidebar.tsx`

### canvas-annotations Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/case-files/canvas/canvas-annotations/canvas-annotations.tsx`
- `src/features/case-files/canvas/canvas-drawer/canvas-drawer.tsx`

### evidence-browser Group

**Reason:** Similar naming pattern and 83% overall similarity

**Components:**

- `src/features/case-files/case-file/case-file-evidence/evidence-browser.tsx`
- `src/features/case-files/case-file/case-file-evidence/evidence-card.tsx`

### StackedCards Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/case-files/stacked-cards/StackedCards.tsx`
- `src/features/mindmap/edges/animated-svg-edge.tsx`
- `src/features/mindmap/workflows/status-edge-controller.tsx`

### codepen-earth-alt Group

**Reason:** Similar naming pattern and 84% overall similarity

**Components:**

- `src/features/data-viz/components/globes/codepen-viz/codepen-earth-alt.tsx`
- `src/features/data-viz/components/globes/codepen-viz/codepen-earth.tsx`

### animated-arc-group-layer Group

**Reason:** Similar naming pattern and 76% overall similarity

**Components:**

- `src/features/data-viz/sightings/animated-arc-group-layer.stories.tsx`
- `src/features/data-viz/sightings/animated-arc-group-layer.tsx`
- `src/features/data-viz/sightings/animated-arc-layer.stories.tsx`

### base-handle Group

**Reason:** Similar naming pattern and 90% overall similarity

**Components:**

- `src/features/mindmap/components/base-handle.tsx`
- `src/features/mindmap/components/labeled-handle.tsx`
- `src/features/mindmap/nodes/base-node.tsx`
- `src/features/mindmap/workflows/base-handle.tsx`
- `src/features/mindmap/workflows/base-node.tsx`
- `src/features/mindmap/workflows/editable-handle.tsx`
- `src/features/mindmap/workflows/labeled-handle.tsx`

### card-stack-multiview Group

**Reason:** Similar naming pattern and 76% overall similarity

**Components:**

- `src/features/mindmap/components/cards/card-stack/card-stack-multiview.tsx`
- `src/features/mindmap/components/cards/card-stack/cards.tsx`

### connection-card Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/features/mindmap/components/cards/connection-card/connection-card.tsx`
- `src/features/mindmap/components/cards/entity-group-card/events-group-card.tsx`
- `src/features/mindmap/components/cards/layer-zero-card.tsx`
- `src/features/mindmap/components/cards/root-node-card/search-input-spotlight.tsx`
- `src/features/mindmap/components/cards/subject-matter-expert-card/SubjectMatterExpertCard.tsx`

### entity-card-utility-menu Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/mindmap/components/cards/entity-card/entity-card-utility-menu.tsx`
- `src/features/mindmap/components/cards/entity-group-card/entity-group-card-bg.tsx`

### entity-card Group

**Reason:** Similar naming pattern and 75% overall similarity

**Components:**

- `src/features/mindmap/components/cards/entity-card/entity-card.tsx`
- `src/features/mindmap/components/cards/event/bonsai-card.tsx`
- `src/features/mindmap/components/cards/event/event-globe-card.tsx`
- `src/features/mindmap/components/cards/event/grid-card.tsx`
- `src/features/mindmap/components/cards/graph-card/graph-card.tsx`
- `src/features/mindmap/components/cards/topic-card.tsx`

### entity-group-card Group

**Reason:** Similar naming pattern and 79% overall similarity

**Components:**

- `src/features/mindmap/components/cards/entity-group-card/entity-group-card.tsx`
- `src/features/mindmap/components/cards/entity-group-card/topic-group-card.tsx`

### graph-card-bg Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/mindmap/components/cards/graph-card/graph-card-bg.tsx`
- `src/features/mindmap/components/cards/root-node-card/InputWithVanishAnimation.tsx`

### NodeMenu Group

**Reason:** Similar naming pattern and 76% overall similarity

**Components:**

- `src/features/mindmap/components/menus/NodeMenu.tsx`
- `src/features/mindmap/components/menus/expandable-tab-menu.tsx`
- `src/features/mindmap/components/menus/floating-node-menu.tsx`

### mindmap-ai-chat Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/features/mindmap/components/menus/mindmap-ai-chat.tsx`
- `src/features/mindmap/components/menus/mindmap-animated-click-menu.tsx`
- `src/features/mindmap/components/menus/mindmap-utility-cursor.tsx`

### mindmap-bottom-menu Group

**Reason:** Similar naming pattern and 71% overall similarity

**Components:**

- `src/features/mindmap/components/menus/mindmap-bottom-menu.tsx`
- `src/features/mindmap/components/menus/mindmap-side-menu.tsx`

### node-status-indicator Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/mindmap/components/node-status-indicator.tsx`
- `src/features/mindmap/workflows/nodes-panel.tsx`

### Sidebar Group

**Reason:** Similar naming pattern and 76% overall similarity

**Components:**

- `src/features/mindmap/components/note/Sidebar/Sidebar.tsx`
- `src/features/mindmap/components/note/ui/Toolbar.tsx`

### AiImageView Group

**Reason:** Similar naming pattern and 95% overall similarity

**Components:**

- `src/features/mindmap/components/note/extensions/AiImage/components/AiImageView.tsx`
- `src/features/mindmap/components/note/extensions/AiWriter/components/AiWriterView.tsx`

### ImageBlockMenu Group

**Reason:** Similar naming pattern and 91% overall similarity

**Components:**

- `src/features/mindmap/components/note/extensions/ImageBlock/components/ImageBlockMenu.tsx`
- `src/features/mindmap/components/note/extensions/MultiColumn/menus/ColumnsMenu.tsx`
- `src/features/mindmap/components/note/menus/ContentItemMenu/ContentItemMenu.tsx`
- `src/features/mindmap/components/note/menus/TextMenu/TextMenu.tsx`

### ImageBlockView Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/mindmap/components/note/extensions/ImageBlock/components/ImageBlockView.tsx`
- `src/features/mindmap/components/note/extensions/ImageBlock/components/ImageBlockWidth.tsx`
- `src/features/mindmap/components/note/extensions/ImageUpload/view/ImageUpload.tsx`
- `src/features/mindmap/components/note/extensions/ImageUpload/view/ImageUploader.tsx`

### CommandButton Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/features/mindmap/components/note/extensions/SlashCommand/CommandButton.tsx`
- `src/features/mindmap/components/note/panels/Colorpicker/ColorButton.tsx`
- `src/features/mindmap/components/note/ui/Button/Button.tsx`
- `src/features/mindmap/components/note/ui/Button/hover-expand-button.tsx`
- `src/features/mindmap/components/note/ui/Button/shiny-button.tsx`

### useContentItemActions Group

**Reason:** Similar naming pattern and 80% overall similarity

**Components:**

- `src/features/mindmap/components/note/menus/ContentItemMenu/hooks/useContentItemActions.tsx`
- `src/features/mindmap/components/note/menus/ContentItemMenu/hooks/useData.tsx`

### ContentTypePicker Group

**Reason:** Similar naming pattern and 94% overall similarity

**Components:**

- `src/features/mindmap/components/note/menus/TextMenu/components/ContentTypePicker.tsx`
- `src/features/mindmap/components/note/menus/TextMenu/components/FontFamilyPicker.tsx`
- `src/features/mindmap/components/note/menus/TextMenu/components/FontSizePicker.tsx`

### Spinner Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/mindmap/components/note/ui/Spinner/Spinner.tsx`
- `src/features/mindmap/components/note/ui/Surface.tsx`
- `src/features/mindmap/components/note/ui/Textarea/Textarea.tsx`
- `src/features/mindmap/components/note/ui/Toggle/Toggle.tsx`

### case-files-and-evidence-board Group

**Reason:** Similar naming pattern and 85% overall similarity

**Components:**

- `src/features/mindmap/components/status-ui/case-files-and-evidence-board.tsx`
- `src/features/mindmap/components/status-ui/thread-board.tsx`

### FloatingConnectionLine Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/features/mindmap/edges/FloatingConnectionLine.tsx`
- `src/features/mindmap/edges/FloatingEdge.tsx`
- `src/features/mindmap/edges/FlowEdge.tsx`

### RootEdge Group

**Reason:** Similar naming pattern and 73% overall similarity

**Components:**

- `src/features/mindmap/edges/RootEdge.tsx`
- `src/features/mindmap/edges/SequentialEdge.tsx`

### useAutoLayout Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/mindmap/hooks/useAutoLayout.tsx`
- `src/features/mindmap/hooks/useForceLayout.tsx`

### annotation-node Group

**Reason:** Similar naming pattern and 70% overall similarity

**Components:**

- `src/features/mindmap/nodes/annotation-node.tsx`
- `src/features/mindmap/nodes/document-node.tsx`
- `src/features/mindmap/workflows/resizable-node.tsx`

### entity-group-node-child Group

**Reason:** Similar naming pattern and 92% overall similarity

**Components:**

- `src/features/mindmap/nodes/entity-group-node-child.tsx`
- `src/features/mindmap/nodes/entity-group-node.tsx`
- `src/features/mindmap/nodes/entity-node.tsx`
- `src/features/mindmap/nodes/personnel-group-node-child.tsx`

### group-results-node Group

**Reason:** Similar naming pattern and 87% overall similarity

**Components:**

- `src/features/mindmap/nodes/group-results-node.tsx`
- `src/features/mindmap/nodes/personnel-group-node.tsx`
- `src/features/mindmap/nodes/root-node.tsx`
- `src/features/mindmap/workflows/text-input-node.tsx`
- `src/features/mindmap/workflows/visualize-text-node.tsx`

### generate-text-node-controller Group

**Reason:** Similar naming pattern and 89% overall similarity

**Components:**

- `src/features/mindmap/workflows/generate-text-node-controller.tsx`
- `src/features/mindmap/workflows/prompt-crafter-node-controller.tsx`
- `src/features/mindmap/workflows/text-input-node-controller.tsx`
- `src/features/mindmap/workflows/visualize-text-node-controller.tsx`

## Refactoring Candidates

| Component | Reason | Severity | Details |
|-----------|--------|----------|--------|
| animated-beam-multiple-inputs.tsx | Large component size | high | Component has 467 lines of code (threshold: 300) |
| animated-beam-multiple-outputs.tsx | Large component size | high | Component has 480 lines of code (threshold: 300) |
| Carousel.tsx | Large component size | high | Component has 617 lines of code (threshold: 300) |
| card.tsx | Large component size | high | Component has 452 lines of code (threshold: 300) |
| expandable.tsx | Large component size | high | Component has 509 lines of code (threshold: 300) |
| floating-panel.tsx | Large component size | high | Component has 468 lines of code (threshold: 300) |
| CardsPlayerHolo.tsx | Large component size | high | Component has 605 lines of code (threshold: 300) |
| CardsPlayerHolo2.tsx | Large component size | high | Component has 668 lines of code (threshold: 300) |
| CirclesHud.tsx | Large component size | high | Component has 935 lines of code (threshold: 300) |
| CirclesHud2.tsx | Large component size | high | Component has 1128 lines of code (threshold: 300) |
| CirclesHud3.tsx | Large component size | high | Component has 1155 lines of code (threshold: 300) |
| GlitchySurveillanceUi.tsx | Large component size | high | Component has 694 lines of code (threshold: 300) |
| HudDash.animations.tsx | Large component size | high | Component has 839 lines of code (threshold: 300) |
| SpaceCard.tsx | Large component size | high | Component has 492 lines of code (threshold: 300) |
| icons.tsx | Large component size | high | Component has 2625 lines of code (threshold: 300) |
| InfiniteMenu.tsx | Large component size | high | Component has 1423 lines of code (threshold: 300) |
| engineer.tsx | Large component size | high | Component has 3922 lines of code (threshold: 300) |
| sightings-ai-insights.tsx | Large component size | high | Component has 470 lines of code (threshold: 300) |
| space-hud.tsx | Large component size | high | Component has 603 lines of code (threshold: 300) |
| sidebar.tsx | Large component size | high | Component has 678 lines of code (threshold: 300) |
| DnaVisualization.tsx | Large component size | high | Component has 530 lines of code (threshold: 300) |
| 3d-graph.tsx | Large component size | high | Component has 544 lines of code (threshold: 300) |
| nodes.tsx | Large component size | high | Component has 671 lines of code (threshold: 300) |
| chatgpt-version.tsx | Large component size | high | Component has 811 lines of code (threshold: 300) |
| old.tsx | Large component size | high | Component has 832 lines of code (threshold: 300) |
| sightings-globe.tsx | Large component size | high | Component has 2383 lines of code (threshold: 300) |
| mindmap-bottom-menu.tsx | Large component size | high | Component has 786 lines of code (threshold: 300) |
| SequentialEdge.tsx | Large component size | high | Component has 464 lines of code (threshold: 300) |
| dialog.tsx | Large component size | medium | Component has 412 lines of code (threshold: 300) |
| gallery-flow.tsx | Large component size | medium | Component has 388 lines of code (threshold: 300) |
| sparkles.tsx | Large component size | medium | Component has 435 lines of code (threshold: 300) |
| popover.tsx | Large component size | medium | Component has 347 lines of code (threshold: 300) |
| alt-globe.tsx | Large component size | medium | Component has 301 lines of code (threshold: 300) |
| threejs-globe.tsx | Large component size | medium | Component has 306 lines of code (threshold: 300) |
| AnimatedHudInterface.tsx | Large component size | medium | Component has 434 lines of code (threshold: 300) |
| HudDash.tsx | Large component size | medium | Component has 425 lines of code (threshold: 300) |
| HudInterface.tsx | Large component size | medium | Component has 435 lines of code (threshold: 300) |
| full-site-nav.tsx | Large component size | medium | Component has 331 lines of code (threshold: 300) |
| minimal-vertical-menu.tsx | Large component size | medium | Component has 320 lines of code (threshold: 300) |
| ModelActionToolbar.tsx | Large component size | medium | Component has 323 lines of code (threshold: 300) |
| HudUapInterface.tsx | Large component size | medium | Component has 301 lines of code (threshold: 300) |
| codepen-globe.tsx | Large component size | medium | Component has 370 lines of code (threshold: 300) |
| bento-cards.tsx | Large component size | medium | Component has 349 lines of code (threshold: 300) |
| ExpandableCardStandardLayout.tsx | Large component size | medium | Component has 320 lines of code (threshold: 300) |
| chart.tsx | Large component size | medium | Component has 354 lines of code (threshold: 300) |
| markdown-content.tsx | Large component size | medium | Component has 326 lines of code (threshold: 300) |
| command-mind-map-menu.tsx | Large component size | medium | Component has 315 lines of code (threshold: 300) |
| section.tsx | Large component size | medium | Component has 404 lines of code (threshold: 300) |
| timeline.tsx | Large component size | medium | Component has 394 lines of code (threshold: 300) |
| drawing-board.tsx | Large component size | medium | Component has 411 lines of code (threshold: 300) |
| drawing-board__d3.tsx | Large component size | medium | Component has 360 lines of code (threshold: 300) |
| spherical-connection-graph.tsx | Large component size | medium | Component has 355 lines of code (threshold: 300) |
| useModelNodes.tsx | Large component size | medium | Component has 319 lines of code (threshold: 300) |
| useRenderListItem.tsx | Large component size | medium | Component has 329 lines of code (threshold: 300) |
| ai-assisted-search-interface.tsx | Large component size | medium | Component has 373 lines of code (threshold: 300) |
| entity-quick-menu.tsx | Large component size | medium | Component has 361 lines of code (threshold: 300) |
| quick-load-button.tsx | Large component size | medium | Component has 341 lines of code (threshold: 300) |
| response-stream.tsx | Large component size | medium | Component has 395 lines of code (threshold: 300) |
| animated-arc-group-layer.stories.tsx | Large component size | medium | Component has 329 lines of code (threshold: 300) |
| SightingsTimeSeries.tsx | Large component size | medium | Component has 365 lines of code (threshold: 300) |
| use-visualization-layers.tsx | Large component size | medium | Component has 405 lines of code (threshold: 300) |
| sightings-globe-refactored.tsx | Large component size | medium | Component has 344 lines of code (threshold: 300) |
| entity-card.tsx | Large component size | medium | Component has 413 lines of code (threshold: 300) |
| entity-group-card-bg.tsx | Large component size | medium | Component has 309 lines of code (threshold: 300) |
| topic-group-card.tsx | Large component size | medium | Component has 366 lines of code (threshold: 300) |
| topic-card.tsx | Large component size | medium | Component has 303 lines of code (threshold: 300) |
| mindmap-bottom-menu.tsx | Too many dependencies | medium | Component has 16 dependencies |
| mindmap-side-menu.tsx | Large component size | medium | Component has 394 lines of code (threshold: 300) |
| model-action-toolbar.tsx | Large component size | medium | Component has 362 lines of code (threshold: 300) |
| BlockEditor.tsx | Too many dependencies | medium | Component has 17 dependencies |
| session-notes.stories.tsx | Large component size | medium | Component has 373 lines of code (threshold: 300) |
| session-notes.tsx | Large component size | medium | Component has 301 lines of code (threshold: 300) |
| SiblingEdge.tsx | Large component size | medium | Component has 425 lines of code (threshold: 300) |
| useGroupNode.tsx | Large component size | medium | Component has 301 lines of code (threshold: 300) |
| user-input-node.tsx | Too many dependencies | medium | Component has 18 dependencies |

The component audit has been successfully completed, revealing several important insights about the codebase:

1. Scale and Distribution:
•  Total Components: 550
•  Categories: 52 distinct categories
•  Largest category: "other" (147 components) - suggests need for better categorization
•  UI-specific components: 90 components
2. Key Issues Identified:
•  Large Components: 72 components exceed the 300-line threshold
•  Consolidation Opportunities: 103 groups of similar components identified
•  Refactoring Candidates: 75 components need attention
•  Top Priority Refactorings:
•  animated-beam-multiple-inputs.tsx (467 lines)
•  animated-beam-multiple-outputs.tsx (480 lines)
•  Carousel.tsx (617 lines)
•  card.tsx (452 lines)
•  expandable.tsx (509 lines)
3. Recommendations for Next Steps:
a) Begin with the highlighted large components, particularly Carousel.tsx which is over twice the recommended size
b) Review the consolidation groups to reduce code duplication
c) Organize the "other" category components into more specific categories
d) Consider creating shared UI component libraries for common patterns

The full audit report has been generated and saved to /docs/component-audit-report.md for detailed review. Would you like to proceed with refactoring any specific component from the identified candidates?
