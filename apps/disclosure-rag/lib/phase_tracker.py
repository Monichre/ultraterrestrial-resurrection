#!/usr/bin/env python3
"""Live phase tracker for the dy pipeline — streams call-chain phases to the terminal.

Wired into main.py's process_url / process_file orchestrators. Each major pipeline
phase gets a live indicator with chain marker, elapsed time, and data-quality stats.
Uses `rich` for styled terminal output when available; falls back to ANSI codes.

API (module-level singleton `tracker`):

    with tracker.phase("Downloading transcript", chain="YT-CHAIN-09", icon="📝"):
        result = fetch_transcript(url)
        tracker.stat("segments", "2,030")
        tracker.stat("duration", "26:31")

    tracker.render_stage_report(stages)   # rich Table or ANSI list
"""

from __future__ import annotations

import contextlib
import sys
import time
from typing import Any, Dict, List, Optional

_RICH_AVAILABLE = False
try:
    from rich.console import Console  # noqa: F401
    from rich.live import Live
    from rich.panel import Panel
    from rich.spinner import Spinner
    from rich.table import Table
    from rich.text import Text

    _RICH_AVAILABLE = True
except ImportError:
    pass

# ── ANSI fallback (when rich is not installed) ──────────────────────────

_RESET = "\033[0m"
_DIM = "\033[2m"
_BOLD = "\033[1m"
_GREEN = "\033[32m"
_RED = "\033[31m"
_YELLOW = "\033[33m"
_CYAN = "\033[36m"
_MAGENTA = "\033[35m"

_SPINNER_CHARS = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"

_STAGE_ICONS = {"success": "✅", "skipped": "⚠️", "failed": "❌", "unknown": "❔"}


class PhaseTracker:
    """Live terminal tracker for pipeline phases.  Singleton — import `tracker`."""

    def __init__(self) -> None:
        self._phases: List[Dict[str, Any]] = []  # completed phases for the final report
        self._current: Optional[Dict[str, Any]] = None
        self._phase_start: float = 0.0
        self._console = Console() if _RICH_AVAILABLE else None  # type: ignore[no-untyped-call]
        self._quiet = not sys.stdout.isatty()

    # ── public API ──────────────────────────────────────────────────────

    @contextlib.contextmanager
    def phase(self, name: str, *, chain: str = "", icon: str = "🔧"):
        """Context manager for a pipeline phase. Prints the phase header on enter,
        the completion line on exit.  Attach stats via `tracker.stat(key, value)`."""
        self._current = {"name": name, "chain": chain, "icon": icon, "stats": {}}
        self._phase_start = time.monotonic()
        self._print_phase_enter(name, chain, icon)
        try:
            yield
            self._current["status"] = "success"
        except Exception:
            self._current["status"] = "failed"
            raise
        finally:
            elapsed = time.monotonic() - self._phase_start
            self._current["elapsed"] = elapsed
            self._phases.append(self._current)
            self._print_phase_exit(self._current)
            self._current = None

    def stat(self, key: str, value: str) -> None:
        """Attach a data-quality stat to the current phase."""
        if self._current is not None:
            self._current["stats"][key] = value

    def render_stage_report(self, stages: List[Dict[str, str]]) -> None:
        """Print the final pipeline stage report — rich Table or ANSI list."""
        if not stages:
            return
        if _RICH_AVAILABLE and self._console is not None:
            self._render_stage_report_rich(stages)
        else:
            self._render_stage_report_ansi(stages)

    # ── internal ────────────────────────────────────────────────────────

    def _print_phase_enter(self, name: str, chain: str, icon: str) -> None:
        if self._quiet:
            return
        if _RICH_AVAILABLE and self._console is not None:
            subtitle = f"[dim]{chain}[/dim]" if chain else ""
            self._console.print(
                Panel(f"  {icon}  [bold]{name}[/bold]", subtitle=subtitle,
                      border_style="cyan", padding=(0, 1)))
        else:
            print(f"\n{icon} {_BOLD}{name}{_RESET}")
            if chain:
                print(f"   {_DIM}{chain}{_RESET}")

    def _print_phase_exit(self, phase: Dict[str, Any]) -> None:
        if self._quiet:
            return
        status = phase.get("status", "unknown")
        elapsed = phase.get("elapsed", 0)
        stats = phase.get("stats", {})

        if _RICH_AVAILABLE and self._console is not None:
            icon = {"success": "[green]✓[/green]",
                    "failed": "[red]✗[/red]"}.get(status, "?")
            time_str = f"[dim]{elapsed:.1f}s[/dim]"
            stat_bits = " · ".join(
                f"[cyan]{k}[/cyan] [dim]{v}[/dim]" for k, v in stats.items())
            line = f"  {icon}  {time_str}"
            if stat_bits:
                line += f"  {stat_bits}"
            self._console.print(line)
        else:
            icon = _STAGE_ICONS.get(status, "❔")
            time_str = f"{_DIM}{elapsed:.1f}s{_RESET}"
            stat_bits = " · ".join(
                f"{_CYAN}{k}{_RESET} {_DIM}{v}{_RESET}" for k, v in stats.items())
            line = f"   {icon} {time_str}"
            if stat_bits:
                line += f"  {stat_bits}"
            print(line)

    def _render_stage_report_rich(self, stages: List[Dict[str, str]]) -> None:
        assert self._console is not None
        table = Table(title="Pipeline stages", border_style="dim cyan",
                      title_style="bold")
        table.add_column("", style="", width=2)
        table.add_column("Stage", style="")
        table.add_column("Detail", style="dim")

        for stage in stages:
            status = stage.get("status", "")
            icon = _STAGE_ICONS.get(status, "❔")
            name = stage.get("name", "unknown")
            detail = stage.get("detail", "")
            table.add_row(icon, name, detail)

        self._console.print()
        self._console.print(table)

    def _render_stage_report_ansi(self, stages: List[Dict[str, str]]) -> None:
        print(f"\n📋 {_BOLD}Pipeline stages:{_RESET}")
        for stage in stages:
            status = stage.get("status", "")
            icon = _STAGE_ICONS.get(status, "❔")
            name = stage.get("name", "unknown")
            detail = stage.get("detail", "")
            line = f"   {icon} {name}"
            if detail:
                line += f"  {_DIM}{detail}{_RESET}"
            print(line)


# ── module-level singleton ─────────────────────────────────────────────

tracker = PhaseTracker()
