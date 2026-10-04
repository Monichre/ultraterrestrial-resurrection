#!/bin/bash
#
# dy-trace — run the real `dy` pipeline under the call-stack tracer.
#
#   ./scripts/dy-trace.sh <URL_OR_FILE> [main.py flags] [--trace-* flags]
#
# Identical to `dy <url>` except that main.py runs under scripts/trace_dy.py,
# which prints an indented live call trace to stderr and writes the full trace
# to data/traces/<timestamp>.log.
#
# Mirrors main.sh's pre-flight (venv interpreter, .env as DEFAULTS not
# overrides) so a traced run and a normal run see the same environment.
#
# NOTE: this always goes to main.py. Playlist URLs (containing `list=` or
# `/playlist`) are routed by main.sh to scripts/playlist_ingestion.py instead
# and are NOT traceable through this wrapper — it would hand the playlist URL
# to main.py, which treats it as one id-less video.

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
VENV_PYTHON="$SCRIPT_DIR/.venv/bin/python"

if [ ! -x "$VENV_PYTHON" ]; then
    echo "Error: $VENV_PYTHON not found. Run ./main.sh setup first." >&2
    exit 1
fi

export VIRTUAL_ENV="$SCRIPT_DIR/.venv"
export PATH="$SCRIPT_DIR/.venv/bin:$PATH"

# Same caller-precedence rule as main.sh:48-63 — .env supplies defaults, an
# explicitly exported value from the caller wins.
if [ -f "$SCRIPT_DIR/.env" ]; then
    _CALLER_ENV="$(export -p)"
    set -a
    source "$SCRIPT_DIR/.env"
    set +a
    eval "$_CALLER_ENV" 2>/dev/null
    unset _CALLER_ENV
fi

exec "$VENV_PYTHON" "$SCRIPT_DIR/scripts/trace_dy.py" "$@"
