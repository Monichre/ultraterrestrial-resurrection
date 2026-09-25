import { loadPromptSync } from '@repo/prompts/yaml-loader'

// Canonical NER prompt — sourced from packages/prompts/sets/disclosure/ner.v1.yaml
export const NER_EXTRACTION_PROMPT = loadPromptSync( 'disclosure.ner' ).prompt
