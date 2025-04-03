# Components Missing Storybook Stories

## Summary

- **Total Components**: 649
- **Components with Stories**: 36 (5.5%)
- **Components without Stories**: 613 (94.5%)
- **High Priority Components** (with Props interfaces): 72
- **High Priority Components without Stories**: 57 (79.2% of high priority components)
- **Components Used in App**: 6 (0.9% of all components)
- **Components Without Stories but Used in App**: 6 (100.0% of used components)

## High Priority Components Missing Stories

These components have Props interfaces and should be prioritized for story creation:

| Component | Path |
| --------- | ---- |
| Admin | features/admin/Admin.tsx |
| AIDropdown | features/mindmap/components/note/menus/TextMenu/components/AIDropdown.tsx |
| AnimatedContent | components/reactbits/AnimatedContent/AnimatedContent.tsx |
| AnimatedHudInterface | components/hud-interface/AnimatedHudInterface.tsx |
| BlurFade | components/animated/blur-fade/BlurFade.tsx |
| BoxReveal | components/animated/box-reveal/BoxReveal.tsx |
| Button | features/mindmap/components/note/ui/Button/Button.tsx |
| Carousel | components/reactbits/Carousel/Carousel.tsx |
| Carousel | components/animated/carousel/Carousel.tsx |
| CirclesHud | components/hud-interface/CirclesHud.tsx |
| ColorButton | features/mindmap/components/note/panels/Colorpicker/ColorButton.tsx |
| CommandButton | features/mindmap/components/note/extensions/SlashCommand/CommandButton.tsx |
| ContentItemMenu | features/mindmap/components/note/menus/ContentItemMenu/ContentItemMenu.tsx |
| ContentTypePicker | features/mindmap/components/note/menus/TextMenu/components/ContentTypePicker.tsx |
| Earth | components/earth/Earth.tsx |
| EditLinkPopover | features/mindmap/components/note/menus/TextMenu/components/EditLinkPopover.tsx |
| EditorHeader | features/mindmap/components/note/BlockEditor/components/EditorHeader.tsx |
| EditorInfo | features/mindmap/components/note/BlockEditor/components/EditorInfo.tsx |
| events-group-card | features/mindmap/components/cards/entity-group-card/events-group-card.tsx |
| FloatingEdge | features/mindmap/edges/FloatingEdge.tsx |
| FontFamilyPicker | features/mindmap/components/note/menus/TextMenu/components/FontFamilyPicker.tsx |
| FontSizePicker | features/mindmap/components/note/menus/TextMenu/components/FontSizePicker.tsx |
| GlitchySurveillanceUi | components/hud-interface/GlitchySurveillanceUi.tsx |
| GridAnimation | components/GridAnimation/GridAnimation.tsx |
| HudInterface | components/hud-interface/HudInterface.tsx |
| HudUapInterface | components/uap-dashboard/HudUapInterface.tsx |
| Icon | features/mindmap/components/note/ui/Icon.tsx |
| ImageBlockView | features/mindmap/components/note/extensions/ImageBlock/components/ImageBlockView.tsx |
| ImageBlockWidth | features/mindmap/components/note/extensions/ImageBlock/components/ImageBlockWidth.tsx |
| InfiniteMenu | components/reactbits/InfiniteMenu/InfiniteMenu.tsx |
| LayeredStack | components/animated/layered-stack/LayeredStack.tsx |
| LinkEditorPanel | features/mindmap/components/note/panels/LinkEditorPanel/LinkEditorPanel.tsx |
| LinkPreviewPanel | features/mindmap/components/note/panels/LinkPreviewPanel/LinkPreviewPanel.tsx |
| LocationVisualization | components/location-visualization/LocationVisualization.tsx |
| MapPopup | features/data-viz/sightings/components/MapPopup.tsx |
| MatrixBackground | components/backgrounds/matrix-background/MatrixBackground.tsx |
| Network | components/icons/Network.tsx |
| NotationsUi | features/case-files/notations-ui/NotationsUi.tsx |
| Note | features/mindmap/components/note/Note.tsx |
| Particles | components/animated/particles/Particles.tsx |
| PromptUI | features/ai/components/prompts/PromptUI.tsx |
| Section | components/timelines/draggable-timeline/Section.tsx |
| ShootingStars | components/backgrounds/shooting-stars/ShootingStars.tsx |
| SiblingEdge | features/mindmap/edges/SiblingEdge.tsx |
| SlideFadeIn | components/animated/animated-wrappers/SlideFadeIn.tsx |
| SlideIn | components/animated/animated-wrappers/SlideIn.tsx |
| SortableList | components/cult-ui/sortable-list/SortableList.tsx |
| SpriteIcon | components/icons/SpriteIcon.tsx |
| StackedCards | features/case-files/stacked-cards/StackedCards.tsx |
| Surface | features/mindmap/components/note/ui/Surface.tsx |
| TableOfContents | features/mindmap/components/note/TableOfContents/TableOfContents.tsx |
| TextEffect | components/animated/text-effect/TextEffect.tsx |
| TextMenu | features/mindmap/components/note/menus/TextMenu/TextMenu.tsx |
| TextScrambleEffect | components/hud-interface/TextScrambleEffect.tsx |
| Toggle | features/mindmap/components/note/ui/Toggle/Toggle.tsx |
| TransitionPanel | components/animated/transition-panel/TransitionPanel.tsx |
| UserPromptMessage | features/ai/components/prompts/UserPromptMessage.tsx |

## Components Used in App but Missing Stories

These components are actively used in the app (./src/app directory) but don't have stories:

| Component | Path | Has Props Interface |
| --------- | ---- | ------------------ |
| AdminDashboard | features/admin/AdminDashboard.tsx | ❌ |
| Button | features/mindmap/components/note/ui/Button/Button.tsx | ✅ |
| GraphPaper | components/graph-paper/GraphPaper.tsx | ❌ |
| Particles | components/animated/particles/Particles.tsx | ✅ |
| SwipeGrid | components/animated/swipe-grid/SwipeGrid.tsx | ❌ |
| TextEffect | components/animated/text-effect/TextEffect.tsx | ✅ |

## Components Missing Stories by Directory

### components

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-svg-edge | ❌ |
| annotation-node | ❌ |
| chat-sidebar | ❌ |
| data-edge | ❌ |
| DeployButton | ❌ |
| dotted-dialog | ❌ |
| grid-background | ❌ |
| grid-overlay | ❌ |
| hero | ❌ |
| MastraHomepageHero | ❌ |
| terminal-display | ❌ |
| test | ❌ |
| web-vitals | ❌ |

### components/9-ui

| Component | Has Props Interface |
| --------- | ------------------ |
| toolbar | ❌ |

### components/GridAnimation

| Component | Has Props Interface |
| --------- | ------------------ |
| GridAnimation | ✅ |

### components/animated

| Component | Has Props Interface |
| --------- | ------------------ |
| accordion-basic | ❌ |
| accordion-icons | ❌ |
| accordion-variant | ❌ |
| animated-card-background-hover | ❌ |
| animated-tabs | ❌ |
| animated-tabs-hover | ❌ |
| cursor-1 | ❌ |
| cursor-2 | ❌ |
| cursor-3 | ❌ |
| dialog-basic-1 | ❌ |
| dialog-basic-2 | ❌ |
| dialog-image | ❌ |
| page-transition | ❌ |
| segmented-control | ❌ |
| smooth-scroll | ❌ |
| transition | ❌ |
| transition-panel-card | ❌ |
| transition-panel-tabs | ❌ |

### components/animated-workflow

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-workflow | ❌ |

### components/animated/animated-beam

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-beam | ❌ |
| animated-beam-multiple-inputs | ❌ |
| animated-beam-multiple-outputs | ❌ |
| circuit-pulse | ❌ |

### components/animated/animated-list

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-list | ❌ |

### components/animated/animated-modal

| Component | Has Props Interface |
| --------- | ------------------ |
| AnimatedModal | ❌ |

### components/animated/animated-tabs

| Component | Has Props Interface |
| --------- | ------------------ |
| AnimatedTabs | ❌ |

### components/animated/animated-wrappers

| Component | Has Props Interface |
| --------- | ------------------ |
| AnimatedComponent | ❌ |
| blur-appear | ❌ |
| FadeIn | ❌ |
| ScaleDown | ❌ |
| SlideFadeIn | ✅ |
| SlideIn | ✅ |

### components/animated/blur-fade

| Component | Has Props Interface |
| --------- | ------------------ |
| BlurFade | ✅ |

### components/animated/blur-in

| Component | Has Props Interface |
| --------- | ------------------ |
| BlurIn | ❌ |

### components/animated/box-reveal

| Component | Has Props Interface |
| --------- | ------------------ |
| BoxReveal | ✅ |

### components/animated/carousel

| Component | Has Props Interface |
| --------- | ------------------ |
| Carousel | ✅ |

### components/animated/core

| Component | Has Props Interface |
| --------- | ------------------ |
| accordion | ❌ |
| animated-background | ❌ |
| cursor | ❌ |
| dialog | ❌ |
| popover | ❌ |

### components/animated/float

| Component | Has Props Interface |
| --------- | ------------------ |
| float | ❌ |

### components/animated/gallery

| Component | Has Props Interface |
| --------- | ------------------ |
| Gallery | ❌ |
| gallery-flow | ❌ |

### components/animated/image-swiper

| Component | Has Props Interface |
| --------- | ------------------ |
| ImageSwiper | ❌ |

### components/animated/lamp-effect

| Component | Has Props Interface |
| --------- | ------------------ |
| lamp-effect | ❌ |

### components/animated/layered-stack

| Component | Has Props Interface |
| --------- | ------------------ |
| LayeredStack | ✅ |

### components/animated/number-ticker

| Component | Has Props Interface |
| --------- | ------------------ |
| NumberTicker | ❌ |

### components/animated/particles

| Component | Has Props Interface |
| --------- | ------------------ |
| Particles | ✅ |

### components/animated/radar

| Component | Has Props Interface |
| --------- | ------------------ |
| Radar | ❌ |
| radar-pulse-beams | ❌ |
| RadarLayout | ❌ |

### components/animated/sparkles

| Component | Has Props Interface |
| --------- | ------------------ |
| sparkles | ❌ |

### components/animated/spotlight

| Component | Has Props Interface |
| --------- | ------------------ |
| spotlight | ❌ |

### components/animated/static

| Component | Has Props Interface |
| --------- | ------------------ |
| Static | ❌ |

### components/animated/swipe-grid

| Component | Has Props Interface |
| --------- | ------------------ |
| SwipeGrid | ❌ |

### components/animated/text-effect

| Component | Has Props Interface |
| --------- | ------------------ |
| ghost-text | ❌ |
| glitch-text | ❌ |
| hyper-text | ❌ |
| letter-glitch | ❌ |
| sparkle-text | ❌ |
| text-shimmer | ❌ |
| TextEffect | ✅ |

### components/animated/text-effect/text-scramble

| Component | Has Props Interface |
| --------- | ------------------ |
| ellipses-scramble | ❌ |
| text-scramble | ❌ |

### components/animated/tracing-beam

| Component | Has Props Interface |
| --------- | ------------------ |
| tracing-beam | ❌ |

### components/animated/transition-panel

| Component | Has Props Interface |
| --------- | ------------------ |
| TransitionPanel | ✅ |

### components/app-sidebar

| Component | Has Props Interface |
| --------- | ------------------ |
| AppSidebar | ❌ |

### components/backgrounds

| Component | Has Props Interface |
| --------- | ------------------ |
| backgrounds | ❌ |
| dot-grid-background | ❌ |
| dot-pattern | ❌ |
| grain | ❌ |
| grid-background | ❌ |
| meteors | ❌ |
| shader-bg | ❌ |
| stars-background | ❌ |

### components/backgrounds/animated-grid-pattern

| Component | Has Props Interface |
| --------- | ------------------ |
| AnimatedGridPattern | ❌ |

### components/backgrounds/background-static

| Component | Has Props Interface |
| --------- | ------------------ |
| BackgroundStatic | ❌ |

### components/backgrounds/dot-gradient

| Component | Has Props Interface |
| --------- | ------------------ |
| dot-gradient | ❌ |

### components/backgrounds/graph-paper

| Component | Has Props Interface |
| --------- | ------------------ |
| graph-paper-bg | ❌ |

### components/backgrounds/matrix-background

| Component | Has Props Interface |
| --------- | ------------------ |
| MatrixBackground | ✅ |

### components/backgrounds/shooting-stars

| Component | Has Props Interface |
| --------- | ------------------ |
| shooting-stars-background | ❌ |
| ShootingStars | ✅ |
| stars-background | ❌ |

### components/blockquote

| Component | Has Props Interface |
| --------- | ------------------ |
| Blockquote | ❌ |

### components/bottom-drawer

| Component | Has Props Interface |
| --------- | ------------------ |
| BottomDrawer.stories | ❌ |

### components/cult-ui/expandable-card

| Component | Has Props Interface |
| --------- | ------------------ |
| card | ❌ |
| expandable | ❌ |

### components/cult-ui/floating-panel

| Component | Has Props Interface |
| --------- | ------------------ |
| floating-panel | ❌ |

### components/cult-ui/popover

| Component | Has Props Interface |
| --------- | ------------------ |
| popover | ❌ |

### components/cult-ui/sortable-list

| Component | Has Props Interface |
| --------- | ------------------ |
| SortableList | ✅ |

### components/cursors

| Component | Has Props Interface |
| --------- | ------------------ |
| mindmap-cursor | ❌ |
| neon-cursor | ❌ |

### components/decorative/rulers

| Component | Has Props Interface |
| --------- | ------------------ |
| ruler-ticks | ❌ |

### components/draggable-stack

| Component | Has Props Interface |
| --------- | ------------------ |
| DraggableStack | ❌ |

### components/drawers

| Component | Has Props Interface |
| --------- | ------------------ |
| drawer-underlay.stories | ❌ |

### components/earth

| Component | Has Props Interface |
| --------- | ------------------ |
| Earth | ✅ |

### components/glitch-fx

| Component | Has Props Interface |
| --------- | ------------------ |
| GlitchFx.stories | ❌ |

### components/globes

| Component | Has Props Interface |
| --------- | ------------------ |
| mapbox-globe | ❌ |
| threejs-globe | ❌ |

### components/globes/cobe-globes

| Component | Has Props Interface |
| --------- | ------------------ |
| admin-dashboard-globe | ❌ |
| alt-globe | ❌ |
| artifact-sphere-animation | ❌ |
| cobe-globe | ❌ |

### components/graph-paper

| Component | Has Props Interface |
| --------- | ------------------ |
| graph-paper.stories | ❌ |
| GraphPaper | ❌ |

### components/hud-interface

| Component | Has Props Interface |
| --------- | ------------------ |
| AnimatedHudInterface | ✅ |
| CardsPlayerHolo.stories | ❌ |
| CardsPlayerHolo2.stories | ❌ |
| CirclesHud | ✅ |
| CirclesHud2.stories | ❌ |
| CirclesHud3.stories | ❌ |
| Dashboard1.stories | ❌ |
| Dashboard2.stories | ❌ |
| GlitchySurveillanceUi | ✅ |
| HudCard.stories | ❌ |
| HudCard2.stories | ❌ |
| HudDash.animations | ❌ |
| HudDash.stories | ❌ |
| HudInterface | ✅ |
| SpaceCard.stories | ❌ |
| TextScrambleEffect | ✅ |

### components/icons

| Component | Has Props Interface |
| --------- | ------------------ |
| BaseGridIcon | ❌ |
| CloudIcon | ❌ |
| connection-icon | ❌ |
| entity-icons | ❌ |
| icons | ❌ |
| LocalDevIcon | ❌ |
| LocalDevSecondaryIcon | ❌ |
| Network | ✅ |
| SpriteIcon | ✅ |
| terminal-icon | ❌ |
| WorkflowIcon | ❌ |

### components/loaders

| Component | Has Props Interface |
| --------- | ------------------ |
| loading | ❌ |
| sightings-loader | ❌ |

### components/location-visualization

| Component | Has Props Interface |
| --------- | ------------------ |
| LocationVisualization | ✅ |

### components/loggers

| Component | Has Props Interface |
| --------- | ------------------ |
| render-logger | ❌ |

### components/moon

| Component | Has Props Interface |
| --------- | ------------------ |
| Moon | ❌ |

### components/multistep-loader

| Component | Has Props Interface |
| --------- | ------------------ |
| multistep-loader | ❌ |

### components/navbar

| Component | Has Props Interface |
| --------- | ------------------ |
| full-site-nav | ❌ |
| navbar | ❌ |
| ut-logo | ❌ |
| ut-logo-alt | ❌ |

### components/note

| Component | Has Props Interface |
| --------- | ------------------ |
| AddNote | ❌ |
| AddNoteFloatingPanel | ❌ |
| AddNotePopover | ❌ |

### components/reactbits/AnimatedContent

| Component | Has Props Interface |
| --------- | ------------------ |
| AnimatedContent | ✅ |

### components/reactbits/Carousel

| Component | Has Props Interface |
| --------- | ------------------ |
| Carousel | ✅ |

### components/reactbits/InfiniteMenu

| Component | Has Props Interface |
| --------- | ------------------ |
| InfiniteMenu | ✅ |

### components/sci-fi

| Component | Has Props Interface |
| --------- | ------------------ |
| arrow-ui | ❌ |
| brain-comparison | ❌ |
| brain-scanner | ❌ |
| brain-visualization | ❌ |
| engineer | ❌ |
| file-stack-demo | ❌ |
| holographic-file-stack | ❌ |
| minimal-vertical-menu | ❌ |
| skull-scan | ❌ |

### components/sci-fi-hud

| Component | Has Props Interface |
| --------- | ------------------ |
| canvas-background | ❌ |
| comparison | ❌ |
| right-ui | ❌ |
| scan | ❌ |
| scanner | ❌ |
| side-ui | ❌ |
| view-labels | ❌ |
| visualization | ❌ |

### components/sci-fi/footer

| Component | Has Props Interface |
| --------- | ------------------ |
| footer | ❌ |

### components/search

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-search-input | ❌ |
| search-input | ❌ |

### components/shader

| Component | Has Props Interface |
| --------- | ------------------ |
| shader | ❌ |

### components/side-panel

| Component | Has Props Interface |
| --------- | ------------------ |
| side-panel | ❌ |

### components/sightings

| Component | Has Props Interface |
| --------- | ------------------ |
| sightings-ai-insights | ❌ |

### components/tabs

| Component | Has Props Interface |
| --------- | ------------------ |
| tabs | ❌ |

### components/timelines/3d-timeline

| Component | Has Props Interface |
| --------- | ------------------ |
| ThreeDTimeline.stories | ❌ |
| ThreeDTimelineExample | ❌ |

### components/timelines/draggable-timeline

| Component | Has Props Interface |
| --------- | ------------------ |
| draggable-timeline.stories | ❌ |
| Section | ✅ |

### components/timelines/scroll-through-timeline

| Component | Has Props Interface |
| --------- | ------------------ |
| scroll-through-timeline | ❌ |

### components/timelines/timeline

| Component | Has Props Interface |
| --------- | ------------------ |
| Timeline.stories | ❌ |
| TimelineExample | ❌ |

### components/toolbars

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-toolbar.stories | ❌ |
| ModelActionToolbar | ❌ |
| motion-dynamic-toolbar | ❌ |
| toolbar-expandable.stories | ❌ |
| transition-panel | ❌ |
| ui-lab-toolbar.stories | ❌ |

### components/toolbars/dynamic-toolbar

| Component | Has Props Interface |
| --------- | ------------------ |
| DynamicToolbar.stories | ❌ |

### components/toolbars/mini-toolbar

| Component | Has Props Interface |
| --------- | ------------------ |
| MiniToolbar.stories | ❌ |

### components/uap-dashboard

| Component | Has Props Interface |
| --------- | ------------------ |
| alternative-globe | ❌ |
| codepen-globe | ❌ |
| filter-panel | ❌ |
| globe | ❌ |
| grid-background | ❌ |
| grid-overlay | ❌ |
| HudUapInterface | ✅ |
| pulsing-disk | ❌ |
| section-header | ❌ |
| sightings-stats-display | ❌ |
| sightings-visualization | ❌ |
| tech-corners | ❌ |
| tech-grid-background | ❌ |
| tech-section | ❌ |
| terminal-display | ❌ |
| time-range-selector | ❌ |

### components/uap-dashboard/graph-paper-background

| Component | Has Props Interface |
| --------- | ------------------ |
| graph-paper-background | ❌ |

### components/uap-dashboard/space-hud

| Component | Has Props Interface |
| --------- | ------------------ |
| space-hud | ❌ |

### components/uap-dashboard/terminal

| Component | Has Props Interface |
| --------- | ------------------ |
| terminal | ❌ |

### components/ufo

| Component | Has Props Interface |
| --------- | ------------------ |
| UFO | ❌ |

### components/ui

| Component | Has Props Interface |
| --------- | ------------------ |
| accordion | ❌ |
| alert | ❌ |
| alert-dialog | ❌ |
| aspect-ratio | ❌ |
| avatar | ❌ |
| badge | ❌ |
| breadcrumb | ❌ |
| calendar | ❌ |
| card | ❌ |
| carousel | ❌ |
| chart | ❌ |
| checkbox | ❌ |
| collapsible | ❌ |
| command | ❌ |
| context-menu | ❌ |
| dialog | ❌ |
| dock | ❌ |
| drawer | ❌ |
| dropdown-menu | ❌ |
| expandable-card | ❌ |
| form | ❌ |
| gradient-tracing | ❌ |
| hover-card | ❌ |
| index.ui | ❌ |
| input | ❌ |
| input-otp | ❌ |
| jsx-preview | ❌ |
| label | ❌ |
| markdown | ❌ |
| menubar | ❌ |
| navigation-menu | ❌ |
| pagination | ❌ |
| popover | ❌ |
| progress | ❌ |
| radio-group | ❌ |
| resizable | ❌ |
| scroll-area | ❌ |
| select | ❌ |
| separator | ❌ |
| services-grid | ❌ |
| sheet | ❌ |
| sidebar | ❌ |
| skeleton | ❌ |
| slider | ❌ |
| sonner | ❌ |
| switch | ❌ |
| table | ❌ |
| tabs | ❌ |
| textarea | ❌ |
| toggle | ❌ |
| toggle-group | ❌ |
| tooltip | ❌ |

### components/ui/button

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-button | ❌ |
| animated-menu-button | ❌ |
| button | ❌ |
| create-button | ❌ |
| share-button | ❌ |
| shiny-button | ❌ |

### components/ui/button/delete-button

| Component | Has Props Interface |
| --------- | ------------------ |
| DeleteButton | ❌ |

### components/ui/button/divider-buttons

| Component | Has Props Interface |
| --------- | ------------------ |
| divider-button.stories | ❌ |

### components/ui/canvas-cursor

| Component | Has Props Interface |
| --------- | ------------------ |
| blob-cursor | ❌ |
| canvas-cursor | ❌ |

### components/ui/card

| Component | Has Props Interface |
| --------- | ------------------ |
| background-overlay-card | ❌ |
| card | ❌ |
| expandable-card | ❌ |
| ExpandableCard | ❌ |
| graph-node-card | ❌ |
| grid-layout | ❌ |
| grid-layout-examples | ❌ |
| hover-card | ❌ |
| pill-card | ❌ |
| shift-card | ❌ |
| shift-card-demo | ❌ |
| simple-card | ❌ |
| stars-card | ❌ |
| text-reveal-card | ❌ |
| toggle-entity-input-with-search | ❌ |

### components/ui/card/bento

| Component | Has Props Interface |
| --------- | ------------------ |
| bento-cards | ❌ |
| bento-grid | ❌ |

### components/ui/card/card-stack

| Component | Has Props Interface |
| --------- | ------------------ |
| card-stack | ❌ |

### components/ui/card/data-card

| Component | Has Props Interface |
| --------- | ------------------ |
| data-card | ❌ |

### components/ui/card/expandable-card

| Component | Has Props Interface |
| --------- | ------------------ |
| ExpandableCardGridLayout | ❌ |
| ExpandableCardStandardLayout | ❌ |

### components/ui/card/hover-card

| Component | Has Props Interface |
| --------- | ------------------ |
| hover-card | ❌ |

### components/ui/card/list-card

| Component | Has Props Interface |
| --------- | ------------------ |
| list-card | ❌ |

### components/ui/card/pill-card

| Component | Has Props Interface |
| --------- | ------------------ |
| PillCard | ❌ |

### components/ui/chat

| Component | Has Props Interface |
| --------- | ------------------ |
| chat-bubble | ❌ |
| chat-input | ❌ |
| chat-message | ❌ |
| chat-message-area | ❌ |
| chat-message-list | ❌ |
| expandable-chat | ❌ |
| markdown-content | ❌ |
| message-loading | ❌ |
| scroll-area | ❌ |

### components/ui/command

| Component | Has Props Interface |
| --------- | ------------------ |
| command-mind-map-menu | ❌ |
| command-search-menu | ❌ |

### components/ui/direction-aware-tabs

| Component | Has Props Interface |
| --------- | ------------------ |
| direction-aware-tabs | ❌ |

### components/ui/header

| Component | Has Props Interface |
| --------- | ------------------ |
| site-header | ❌ |

### components/ui/icons

| Component | Has Props Interface |
| --------- | ------------------ |
| arrow | ❌ |
| openai | ❌ |

### components/ui/loading

| Component | Has Props Interface |
| --------- | ------------------ |
| globe-loading | ❌ |

### components/ui/tooltip

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-tooltip | ❌ |
| tooltip | ❌ |

### components/vertical-progress-ui

| Component | Has Props Interface |
| --------- | ------------------ |
| VerticalProgressUi | ❌ |

### components/video

| Component | Has Props Interface |
| --------- | ------------------ |
| video | ❌ |

### features/3d

| Component | Has Props Interface |
| --------- | ------------------ |
| entity-network-graph-3d | ❌ |
| video | ❌ |

### features/3d/3d-card

| Component | Has Props Interface |
| --------- | ------------------ |
| 3d-card | ❌ |

### features/3d/3d-pin

| Component | Has Props Interface |
| --------- | ------------------ |
| 3d-pin | ❌ |
| 3d-pin-card | ❌ |

### features/3d/3d-timeline-journey

| Component | Has Props Interface |
| --------- | ------------------ |
| 3d-timeline-journey | ❌ |
| item | ❌ |
| section | ❌ |
| timeline | ❌ |

### features/3d/dna-visualization

| Component | Has Props Interface |
| --------- | ------------------ |
| DnaPage | ❌ |
| DnaVisualization.stories | ❌ |

### features/3d/drawing-board

| Component | Has Props Interface |
| --------- | ------------------ |
| command-menu | ❌ |
| drawing-board | ❌ |
| drawing-board__d3 | ❌ |
| entity-menu | ❌ |
| graph | ❌ |
| nodes | ❌ |

### features/3d/globe-connections

| Component | Has Props Interface |
| --------- | ------------------ |
| bezier-3d-facade | ❌ |
| ConnectionsFacade | ❌ |
| Globe.stories | ❌ |
| GlobeConnectionsExample.stories | ❌ |
| XRGrabbable | ❌ |

### features/3d/scroll-through-3d

| Component | Has Props Interface |
| --------- | ------------------ |
| model | ❌ |
| overlay | ❌ |
| path-journey | ❌ |
| ScrollThrough3dWrapper | ❌ |
| ScrollThroughThreeD | ❌ |
| ScrollTriggerScene.stories | ❌ |

### features/3d/ufos/ufo

| Component | Has Props Interface |
| --------- | ------------------ |
| ufo-model | ❌ |
| ufo.stories | ❌ |

### features/3d/visualizations/3d-grid

| Component | Has Props Interface |
| --------- | ------------------ |
| 3d-grid | ❌ |

### features/3d/visualizations/diagram

| Component | Has Props Interface |
| --------- | ------------------ |
| 3d-graph | ❌ |
| basic-nodes | ❌ |
| graph-visualization | ❌ |
| nodes | ❌ |
| scroll-controls | ❌ |
| spherical-connection-graph | ❌ |

### features/3d/visualizations/graph

| Component | Has Props Interface |
| --------- | ------------------ |
| rtf-graph | ❌ |

### features/3d/visualizations/spatial-gallery

| Component | Has Props Interface |
| --------- | ------------------ |
| spatial-gallery | ❌ |

### features/3d/visualizations/word-cloud

| Component | Has Props Interface |
| --------- | ------------------ |
| word-cloud | ❌ |

### features/admin

| Component | Has Props Interface |
| --------- | ------------------ |
| Admin | ✅ |
| AdminDashboard | ❌ |

### features/admin/ui

| Component | Has Props Interface |
| --------- | ------------------ |
| columns | ❌ |
| RecordsTable | ❌ |
| SelectedRecordsList | ❌ |

### features/ai/actions

| Component | Has Props Interface |
| --------- | ------------------ |
| chat.actions | ❌ |

### features/ai/api

| Component | Has Props Interface |
| --------- | ------------------ |
| actions | ❌ |

### features/ai/components

| Component | Has Props Interface |
| --------- | ------------------ |
| ai-assisted-search-interface | ❌ |
| entity-menu | ❌ |
| knowledge-graph | ❌ |
| markdown | ❌ |
| message | ❌ |
| mindmap-entity-loader-card | ❌ |
| SuggestedSearchItem | ❌ |

### features/ai/components/ai-inputs

| Component | Has Props Interface |
| --------- | ------------------ |
| ai-inputs | ❌ |
| ai-oracle | ❌ |
| oracle-input | ❌ |

### features/ai/components/chat-interface

| Component | Has Props Interface |
| --------- | ------------------ |
| chat | ❌ |
| chat-bottombar | ❌ |
| chat-layout | ❌ |
| chat-list | ❌ |
| chat-sidebar | ❌ |
| chat-textarea | ❌ |
| chat-topbar | ❌ |
| conversation | ❌ |

### features/ai/components/mindmap-search-ui

| Component | Has Props Interface |
| --------- | ------------------ |
| entity-quick-menu | ❌ |
| quick-load-button | ❌ |

### features/ai/components/prompt-kit

| Component | Has Props Interface |
| --------- | ------------------ |
| markdown | ❌ |
| reasoning | ❌ |
| response-stream | ❌ |

### features/ai/components/prompt-kit/ai-markdown-message

| Component | Has Props Interface |
| --------- | ------------------ |
| code-block | ❌ |
| highlighter | ❌ |
| message | ❌ |
| model-selector | ❌ |

### features/ai/components/prompts

| Component | Has Props Interface |
| --------- | ------------------ |
| Answer | ❌ |
| PromptInput | ❌ |
| PromptMessages | ❌ |
| PromptPanel | ❌ |
| PromptState | ❌ |
| PromptUI | ✅ |
| SimilarTopics | ❌ |
| SourceCard | ❌ |
| Sources | ❌ |
| UserPromptMessage | ✅ |

### features/case-files

| Component | Has Props Interface |
| --------- | ------------------ |
| flashlight-background | ❌ |

### features/case-files/canvas

| Component | Has Props Interface |
| --------- | ------------------ |
| demos | ❌ |

### features/case-files/canvas/canvas-annotations

| Component | Has Props Interface |
| --------- | ------------------ |
| canvas-annotations | ❌ |

### features/case-files/canvas/canvas-drawer

| Component | Has Props Interface |
| --------- | ------------------ |
| canvas-drawer | ❌ |

### features/case-files/canvas/canvas-grid

| Component | Has Props Interface |
| --------- | ------------------ |
| canvas-grid | ❌ |

### features/case-files/case-file/case-file-evidence

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-folder | ❌ |
| case-file-dossier | ❌ |
| classification-banner | ❌ |
| data-grid | ❌ |
| evidence-browser | ❌ |
| evidence-card | ❌ |
| evidence-detail-sidebar | ❌ |
| evidence.stories | ❌ |

### features/case-files/case-file/case-file-folder

| Component | Has Props Interface |
| --------- | ------------------ |
| case-file | ❌ |
| gooey-svg-filter | ❌ |

### features/case-files/connections-ui

| Component | Has Props Interface |
| --------- | ------------------ |
| ConnectionsUi.stories | ❌ |
| EntityConnectionsFlow | ❌ |

### features/case-files/easel-tabs

| Component | Has Props Interface |
| --------- | ------------------ |
| EaselTabs.stories | ❌ |

### features/case-files/folder

| Component | Has Props Interface |
| --------- | ------------------ |
| folder-flyout | ❌ |
| folder-open | ❌ |
| folder-tabs | ❌ |

### features/case-files/notations-ui

| Component | Has Props Interface |
| --------- | ------------------ |
| NotationsUi | ✅ |

### features/case-files/stacked-cards

| Component | Has Props Interface |
| --------- | ------------------ |
| exploding-stack.stories | ❌ |
| stacked-cards.stories | ❌ |
| StackedCards | ✅ |

### features/collab

| Component | Has Props Interface |
| --------- | ------------------ |
| live-users | ❌ |
| room | ❌ |

### features/data-viz/components/globes

| Component | Has Props Interface |
| --------- | ------------------ |
| globe | ❌ |
| mapbox-globe | ❌ |

### features/data-viz/components/globes/codepen-viz

| Component | Has Props Interface |
| --------- | ------------------ |
| codepen-earth | ❌ |
| codepen-earth-alt | ❌ |

### features/data-viz/components/world-map

| Component | Has Props Interface |
| --------- | ------------------ |
| world-map | ❌ |

### features/data-viz/sightings

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-arc-group-layer.stories | ❌ |
| animated-arc-layer.stories | ❌ |
| chatgpt-version | ❌ |
| old | ❌ |
| sightings | ❌ |
| sightings-globe | ❌ |
| sightings-globe-refactored | ❌ |
| sightings-loader | ❌ |
| world-map | ❌ |

### features/data-viz/sightings/components

| Component | Has Props Interface |
| --------- | ------------------ |
| deck-gl-overlay | ❌ |
| EventsTimeSeries | ❌ |
| hud-sightings-terminal | ❌ |
| MapPopup | ✅ |
| sightings-globe-settings | ❌ |

### features/data-viz/sightings/components/sightings-timeseries

| Component | Has Props Interface |
| --------- | ------------------ |
| SightingsTimeSeries.stories | ❌ |

### features/mindmap

| Component | Has Props Interface |
| --------- | ------------------ |
| graph | ❌ |
| mind-map | ❌ |

### features/mindmap/components

| Component | Has Props Interface |
| --------- | ------------------ |
| ask-ai | ❌ |
| base-handle | ❌ |
| button-handle | ❌ |
| connection-list | ❌ |
| example-client-component | ❌ |
| labeled-handle | ❌ |
| node-status-indicator | ❌ |

### features/mindmap/components/cards

| Component | Has Props Interface |
| --------- | ------------------ |
| basic-mindmap-cards | ❌ |
| layer-zero-card | ❌ |
| luxe-card | ❌ |
| mini-card | ❌ |
| render-entity-card | ❌ |
| testimony-card | ❌ |
| topic-card | ❌ |

### features/mindmap/components/cards/card-stack

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-mini-card | ❌ |
| card-stack | ❌ |
| card-stack-multiview | ❌ |
| cards | ❌ |

### features/mindmap/components/cards/connection-card

| Component | Has Props Interface |
| --------- | ------------------ |
| connection-card | ❌ |

### features/mindmap/components/cards/entity-card

| Component | Has Props Interface |
| --------- | ------------------ |
| entity-card | ❌ |
| entity-card-tooltip | ❌ |
| entity-card-utility-menu | ❌ |

### features/mindmap/components/cards/entity-group-card

| Component | Has Props Interface |
| --------- | ------------------ |
| entity-group-card | ❌ |
| entity-group-card-bg | ❌ |
| events-group-card | ✅ |
| lights-background | ❌ |
| organizations-group-card | ❌ |
| sections | ❌ |
| testimonies-group-card | ❌ |
| topic-group-card | ❌ |

### features/mindmap/components/cards/event

| Component | Has Props Interface |
| --------- | ------------------ |
| bonsai-card | ❌ |
| event-globe-card | ❌ |
| grid-card | ❌ |
| photo-carousel | ❌ |

### features/mindmap/components/cards/graph-card

| Component | Has Props Interface |
| --------- | ------------------ |
| graph-card | ❌ |
| graph-card-bg | ❌ |

### features/mindmap/components/cards/root-node-card

| Component | Has Props Interface |
| --------- | ------------------ |
| InputWithVanishAnimation | ❌ |
| root-node-card | ❌ |
| RootNodeToolbar | ❌ |
| search-input-spotlight | ❌ |

### features/mindmap/components/cards/subject-matter-expert-card

| Component | Has Props Interface |
| --------- | ------------------ |
| SubjectMatterExpertCard | ❌ |

### features/mindmap/components/clones

| Component | Has Props Interface |
| --------- | ------------------ |
| clone-node | ❌ |

### features/mindmap/components/launchpad

| Component | Has Props Interface |
| --------- | ------------------ |
| launchpad.stories | ❌ |

### features/mindmap/components/menus

| Component | Has Props Interface |
| --------- | ------------------ |
| examples | ❌ |
| expandable-tab-menu | ❌ |
| floating-node-menu | ❌ |
| mindmap-ai-chat | ❌ |
| mindmap-animated-click-menu | ❌ |
| mindmap-bottom-menu | ❌ |
| mindmap-side-menu | ❌ |
| mindmap-utility-cursor | ❌ |
| model-action-toolbar.stories | ❌ |
| NodeMenu | ❌ |
| oracle-sphere-test | ❌ |
| oracle-sphere.stories | ❌ |

### features/mindmap/components/note

| Component | Has Props Interface |
| --------- | ------------------ |
| Note | ✅ |

### features/mindmap/components/note/BlockEditor

| Component | Has Props Interface |
| --------- | ------------------ |
| BlockEditor | ❌ |
| types | ❌ |

### features/mindmap/components/note/BlockEditor/components

| Component | Has Props Interface |
| --------- | ------------------ |
| EditorHeader | ✅ |
| EditorInfo | ✅ |

### features/mindmap/components/note/Sidebar

| Component | Has Props Interface |
| --------- | ------------------ |
| Sidebar | ❌ |

### features/mindmap/components/note/TableOfContents

| Component | Has Props Interface |
| --------- | ------------------ |
| TableOfContents | ✅ |

### features/mindmap/components/note/extensions/AiImage

| Component | Has Props Interface |
| --------- | ------------------ |
| AiImage | ❌ |

### features/mindmap/components/note/extensions/AiImage/components

| Component | Has Props Interface |
| --------- | ------------------ |
| AiImageView | ❌ |

### features/mindmap/components/note/extensions/AiWriter

| Component | Has Props Interface |
| --------- | ------------------ |
| AiWriter | ❌ |

### features/mindmap/components/note/extensions/AiWriter/components

| Component | Has Props Interface |
| --------- | ------------------ |
| AiWriterView | ❌ |

### features/mindmap/components/note/extensions/EmojiSuggestion/components

| Component | Has Props Interface |
| --------- | ------------------ |
| EmojiList | ❌ |

### features/mindmap/components/note/extensions/ImageBlock/components

| Component | Has Props Interface |
| --------- | ------------------ |
| ImageBlockMenu | ❌ |
| ImageBlockView | ✅ |
| ImageBlockWidth | ✅ |

### features/mindmap/components/note/extensions/ImageUpload/view

| Component | Has Props Interface |
| --------- | ------------------ |
| ImageUpload | ❌ |
| ImageUploader | ❌ |

### features/mindmap/components/note/extensions/MultiColumn/menus

| Component | Has Props Interface |
| --------- | ------------------ |
| ColumnsMenu | ❌ |

### features/mindmap/components/note/extensions/SlashCommand

| Component | Has Props Interface |
| --------- | ------------------ |
| CommandButton | ✅ |
| MenuList | ❌ |

### features/mindmap/components/note/extensions/TableOfContentsNode

| Component | Has Props Interface |
| --------- | ------------------ |
| TableOfContentsNode | ❌ |

### features/mindmap/components/note/lib

| Component | Has Props Interface |
| --------- | ------------------ |
| constants | ❌ |

### features/mindmap/components/note/lib/data

| Component | Has Props Interface |
| --------- | ------------------ |
| initialContent | ❌ |

### features/mindmap/components/note/menus/ContentItemMenu

| Component | Has Props Interface |
| --------- | ------------------ |
| ContentItemMenu | ✅ |

### features/mindmap/components/note/menus/LinkMenu

| Component | Has Props Interface |
| --------- | ------------------ |
| LinkMenu | ❌ |

### features/mindmap/components/note/menus/TextMenu

| Component | Has Props Interface |
| --------- | ------------------ |
| TextMenu | ✅ |

### features/mindmap/components/note/menus/TextMenu/components

| Component | Has Props Interface |
| --------- | ------------------ |
| AIDropdown | ✅ |
| ContentTypePicker | ✅ |
| EditLinkPopover | ✅ |
| FontFamilyPicker | ✅ |
| FontSizePicker | ✅ |

### features/mindmap/components/note/panels/Colorpicker

| Component | Has Props Interface |
| --------- | ------------------ |
| ColorButton | ✅ |
| Colorpicker | ❌ |

### features/mindmap/components/note/panels/LinkEditorPanel

| Component | Has Props Interface |
| --------- | ------------------ |
| LinkEditorPanel | ✅ |

### features/mindmap/components/note/panels/LinkPreviewPanel

| Component | Has Props Interface |
| --------- | ------------------ |
| LinkPreviewPanel | ✅ |

### features/mindmap/components/note/ui

| Component | Has Props Interface |
| --------- | ------------------ |
| Icon | ✅ |
| PopoverMenu | ❌ |
| Surface | ✅ |
| Toolbar | ❌ |

### features/mindmap/components/note/ui/Button

| Component | Has Props Interface |
| --------- | ------------------ |
| Button | ✅ |
| hover-expand-button | ❌ |
| shiny-button | ❌ |

### features/mindmap/components/note/ui/Dropdown

| Component | Has Props Interface |
| --------- | ------------------ |
| Dropdown | ❌ |

### features/mindmap/components/note/ui/Loader

| Component | Has Props Interface |
| --------- | ------------------ |
| Loader | ❌ |

### features/mindmap/components/note/ui/Spinner

| Component | Has Props Interface |
| --------- | ------------------ |
| Spinner | ❌ |

### features/mindmap/components/note/ui/Textarea

| Component | Has Props Interface |
| --------- | ------------------ |
| Textarea | ❌ |

### features/mindmap/components/note/ui/Toggle

| Component | Has Props Interface |
| --------- | ------------------ |
| Toggle | ✅ |

### features/mindmap/components/status-ui

| Component | Has Props Interface |
| --------- | ------------------ |
| agent-notifications-log.stories | ❌ |
| case-files-and-evidence-board.stories | ❌ |
| graph-status-log.stories | ❌ |
| session-notes.stories | ❌ |
| thread-board | ❌ |

### features/mindmap/config

| Component | Has Props Interface |
| --------- | ------------------ |
| edge-types | ❌ |
| node-types | ❌ |

### features/mindmap/edges

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-svg-edge | ❌ |
| button-edge | ❌ |
| data-edge | ❌ |
| FloatingConnectionLine | ❌ |
| FloatingEdge | ✅ |
| FlowEdge | ❌ |
| RootEdge | ❌ |
| SequentialEdge | ❌ |
| SiblingEdge | ✅ |

### features/mindmap/nodes

| Component | Has Props Interface |
| --------- | ------------------ |
| animated-node | ❌ |
| annotation-node | ❌ |
| AnnotationNode | ❌ |
| base-node | ❌ |
| core-node-ui | ❌ |
| database-schema-node | ❌ |
| document-node | ❌ |
| entity-group-node | ❌ |
| entity-group-node-child | ❌ |
| entity-group-node-child-events | ❌ |
| entity-node | ❌ |
| group-results-node | ❌ |
| personnel-group-node | ❌ |
| personnel-group-node-child | ❌ |
| root-node | ❌ |
| testimony-node | ❌ |

### features/mindmap/nodes/user-input-node

| Component | Has Props Interface |
| --------- | ------------------ |
| anchor | ❌ |

### features/mindmap/workflows

| Component | Has Props Interface |
| --------- | ------------------ |
| base-handle | ❌ |
| base-node | ❌ |
| editable-handle | ❌ |
| generate-text-node-controller | ❌ |
| labeled-handle | ❌ |
| node-header | ❌ |
| node-header-status | ❌ |
| nodes-panel | ❌ |
| prompt-crafter-node-controller | ❌ |
| resizable-node | ❌ |
| status-edge-controller | ❌ |
| text-input-node | ❌ |
| text-input-node-controller | ❌ |
| visualize-text-node | ❌ |
| visualize-text-node-controller | ❌ |

### features/user

| Component | Has Props Interface |
| --------- | ------------------ |
| get-user-by-auth-id | ❌ |

## Recommendations

Based on this analysis, we recommend the following actions:

1. **Focus on High-Priority Components**: Begin by creating stories for components with Props interfaces, especially those used in the app.
2. **Address Active Components**: Prioritize components that are actively used in the app (6 components).
3. **Establish Guidelines**: Create a team standard that all new components should have corresponding stories.
4. **Incremental Progress**: Set a goal to increase story coverage by at least 10% per sprint.
5. **Leverage Existing Patterns**: Use existing stories as templates for similar components.

*Report generated on 3/31/2025 at 2:28:56 PM*
