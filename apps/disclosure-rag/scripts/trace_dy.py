#!/usr/bin/env python3
"""
Live call-stack tracer for the `dy` pipeline.

Runs main.py under sys.setprofile and prints an indented, real-time trace of
every call into first-party disclosure-rag code — so a `dy <url>` run can be
watched as it descends main.py -> lib/ -> processing/.

Third-party frames (.venv, site-packages, stdlib) are filtered out: the point is
to see OUR call graph, not openai's HTTP retry internals.

Usage (from apps/disclosure-rag/, via the venv so .env is loaded the same way
main.sh loads it):

    ./main.sh --help                       # normal dy, for comparison
    .venv/bin/python scripts/trace_dy.py <URL_OR_FILE> [main.py flags...]

Recommended first run — proves the tracer without touching the network or
writing anything (main.py returns before any side effect on --dry-run):

    set -a; source .env; set +a
    .venv/bin/python scripts/trace_dy.py "https://example.com/x" --dry-run

Options (consumed by the tracer, everything else passes through to main.py):

    --trace-out PATH   write the full trace here (default: data/traces/<ts>.log)
    --trace-depth N    only print frames at depth <= N (default: unlimited)
    --trace-args       show truncated argument values on each call
    --trace-quiet      write the trace file but do not print to stderr

Exit code is main.py's own exit code, so this is a drop-in for a real run.
"""

from __future__ import annotations

import os
import re
import runpy
import sys
import threading
import time
from pathlib import Path

# Parameter names whose values must never reach the trace file.
_SECRET_ARG = re.compile(
    r"(api_?key|secret|token|password|passwd|credential|authorization)", re.I
)


def _safe_repr(value, limit: int = 60) -> str:
    """repr() that cannot explode the trace or the traced program.

    Transcripts and API payloads move through this pipeline as multi-hundred-KB
    strings; repr'ing one in full would materialize the whole thing per call.
    Length-capped types are truncated before repr, and any object with a
    misbehaving __repr__ degrades to its type name rather than raising.
    """
    try:
        if isinstance(value, (str, bytes)):
            if len(value) > limit:
                return f"<{type(value).__name__} len={len(value)}>"
            return repr(value)
        if isinstance(value, (list, tuple, dict, set)):
            return f"<{type(value).__name__} len={len(value)}>"
        out = repr(value)
        return out if len(out) <= limit else out[: limit - 3] + "..."
    except Exception:
        return f"<{type(value).__name__} unreprable>"

# apps/disclosure-rag/ — everything under here is "first party" for the trace.
APP_DIR = Path(__file__).resolve().parent.parent

# Frames from these are noise: the venv, any site-packages, and the tracer.
_EXCLUDED_PARTS = ("/.venv/", "/venv/", "/site-packages/", "/__pycache__/")
_SELF = str(Path(__file__).resolve())


class Tracer:
    def __init__(self, out_path, max_depth=None, show_args=False, quiet=False):
        self.out = open(out_path, "w", encoding="utf-8")
        self.max_depth = max_depth
        self.show_args = show_args
        self.quiet = quiet
        self.depth = 0
        self.calls = 0
        self.started = time.perf_counter()
        # Per-frame start times, keyed by id(frame), for elapsed-time reporting.
        self._t = {}

    # -- filtering ---------------------------------------------------------

    def _is_first_party(self, filename: str) -> bool:
        if not filename or filename[0] == "<":
            return False  # <string>, <frozen importlib...>, etc.
        if filename == _SELF:
            return False
        if any(part in filename for part in _EXCLUDED_PARTS):
            return False
        return filename.startswith(str(APP_DIR))

    # -- output ------------------------------------------------------------

    def _emit(self, line: str) -> None:
        # Flush every line: a run that hangs or is Ctrl-C'd must still leave a
        # complete trace on disk up to the point it stopped. Buffering would
        # lose exactly the frames you need to see when diagnosing a hang.
        self.out.write(line + "\n")
        self.out.flush()
        if not self.quiet:
            sys.stderr.write(line + "\n")
            sys.stderr.flush()

    def _format_args(self, frame) -> str:
        if not self.show_args:
            return ""
        code = frame.f_code
        names = code.co_varnames[: code.co_argcount]
        parts = []
        for name in names:
            if name == "self":
                continue
            # The trace file is written to disk and pasted into issues. This
            # pipeline passes OPENAI_API_KEY / UPSTASH tokens as ordinary
            # arguments, so never repr a parameter whose name looks secret.
            if _SECRET_ARG.search(name):
                parts.append(f"{name}=<redacted>")
                continue
            parts.append(f"{name}={_safe_repr(frame.f_locals.get(name))}")
        return "(" + ", ".join(parts) + ")" if parts else "()"

    # -- the profile hook --------------------------------------------------

    def __call__(self, frame, event, arg):
        # setprofile fires on EVERY frame process-wide, including inside this
        # hook's own helpers if they were traceable. Any exception raised here
        # would surface as a failure of the code being traced, so the whole body
        # is guarded: a broken tracer must never break the run it observes.
        try:
            return self._handle(frame, event, arg)
        except Exception:
            return

    def _handle(self, frame, event, arg):
        if event not in ("call", "return"):
            return  # c_call / c_return / c_exception: not our code

        code = frame.f_code
        if not self._is_first_party(code.co_filename):
            return

        rel = os.path.relpath(code.co_filename, APP_DIR)

        if event == "call":
            self.calls += 1
            self._t[id(frame)] = time.perf_counter()
            if self.max_depth is None or self.depth <= self.max_depth:
                elapsed = time.perf_counter() - self.started
                indent = "│  " * self.depth
                self._emit(
                    f"{elapsed:7.2f}s {indent}→ {code.co_name}"
                    f"{self._format_args(frame)}  [{rel}:{frame.f_lineno}]"
                )
            self.depth += 1

        else:  # return
            self.depth = max(0, self.depth - 1)
            start = self._t.pop(id(frame), None)
            if self.max_depth is None or self.depth <= self.max_depth:
                took = f"{(time.perf_counter() - start) * 1000:.0f}ms" if start else "?"
                summary = f" = {_safe_repr(arg, limit=70)}" if arg is not None else ""
                elapsed = time.perf_counter() - self.started
                indent = "│  " * self.depth
                self._emit(
                    f"{elapsed:7.2f}s {indent}← {code.co_name} ({took}){summary}"
                )

    def close(self, exit_code) -> None:
        total = time.perf_counter() - self.started
        footer = (
            f"\n--- trace complete: {self.calls} first-party calls "
            f"in {total:.2f}s, exit code {exit_code} ---"
        )
        self._emit(footer)
        self.out.close()


def _split_argv(argv):
    """Peel off --trace-* flags; everything else belongs to main.py."""
    opts = {"out": None, "depth": None, "args": False, "quiet": False}
    passthrough = []
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--trace-out":
            opts["out"] = argv[i + 1]
            i += 2
        elif a == "--trace-depth":
            opts["depth"] = int(argv[i + 1])
            i += 2
        elif a == "--trace-args":
            opts["args"] = True
            i += 1
        elif a == "--trace-quiet":
            opts["quiet"] = True
            i += 1
        else:
            passthrough.append(a)
            i += 1
    return opts, passthrough


def main() -> int:
    opts, passthrough = _split_argv(sys.argv[1:])

    out_path = opts["out"]
    if out_path is None:
        traces_dir = APP_DIR / "data" / "traces"
        traces_dir.mkdir(parents=True, exist_ok=True)
        out_path = traces_dir / f"{time.strftime('%Y%m%d-%H%M%S')}.log"

    tracer = Tracer(
        out_path,
        max_depth=opts["depth"],
        show_args=opts["args"],
        quiet=opts["quiet"],
    )

    target = str(APP_DIR / "main.py")

    # main.py resolves sibling modules (lib/, processing/) by relative import
    # position, so it must run with APP_DIR importable and as cwd.
    sys.path.insert(0, str(APP_DIR))
    os.chdir(APP_DIR)

    # main.py's argparse reads sys.argv[1:] — hand it only the passthrough args.
    sys.argv = [target] + passthrough

    header = (
        f"--- tracing: {target} {' '.join(passthrough)}\n"
        f"--- first-party root: {APP_DIR}\n"
        f"--- trace file: {out_path}\n"
    )
    tracer._emit(header)

    exit_code = 0
    # threading.setprofile catches worker threads started after this point;
    # sys.setprofile only covers the main thread.
    threading.setprofile(tracer)
    sys.setprofile(tracer)
    try:
        runpy.run_path(target, run_name="__main__")
    except SystemExit as e:  # main.py calls sys.exit() on failed stages
        exit_code = e.code if isinstance(e.code, int) else 0
    finally:
        sys.setprofile(None)
        threading.setprofile(None)
        tracer.close(exit_code)

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
