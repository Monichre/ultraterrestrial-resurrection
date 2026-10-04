#!/usr/bin/env python3
"""Run main.py with all non-loopback network egress blocked at the socket layer.

Used by DY-BENCH check B3.3. `ingestion-hardening.md` §8.7 records a local `dy`
run POSTing to production (`https://www.ultraterrestrial.app/api/workflow/processing`,
HTTP 201) with no dry-run guard on that path.

Checking for the *absence* of a log line would be weak evidence — the enqueue
could succeed silently. Instead this patches `socket.socket.connect` so any
connection to a non-loopback address raises and prints `EGRESS <host>:<port>`.
A clean run therefore produces positive evidence of no egress, and a leaking run
names the destination it tried to reach.

Usage (arguments are passed through to main.py):
    .venv/bin/python scripts/_bench_egress_guard.py <url> --dry-run
"""

from __future__ import annotations

import ipaddress
import socket
import sys
from pathlib import Path

APP_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APP_DIR))

_violations: list[str] = []


def _is_loopback(host: str) -> bool:
    try:
        return ipaddress.ip_address(host).is_loopback
    except ValueError:
        return host in ("localhost", "localhost.localdomain", "")


class EgressBlocked(OSError):
    pass


def _install_guard() -> None:
    real_connect = socket.socket.connect
    real_connect_ex = socket.socket.connect_ex

    def guarded_connect(self, address, *a, **kw):
        if isinstance(address, tuple) and len(address) >= 2:
            host, port = str(address[0]), address[1]
            if not _is_loopback(host):
                msg = f"EGRESS {host}:{port}"
                _violations.append(msg)
                print(msg, flush=True)
                raise EgressBlocked(msg)
        return real_connect(self, address, *a, **kw)

    def guarded_connect_ex(self, address, *a, **kw):
        if isinstance(address, tuple) and len(address) >= 2:
            host, port = str(address[0]), address[1]
            if not _is_loopback(host):
                msg = f"EGRESS {host}:{port}"
                _violations.append(msg)
                print(msg, flush=True)
                return 111  # ECONNREFUSED
        return real_connect_ex(self, address, *a, **kw)

    socket.socket.connect = guarded_connect  # type: ignore[method-assign]
    socket.socket.connect_ex = guarded_connect_ex  # type: ignore[method-assign]


def main() -> int:
    _install_guard()
    import main as dy_main  # noqa: E402  (import after the guard is installed)

    sys.argv = ["main.py"] + sys.argv[1:]
    code = 0
    try:
        dy_main.main()
    except SystemExit as ex:
        code = int(ex.code or 0)
    except Exception as ex:  # a crash is reported, not swallowed
        print(f"GUARD-RUN-ERROR {type(ex).__name__}: {ex}", flush=True)
        code = 1
    if _violations:
        print(f"GUARD-VIOLATIONS {len(_violations)}", flush=True)
        return 1
    print("GUARD-OK", flush=True)
    return code


if __name__ == "__main__":
    sys.exit(main())
