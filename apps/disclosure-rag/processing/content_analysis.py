import json
import os
from textwrap import dedent
from typing import Any, Dict, Optional

from dotenv import load_dotenv
from pydantic import BaseModel

from lib.prompt_loader import get_prompt
from processing.rag_prompt_pipeline import RagPromptPipeline
from rich.console import Console
from rich.panel import Panel
from rich.style import Style
from rich.table import Table

# Load environment variables when module is imported
load_dotenv()

console = Console()

research_prompt = get_prompt("disclosure.research")
ner_prompt = get_prompt("disclosure.ner")

conversation_history = [
    {"role": "system", "content": research_prompt}
]


class AssistantResponse(BaseModel):
    assistant_reply: str


class ContentAnalysisEngine:
    def analyze_content(self, content_text):
        """Analyze content via the shared frontier fallback chain.

        Previously this called `get_claude_analysis` alone (the OpenAI and
        DeepSeek branches were commented out). When the Anthropic key ran out of
        credit, the method still returned its header and `=== ORIGINAL CONTENT
        ===` marker with nothing between them — the ~195-byte `Summary.txt`
        stubs found throughout the archive (ingestion-hardening.md §8.5).
        Because entity extraction reads the summary file, that empty stub also
        starved extraction (§8.6).

        Routed through `lib.llm_fallback` with `task_id="narrative_summary"`,
        so tier order comes from packages/ai/prompts/llm_routing.yaml — the
        same config `RagPromptPipeline` uses. The class's raw Anthropic / OpenAI
        / Groq / DeepSeek clients and six never-called legacy methods were
        removed 2026-09-28; they pinned claude-3-5-sonnet, gpt-4o-mini and
        deepseek-r1-distill and built clients on every instantiation.

        Returns **None** when every tier fails, so callers report a failed stage
        rather than writing a stub that looks like output.

        ═══ YT-CHAIN-10 · content_analysis.py :: analyze_content() ════════
        LLM CALL #1 of 2. Produces the narrative analysis that becomes the
        body of Summary.txt back at YT-CHAIN-12.
        Provider: llm_routing.yaml task `narrative_summary` (2026-09-28;
        was the hardcoded FRONTIER_FALLBACK_CHAIN).
        PREV ← YT-CHAIN-06  lib/youtube.py :: generate_transcript()
        NEXT → YT-CHAIN-11  process_for_rag()  (same caller, next statement)
        ═══════════════════════════════════════════════════════════════════
        """
        from lib.llm_fallback import AllProvidersFailed, get_fallback

        try:
            # task_id routes through llm_routing.yaml; without it this call
            # used the stale hardcoded emergency chain in llm_fallback.py.
            result = get_fallback().complete(
                research_prompt, content_text, temperature=0.1, max_tokens=4000,
                task_id="narrative_summary")
        except AllProvidersFailed as exc:
            print("❌ Content analysis failed - every provider in the chain was "
                  f"unavailable: {exc}")
            return None
        except Exception as exc:
            print(f"❌ Content analysis error: {type(exc).__name__}: {exc}")
            return None

        if not result.text or not result.text.strip():
            print("❌ Content analysis returned empty text "
                  f"(served by {result.tier_id})")
            return None

        return (
            "=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===\n\n"
            f"Research Agent Analysis ({result.provider}):\n"
            f"{result.text}\n\n"
            "=== ORIGINAL CONTENT ===\n\n"
        )

    def process_for_rag(
        self,
        content_text: str,
        *,
        provenance: str = "",
        filename_hint: str = "",
        content_type_override: Optional[str] = None,
        skip_ner: bool = False,
        run_ner: bool = True,
    ) -> Dict[str, Any]:
        """
        Run the registry-backed RAG/NER document pipeline.

        Returns structured classification, analysis, Evidence chunks, NER, and
        embeddable_texts suitable for vector indexing (Inference excluded).

        ═══ YT-CHAIN-11 · content_analysis.py :: process_for_rag() ════════
        LLM CALL #2 of 2. classification → Evidence chunks → NER →
        embeddable_texts. Its output is what YT-CHAIN-13's trace map anchors
        against, and what would be vectorized if anything vectorized it.
        Provider: processing/rag_prompt_pipeline.py builds its own
        `self._llm = get_fallback(...)` — same lib/llm_fallback.py chain.
        ✅ OpenRouter — correct, no OpenAI on this path.
        PREV ← YT-CHAIN-10  analyze_content()
        NEXT → YT-CHAIN-12  lib/youtube.py Phase 5 artifact writes
        ═══════════════════════════════════════════════════════════════════
        """
        pipeline = RagPromptPipeline(run_ner=run_ner)
        return pipeline.process(
            content_text,
            provenance=provenance,
            filename_hint=filename_hint,
            content_type_override=content_type_override,
            skip_ner=skip_ner,
        ).to_dict()

    def analyze_content_with_rag_pipeline(
        self,
        content_text: str,
        *,
        provenance: str = "",
        filename_hint: str = "",
        include_legacy_summary: bool = True,
        skip_ner: bool = False,
    ) -> Dict[str, Any]:
        """Legacy narrative summary + structured RAG pipeline artifact."""
        rag = self.process_for_rag(
            content_text,
            provenance=provenance,
            filename_hint=filename_hint,
            skip_ner=skip_ner,
        )
        legacy = None
        if include_legacy_summary:
            legacy = self.analyze_content(content_text)
        return {
            "legacy_analysis": legacy,
            "rag_pipeline": rag,
            "embeddable_texts": rag.get("embeddable_texts") or [],
            "status": rag.get("status"),
        }
