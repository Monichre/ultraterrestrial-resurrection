# Deep Research (under `@repo/ai/services`)

Unified helpers that combine Firecrawl and Exa for web research. Import from the AI workspace barrel:

```ts
import {
  enhancedDeepResearch,
  quickResearch,
  comprehensiveResearch,
} from '@repo/ai/services'
```

Vendor clients live alongside this module at `packages/ai/services/{exa,firecrawl}/`. Nested private copies of those clients were removed in the 2026-08-06 merge.
