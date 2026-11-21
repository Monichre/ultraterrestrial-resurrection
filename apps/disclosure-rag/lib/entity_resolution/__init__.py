"""Staged entity resolution: NER mentions -> reviewed links to Neon entity rows.

Schema: packages/db/migrations/003_entity_resolution.sql (entity_aliases +
document_entities as the mention queue). Stages, each resumable:

    load     pending mentions from *_rag_pipeline.json          (mentions.py)
    resolve  exact alias hit -> matched, else needs_review      (store.py)
    review   operator decides needs_review in the terminal      (review_cli.py)
    apply    create entities for `new`, stamp applied_at        (store.py)

Ingest never writes entity rows. Only `apply` does, and only for decisions.
"""

from .mentions import TYPE_TO_TABLE, Mention, extract_mentions
from .store import (
    apply_decisions,
    decide_match,
    decide_new,
    decide_skip,
    find_candidates,
    load_mentions,
    resolve_pending,
)

__all__ = [
    "TYPE_TO_TABLE",
    "Mention",
    "extract_mentions",
    "apply_decisions",
    "decide_match",
    "decide_new",
    "decide_skip",
    "find_candidates",
    "load_mentions",
    "resolve_pending",
]
