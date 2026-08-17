#!/usr/bin/env python3
"""DY-BENCH — functional & output benchmark for the disclosure-rag pipeline and `dy`.

Spec: docs/plans/2026-08-08-disclosure-rag-benchmark.md

RULE 1 — assert on side effects, never on the tool's self-report. The 2026-08-01
live trace recorded a run that printed a checkmark for three stages that errored
(ingestion-hardening.md §8.1). Any check that greps stdout for success would have
scored that run green. So every check here compares observable state before/after,
and the only stdout assertions are *negative*: given a broken dependency, the run
must say so and exit non-zero.

Usage:
    .venv/bin/python scripts/benchmark_pipeline.py                 # v1 tier
    .venv/bin/python scripts/benchmark_pipeline.py --tier v2       # + live/sandbox
    .venv/bin/python scripts/benchmark_pipeline.py --json out.json
    .venv/bin/python scripts/benchmark_pipeline.py --only B2,B3

Exit code 0 only when every check in the selected tier passed. BLOCKED checks are
always printed with their reason and never silently counted as passes.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Callable, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
APP_DIR = Path(__file__).resolve().parent.parent
MAIN_SH = APP_DIR / "main.sh"
VENV_PY = APP_DIR / ".venv" / "bin" / "python"
sys.path.insert(0, str(APP_DIR))

PASS, FAIL, BLOCKED = "PASS", "FAIL", "BLOCKED"

# ANSI escape introducer, matched literally so we can detect the *un*-interpreted
# form that main.sh's heredoc emits ("\033[0;34m" as 7 printable characters).
LITERAL_ESC = r"\033["


@dataclass
class Result:
    id: str
    tier: str
    assertion: str
    status: str
    detail: str = ""
    evidence: str = ""


@dataclass
class Registry:
    results: list = field(default_factory=list)

    def record(self, r: Result) -> Result:
        self.results.append(r)
        return r


REG = Registry()
CHECKS: list[tuple[str, str, str, Callable]] = []


def check(cid: str, tier: str, assertion: str):
    """Register a check. The function returns (status, detail, evidence)."""
    def deco(fn: Callable) -> Callable:
        CHECKS.append((cid, tier, assertion, fn))
        return fn
    return deco


# ---------------------------------------------------------------- utilities

def run(cmd: list[str], env: Optional[dict] = None, timeout: int = 180,
        cwd: Optional[Path] = None) -> tuple[int, str, float]:
    """Run a command, return (exit_code, combined_output, wall_seconds)."""
    e = dict(os.environ)
    if env:
        for k, v in env.items():
            if v is None:
                e.pop(k, None)
            else:
                e[k] = v
    t0 = time.monotonic()
    try:
        p = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout,
                           env=e, cwd=str(cwd or APP_DIR))
        out = (p.stdout or "") + (p.stderr or "")
        return p.returncode, out, time.monotonic() - t0
    except subprocess.TimeoutExpired as ex:
        got = (ex.stdout or b"") if isinstance(ex.stdout, bytes) else (ex.stdout or "")
        if isinstance(got, bytes):
            got = got.decode(errors="replace")
        return 124, f"TIMEOUT after {timeout}s\n{got}", time.monotonic() - t0


def strip_ansi(s: str) -> str:
    return re.sub(r"\x1b\[[0-9;]*m", "", s)


def tree_fingerprint(root: Path) -> str:
    """sha256 over (relpath, size, mtime_ns) for every file under root.

    Cheaper than hashing content across a ~950-file archive, and strictly more
    sensitive than a file count: it detects in-place rewrites, which is exactly
    the mutation §8.4 describes (entry overwritten, created_at reset).
    """
    if not root.exists():
        return "ABSENT"
    h = hashlib.sha256()
    for p in sorted(root.rglob("*")):
        if p.is_file():
            try:
                st = p.stat()
            except OSError:
                continue
            h.update(str(p.relative_to(root)).encode())
            h.update(str(st.st_size).encode())
            h.update(str(st.st_mtime_ns).encode())
    return h.hexdigest()


def kb_root_path() -> Path:
    from lib.kb.kb_root import kb_root
    return kb_root()


def load_index() -> dict:
    idx = kb_root_path() / "metadata" / "index.json"
    if not idx.exists():
        return {"documents": {}, "tags": {}}
    return json.loads(idx.read_text())


def main_sh_help_text() -> str:
    _, out, _ = run(["bash", str(MAIN_SH), "--help"], timeout=60)
    return out


def dispatched_subcommands() -> set[str]:
    """Subcommands main.sh's `case` block actually dispatches."""
    src = MAIN_SH.read_text()
    m = re.search(r"# Main command handling\ncase \"\$1\" in\n(.*?)\nesac", src, re.S)
    if not m:
        return set()
    names: set[str] = set()
    for line in m.group(1).splitlines():
        mm = re.match(r"\s{4}([a-z0-9|_-]+)\)\s*$", line)
        if mm:
            for n in mm.group(1).split("|"):
                if n not in ("*",):
                    names.add(n)
    return names


def advertised_subcommands(help_text: str) -> set[str]:
    """Names documented in the help text's Commands: and Options: blocks.

    Both blocks count as documentation: `--help` is dispatched by the same `case`
    arm as `help` but is legitimately described under Options, so scanning only
    Commands: would report it as undocumented.
    """
    body = strip_ansi(help_text).replace(LITERAL_ESC + "0;32m", "").replace(LITERAL_ESC + "0m", "")
    names: set[str] = set()
    for header in ("Commands:", "Options:"):
        m = re.search(re.escape(header) + r"\s*\n(.*?)(?:\n\s*\n|\Z)", body, re.S)
        if not m:
            continue
        for line in m.group(1).splitlines():
            mm = re.match(r"\s{2}(-{0,2}[a-z0-9-]+)\s{2,}\S", line)
            if mm:
                names.add(mm.group(1))
    return names


# ============================================================ B1 — surface

@check("B1.1", "v1", "dy --help exits 0 and renders ANSI color, not literal escapes")
def b1_1():
    code, out, _ = run(["bash", str(MAIN_SH), "--help"], timeout=60)
    if code != 0:
        return FAIL, f"exit={code}", out[-300:]
    if LITERAL_ESC in out:
        n = out.count(LITERAL_ESC)
        return FAIL, f"{n} literal '\\033[' sequences in help output", \
            next(l for l in out.splitlines() if LITERAL_ESC in l)[:120]
    return PASS, "exit=0, no literal escape sequences", ""


@check("B1.2", "v1", "help text and case-block dispatch table agree")
def b1_2():
    adv, disp = advertised_subcommands(main_sh_help_text()), dispatched_subcommands()
    if not adv:
        return FAIL, "could not parse Commands: block from help", ""
    # Flags documented under Options: (--upload, --no-kb) are forwarded to main.py
    # rather than dispatched by the case block, so they are excluded from the
    # "advertised but not dispatched" direction. --help is dispatched, so it stays.
    adv_cmds = {a for a in adv if not a.startswith("-")} | (adv & disp)
    missing, undoc = sorted(adv_cmds - disp), sorted(disp - adv)
    if missing or undoc:
        return FAIL, f"advertised-but-undispatched={missing} dispatched-but-undocumented={undoc}", \
            f"advertised={sorted(adv)} dispatched={sorted(disp)}"
    return PASS, f"{len(adv)} subcommands agree", f"{sorted(adv)}"


@check("B1.3", "v1", "no subcommand exits 0 after failing")
def b1_3():
    liars = []
    for sub in ("ui", "sync-rag"):
        code, out, _ = run(["bash", str(MAIN_SH), sub], timeout=90)
        broken = ("unrecognized arguments" in out or "Traceback" in out
                  or "command not found" in out)
        if broken and code == 0:
            liars.append(f"{sub}: exit=0 despite {out.strip().splitlines()[-1][:70]!r}")
    if liars:
        return FAIL, f"{len(liars)} subcommand(s) exit 0 after failing", "; ".join(liars)
    return PASS, "no false-success subcommand", ""


@check("B1.4", "v1", "unknown command exits non-zero and prints help")
def b1_4():
    code, out, _ = run(["bash", str(MAIN_SH), "definitely-not-a-command"], timeout=60)
    if code == 0:
        return FAIL, "exit=0 for unknown command", out[-200:]
    if "Usage:" not in strip_ansi(out):
        return FAIL, f"exit={code} but no usage text", out[-200:]
    return PASS, f"exit={code}, help printed", ""


@check("B1.5", "v1", "dy stats reports counts without traceback")
def b1_5():
    code, out, _ = run(["bash", str(MAIN_SH), "stats"], timeout=180)
    if "Traceback" in out:
        return FAIL, "traceback", out[-300:]
    if code != 0:
        return FAIL, f"exit={code}", out[-300:]
    if "Total Documents:" not in out:
        return FAIL, "no document total in output", out[-300:]
    total = re.search(r"Total Documents:\s*(\d+)", out)
    return PASS, f"Total Documents: {total.group(1) if total else '?'}", ""


@check("B1.6", "v1", "dy search returns results or an explicit no-results, without errors")
def b1_6():
    # "ufo" appears in the title of many indexed docs; a corpus of 500+ UAP
    # transcripts returning zero hits for it means retrieval is broken, not empty.
    code, out, _ = run(["bash", str(MAIN_SH), "search", "ufo"], timeout=240)
    if "Traceback" in out or "KeyError" in out:
        return FAIL, "exception during search", out[-300:]
    errs = [l for l in out.splitlines() if "Metadata file not found" in l]
    if errs:
        return FAIL, f"{len(errs)} documents unreadable (get_document path resolution)", errs[0][:120]
    m = re.search(r"Found (\d+) results", out)
    if m:
        return PASS, f"{m.group(1)} results", ""
    if "No results found." in out:
        return FAIL, "zero hits for 'ufo' across a UAP corpus — retrieval is broken", out[-200:]
    return FAIL, "neither results nor a no-results message", out[-200:]


@check("B1.7", "v1", "launcher subcommands reach their target process")
def b1_7():
    bad = []
    for sub in ("ui", "sync-rag"):
        _, out, _ = run(["bash", str(MAIN_SH), sub], timeout=90)
        if "unrecognized arguments" in out:
            bad.append(f"{sub}: died on argument parsing")
    if bad:
        return FAIL, "; ".join(bad), ""
    return PASS, "launchers reach their target", ""


# ====================================================== B2 — truthfulness

def _stage_lines(out: str) -> list[str]:
    return [l for l in strip_ansi(out).splitlines()
            if ("✅" in l or "❌" in l or "⚠️" in l or "⏭️" in l)]


def all_providers_dead() -> dict:
    """Every credential the LLM chain can use, set to an invalid value.

    Derived from `FRONTIER_FALLBACK_CHAIN` rather than hand-listed, so a tier
    added later cannot silently keep these checks alive: a hardcoded list that
    misses one new provider turns "nothing can succeed" into "one thing still
    succeeds", and the check would pass for the wrong reason.

    Killing only OpenAI+Anthropic does NOT break a run — the chain falls
    through to another tier and genuinely succeeds, so reporting ✅ there is
    honest. The truthfulness property only has meaning when nothing can succeed.
    """
    from lib.llm_fallback import FRONTIER_FALLBACK_CHAIN
    dead = {}
    for tier in FRONTIER_FALLBACK_CHAIN:
        for key in tier.env_keys:
            dead[key] = "INVALID-BENCHMARK-KEY"
    # Legacy direct-SDK credentials still read outside the chain
    # (agents/entity_extraction_agent.py reads OPENAI_API_KEY itself).
    for key in ("OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GEMINI_API_KEY",
                "GOOGLE_API_KEY"):
        dead[key] = "INVALID-BENCHMARK-KEY"
    return dead


def _run_with_dead_providers():
    env = all_providers_dead()
    env["DISCLOSURE_RAG_KB_PATH"] = str(SANDBOX / "deadproviders")
    return run(["bash", str(MAIN_SH), "process-file", str(FIXTURES["short_txt"]),
                "--no-kb"], env=env, timeout=420)


@check("B2.1", "v1", "with every provider dead, stages report failure not success")
def b2_1():
    code, out, _ = _run_with_dead_providers()
    lines = _stage_lines(out)
    if not lines:
        return FAIL, "no stage report emitted at all", out[-300:]
    liar = [l for l in lines if "✅" in l and re.search(
        r"\b(401|403|invalid|incorrect api key|credit balance|failed|error)\b", l, re.I)]
    if liar:
        return FAIL, f"{len(liar)} stage(s) report ✅ while naming a failure", liar[0][:160]
    fails = [l for l in lines if "❌" in l]
    if not fails:
        return FAIL, "every stage reported success with all providers dead", \
            " | ".join(l.strip()[:60] for l in lines[:5])
    return PASS, f"{len(fails)} stage(s) correctly reported ❌", fails[0].strip()[:120]


@check("B2.2", "v1", "a run whose required stage failed exits non-zero")
def b2_2():
    code, out, _ = _run_with_dead_providers()
    failed = [l for l in _stage_lines(out) if "❌" in l]
    if failed and code == 0:
        return FAIL, f"exit=0 despite {len(failed)} failed stage(s)", failed[0].strip()[:120]
    if not failed:
        return FAIL, "no stage reported failure (see B2.1); exit code untestable", ""
    return PASS, f"exit={code} with {len(failed)} failed stage(s)", ""


@check("B2.3", "v1", "the ✅ count equals the count of stages that actually succeeded")
def b2_3():
    """Cross-checks the printed report against the machine-readable stage record.

    main.py builds `stages` as dicts carrying an explicit ok flag and prints them
    via _print_stage_report. This compares the two so a print-side bug that
    renders a failed stage as ✅ is caught structurally rather than by eye.
    """
    import importlib
    m = importlib.import_module("main")
    ok_stage = m._stage("x", True, "d")
    bad_stage = m._stage("y", False, "boom")
    skip = m._skipped("z", "n/a")
    rendered = []
    for s in (ok_stage, bad_stage, skip):
        icon = s.get("icon") or s.get("status") or ""
        rendered.append((s.get("name"), s.get("ok"), icon))
    mism = [r for r in rendered
            if (r[1] is True and "✅" not in str(r[2]))
            or (r[1] is False and "❌" not in str(r[2]))]
    if mism:
        return FAIL, f"{len(mism)} stage(s) render an icon inconsistent with their ok flag", str(mism)
    return PASS, "stage icon matches ok flag for ok/failed/skipped", str(rendered)


@check("B2.4", "v1", "no contradictory availability claims for one subsystem")
def b2_4():
    _, out, _ = run(["bash", str(MAIN_SH), "--status"], timeout=240)
    txt = strip_ansi(out)
    pos = "CocoIndex knowledge graph integration available" in txt or "Enhanced CocoIndex available" in txt
    neg = "CocoIndex not available" in txt
    if pos and neg:
        lines = [l.strip() for l in txt.splitlines() if "ocoIndex" in l]
        return FAIL, "CocoIndex reported both available and not available in one run", \
            " | ".join(l[:70] for l in lines[:3])
    return PASS, "no contradictory availability claims", ""


@check("B2.5", "v1", "--status reports ✅ only for operationally available subsystems")
def b2_5():
    _, out, _ = run(["bash", str(MAIN_SH), "--status"], timeout=240)
    txt = strip_ansi(out)
    m = re.search(r"CocoIndex KG:\s*(✅|❌)", txt)
    if not m:
        return FAIL, "--status did not report CocoIndex KG", txt[-200:]
    import importlib
    ci = importlib.import_module("lib.cocoindex_integration")
    really = bool(getattr(ci, "cocoindex_available", False))
    claimed = m.group(1) == "✅"
    if claimed and not really:
        return FAIL, "reports ✅ while `import cocoindex` fails", m.group(0)
    return PASS, f"claimed={m.group(1)} matches operational={really}", ""


# ======================================================== B3 — dry-run purity

@check("B3.1", "v1", "--dry-run leaves the archive tree byte-identical")
def b3_1():
    root = kb_root_path()
    before = tree_fingerprint(root)
    run(["bash", str(MAIN_SH), "https://www.youtube.com/watch?v=HFLBDi87888", "--dry-run"],
        timeout=300)
    after = tree_fingerprint(root)
    if before != after:
        return FAIL, "archive tree mutated by a dry run", f"{before[:16]} -> {after[:16]}"
    return PASS, f"tree fingerprint unchanged ({before[:16]}…)", ""


@check("B3.2", "v1", "--dry-run leaves index.json byte-identical")
def b3_2():
    idx = kb_root_path() / "metadata" / "index.json"
    before = hashlib.sha256(idx.read_bytes()).hexdigest() if idx.exists() else "ABSENT"
    run(["bash", str(MAIN_SH), "https://www.youtube.com/watch?v=HFLBDi87888", "--dry-run"],
        timeout=300)
    after = hashlib.sha256(idx.read_bytes()).hexdigest() if idx.exists() else "ABSENT"
    if before != after:
        return FAIL, "index.json mutated by a dry run", f"{before[:16]} -> {after[:16]}"
    return PASS, f"index.json unchanged ({before[:16]}…)", ""


@check("B3.3", "v1", "--dry-run performs zero outbound writes (no production enqueue)")
def b3_3():
    """§8.7: a local run POSTed to https://www.ultraterrestrial.app/…, HTTP 201.

    Rather than trusting the absence of a log line, this blocks egress at the
    socket layer: any connect() to a non-loopback address during the dry run
    raises, and the raised host is reported. Absence of an exception is therefore
    positive evidence, not merely missing evidence.
    """
    guard = APP_DIR / "scripts" / "_bench_egress_guard.py"
    code, out, _ = run(
        [str(VENV_PY), str(guard), "https://www.youtube.com/watch?v=HFLBDi87888", "--dry-run"],
        timeout=300)
    hits = [l for l in out.splitlines() if l.startswith("EGRESS ")]
    if hits:
        return FAIL, f"{len(hits)} outbound connection(s) during dry run", hits[0][:160]
    if "GUARD-OK" not in out:
        return BLOCKED, "egress guard did not report cleanly", out[-300:]
    return PASS, "zero non-loopback connections during dry run", ""


@check("B3.4", "v1", "playlist --dry-run is dry BEFORE the network, not after")
def b3_4():
    """Static check: the dry-run guard must precede transcript fetch.

    Measured statically because the failure mode is that a live fetch happens —
    running it to find out would perform the very network call being tested and
    risks the YouTube IP block the script's own breaker guards against.
    """
    src = (APP_DIR / "scripts" / "playlist_ingestion.py").read_text()
    lines = src.splitlines()
    def first_line(pat):
        for i, l in enumerate(lines, 1):
            if re.search(pat, l):
                return i
        return None
    guard = first_line(r"if\s+.*\bdry_run\b")
    fetch = first_line(r"(generate_transcript|YouTubeTranscriptApi|yt_dlp|fetch_transcript)")
    if guard is None:
        return FAIL, "no dry_run guard found in playlist_ingestion.py", ""
    if fetch is None:
        return PASS, f"dry_run guard at :{guard}; no direct transcript fetch in this module", ""
    if guard > fetch:
        return FAIL, f"dry_run checked at :{guard}, AFTER transcript fetch at :{fetch}", \
            lines[fetch - 1].strip()[:120]
    return PASS, f"dry_run guard at :{guard} precedes fetch at :{fetch}", ""


@check("B3.5", "v1", "--dry-run plan lists the stages a real run would attempt")
def b3_5():
    _, out, _ = run(["bash", str(MAIN_SH), "https://www.youtube.com/watch?v=HFLBDi87888",
                     "--dry-run"], timeout=300)
    txt = strip_ansi(out)
    if "DRY RUN" not in txt:
        return FAIL, "no dry-run banner", txt[-200:]
    plan = [l.strip(" •\t") for l in txt.splitlines() if l.strip().startswith("•")]
    if len(plan) < 3:
        return FAIL, f"plan has only {len(plan)} line(s)", " | ".join(plan)
    required = ("transcript", "knowledge base", "entity")
    missing = [r for r in required if not any(r in p.lower() for p in plan)]
    if missing:
        return FAIL, f"plan omits {missing}", " | ".join(p[:50] for p in plan)
    return PASS, f"{len(plan)} planned stages, all required classes present", " | ".join(
        p[:40] for p in plan[:4])


# ============================================ B4 — write location & integrity

@check("B4.3", "v1", "every index.json entry resolves to a file that exists")
def b4_3():
    from lib.kb.knowledge_base_crud import KnowledgeBaseCRUD
    kb = KnowledgeBaseCRUD()
    docs = kb.index["documents"]
    missing = []
    for did, info in docs.items():
        p = info.get("path", "")
        fp = Path(p) if os.path.isabs(p) else (kb.kb_path / p)
        if not fp.exists():
            missing.append(f"{did}:{p}")
    if missing:
        return FAIL, f"{len(missing)}/{len(docs)} entries unresolvable", missing[0][:140]
    return PASS, f"all {len(docs)} entries resolve", ""


@check("B4.3b", "v1", "every index.json entry is readable via get_document()")
def b4_3b():
    """Resolving to *a path* is not enough — the CRUD must be able to read it back.

    Separated from B4.3 because these diverge: 567/567 entries point at a
    directory that exists, while get_document() reads 0 of them.
    """
    from lib.kb.knowledge_base_crud import KnowledgeBaseCRUD
    kb = KnowledgeBaseCRUD()
    docs = kb.index["documents"]
    unreadable = [did for did in docs if kb.get_document(did) is None]
    if unreadable:
        return FAIL, f"{len(unreadable)}/{len(docs)} documents unreadable via get_document()", \
            f"e.g. {unreadable[0]} -> {docs[unreadable[0]].get('path','')[:90]}"
    return PASS, f"all {len(docs)} documents readable", ""


@check("B4.2", "v1", "index.json stores paths relative to the archive root")
def b4_2():
    docs = load_index()["documents"]
    absolute = [f"{d}:{i.get('path','')}" for d, i in docs.items()
                if os.path.isabs(i.get("path", ""))]
    if absolute:
        return FAIL, f"{len(absolute)}/{len(docs)} entries store absolute paths", absolute[0][:140]
    return PASS, f"all {len(docs)} paths relative", ""


@check("B4.4", "v1", "the archive root is overridable so tests need not touch production")
def b4_4():
    sandbox = SANDBOX / "rootcheck"
    code, out, _ = run([str(VENV_PY), "-c",
        "import sys; sys.path.insert(0,'.');"
        "from lib.kb.kb_root import kb_root, sources_root;"
        "from lib.kb.knowledge_base_crud import KnowledgeBaseCRUD;"
        "from lib.data_formatter import StandardizedDataFormatter;"
        "print('ROOT', kb_root());"
        "print('CRUD', KnowledgeBaseCRUD().kb_path);"
        "print('FMT', StandardizedDataFormatter().base_storage_dir)"],
        env={"DISCLOSURE_RAG_KB_PATH": str(sandbox)}, timeout=180)
    if code != 0:
        return FAIL, f"probe exited {code}", out[-300:]
    honored = [l for l in out.splitlines() if l.startswith(("ROOT", "CRUD", "FMT"))]
    stray = [l for l in honored if str(sandbox) not in l]
    if stray or len(honored) < 3:
        return FAIL, "not every writer honors DISCLOSURE_RAG_KB_PATH", "; ".join(stray or honored)
    return PASS, f"{len(honored)} writers honor the override", "; ".join(
        l.split()[0] for l in honored)


# ===================================================== B6 — output quality

@check("B6.1", "v1", "generated summaries are not empty stubs")
def b6_1():
    """Measures the archive's existing output, which is the pipeline's real record.

    A summary whose `=== ORIGINAL CONTENT ===` section is empty is the 195-byte
    stub of ingestion-hardening.md §8.5 — the file exists, so a file-count check
    passes, but it carries no analysis.
    """
    tdir = kb_root_path() / "sources" / "transcripts"
    if not tdir.exists():
        return BLOCKED, "no transcripts directory", str(tdir)
    summaries = sorted(tdir.rglob("*Summary.txt"),
                       key=lambda p: p.stat().st_mtime, reverse=True)[:25]
    if not summaries:
        return BLOCKED, "no summary files to measure", ""
    stubs = []
    for s in summaries:
        body = s.read_text(errors="replace")
        _, _, tail = body.partition("=== ORIGINAL CONTENT ===")
        if not tail.strip():
            stubs.append(f"{s.parent.name}/{s.name} ({s.stat().st_size}B)")
    if stubs:
        return FAIL, f"{len(stubs)}/{len(summaries)} recent summaries are empty stubs", stubs[0][:140]
    return PASS, f"all {len(summaries)} recent summaries carry analysis", ""


@check("B6.2", "v1", "the analysis path degrades to a live provider when the primary is dead")
def b6_2():
    """The primary (Anthropic) is out of credit; DeepSeek is live and configured.

    ContentAnalysisEngine must try the other configured providers rather than
    returning an empty analysis section.
    """
    code, out, _ = run([str(VENV_PY), "-c",
        "import sys; sys.path.insert(0,'.');"
        "from processing.content_analysis import ContentAnalysisEngine as E;"
        "r = E().analyze_content('Witness reported a metallic disc over Phoenix "
        "in March 1997, observed for eleven minutes by multiple observers.');"
        "print('RESULT_NONE' if r is None else 'RESULT_LEN %d' % len(r));"
        "body = (r or '').split('=== ORIGINAL CONTENT ===')[0];"
        "print('ANALYSIS_CHARS %d' % len(body.replace('=== APPLIED RESEARCH METHODOLOGY "
        "CONTENT ANALYSIS ===','').strip()))"], timeout=300)
    if code != 0:
        return FAIL, f"analyze_content raised (exit {code})", out[-300:]
    m = re.search(r"ANALYSIS_CHARS (\d+)", out)
    if not m:
        return BLOCKED, "probe produced no measurement", out[-300:]
    chars = int(m.group(1))
    if chars == 0:
        return FAIL, "analysis section empty despite a live provider (DeepSeek) configured", \
            out.strip().splitlines()[-2:][0][:140] if out.strip() else ""
    return PASS, f"{chars} chars of analysis produced via fallback", ""


@check("B6.3", "v1", "with every provider dead, the summary stage fails loudly and writes no stub")
def b6_3():
    code, out, _ = run([str(VENV_PY), "-c",
        "import sys; sys.path.insert(0,'.');"
        "from processing.content_analysis import ContentAnalysisEngine as E;"
        "r = E().analyze_content('test content for provider outage');"
        "print('RESULT_NONE' if r is None else 'RESULT_TEXT')"],
        env=all_providers_dead(), timeout=300)
    if code != 0:
        return FAIL, f"probe exited {code}", out[-300:]
    if "RESULT_NONE" not in out:
        return FAIL, "returned a summary string with every provider dead (this is the stub)", \
            out.strip()[-140:]
    return PASS, "returns None rather than an empty stub", ""


@check("B6.5", "v1", "process_for_rag emits Evidence chunks and embeddable_texts")
def b6_5():
    code, out, _ = run([str(VENV_PY), "-c",
        "import sys, json; sys.path.insert(0,'.');"
        "from processing.content_analysis import ContentAnalysisEngine as E;"
        "r = E().process_for_rag('On 13 March 1997 multiple witnesses in Phoenix, "
        "Arizona reported a V-shaped craft. The Air Force attributed it to flares.', "
        "provenance='benchmark', skip_ner=True, run_ner=False);"
        "print('KEYS', sorted(r.keys()));"
        "print('EMBEDDABLE', len(r.get('embeddable_texts') or []));"
        "print('STATUS', r.get('status'))"], timeout=300)
    if code != 0:
        return FAIL, f"process_for_rag raised (exit {code})", out[-400:]
    m = re.search(r"EMBEDDABLE (\d+)", out)
    if not m:
        return FAIL, "no embeddable_texts measurement", out[-300:]
    n = int(m.group(1))
    if n == 0:
        status = re.search(r"STATUS (.+)", out)
        return FAIL, "zero embeddable_texts produced", (status.group(1)[:140] if status else out[-140:])
    return PASS, f"{n} embeddable texts emitted", ""


# ================================================ B7 — startup & performance

@check("B7.1", "v1", "dy --help completes in < 1.0s")
def b7_1():
    _, _, secs = run(["bash", str(MAIN_SH), "--help"], timeout=60)
    if secs >= 1.0:
        return FAIL, f"{secs:.2f}s (heavy imports before argparse?)", ""
    return PASS, f"{secs:.3f}s", ""


@check("B7.2", "v1", "dy --status completes in < 20s")
def b7_2():
    code, out, secs = run(["bash", str(MAIN_SH), "--status"], timeout=180)
    if secs >= 20.0:
        return FAIL, f"{secs:.1f}s", ""
    return PASS, f"{secs:.1f}s", ""


@check("B7.3", "v1", "--dry-run on a YouTube URL completes in < 30s")
def b7_3():
    _, _, secs = run(["bash", str(MAIN_SH), "https://www.youtube.com/watch?v=HFLBDi87888",
                      "--dry-run"], timeout=300)
    if secs >= 30.0:
        return FAIL, f"{secs:.1f}s", ""
    return PASS, f"{secs:.1f}s", ""


# ==================================================== B8 — determinism

@check("B8.1", "v1", "two consecutive dry runs produce identical plans")
def b8_1():
    plans = []
    for _ in range(2):
        _, out, _ = run(["bash", str(MAIN_SH), "https://www.youtube.com/watch?v=HFLBDi87888",
                         "--dry-run"], timeout=300)
        txt = strip_ansi(out)
        plans.append([l.strip() for l in txt.splitlines() if l.strip().startswith("•")])
    if plans[0] != plans[1]:
        diff = set(map(str, plans[0])) ^ set(map(str, plans[1]))
        return FAIL, "dry-run plans differ between runs", str(sorted(diff))[:200]
    return PASS, f"{len(plans[0])} plan lines identical across 2 runs", ""


@check("B8.2", "v1", "content-hash identity is stable for byte-identical input")
def b8_2():
    code, out, _ = run([str(VENV_PY), "-c",
        "import sys; sys.path.insert(0,'.');"
        "from lib.kb.knowledge_base_crud import KnowledgeBaseCRUD as K;"
        "k = K(); t = 'Phoenix Lights, 13 March 1997.';"
        "print('H', k._content_hash(t), k._content_hash(t), k._generate_id(t))"],
        env={"DISCLOSURE_RAG_KB_PATH": str(SANDBOX / "hashcheck")}, timeout=180)
    if code != 0:
        return FAIL, f"probe exited {code}", out[-300:]
    m = re.search(r"H (\S+) (\S+) (\S+)", out)
    if not m:
        return FAIL, "no hash measurement", out[-200:]
    a, b, sid = m.groups()
    if a != b:
        return FAIL, "content hash unstable within a process", f"{a} != {b}"
    if not sid or len(sid) != 12 or not a.startswith(sid):
        return FAIL, "document id is not a prefix of the content hash", f"{sid} vs {a}"
    return PASS, f"stable hash {a[:16]}…, id={sid}", ""


# ======================================= B4/B5 — sandbox ingest (v2 tier)

@check("B4.1", "v2", "a real ingest lands under sources/, not a parallel tree")
def b4_1():
    sandbox = SANDBOX / "ingest"
    if sandbox.exists():
        shutil.rmtree(sandbox)
    fx = FIXTURES["short_txt"]
    code, out, _ = run(["bash", str(MAIN_SH), "process-file", str(fx)],
                       env={"DISCLOSURE_RAG_KB_PATH": str(sandbox)}, timeout=420)
    if not sandbox.exists():
        return FAIL, "ingest created nothing under the archive root", out[-300:]
    written = [p for p in sandbox.rglob("*") if p.is_file()]
    if not written:
        return FAIL, "archive root created but empty", out[-300:]
    outside = [str(p.relative_to(sandbox)) for p in written
               if not str(p.relative_to(sandbox)).startswith(("sources/", "metadata/"))]
    if outside:
        return FAIL, f"{len(outside)} file(s) written outside sources/ and metadata/", outside[0]
    in_sources = [p for p in written if str(p.relative_to(sandbox)).startswith("sources/")]
    if not in_sources:
        return FAIL, "nothing written under sources/", str([str(p.relative_to(sandbox)) for p in written][:3])
    return PASS, f"{len(in_sources)} file(s) under sources/, none outside", \
        str(in_sources[0].relative_to(sandbox))


@check("B5.1", "v2", "re-ingesting an item does not reset its created_at")
def b5_1():
    sandbox = SANDBOX / "reingest"
    if sandbox.exists():
        shutil.rmtree(sandbox)
    fx = FIXTURES["short_txt"]
    env = {"DISCLOSURE_RAG_KB_PATH": str(sandbox)}

    def snapshot():
        idx = sandbox / "metadata" / "index.json"
        if not idx.exists():
            return {}
        return {d: i.get("created_at") for d, i in
                json.loads(idx.read_text())["documents"].items()}

    run(["bash", str(MAIN_SH), "process-file", str(fx)], env=env, timeout=420)
    first = snapshot()
    if not first:
        return BLOCKED, "first ingest produced no index entries", ""
    time.sleep(1.1)
    run(["bash", str(MAIN_SH), "process-file", str(fx)], env=env, timeout=420)
    second = snapshot()
    changed = {d: (first[d], second.get(d)) for d in first
               if d in second and second[d] != first[d]}
    if changed:
        d, (a, b) = next(iter(changed.items()))
        return FAIL, f"{len(changed)} document(s) had created_at reset by re-ingest", \
            f"{d}: {a} -> {b}"
    return PASS, f"created_at preserved for all {len(first)} document(s)", ""


@check("B5.2", "v2", "re-ingest leaves no directory unreferenced by the index")
def b5_2():
    sandbox = SANDBOX / "reingest"
    idx = sandbox / "metadata" / "index.json"
    if not idx.exists():
        return BLOCKED, "no index from B5.1 sandbox", ""
    docs = json.loads(idx.read_text())["documents"]
    referenced = set()
    for i in docs.values():
        p = i.get("path", "")
        fp = Path(p) if os.path.isabs(p) else (sandbox / p)
        referenced.add(str(fp.resolve()))
    leaf_dirs = {str(p.parent.resolve()) for p in (sandbox / "sources").rglob("*")
                 if p.is_file()} if (sandbox / "sources").exists() else set()
    orphans = sorted(d for d in leaf_dirs
                     if d not in referenced and not any(d.startswith(r) for r in referenced)
                     and not any(r.startswith(d) for r in referenced))
    if orphans:
        return FAIL, f"{len(orphans)} content director(ies) unreferenced by any index entry", \
            orphans[0]
    return PASS, f"all {len(leaf_dirs)} content director(ies) referenced", ""


@check("B6.4", "v2", "entity extraction over a known-entity fixture returns > 0 entities")
def b6_4():
    code, out, _ = run([str(VENV_PY), "-c",
        "import sys; sys.path.insert(0,'.');"
        "from processing.content_analysis import ContentAnalysisEngine as E;"
        "r = E().process_for_rag(open('%s').read(), provenance='benchmark');"
        "ner = r.get('ner') or {};"
        "n = sum(len(v) for v in ner.values()) if isinstance(ner, dict) else len(ner);"
        "print('ENTITIES', n)" % FIXTURES["short_txt"]], timeout=420)
    if code != 0:
        return FAIL, f"extraction raised (exit {code})", out[-400:]
    m = re.search(r"ENTITIES (\d+)", out)
    if not m:
        return BLOCKED, "no entity measurement produced", out[-300:]
    n = int(m.group(1))
    if n == 0:
        return FAIL, "0 entities from a fixture naming Phoenix, Arizona, and the USAF", out[-200:]
    return PASS, f"{n} entities extracted", ""


# ================================================================ fixtures

FIXTURE_TEXT = """Phoenix Lights Incident — Benchmark Fixture

On 13 March 1997, thousands of witnesses across Arizona, including Governor Fife
Symington, reported a V-shaped formation of lights passing over Phoenix between
19:30 and 22:30 local time. The United States Air Force later attributed the
22:00 portion of the event to LUU-2B/B illumination flares dropped by A-10
Warthog aircraft over the Barry M. Goldwater Range.

Witnesses described the earlier 20:30 formation as a single solid craft roughly
a mile wide, silent, moving slowly southeast toward Tucson. Dr. Lynne Kitei
documented the event photographically. The Air Force explanation has never
accounted for the earlier sighting.
"""


def build_fixtures(root: Path) -> dict:
    root.mkdir(parents=True, exist_ok=True)
    txt = root / "phoenix_lights_fixture.txt"
    txt.write_text(FIXTURE_TEXT)
    return {"short_txt": txt}


SANDBOX = Path(tempfile.gettempdir()) / "dy-bench-sandbox"
FIXTURES: dict = {}


# ==================================================================== main

TIER_ORDER = {"v1": 1, "v2": 2}


def main() -> int:
    global FIXTURES
    ap = argparse.ArgumentParser(description="DY-BENCH — disclosure-rag pipeline benchmark")
    ap.add_argument("--tier", default="v1", choices=["v1", "v2"],
                    help="highest tier to run (v2 includes v1)")
    ap.add_argument("--only", default="", help="comma-separated check id prefixes, e.g. B2,B3.1")
    ap.add_argument("--json", dest="json_out", default="", help="write results to this path")
    args = ap.parse_args()

    SANDBOX.mkdir(parents=True, exist_ok=True)
    FIXTURES = build_fixtures(SANDBOX / "fixtures")

    max_tier = TIER_ORDER[args.tier]
    prefixes = [p.strip() for p in args.only.split(",") if p.strip()]
    selected = [c for c in CHECKS
                if TIER_ORDER[c[1]] <= max_tier
                and (not prefixes or any(c[0].startswith(p) for p in prefixes))]

    print(f"\nDY-BENCH — {len(selected)} checks, tier ≤ {args.tier}")
    print(f"archive root : {kb_root_path()}")
    print(f"sandbox      : {SANDBOX}")
    print("=" * 78)

    for cid, tier, assertion, fn in selected:
        print(f"  {cid:<7} {assertion[:58]:<58} … ", end="", flush=True)
        try:
            status, detail, evidence = fn()
        except Exception as ex:
            status, detail, evidence = BLOCKED, f"{type(ex).__name__}: {ex}", ""
        icon = {PASS: "PASS", FAIL: "FAIL", BLOCKED: "BLOCK"}[status]
        print(icon)
        if detail:
            print(f"          └─ {detail}")
        if evidence and status != PASS:
            print(f"             {evidence[:150]}")
        REG.record(Result(cid, tier, assertion, status, detail, evidence))

    npass = sum(1 for r in REG.results if r.status == PASS)
    nfail = sum(1 for r in REG.results if r.status == FAIL)
    nblock = sum(1 for r in REG.results if r.status == BLOCKED)
    print("=" * 78)
    print(f"  PASS {npass}   FAIL {nfail}   BLOCKED {nblock}   (of {len(REG.results)})")

    v1 = [r for r in REG.results if r.tier == "v1"]
    v1_fail = [r for r in v1 if r.status != PASS]
    if v1:
        print(f"  v1 tier: {len(v1) - len(v1_fail)}/{len(v1)} passing"
              f"{'' if not v1_fail else ' — ' + ', '.join(r.id for r in v1_fail)}")

    if args.json_out:
        Path(args.json_out).write_text(json.dumps(
            {"results": [asdict(r) for r in REG.results],
             "summary": {"pass": npass, "fail": nfail, "blocked": nblock}}, indent=2))
        print(f"  wrote {args.json_out}")

    return 0 if nfail == 0 and nblock == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
