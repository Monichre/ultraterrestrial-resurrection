#!/usr/bin/env node
// Live kanban server for docs/plans/TODO.md
// Self-contained, stdlib only. Parses TODO.md on every request so edits show on refresh.
//
//   node docs/plans/kanban-server.mjs            # port 4173
//   PORT=5000 node docs/plans/kanban-server.mjs
//
// Endpoints:
//   GET /            -> swimlane kanban HTML (A/B rows per column)
//   GET /api/tickets -> JSON {generated, source, tickets:[{id,lane,col,title,status,foot}]}
//   GET /api/health  -> JSON {ok, source, mtime}
//   GET /api/events  -> SSE stream; pushes "reload" when TODO.md changes on disk

import http from 'node:http'
import { readFileSync, statSync, watchFile } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TODO_PATH = join(__dirname, 'TODO.md')
const PORT = Number(process.env.PORT) || 4173

// SSE clients for auto-refresh
const sseClients = new Set()
let lastMtime = 0
try { lastMtime = statSync(TODO_PATH).mtimeMs } catch {}

// Watch TODO.md; notify all SSE clients on change
watchFile(TODO_PATH, { interval: 500 }, (curr, prev) => {
  if (curr.mtimeMs === prev.mtimeMs) return
  lastMtime = curr.mtimeMs
  const ts = new Date().toISOString()
  console.log(`[watch] TODO.md changed ${ts} — notifying ${sseClients.size} client(s)`)
  for (const res of sseClients) {
    res.write(`event: reload\ndata: ${ts}\n\n`)
  }
})

// ── parsing ──────────────────────────────────────────────────────────────

function readTodo() {
  const src = readFileSync(TODO_PATH, 'utf8')
  const laneMap = parseLaneMap(src)
  const tickets = parseTickets(src, laneMap)
  return { src, laneMap, tickets }
}

// Lane assignment from the Worklanes table near the top.
// Rows look like: | **A — Corpus & Ingestion** | T-048 | T-045 (in review), **T-055**, ... | T-044, **T-054** |
function parseLaneMap(src) {
  const map = {}
  const tableRe = /\|\s*\*\*(A|B)\s*[—-][^*]*\*\*\s*\|([^|]+)\|([^|]+)\|([^|]+)\|/g
  let m
  while ((m = tableRe.exec(src))) {
    const lane = m[1]
    for (const cell of [m[2], m[3], m[4]]) {
      const ids = cell.match(/T-\d{3}/g) || []
      for (const id of ids) {
        if (!(id in map)) map[id] = lane // first table wins; tickets only appear once
      }
    }
  }
  return map
}

function parseTickets(src, laneMap) {
  const out = []
  const lines = src.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const h = line.match(/^###\s+(T-\d{3}):\s*(.+)$/)
    if (!h) continue
    const id = h[1]
    const title = h[2].trim()
    // status is the first "- **Status:**" line within the next ~6 lines
    let status = ''
    for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
      const sm = lines[j].match(/^\s*-\s*\*\*Status:\*\*\s*(.+)$/)
      if (sm) { status = sm[1].trim(); break }
      if (lines[j].match(/^###\s/)) break
    }
    const col = statusToCol(status)
    const lane = laneMap[id] || inferLane(title)
    out.push({ id, title, status, col, lane, foot: status })
  }
  return out
}

// Normalize the free-form status strings into 5 columns.
function statusToCol(s) {
  const u = s.toUpperCase()
  if (u.startsWith('DONE')) {
    // "DONE / IN REVIEW" → review; pure DONE → done
    if (u.includes('IN REVIEW')) return 'review'
    return 'done'
  }
  if (u.includes('IN PROGRESS')) return 'progress'
  if (u.includes('BLOCKED') || u.includes('VERIFICATION BLOCKED') || u.includes('REVIEW BLOCKED')) return 'blocked'
  if (u.includes('IN REVIEW') || u.includes('DECISION READY')) return 'review'
  if (u.includes('BUILT') || u.includes('COMMITTED')) return 'progress'
  if (u.startsWith('OPEN')) return 'backlog'
  return 'backlog'
}

// Fallback lane inference from title keywords when the ticket isn't in the Worklanes table.
function inferLane(title) {
  const t = title.toLowerCase()
  const aKeys = ['ingest', 'corpus', 'trace map', 'playlist', 'disclosure-rag', 'main.py', 'provenance', 'knowledge-base']
  if (aKeys.some(k => t.includes(k))) return 'A'
  return 'B'
}

// ── HTML ─────────────────────────────────────────────────────────────────

function renderHtml(tickets) {
  const counts = { backlog: 0, progress: 0, review: 0, blocked: 0, done: 0 }
  for (const t of tickets) counts[t.col]++
  const aCount = tickets.filter(t => t.lane === 'A').length
  const bCount = tickets.filter(t => t.lane === 'B').length

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  // turn DMGD-NNN refs into links
  const linkify = s => esc(s).replace(/(DMGD-\d+)/g, '<a href="https://linear.app/digital-mischief-group/issue/$1" target="_blank">$1</a>')

  const cols = ['backlog', 'progress', 'review', 'blocked', 'done']
  const colLabel = { backlog: 'Backlog', progress: 'In Progress', review: 'In Review', blocked: 'Blocked', done: 'Done' }

  const renderCard = t => `
      <div class="card lane-${t.lane}" data-lane="${t.lane}">
        <div class="card-top">
          <span class="tid">${t.id}</span>
          <span class="lane-badge">Lane ${t.lane}</span>
        </div>
        <div class="card-title">${esc(t.title)}</div>
        <div class="card-foot">${linkify(t.foot)}</div>
      </div>`

  const renderSwimlane = (lane, laneLabel) => {
    return cols.map(c => {
      const items = tickets.filter(t => t.col === c && t.lane === lane)
      const inner = items.length
        ? items.map(renderCard).join('')
        : '<div class="empty">—</div>'
      return `  <div class="swim-cell" data-col="${c}" data-lane="${lane}">
    <div class="swim-cell-head"><span class="swim-lane">${laneLabel}</span><span class="n">${items.length}</span></div>
    <div class="col-body">${inner}</div>
  </div>`
    }).join('\n')
  }

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>UR Plan Kanban — live</title>
<style>
  :root{
    --bg:#0d1520;--bg-2:#0a111c;--panel:#13202f;--panel-2:#172738;
    --line:#1f3247;--line-2:#2a4361;--ink:#d7e3f1;--ink-dim:#8aa3bd;--ink-faint:#5b7390;
    --accent:#5fb4d4;--amber:#e0a64e;--cyan:#5fb4d4;--green:#6fbf8b;--red:#d97a7a;--violet:#a78bd4;--slate:#6b8199;
    --grid:rgba(95,180,212,.05);
    --mono:'JetBrains Mono','SF Mono',ui-monospace,Menlo,Consolas,monospace;
    --sans:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{
    background:
      linear-gradient(var(--grid) 1px,transparent 1px) 0 0/32px 32px,
      linear-gradient(90deg,var(--grid) 1px,transparent 1px) 0 0/32px 32px,
      radial-gradient(1200px 800px at 80% -10%,#16324a 0%,transparent 60%),
      var(--bg);
    color:var(--ink);font-family:var(--sans);font-size:14px;line-height:1.5;min-height:100vh;
    -webkit-font-smoothing:antialiased;
  }
  header{
    border-bottom:1px solid var(--line);padding:18px 28px;
    background:rgba(10,17,28,.7);backdrop-filter:blur(8px);
    position:sticky;top:0;z-index:10;
  }
  .head-row{display:flex;align-items:baseline;justify-content:space-between;gap:24px;flex-wrap:wrap}
  h1{font-family:var(--mono);font-size:15px;font-weight:600;letter-spacing:.04em;margin:0;text-transform:uppercase}
  h1 .dim{color:var(--ink-faint);font-weight:400}
  h1 .live{color:var(--green);font-size:10px;vertical-align:middle;margin-left:8px;letter-spacing:.1em}
  h1 .live::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--green);margin-right:4px;animation:pulse 2s infinite;vertical-align:middle}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  .meta{font-family:var(--mono);font-size:11px;color:var(--ink-faint);letter-spacing:.04em}
  .meta b{color:var(--ink-dim);font-weight:500}
  .meta a{color:var(--accent);text-decoration:none}
  .meta a:hover{text-decoration:underline}
  .toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:14px}
  .filter-btn{
    font-family:var(--mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;
    background:transparent;color:var(--ink-dim);border:1px solid var(--line-2);
    padding:5px 10px;border-radius:3px;cursor:pointer;transition:all .15s;
  }
  .filter-btn:hover{color:var(--ink);border-color:var(--accent)}
  .filter-btn.active{background:var(--accent);color:#0a111c;border-color:var(--accent);font-weight:600}
  .filter-btn .count{opacity:.6;margin-left:4px}
  .spacer{flex:1}
  .legend{display:flex;gap:14px;font-family:var(--mono);font-size:10px;color:var(--ink-faint);letter-spacing:.05em;text-transform:uppercase}
  .legend span{display:inline-flex;align-items:center;gap:5px}
  .dot{width:8px;height:8px;border-radius:2px;display:inline-block}

  .board-wrap{overflow-x:auto;padding:20px 28px 10px}
  .board{
    display:grid;
    grid-template-columns:200px repeat(5, minmax(240px, 1fr));
    gap:0;
    min-width:1400px;
    border:1px solid var(--line);border-radius:6px;
    background:rgba(19,32,47,.3);
  }
  .col-header{
    padding:11px 14px;border-bottom:1px solid var(--line);border-left:1px solid var(--line);
    font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;
    color:var(--ink-dim);background:var(--panel);
    display:flex;align-items:center;justify-content:space-between;
    position:sticky;top:74px;z-index:2;
  }
  .col-header .n{font-size:10px;color:var(--ink-faint);background:var(--bg-2);border:1px solid var(--line);padding:1px 6px;border-radius:8px}
  .col-header .bar{width:24px;height:2px;border-radius:1px;margin-right:8px}
  .col-header .title{display:flex;align-items:center}
  .col-header[data-col="backlog"]  .bar{background:var(--slate)}
  .col-header[data-col="progress"] .bar{background:var(--amber)}
  .col-header[data-col="review"]   .bar{background:var(--violet)}
  .col-header[data-col="blocked"]  .bar{background:var(--red)}
  .col-header[data-col="done"]     .bar{background:var(--green)}
  .col-header.corner{background:var(--bg-2);color:var(--ink-faint);font-size:10px}

  .lane-label{
    padding:14px;border-bottom:1px solid var(--line);
    font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;
    display:flex;flex-direction:column;justify-content:center;gap:4px;
    background:var(--bg-2);
  }
  .lane-label.a{color:var(--amber);border-left:3px solid var(--amber)}
  .lane-label.b{color:var(--cyan);border-left:3px solid var(--cyan)}
  .lane-label .sub{color:var(--ink-faint);font-size:9px;letter-spacing:.06em}

  .swim-cell{
    border-left:1px solid var(--line);border-bottom:1px solid var(--line);
    min-height:120px;
  }
  .swim-cell[data-lane="A"]{background:rgba(224,166,78,.025)}
  .swim-cell[data-lane="B"]{background:rgba(95,180,212,.02)}
  .swim-cell-head{
    display:flex;align-items:center;justify-content:space-between;
    padding:6px 10px;border-bottom:1px solid var(--line);
    font-family:var(--mono);font-size:9px;letter-spacing:.08em;text-transform:uppercase;
    color:var(--ink-faint);
  }
  .swim-cell-head .n{font-size:9px;color:var(--ink-faint)}
  .col-body{padding:10px;display:flex;flex-direction:column;gap:9px}

  .card{
    background:var(--panel-2);border:1px solid var(--line);border-left:3px solid var(--line-2);
    border-radius:4px;padding:10px 12px;transition:border-color .15s,transform .1s;
  }
  .card:hover{border-color:var(--line-2);transform:translateY(-1px)}
  .card.lane-A{border-left-color:var(--amber)}
  .card.lane-B{border-left-color:var(--cyan)}
  .card-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
  .tid{font-family:var(--mono);font-size:11px;font-weight:600;color:var(--ink);letter-spacing:.04em}
  .lane-badge{font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;padding:1px 5px;border-radius:2px;border:1px solid}
  .lane-A .lane-badge{color:var(--amber);border-color:rgba(224,166,78,.4);background:rgba(224,166,78,.08)}
  .lane-B .lane-badge{color:var(--cyan);border-color:rgba(95,180,212,.4);background:rgba(95,180,212,.08)}
  .card-title{font-size:12.5px;color:var(--ink);line-height:1.4;margin:0 0 7px}
  .card-foot{font-family:var(--mono);font-size:10px;color:var(--ink-faint);line-height:1.45;letter-spacing:.02em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .card-foot a{color:var(--accent);text-decoration:none}
  .card-foot a:hover{text-decoration:underline}
  .card.hidden{display:none}
  .empty{text-align:center;padding:18px 8px;font-family:var(--mono);font-size:10px;color:var(--ink-faint);letter-spacing:.06em}

  .footnote{
    padding:18px 28px 40px;font-family:var(--mono);font-size:10px;color:var(--ink-faint);
    letter-spacing:.04em;line-height:1.6;border-top:1px solid var(--line);margin-top:10px;
  }
  .footnote a{color:var(--ink-dim)}
</style>
</head>
<body>
<header>
  <div class="head-row">
    <h1>UR Plan Kanban <span class="dim">— docs/plans/TODO.md</span><span class="live">LIVE</span></h1>
    <div class="meta">
      <b>${tickets.length}</b> tickets · Lane A <b>${aCount}</b> · Lane B <b>${bCount}</b> ·
      <a href="/api/tickets">JSON</a> · <a href="/api/health">health</a> ·
      regenerated every request · port ${PORT}
    </div>
  </div>
  <div class="toolbar">
    <button class="filter-btn active" data-filter="all">All <span class="count">${tickets.length}</span></button>
    <button class="filter-btn" data-filter="A">Lane A · Corpus <span class="count">${aCount}</span></button>
    <button class="filter-btn" data-filter="B">Lane B · Platform <span class="count">${bCount}</span></button>
    <div class="spacer"></div>
    <div class="legend">
      <span><i class="dot" style="background:var(--amber)"></i>Lane A — Corpus & Ingestion</span>
      <span><i class="dot" style="background:var(--cyan)"></i>Lane B — Platform & Experience</span>
    </div>
  </div>
</header>

<div class="board-wrap">
  <div class="board">
    <div class="col-header corner">lane \\ col</div>
    ${cols.map(c => `<div class="col-header" data-col="${c}"><div class="title"><i class="bar"></i>${colLabel[c]}</div><span class="n">${counts[c]}</span></div>`).join('\n    ')}

    <div class="lane-label a">Lane A<span class="sub">Corpus & Ingestion</span></div>
    ${renderSwimlane('A', 'A')}

    <div class="lane-label b">Lane B<span class="sub">Platform & Experience</span></div>
    ${renderSwimlane('B', 'B')}
  </div>
</div>

<div class="footnote">
  Live view. Server parses <a href="TODO.md">docs/plans/TODO.md</a> on every request.
  Lane assignment from the Worklanes table; column from each ticket's <b>Status:</b> line.
  Agents: <a href="/api/tickets">/api/tickets</a> returns JSON · <a href="/api/events">/api/events</a> SSE stream.
  Page auto-refreshes when TODO.md changes. Other machines: tunnel the port (<code>ngrok http ${PORT}</code> or <code>cloudflared tunnel --url http://localhost:${PORT}</code>).
</div>

<script>
// auto-refresh via SSE
const evtSource = new EventSource('/api/events');
evtSource.addEventListener('reload', () => {
  console.log('[kanban] TODO.md changed — reloading');
  location.reload();
});

const btns = document.querySelectorAll(".filter-btn");
btns.forEach(b => b.addEventListener("click", () => {
  btns.forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  const f = b.dataset.filter;
  document.querySelectorAll(".card").forEach(card => {
    card.classList.toggle("hidden", !(f === "all" || card.dataset.lane === f));
  });
  // hide empty swim cells when their lane is filtered out
  document.querySelectorAll(".swim-cell").forEach(cell => {
    const visible = cell.querySelectorAll(".card:not(.hidden)").length;
    cell.style.display = (f === "all" || cell.dataset.lane === f) ? "" : "none";
  });
}));
</script>
</body>
</html>`
}

// ── server ───────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  try {
    if (req.url === '/api/health') {
      const st = statSync(TODO_PATH)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: true, source: TODO_PATH, mtime: st.mtime.toISOString() }))
      return
    }
    if (req.url === '/api/events') {
      res.writeHead(200, {
        'content-type': 'text/event-stream',
        'cache-control': 'no-cache',
        'connection': 'keep-alive',
        'access-control-allow-origin': '*',
      })
      res.write(`event: connected\ndata: ${new Date().toISOString()}\n\n`)
      sseClients.add(res)
      req.on('close', () => sseClients.delete(res))
      return
    }
    if (req.url === '/api/tickets') {
      const { tickets } = readTodo()
      res.writeHead(200, {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      })
      res.end(JSON.stringify({
        generated: new Date().toISOString(),
        source: 'docs/plans/TODO.md',
        count: tickets.length,
        tickets,
      }, null, 2))
      return
    }
    if (req.url === '/' || req.url === '/index.html') {
      const { tickets } = readTodo()
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
      res.end(renderHtml(tickets))
      return
    }
    res.writeHead(404, { 'content-type': 'text/plain' })
    res.end('not found. try / or /api/tickets')
  } catch (e) {
    res.writeHead(500, { 'content-type': 'text/plain' })
    res.end('kanban-server error: ' + e.message)
  }
})

server.listen(PORT, () => {
  console.log(`kanban live → http://localhost:${PORT}`)
  console.log(`  HTML:  http://localhost:${PORT}/`)
  console.log(`  JSON:  http://localhost:${PORT}/api/tickets`)
  console.log(`  src:   ${TODO_PATH}`)
})
