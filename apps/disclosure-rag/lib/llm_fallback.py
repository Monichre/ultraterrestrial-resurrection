"""Multi-provider frontier-model fallback chain for disclosure-rag enrichment.

Python counterpart to `apps/app/src/lib/ai/model-fallback.ts`. Same policy:
only current frontier models, never legacy tiers. Tiers are tried in order, a
tier is skipped when its credential is absent, and the chain moves on when a
tier errors — so one provider being down never takes enrichment down.

Two things this adds over the TS version, because this side runs *batches*
(104 podcast episodes x several prompts each) rather than one interactive
stream:

1. **Error classification.** A 401/403/404 is permanent — the tier is marked
   dead for the life of the process and skipped thereafter, so a revoked key
   costs one wasted round-trip per run instead of one per call. A 429/5xx/
   timeout is transient and gets a bounded retry with backoff.
2. **Attribution.** `complete()` returns which tier served the request, so
   callers can record truthfully whether enrichment actually happened. Silent
   degradation is how a whole ingestion run once recorded `status: ingested`
   on documents whose enrichment had 401'd.

**Gateway policy (2026-08-07).** First-party OpenAI and Anthropic tiers were
removed from this chain, not demoted. A trailing tier is still a *reachable*
tier: leaving one in place means the first time every gateway above it fails,
the run silently bills a vendor we have chosen to stop paying. Absence is the
only enforcement that survives an outage. `AllProvidersFailed` raising is the
intended behaviour when the gateways are down.

Consequence worth stating plainly: enrichment no longer has an OpenAI or
Anthropic safety net, so a total gateway outage now fails the run instead of
quietly costing money. That is the trade the policy asks for.

Note this governs *completions only*. Embeddings remain on OpenAI
`text-embedding-3-small` @ 1536 dims — 6,540 vectors are already stored in
Postgres against that model, and re-providering them does not error, it
silently returns incoherent rankings. See `lib/knowledge_base.py:127,172`.

Credential liveness verified 2026-08-07 against each provider's models
endpoint (see CHAIN comments). A 200 there proves only that the endpoint
lists models — it is not proof of credit, which is how a chain of "live"
tiers once produced 47 consecutive `enrichment_failed` episodes. Dead-keyed
tiers below the gateways are deliberately retained: they cost one attempt per
process and light up automatically once the credential is fixed.
"""

from __future__ import annotations

import json
import logging
import os
import random
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Sequence

logger = logging.getLogger(__name__)

# Status codes that mean "this tier will never work in this process".
#
# 402 earns its place empirically: on 2026-08-07 the HuggingFace router
# answered a live completion with `402 - You have depleted your monthly
# included credits`. Depleted credit does not un-deplete mid-run, but 402 was
# in neither set, so it fell through to the transient path and would have cost
# one wasted round-trip on *every* call across a 104-episode batch — precisely
# the per-call waste this module's docstring claims to have designed out.
PERMANENT_STATUS = {400, 401, 402, 403, 404}
# Status codes worth retrying on the same tier before moving on.
TRANSIENT_STATUS = {408, 409, 425, 429, 500, 502, 503, 504}

DEFAULT_TEMPERATURE = 0.1
DEFAULT_MAX_TOKENS = 1200


@dataclass(frozen=True)
class Tier:
    """One attempt in the fallback chain.

    `kind` selects the wire protocol, not the vendor: "anthropic" uses the
    Anthropic Messages API, "openai_compat" uses OpenAI's chat/completions
    shape, which DeepSeek, Together, Groq, and z.ai all serve. That keeps the
    dependency surface at two SDKs (both already installed) instead of one per
    provider.
    """

    id: str
    provider: str
    env_keys: Sequence[str]
    model: str
    kind: str = "openai_compat"
    base_url: Optional[str] = None
    max_retries: int = 0
    #: Model emits chain-of-thought before its answer, billed against the same
    #: max_tokens budget. Verified 2026-08-07: deepseek-v4-pro and Kimi-K3 both
    #: return finish_reason="length" with EMPTY content at max_tokens=16, and
    #: the correct answer at 800 — the reasoning ate the entire budget. Without
    #: a floor this looks exactly like a broken provider. (Same class of trap
    #: as Gemini's thinkingBudget in the TS chain.)
    reasoning: bool = False
    # OpenRouter Auto Router config (only for kind=openrouter_auto)
    auto_router_plugin_id: str = "auto-router"
    auto_router_cost_tier: str = "medium"
    auto_router_allowed_models: tuple = ()
    auto_router_excluded_models: tuple = ()

    def api_key(self) -> Optional[str]:
        for key in self.env_keys:
            value = os.environ.get(key)
            if value:
                return value
        return None


#: Extra budget *added* for reasoning tiers so chain-of-thought cannot starve
#: the answer.
#:
#: This was a `max(max_tokens, 2048)` floor until 2026-08-07. A floor is the
#: wrong shape: it caps CoT and answer under one ceiling, so a caller asking
#: for 1200 tokens of JSON got 2048 total and the reasoning ate the difference.
#: Observed directly when GLM-5.2 became tier 1 — a real 20k-char transcript
#: produced JSON that truncated mid-token at char 7209 and failed to parse.
#: Headroom is additive because the caller's number describes the *answer* it
#: needs; the model's thinking is a separate cost the caller cannot size.
REASONING_HEADROOM_TOKENS = 4096


# Ordering rationale: three gateways first, then direct-vendor tiers as a
# long tail. The gateways all serve **the same model** (GLM-5.2, the one entry
# on the frontier-only list that is neither OpenAI nor Anthropic), so falling
# from tier 1 to tier 3 is a change of *route*, not a change of capability —
# enrichment quality does not silently degrade as the chain descends, which is
# what a mixed-capability chain would do.
#
# All three speak OpenAI's chat/completions shape, so this needs no new SDK.
FRONTIER_FALLBACK_CHAIN: List[Tier] = [
    Tier(
        # Endpoint verified 200 on 2026-08-07. Serves `z-ai/glm-5.2`.
        # Key lives in the repo-root .env and was invisible here until it was
        # copied into apps/disclosure-rag/.env — this app calls bare
        # load_dotenv(), whose find_dotenv() stops at the first .env going up.
        id="openrouter/glm-5.2",
        provider="GLM-5.2 (OpenRouter)",
        env_keys=("OPENROUTER_API_KEY",),
        model="z-ai/glm-5.2",
        base_url="https://openrouter.ai/api/v1",
        max_retries=1,
        reasoning=True,
    ),
    Tier(
        # Endpoint verified 200 on 2026-08-07. Serves `zai-org/GLM-5.2`.
        # Credential is currently **ambient shell state only** — exported in
        # the user's profile, absent from every .env in the repo. That means
        # this tier is live for an interactive `dy` run and silently skipped
        # under cron/CI, which is exactly the kind of environment-dependent
        # behaviour that makes a fallback chain untrustworthy. Move it into
        # apps/disclosure-rag/.env to make it real everywhere.
        id="huggingface/glm-5.2",
        provider="GLM-5.2 (HuggingFace Router)",
        env_keys=("HUGGINGFACE_ACCESS_TOKEN", "HF_TOKEN", "HUGGINGFACE_API_KEY"),
        model="zai-org/GLM-5.2",
        base_url="https://router.huggingface.co/v1",
        max_retries=1,
        reasoning=True,
    ),
    Tier(
        # Endpoint verified 200 on 2026-08-07. Serves bare `glm-5.2`.
        # Same ambient-only caveat as the HuggingFace tier: exported from
        # ~/.zshrc, not present in any .env.
        id="ollama-cloud/glm-5.2",
        provider="GLM-5.2 (Ollama Cloud)",
        env_keys=("OLLAMA_API_KEY",),
        model="glm-5.2",
        base_url="https://ollama.com/v1",
        max_retries=1,
        reasoning=True,
    ),
    Tier(
        # Live 2026-08-07. First tier on a different vendor + credential.
        id="deepseek/deepseek-v4-pro",
        provider="DeepSeek V4 Pro",
        env_keys=("DEEPSEEK_API_KEY",),
        model="deepseek-v4-pro",
        base_url="https://api.deepseek.com",
        max_retries=1,
        reasoning=True,
    ),
    Tier(
        # Live 2026-08-07. Third distinct vendor.
        id="together/kimi-k3",
        provider="Kimi K3 (Together)",
        env_keys=("TOGETHERAI_API_KEY", "TOGETHER_API_KEY"),
        model="moonshotai/Kimi-K3",
        base_url="https://api.together.xyz/v1",
        max_retries=1,
        reasoning=True,
    ),
    Tier(
        # Key returned 401 on 2026-08-07. Retained: costs one attempt per
        # process, activates when fixed. `openai/gpt-oss-120b` is an
        # open-weight model served by Groq — it uses a Groq credential and
        # bills Groq, so it is not OpenAI API usage despite the model name.
        id="groq/gpt-oss-120b",
        provider="GPT-OSS 120B (Groq)",
        env_keys=("GROQ_API_KEY",),
        model="openai/gpt-oss-120b",
        base_url="https://api.groq.com/openai/v1",
    ),
    Tier(
        # No ZHIPU_API_KEY/GLM_API_KEY in this app's env — skipped for free,
        # present so parity with the TS chain is explicit rather than an
        # oversight.
        id="zhipu/glm-5.2",
        provider="GLM-5.2",
        env_keys=("ZHIPU_API_KEY", "GLM_API_KEY"),
        model="glm-5.2",
        base_url="https://api.z.ai/api/paas/v4",
    ),
]


@dataclass
class LLMResult:
    """A completion plus the provenance needed to record it honestly."""

    text: str
    tier_id: str
    provider: str
    attempts: int
    degraded: bool  # served by something other than the first enabled tier
    #: True only when a schema was requested AND the serving tier honoured it.
    #:
    #: Deliberately not folded into `degraded`, which already means "a tier
    #: other than the first served this". Those are different degradations with
    #: different fixes — one is a routing fact, the other says the JSON came
    #: back on the model's good behaviour rather than under enforcement — and a
    #: caller that cannot tell them apart cannot act on either.
    schema_enforced: bool = False


class AllProvidersFailed(RuntimeError):
    """Every enabled tier failed. Carries the per-tier reasons."""

    def __init__(self, failures: Dict[str, str]):
        self.failures = failures
        detail = "; ".join(f"{tier}: {err}" for tier, err in failures.items()) or "no tiers enabled"
        super().__init__(f"All LLM providers failed ({detail})")


class BudgetExhausted(RuntimeError):
    """max_tokens ran out before the model emitted an answer."""


class SchemaUnsupported(RuntimeError):
    """The tier rejected the structured-output request itself.

    Distinct from a failed *call*: the tier is healthy and its credential is
    good, it just does not implement `response_format: json_schema` (or the
    forced-tool equivalent). Treating this as a tier failure would walk the
    whole chain looking for a capability the next tier may not have either,
    when retrying this same tier unconstrained is both cheaper and likelier to
    work — a schema-less answer that parses beats no answer at all.
    """


#: Markers in a 400 body that mean "I don't implement structured output",
#: as opposed to "your request was bad". Gateways word this differently:
#: OpenRouter says the provider doesn't support response_format, others name
#: the field directly.
_SCHEMA_REJECTION_MARKERS = (
    "response_format",
    "json_schema",
    "structured output",
    "does not support",
    "unsupported parameter",
    "tool_choice",
)


def _is_schema_rejection(exc: Exception) -> bool:
    """True when a 4xx names structured output as the thing it refused.

    Deliberately narrow: it must be a client error AND mention the feature.
    A generic 400 stays a generic 400, so a genuinely malformed request is not
    silently retried as though the schema were at fault.
    """
    status = _status_of(exc)
    if status is not None and not (400 <= status < 500):
        return False
    body = str(exc).lower()
    return any(marker in body for marker in _SCHEMA_REJECTION_MARKERS)


#: 400 is ambiguous: "credit balance too low" / "quota exceeded" kills the tier
#: for the whole run, but a malformed or oversized single request does not.
#: Marking every 400 permanent would let one bad document disable a working
#: provider for the remaining 100+ episodes.
_ACCOUNT_LEVEL_400 = ("credit balance", "billing", "quota", "insufficient", "payment", "plans & billing")


def _is_account_level(exc: Exception) -> bool:
    return any(marker in str(exc).lower() for marker in _ACCOUNT_LEVEL_400)


def _status_of(exc: Exception) -> Optional[int]:
    """Best-effort HTTP status from an SDK exception.

    Both the openai and anthropic SDKs raise APIStatusError subclasses
    carrying `.status_code`; httpx errors carry `.response.status_code`.
    """
    status = getattr(exc, "status_code", None)
    if isinstance(status, int):
        return status
    response = getattr(exc, "response", None)
    status = getattr(response, "status_code", None)
    return status if isinstance(status, int) else None


def _is_permanent(exc: Exception) -> bool:
    if isinstance(exc, BudgetExhausted):
        return False  # request-level, and retried with a raised ceiling
    status = _status_of(exc)
    if status == 400:
        return _is_account_level(exc)
    if status is not None:
        return status in PERMANENT_STATUS
    # No status: an import failure or client-construction error is permanent;
    # a network blip is not.
    return isinstance(exc, (ImportError, ModuleNotFoundError))


def _is_transient(exc: Exception) -> bool:
    status = _status_of(exc)
    if status is not None:
        return status in TRANSIENT_STATUS
    return not isinstance(exc, (ImportError, ModuleNotFoundError))


class LLMFallback:
    """Ordered frontier chain with per-tier retry and dead-tier caching.

    When a `task_id` is passed to `complete()`, the router determines tier
    order from `llm_routing.yaml` and caches schema capabilities per-tier.
    Without a `task_id`, falls back to the legacy hardcoded chain.
    """

    def __init__(
        self,
        tiers: Optional[Sequence[Tier]] = None,
        *,
        prefer_provider: Optional[str] = None,
        backoff_base: float = 0.75,
    ):
        chain = list(tiers if tiers is not None else FRONTIER_FALLBACK_CHAIN)
        prefer = (prefer_provider or os.getenv("RAG_PIPELINE_PROVIDER") or "").lower().strip()
        if prefer:
            # Stable partition: preferred vendor's tiers first, order preserved.
            chain.sort(key=lambda t: 0 if prefer in t.id.lower() else 1)
        self.tiers = chain
        self.backoff_base = backoff_base
        self._dead: Dict[str, str] = {}
        self._clients: Dict[str, Any] = {}

        # Router integration — lazy-loaded to avoid circular imports at module level
        self._router = None

    def _get_router(self):
        """Lazy-load the router singleton."""
        if self._router is None:
            try:
                from lib.llm_router import get_router
                self._router = get_router()
            except Exception as e:
                logger.debug("Router not available, using legacy chain: %s", e)
        return self._router

    # -- introspection ----------------------------------------------------

    def enabled_tiers(self) -> List[Tier]:
        """Tiers with a credential present and not yet proven dead."""
        return [t for t in self.tiers if t.api_key() and t.id not in self._dead]

    def describe(self) -> str:
        enabled = self.enabled_tiers()
        if not enabled:
            return "no enabled tiers"
        return " -> ".join(t.id for t in enabled)

    # -- clients ----------------------------------------------------------

    def _client(self, tier: Tier):
        if tier.id in self._clients:
            return self._clients[tier.id]
        key = tier.api_key()
        if tier.kind == "anthropic":
            from anthropic import Anthropic

            client = Anthropic(api_key=key)
        elif tier.kind == "google":
            # Google Generative AI API — we use the google-genai SDK which
            # provides a unified client. Fall back to raw httpx if the SDK
            # is not installed.
            try:
                from google import genai
                client = genai.Client(api_key=key)
            except ImportError:
                client = {"_raw": True, "key": key}
        else:
            from openai import OpenAI

            client = OpenAI(api_key=key, base_url=tier.base_url) if tier.base_url else OpenAI(api_key=key)
        self._clients[tier.id] = client
        return client

    def _call_google(
        self,
        client: Any,
        tier: Tier,
        system_prompt: str,
        user_content: str,
        temperature: float,
        max_tokens: int,
        schema: Optional[Dict[str, Any]] = None,
        schema_name: str = "response",
        strict: bool = False,
    ) -> str:
        """Call Google Generative AI API (gemini models).

        Uses the google-genai SDK when available, falls back to raw httpx.
        Structured output via response_schema (JSON mode).
        """
        # If the SDK wasn't available, client is a dict with the key — use httpx
        if isinstance(client, dict) and client.get("_raw"):
            return self._call_google_raw(
                client["key"], tier, system_prompt, user_content,
                temperature, max_tokens, schema, schema_name, strict,
            )

        from google.genai import types

        config_kwargs: Dict[str, Any] = {
            "temperature": temperature,
            "max_output_tokens": max_tokens,
        }
        if schema is not None:
            config_kwargs["response_mime_type"] = "application/json"
            config_kwargs["response_schema"] = schema

        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            **config_kwargs,
        )

        try:
            response = client.models.generate_content(
                model=tier.model,
                contents=user_content,
                config=config,
            )
        except Exception as exc:
            # Check for schema rejection
            exc_str = str(exc).lower()
            if schema is not None and any(s in exc_str for s in ["schema", "response_format", "json", "unsupported"]):
                raise SchemaUnsupported(f"{tier.id}: {exc}") from exc
            raise

        text = response.text or ""
        if not text.strip():
            # Check for budget exhaustion
            finish = getattr(response, "finish_reason", None)
            if finish and "length" in str(finish).lower():
                raise BudgetExhausted(
                    f"{tier.id}: max_tokens={max_tokens} consumed before any answer"
                )
        return text

    def _call_google_raw(
        self,
        api_key: str,
        tier: Tier,
        system_prompt: str,
        user_content: str,
        temperature: float,
        max_tokens: int,
        schema: Optional[Dict[str, Any]] = None,
        schema_name: str = "response",
        strict: bool = False,
    ) -> str:
        """Raw httpx fallback for Google API when SDK is not installed."""
        import httpx

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{tier.model}:generateContent?key={api_key}"
        body: Dict[str, Any] = {
            "contents": [{"parts": [{"text": user_content}]}],
            "systemInstruction": {"parts": [{"text": system_prompt}]},
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens,
            },
        }
        if schema is not None:
            body["generationConfig"]["responseMimeType"] = "application/json"
            body["generationConfig"]["responseSchema"] = schema

        resp = httpx.post(url, json=body, headers={"Content-Type": "application/json"}, timeout=120)
        if resp.status_code >= 400:
            exc_str = resp.text.lower()
            if schema is not None and any(s in exc_str for s in ["schema", "response_format", "json", "unsupported"]):
                raise SchemaUnsupported(f"{tier.id}: HTTP {resp.status_code}: {resp.text[:200]}")
            raise RuntimeError(f"{tier.id}: HTTP {resp.status_code}: {resp.text[:200]}")

        data = resp.json()
        candidates = data.get("candidates", [])
        if not candidates:
            return ""
        parts = candidates[0].get("content", {}).get("parts", [])
        text = "".join(p.get("text", "") for p in parts)
        return text

    def _call_openrouter_auto(
        self,
        client: Any,
        tier: Tier,
        system_prompt: str,
        user_content: str,
        temperature: float,
        max_tokens: int,
        schema: Optional[Dict[str, Any]] = None,
        schema_name: str = "response",
        strict: bool = False,
    ) -> str:
        """Call OpenRouter Auto Router.

        Uses the OpenAI-compatible endpoint with the auto-router plugin.
        OpenRouter classifies the prompt and selects the best model based
        on trailing 7-day community spend share for the task type.

        The response includes a `model` field showing which model was
        actually selected — we log it for discovery/benchmarking.
        """
        request: Dict[str, Any] = dict(
            model=tier.model,  # "openrouter/auto" or "openrouter/auto-beta"
            temperature=temperature,
            max_tokens=max_tokens,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
        )
        if schema is not None:
            request["response_format"] = {
                "type": "json_schema",
                "json_schema": {
                    "name": schema_name,
                    "strict": strict,
                    "schema": schema,
                },
            }
        # Auto Router plugin config
        plugin: Dict[str, Any] = {"id": tier.auto_router_plugin_id}
        if tier.auto_router_cost_tier:
            plugin["cost_tier"] = tier.auto_router_cost_tier
        if tier.auto_router_allowed_models:
            plugin["allowed_models"] = list(tier.auto_router_allowed_models)
        if tier.auto_router_excluded_models:
            plugin["excluded_models"] = list(tier.auto_router_excluded_models)
        request["plugins"] = [plugin]
        try:
            response = client.chat.completions.create(**request)
        except Exception as exc:
            if schema is not None and _is_schema_rejection(exc):
                raise SchemaUnsupported(f"{tier.id}: {exc}") from exc
            raise
        choice = response.choices[0]
        text = choice.message.content or ""
        # Log which model the Auto Router actually selected (discovery signal)
        selected_model = getattr(response, "model", None)
        if selected_model:
            logger.info(
                "Auto Router %s selected model: %s (cost_tier=%s)",
                tier.id, selected_model, tier.auto_router_cost_tier,
            )
        if not text.strip() and choice.finish_reason == "length":
            raise BudgetExhausted(
                f"{tier.id}: max_tokens={max_tokens} consumed before any answer"
            )
        return text

    def _call_provider(
        self,
        tier: Tier,
        system_prompt: str,
        user_content: str,
        temperature: float,
        max_tokens: int,
        schema: Optional[Dict[str, Any]] = None,
        schema_name: str = "response",
        strict: bool = False,
    ) -> str:
        client = self._client(tier)
        if tier.kind == "google":
            return self._call_google(
                client, tier, system_prompt, user_content,
                temperature, max_tokens, schema, schema_name, strict,
            )
        if tier.kind == "openrouter_auto":
            return self._call_openrouter_auto(
                client, tier, system_prompt, user_content,
                temperature, max_tokens, schema, schema_name, strict,
            )
        if tier.kind == "anthropic":
            kwargs: Dict[str, Any] = {}
            if schema is not None:
                # Anthropic has no response_format; a forced tool call is the
                # equivalent guarantee — the model must emit arguments matching
                # the schema, and we read them back as the JSON body.
                kwargs["tools"] = [{
                    "name": schema_name,
                    "description": "Return the result in this exact structure.",
                    "input_schema": schema,
                }]
                kwargs["tool_choice"] = {"type": "tool", "name": schema_name}
            message = client.messages.create(
                model=tier.model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=[{"role": "user", "content": user_content}],
                **kwargs,
            )
            if schema is not None:
                for block in message.content:
                    if getattr(block, "type", "") == "tool_use":
                        return json.dumps(block.input)
                raise SchemaUnsupported(
                    f"{tier.id}: forced tool call returned no tool_use block")
            return "".join(block.text for block in message.content if getattr(block, "type", "") == "text")

        request: Dict[str, Any] = dict(
            model=tier.model,
            temperature=temperature,
            max_tokens=max_tokens,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content},
            ],
        )
        if schema is not None:
            # OpenAI-compatible structured output. Every tier in the chain is
            # reached through an OpenAI-shaped endpoint (OpenRouter, DeepSeek,
            # Together, Groq, Ollama), so one request shape covers all of them.
            #
            # `strict` is opt-in per call site, not hardcoded. Strict mode is a
            # *narrower* JSON Schema dialect — every object needs
            # `additionalProperties: false` and every property must appear in
            # `required` — and a provider that validates the dialect rejects a
            # schema that does not comply. Hardcoding it here would mean one
            # unhardened schema anywhere could 400 every call through this
            # chain. Turn it on per schema, once that schema is known clean.
            #
            # Measured 2026-08-10: OpenRouter -> z-ai/glm-5.2 accepts strict
            # and enforces the field names, but does NOT validate the strict
            # dialect (entity.schema.json, which violates it in 10 places, was
            # accepted at strict: true). So strict is not self-enforcing here —
            # a schema being accepted by tier 1 is not evidence it is clean.
            request["response_format"] = {
                "type": "json_schema",
                "json_schema": {
                    "name": schema_name,
                    "strict": strict,
                    "schema": schema,
                },
            }
        try:
            response = client.chat.completions.create(**request)
        except Exception as exc:
            # A gateway that does not implement json_schema rejects the request
            # outright (400). That is a capability gap, not a dead provider —
            # raise it distinctly so complete() can retry unconstrained here
            # instead of burning the tier and falling down the whole chain.
            if schema is not None and _is_schema_rejection(exc):
                raise SchemaUnsupported(f"{tier.id}: {exc}") from exc
            raise
        choice = response.choices[0]
        text = choice.message.content or ""
        # A reasoning model that ran out of budget returns empty content with
        # finish_reason="length" — the answer never got written. Name that
        # precisely instead of letting it surface as "provider returned empty
        # text", which reads like a dead provider and sends you debugging the
        # wrong thing.
        if not text.strip() and choice.finish_reason == "length":
            raise BudgetExhausted(
                f"{tier.id}: max_tokens={max_tokens} consumed before any answer "
                f"was emitted (reasoning={tier.reasoning}); raise max_tokens"
            )
        return text

    # -- public API -------------------------------------------------------

    def complete(
        self,
        system_prompt: str,
        user_content: str,
        *,
        temperature: float = DEFAULT_TEMPERATURE,
        max_tokens: int = DEFAULT_MAX_TOKENS,
        schema: Optional[Dict[str, Any]] = None,
        schema_name: str = "response",
        strict: bool = False,
        task_id: Optional[str] = None,
    ) -> LLMResult:
        """Run the chain, returning the first success and its provenance.

        When `task_id` is given, the router determines tier order from
        ``llm_routing.yaml`` and caches schema capabilities per-tier. Without
        it, the legacy hardcoded chain is used.

        When `schema` is given, the provider is required to emit JSON matching
        it rather than merely asked to in prose. This is what separates a
        parseable answer from a hopeful one: the pipeline previously pasted the
        schema into the system prompt as text and called json.loads on whatever
        came back, so a single malformed comma at char 8455 silently produced
        zero chunks, zero NER, and zero embeddable texts while the run still
        reported success.

        `strict` narrows the schema dialect (see _invoke). Pass it only for a
        schema audited against strict's rules; an unaudited schema under strict
        is how you 400 a healthy tier.

        A tier that cannot honour the schema is not a failed tier — see
        SchemaUnsupported. Raises AllProvidersFailed only when every enabled
        tier is exhausted.
        """
        failures: Dict[str, str] = {}
        attempts = 0
        first_enabled = None

        # When task_id is given, use the router to determine tier order.
        # The router filters dead tiers (persisted to disk) and orders by
        # the task's preferred → fallback → last-resort chain.
        router = self._get_router() if task_id else None
        if router and task_id:
            routed = router.get_ordered_tiers_for_task(task_id)
            # Convert TierConfig objects to the legacy Tier shape that
            # _call_provider expects. We build ad-hoc Tier instances so
            # the rest of the loop is unchanged.
            chain = [
                Tier(
                    id=t.id,
                    provider=t.provider,
                    env_keys=t.env_keys,
                    model=t.model,
                    kind=t.kind,
                    base_url=t.base_url,
                    max_retries=t.max_retries,
                    reasoning=t.reasoning,
                    auto_router_plugin_id=t.auto_router_plugin_id,
                    auto_router_cost_tier=t.auto_router_cost_tier,
                    auto_router_allowed_models=t.auto_router_allowed_models,
                    auto_router_excluded_models=t.auto_router_excluded_models,
                )
                for t in routed
            ]
            # Use per-task reasoning headroom from config if available
            tier_configs = {t.id: t for t in routed}
        else:
            chain = self.tiers
            tier_configs = {}

        for tier in chain:
            if not tier.api_key():
                continue  # credential absent — free skip, not a failure
            if first_enabled is None:
                first_enabled = tier.id
            if tier.id in self._dead:
                failures.setdefault(tier.id, f"skipped ({self._dead[tier.id]})")
                continue

            # Reasoning tiers bill chain-of-thought against max_tokens, so a
            # budget sized for a non-reasoning model yields a truncated or
            # empty answer. Add headroom rather than raising a floor: the
            # caller's number sizes the answer, not the model's thinking.
            tier_max_tokens = (
                max_tokens + REASONING_HEADROOM_TOKENS if tier.reasoning else max_tokens
            )

            for attempt in range(1, tier.max_retries + 2):
                attempts += 1
                try:
                    # Check if this tier is known to not support structured
                    # output (from config or cached rejection). If so, skip
                    # the schema attempt entirely — no wasted round trip.
                    send_schema = schema
                    if send_schema is not None and router:
                        if not router.should_send_schema(tier.id, task_id or "", send_schema):
                            send_schema = None
                    try:
                        text = self._call_provider(
                            tier, system_prompt, user_content, temperature, tier_max_tokens,
                            schema=send_schema, schema_name=schema_name, strict=strict,
                        )
                        enforced = send_schema is not None
                        # Cache successful schema enforcement
                        if send_schema is not None and router:
                            router.set_tier_schema_capability(tier.id, True)
                    except SchemaUnsupported as exc:
                        # The tier is healthy and its credential is good — it
                        # just does not implement structured output. Retry it
                        # unconstrained rather than descending: the next tier
                        # may not implement it either, and a schema-less answer
                        # that parses beats no answer. Caught here, ahead of the
                        # generic handler below, because _is_permanent says
                        # False and _is_transient says True for this exception —
                        # so falling through would retry the same tier with the
                        # same schema and then burn the rest of the chain.
                        #
                        # Cache the capability so we skip the schema attempt
                        # on every subsequent call to this tier.
                        if router:
                            router.set_tier_schema_capability(tier.id, False)
                        logger.warning(
                            "LLM tier %s does not support structured output (%s) — "
                            "retrying unconstrained on the same tier", tier.id, exc,
                        )
                        attempts += 1
                        text = self._call_provider(
                            tier, system_prompt, user_content, temperature, tier_max_tokens,
                        )
                        enforced = False
                    if not text.strip():
                        raise RuntimeError("provider returned empty text")
                    if tier.id != first_enabled:
                        logger.info("LLM fallback: served by %s (degraded from %s)", tier.id, first_enabled)
                    return LLMResult(
                        text=text,
                        tier_id=tier.id,
                        provider=tier.provider,
                        attempts=attempts,
                        degraded=tier.id != first_enabled,
                        schema_enforced=enforced,
                    )
                except Exception as exc:  # noqa: BLE001 - classified below
                    reason = f"{type(exc).__name__}: {exc}"
                    failures[tier.id] = reason
                    if _is_permanent(exc):
                        status = _status_of(exc)
                        self._dead[tier.id] = f"HTTP {status}" if status else type(exc).__name__
                        # Persist to disk via router so new invocations skip this tier
                        if router:
                            router.mark_tier_dead(tier.id, self._dead[tier.id])
                        logger.warning(
                            "LLM tier %s permanently unavailable (%s) — skipping for the rest of this run",
                            tier.id, self._dead[tier.id],
                        )
                        break
                    last_attempt = attempt >= tier.max_retries + 1
                    if isinstance(exc, BudgetExhausted) and not last_attempt:
                        tier_max_tokens *= 2
                        logger.warning(
                            "LLM tier %s exhausted its token budget — retrying at max_tokens=%d",
                            tier.id, tier_max_tokens,
                        )
                        continue
                    if last_attempt or not _is_transient(exc):
                        logger.warning("LLM tier %s failed (%s) — trying next tier", tier.id, reason)
                        break
                    delay = self.backoff_base * (2 ** (attempt - 1)) * (1 + random.random() * 0.25)
                    logger.warning(
                        "LLM tier %s attempt %d failed (%s) — retrying in %.1fs",
                        tier.id, attempt, reason, delay,
                    )
                    time.sleep(delay)

        raise AllProvidersFailed(failures)


_SHARED: Optional[LLMFallback] = None


def get_fallback(prefer_provider: Optional[str] = None) -> LLMFallback:
    """Process-wide chain, so the dead-tier cache is shared across callers."""
    global _SHARED
    if _SHARED is None:
        _SHARED = LLMFallback(prefer_provider=prefer_provider)
    return _SHARED
