"""
Live-DB operations for the SP1 loader: --load and --verify.

Host-agnostic — reads DATABASE_URL (Supabase / Neon / local Postgres / etc).
Requires psycopg (v3) + the 0001_init.sql schema already applied to the target.

  pip install "psycopg[binary]"
  export DATABASE_URL=postgresql://user:pass@host:5432/dbname
  python load_csv.py --load
  python load_csv.py --verify
"""
from __future__ import annotations

import os
import sys


def _connect():
    url = os.getenv("DATABASE_URL")
    if not url:
        sys.exit("ERROR: DATABASE_URL not set. Point it at your Postgres+pgvector host.")
    try:
        import psycopg
    except ImportError:
        sys.exit('ERROR: psycopg not installed. Run: pip install "psycopg[binary]"')
    return psycopg, psycopg.connect(url)


def _adapt(val):
    """Wrap dict JSON values for jsonb cols; leave text[] lists and scalars as-is."""
    from psycopg.types.json import Jsonb
    if isinstance(val, dict):
        return Jsonb(val)
    return val


def load(specs, parse_table):
    from load_csv import EDGE_DEFS
    psycopg, conn = _connect()
    inserted = {}
    with conn:
        with conn.cursor() as cur:
            # entity + junction + app tables, parents-first (TABLES order)
            for spec in specs:
                table, _f, _nt, _ls, cols = spec
                rows, *_ = parse_table(spec)
                if not rows:
                    inserted[table] = 0
                    continue
                db_cols = ["id"] + [c[0] for c in cols]
                ident = ", ".join(f'"{c}"' for c in db_cols)
                ph = ", ".join(["%s"] * len(db_cols))
                sql = (f'INSERT INTO "{table}" ({ident}) VALUES ({ph}) '
                       f'ON CONFLICT (id) DO NOTHING')
                data = [tuple(_adapt(r.get(c)) for c in db_cols) for r in rows]
                cur.executemany(sql, data)
                inserted[table] = len(rows)
                print(f"  loaded {table:<36} {len(rows):>7} rows")

            # seed nodes: one row per entity across all typed tables
            print("  seeding nodes ...")
            for spec in specs:
                table, _f, ntype, lsrc, _c = spec
                if not ntype:
                    continue
                cur.execute(
                    f'INSERT INTO nodes (id, entity_type, label) '
                    f'SELECT id, %s, "{lsrc}" FROM "{table}" '
                    f'ON CONFLICT (id) DO NOTHING', (ntype,))

            # seed structural edges (guard: both endpoints must be nodes)
            print("  seeding edges ...")
            for table, src_col, dst_col, rel in EDGE_DEFS:
                src_expr = "t.id" if src_col == "id" else f't."{src_col}"'
                cur.execute(
                    f'INSERT INTO edges (src_id, dst_id, rel_type) '
                    f'SELECT {src_expr}, t."{dst_col}", %s FROM "{table}" t '
                    f'JOIN nodes ns ON ns.id = {src_expr} '
                    f'JOIN nodes nd ON nd.id = t."{dst_col}" '
                    f'WHERE t."{dst_col}" IS NOT NULL '
                    f'ON CONFLICT (src_id, dst_id, rel_type) DO NOTHING', (rel,))
    print("\nLOAD COMPLETE")
    return 0


def verify(EXPECTED):
    _psycopg, conn = _connect()
    rc = 0
    with conn, conn.cursor() as cur:
        print("ROW COUNTS")
        for table, exp in EXPECTED.items():
            cur.execute(f'SELECT count(*) FROM "{table}"')
            got = cur.fetchone()[0]
            ok = "✓" if got == exp else "✗"
            if got != exp:
                rc = 1
            print(f"  {table:<20}{got:>8}  (expect {exp}) {ok}")

        cur.execute("SELECT count(*) FROM nodes")
        print(f"\nnodes: {cur.fetchone()[0]}")
        cur.execute("SELECT count(*) FROM edges")
        print(f"edges: {cur.fetchone()[0]}")
        cur.execute("SELECT rel_type, count(*) FROM edges GROUP BY rel_type ORDER BY 2 DESC")
        for rel, n in cur.fetchall():
            print(f"    {rel:<20}{n:>7}")

        # dangling FK report (constraints are NOT VALID, so check explicitly)
        print("\nDANGLING REFERENCES (FK target missing)")
        checks = [
            ("testimonies", "event", "events"),
            ("testimonies", "witness", "key_figures"),
            ("testimonies", "organization", "organizations"),
            ("event_subject_matter_experts", "event", "events"),
            ("event_subject_matter_experts", "subject_matter_expert", "key_figures"),
            ("topics_testimonies", "topic", "topics"),
            ("topics_testimonies", "testimony", "testimonies"),
        ]
        clean = True
        for child, col, parent in checks:
            cur.execute(
                f'SELECT count(*) FROM "{child}" c '
                f'WHERE c."{col}" IS NOT NULL '
                f'AND NOT EXISTS (SELECT 1 FROM "{parent}" p WHERE p.id = c."{col}")')
            n = cur.fetchone()[0]
            if n:
                clean = False
                print(f"  {child}.{col} -> {parent}: {n} dangling")
        if clean:
            print("  none ✓")

        # node coverage: every loaded entity row has a node
        print("\nNODE COVERAGE")
        for table, ntype in [("events", "event"), ("key_figures", "key_figure"),
                             ("topics", "topic"), ("sightings", "sighting")]:
            cur.execute(f'SELECT count(*) FROM "{table}" t '
                        f'WHERE NOT EXISTS (SELECT 1 FROM nodes n WHERE n.id=t.id)')
            miss = cur.fetchone()[0]
            print(f"  {table:<14} uncovered: {miss} {'✓' if miss == 0 else '✗'}")
            if miss:
                rc = 1
    print("\n" + ("VERIFY PASS ✓" if rc == 0 else "VERIFY FAIL ✗"))
    return rc
