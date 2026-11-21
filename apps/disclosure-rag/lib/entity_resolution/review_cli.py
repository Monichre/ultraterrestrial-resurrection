"""`dy review` — decide needs_review mentions in the terminal, one at a time.

Each decision commits immediately, so `q` (or Ctrl-C) never loses work.
"""

from __future__ import annotations

from rich.console import Console
from rich.prompt import Prompt
from rich.table import Table

from . import store

console = Console()


def _next_mention(conn, table: str | None):
    sql = """
        SELECT d.id, d.entity_type, d.entity_name, d.resolved_table, d.context,
               d.chunk_index, d.metadata, doc.title
        FROM document_entities d LEFT JOIN documents doc ON doc.id = d.document
        WHERE d.status = 'needs_review'
    """
    params: list = []
    if table:
        sql += " AND d.resolved_table = %s"
        params.append(table)
    sql += " ORDER BY d.resolved_table, d.entity_name_normalized, d.id LIMIT 1"
    return conn.execute(sql, params).fetchone()


def _open_count(conn, table: str | None) -> int:
    sql = "SELECT count(*) FROM document_entities WHERE status='needs_review'"
    params: list = []
    if table:
        sql += " AND resolved_table = %s"
        params.append(table)
    return conn.execute(sql, params).fetchone()[0]


def run_review(conn, run_id: str, table: str | None = None) -> dict[str, int]:
    """conn must be autocommit=False; each decision is committed on its own."""
    stats = {"matched": 0, "new": 0, "skipped": 0, "cascaded": 0}
    while True:
        row = _next_mention(conn, table)
        if row is None:
            console.print("[green]Review queue empty.[/green]")
            break
        mention_id, etype, name, rtable, quote, chunk_index, meta, title = row
        meta = meta or {}
        # Recompute: aliases added earlier in this session may change the ranking.
        candidates = store.find_candidates(conn, rtable, name) if rtable else []
        remaining = _open_count(conn, table)

        console.rule(f"[bold]{remaining} left[/bold] · {etype} → {rtable}")
        console.print(f"[bold cyan]\"{name}\"[/bold cyan]")
        source = title or meta.get("kb_path") or "?"
        console.print(f"[dim]{source} · chunk {chunk_index}[/dim]")
        if quote:
            console.print(f"  “{quote[:400]}”")
        if meta.get("ner_aliases"):
            console.print(f"[dim]NER aliases: {', '.join(meta['ner_aliases'])}[/dim]")

        grid = Table(show_header=True, header_style="bold")
        grid.add_column("#")
        grid.add_column("candidate")
        grid.add_column("score", justify="right")
        grid.add_column("id", style="dim")
        for i, c in enumerate(candidates, 1):
            grid.add_row(str(i), c["label"], f"{c['score']:.2f}", c["entity_id"])
        if candidates:
            console.print(grid)
        else:
            console.print("[yellow]No candidates.[/yellow]")

        choices = [str(i) for i in range(1, len(candidates) + 1)] + ["n", "s", "q"]
        answer = Prompt.ask("match # · n new · s skip · q quit", choices=choices)
        if answer == "q":
            break
        if answer == "n":
            marked = store.decide_new(conn, mention_id, run_id)
            stats["new"] += 1
            stats["cascaded"] += max(marked - 1, 0)
        elif answer == "s":
            store.decide_skip(conn, mention_id, run_id)
            stats["skipped"] += 1
        else:
            chosen = candidates[int(answer) - 1]
            stats["cascaded"] += store.decide_match(conn, mention_id, chosen["entity_id"], run_id)
            stats["matched"] += 1
        conn.commit()
    return stats
