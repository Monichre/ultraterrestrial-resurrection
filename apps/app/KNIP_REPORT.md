# 📊 KNIP Analysis Report

> **Code Analysis Summary**: This report identifies unused files, dependencies, and exports to help optimize the codebase.

## 📈 Executive Summary

| Category | Count | Impact |
|----------|-------|---------|
| 🗂️ **Unused Files** | **961** | 🔴 High - Remove to reduce bundle size |
| 📦 **Unused Dependencies** | **68** | 🟡 Medium - Remove to reduce node_modules size |
| 🔧 **Unused Dev Dependencies** | **11** | 🟢 Low - Safe to remove |
| ⚠️ **Unlisted Dependencies** | **35** | 🔴 High - Add to package.json or remove usage |
| 🔗 **Unresolved Imports** | **58** | 🔴 High - Fix import paths |
| 📤 **Unused Exports** | **528** | 🟡 Medium - Remove to improve tree-shaking |
| 🏷️ **Unused Types** | **136** | 🟢 Low - Remove for cleaner code |
| 🔄 **Duplicate Exports** | **24** | 🟡 Medium - Consolidate duplicates |

---

## 🗂️ Unused Files (961)

### High Priority Removals

#### Scripts & Build Tools
```
eslint.config.mjs
liveblocks.config.ts
public/force-worker.js
scripts/batch-rename.js
scripts/generate-stories.js
scripts/naming-audit.js
scripts/run-component-audit.ts
scripts/test-ranking-system.js
```

#### Data Import Scripts
```
scripts/data-import/events/prepare-events.ts
scripts/data-import/events/test-events-import.ts
scripts/data-import/import-testimonies-to-xata-fixed.ts
scripts/data-import/import-testimonies-to-xata.ts
scripts/data-import/importers/events.js
scripts/data-import/process-test-subset.js
scripts/data-import/process-testimonies.ts
scripts/data-import/processing/personnel/ufo-int-personnel.ts
scripts/data-import/processing/test.ts
scripts/data-import/processing/ufo-int-tests/test.ts
scripts/data-import/processors/events.js
scripts/data-import/testimonies/extract-single-testimony.ts
scripts/identify-missing-stories.ts
scripts/process-and-monitor.ts
scripts/rename-file.js
scripts/update-vectors.ts
scripts/workers/testimony-queue-worker.ts
```

#### Component Files

##### Admin Dashboard Components
```
src/components/admin-dashboard/components/app-sidebar.tsx
src/components/admin-dashboard/components/chart-area-interactive.tsx
src/components/admin-dashboard/components/data-table.tsx
src/components/admin-dashboard/components/nav-documents.tsx
src/components/admin-dashboard/components/nav-main.tsx
src/components/admin-dashboard/components/nav-secondary.tsx
src/components/admin-dashboard/components/nav-user.tsx
src/components/admin-dashboard/components/section-cards.tsx
src/components/admin-dashboard/components/site-header.tsx
src/components/admin-dashboard/page.tsx
```

##### Animated Components
```
src/components/animated/animated-beam/circuit-pulse.tsx
src/components/animated/animated-tabs/AnimatedTabs.tsx
src/components/animated/animated-tabs/index.tsx
src/components/animated/carousel/Carousel.tsx
src/components/animated/carousel/index.tsx
src/components/animated/core/popover.tsx
src/components/animated/dynamic-island/index.tsx
src/components/animated/entrance-preloader/default-lines.ts
src/components/animated/entrance-preloader/EntrancePreloader.tsx
src/components/animated/entrance-preloader/example.tsx
src/components/animated/entrance-preloader/index.ts
src/components/animated/entrance-preloader/types.ts
src/components/animated/entrance-preloader/useEntrancePreloader.ts
src/components/animated/entrance-preloader/utils.ts
src/components/animated/gallery/gallery-flow.tsx
src/components/animated/lamp-effect/lamp-effect.stories.ts
src/components/animated/layered-stack/index.tsx
src/components/animated/layered-stack/LayeredStack.tsx
src/components/animated/text-effect/ghost-text.tsx
src/components/animated/text-effect/glitch-text.tsx
src/components/animated/text-effect/hyper-text.tsx
src/components/animated/text-effect/letter-glitch.tsx
src/components/animated/text-effect/sparkle-text.tsx
src/components/animated/transition-panel-card.tsx
```

##### UI Components
```
src/components/ui/alert-dialog.tsx
src/components/ui/annotation-menu.stories.tsx
src/components/ui/annotation-menu.tsx
src/components/ui/aspect-ratio.tsx
src/components/ui/button/animated-button.tsx
src/components/ui/button/create-button.tsx
src/components/ui/button/delete-button/DeleteButton.tsx
src/components/ui/button/delete-button/index.tsx
src/components/ui/button/divider-buttons/divider-button.stories.tsx
src/components/ui/button/divider-buttons/divider-button.tsx
src/components/ui/button/divider-buttons/index.ts
src/components/ui/button/index.tsx
src/components/ui/button/share-button.tsx
src/components/ui/button/shiny-button.tsx
```

### Medium Priority Removals

#### Stories & Examples
```
src/components/bottom-drawer/BottomDrawer.stories.tsx
src/components/draggable-stack/DraggableStack.stories.tsx
src/components/drawers/drawer-underlay.stories.tsx
src/components/glitch-fx/GlitchFx.stories.tsx
src/components/graph-paper/graph-paper.stories.tsx
src/components/hud-interface/CardsPlayerHolo.stories.tsx
src/components/hud-interface/CardsPlayerHolo2.stories.tsx
src/components/hud-interface/CirclesHud2.stories.tsx
src/components/hud-interface/CirclesHud3.stories.tsx
src/components/hud-interface/Dashboard1.stories.tsx
src/components/hud-interface/Dashboard2.stories.tsx
```

#### Features & Complex Components
```
src/features/3d/3d-card/3d-card.tsx
src/features/3d/3d-pin/3d-pin-card.tsx
src/features/3d/3d-pin/3d-pin.stories.ts
src/features/3d/3d-pin/3d-pin.tsx
src/features/3d/3d-pin/index.tsx
src/features/admin/Admin.tsx
src/features/admin/index.tsx
src/features/admin/ui/columns.tsx
```

### Low Priority Removals

#### Test & Utility Files
```
src/components/test.tsx
src/components/web-vitals.tsx
src/tests/mindmap-flow-test.tsx
templates/hook/index.js
```

---

## 📦 Dependencies Analysis

### 🔴 Unused Dependencies (68) - High Impact

#### AI & ML Libraries
```json
{
  "@ai-sdk/deepseek": "Remove if not using DeepSeek AI",
  "@ai-sdk/groq": "Remove if not using Groq AI",
  "langsmith": "Remove if not using LangSmith tracking",
  "multion": "Remove if not using MultiOn automation"
}
```

#### UI & Animation Libraries
```json
{
  "@dnd-kit/core": "Remove if not using drag & drop",
  "@dnd-kit/modifiers": "Remove if not using drag & drop",
  "@dnd-kit/sortable": "Remove if not using drag & drop",
  "@dnd-kit/utilities": "Remove if not using drag & drop",
  "@liveblocks/react": "Remove if not using Liveblocks",
  "embla-carousel-react": "Remove if not using Embla carousel",
  "rough-notation": "Remove if not using rough notation",
  "tldraw": "Remove if not using tldraw"
}
```

#### Database & Backend Libraries
```json
{
  "@supabase/ssr": "Remove if fully migrated to Xata",
  "@upstash/qstash": "Remove if not using Upstash Queue",
  "@upstash/vector": "Remove if not using Upstash Vector",
  "@upstash/workflow": "Remove if not using Upstash Workflows",
  "inngest": "Remove if not using Inngest"
}
```

#### 3D & Visualization Libraries
```json
{
  "d3-dag": "Remove if not using D3 DAG layouts",
  "d3-hierarchy": "Remove if not using D3 hierarchy",
  "d3-timer": "Remove if not using D3 timer",
  "elkjs": "Remove if not using ELK layouts",
  "entitree-flex": "Remove if not using Entitree layouts",
  "gl-matrix": "Remove if not using WebGL matrix operations",
  "react-globe.gl": "Remove if not using Globe.gl",
  "troika-3d": "Remove if not using Troika 3D",
  "troika-3d-ui": "Remove if not using Troika 3D UI",
  "troika-three-utils": "Remove if not using Troika utilities"
}
```

### 🟡 Unused Dev Dependencies (11) - Medium Impact

#### Storybook Related
```json
{
  "@chromatic-com/storybook": "Remove if not using Chromatic",
  "@geometricpanda/storybook-addon-badges": "Remove if not using badges addon",
  "@storybook/addon-console": "Remove if not using console addon",
  "@storybook/addon-onboarding": "Remove if not using onboarding addon",
  "@storybook/jest": "Remove if not using Storybook Jest",
  "@storybook/testing-library": "Remove if not using testing library",
  "storybook": "Remove if not using Storybook"
}
```

#### Build Tools
```json
{
  "@eslint/eslintrc": "Remove if using flat config",
  "cross-env": "Remove if not setting cross-platform env vars",
  "eslint": "Remove if not using ESLint",
  "sass": "Remove if not using Sass"
}
```

### ⚠️ Unlisted Dependencies (35) - Critical Issues

#### Required Dependencies Missing from package.json
```json
{
  "@upstash/search": "Add to package.json - used in document routes",
  "@upstash/queue": "Add to package.json - used in processing routes",
  "@tiptap/core": "Add to package.json - used in research extensions",
  "@tiptap/extension-document": "Add to package.json - used in research extensions",
  "@tiptap/extension-paragraph": "Add to package.json - used in research extensions",
  "@tiptap/extension-text": "Add to package.json - used in research extensions",
  "@radix-ui/react-toast": "Add to package.json - used in toast UI",
  "tippy.js": "Add to package.json - used in research mentions",
  "unified": "Add to package.json - used in markdown rendering",
  "react-dropzone": "Add to package.json - used in upload zones",
  "zod-to-json-schema": "Add to package.json - used in Firecrawl"
}
```

---

## 🔗 Unresolved Imports (58) - Critical Issues

### Database Import Issues
```typescript
// Fix these import paths:
"@/db/xata" // Used in 25+ files - verify path is correct
"@/db/xata/client" // Used in 8+ files
"@/db/xata/db/models" // Used in admin page
"@/db/xata/functions/key-figures" // Used in admin page
```

### Service Import Issues  
```typescript
// Fix these import paths:
"@/services/resource-scrape/processing" // Used in file processing
"@/services/resource-scrape" // Used in batch scraping
"@/features/mindmap/actions/fetch-entities-with-connections" // Used in mindmap
```

### Pipeline Import Issues
```typescript
// Fix these relative imports:
"./db/types" // Used in document processing
"./pipeline/extract" // Used in document processing  
"./pipeline/analyze" // Used in document processing
"../lib/actions" // Used in multiple pipelines
"../lib/db/types" // Used in multiple components
```

---

## 📤 Unused Exports Analysis (528)

### High Priority - Remove Large Unused Exports

#### Component Exports (100+ items)
- **Animated Components**: 50+ unused animated component exports
- **UI Components**: 80+ unused UI component exports  
- **Feature Components**: 60+ unused feature component exports

#### Utility Exports (200+ items)
- **Animation Utilities**: 30+ unused animation functions
- **Color Utilities**: 25+ unused color constants
- **Helper Functions**: 100+ unused utility functions

#### Type Exports (136 items)
- **Interface Types**: 80+ unused interface definitions
- **Type Aliases**: 56+ unused type definitions

### Recommended Actions

1. **Immediate Cleanup**: Remove unused component exports
2. **Utility Audit**: Review and remove unused utility functions
3. **Type Cleanup**: Remove unused type definitions
4. **Export Optimization**: Use named exports consistently

---

## 🔄 Duplicate Exports (24)

### Component Duplicates
```typescript
// Fix these duplicate exports:
CustomCursor|default // src/components/cursor-ui/CustomCursor.tsx
FileUpload|default // src/components/file-upload/index.tsx
Button|default // Multiple button components
MarkdownRenderer|MemoizedReact // Pipeline components
```

---

## 🎯 Action Plan

### Phase 1: Critical Fixes (Week 1)
- [ ] Fix all unresolved imports (58 items)
- [ ] Add missing dependencies to package.json (35 items)
- [ ] Remove unused dependencies causing build issues

### Phase 2: File Cleanup (Week 2)  
- [ ] Remove unused script files (50+ items)
- [ ] Remove unused component stories (30+ items)
- [ ] Remove unused admin dashboard components (10+ items)

### Phase 3: Dependency Cleanup (Week 3)
- [ ] Remove unused dependencies (68 items) 
- [ ] Remove unused dev dependencies (11 items)
- [ ] Update package.json and run clean install

### Phase 4: Code Optimization (Week 4)
- [ ] Remove unused exports (528 items)
- [ ] Remove unused types (136 items)  
- [ ] Fix duplicate exports (24 items)

---

## 📊 Impact Estimation

### Bundle Size Reduction
- **Unused Files**: ~2-5MB reduction
- **Unused Dependencies**: ~50-100MB node_modules reduction
- **Unused Exports**: ~10-20% tree-shaking improvement

### Development Experience
- **Faster Builds**: 10-20% improvement
- **Cleaner Codebase**: Easier navigation and maintenance
- **Reduced Confusion**: Fewer unused imports and components

---

*Generated by KNIP analysis tool*