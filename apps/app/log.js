// log.js
import fs from "fs";
import path from "path";

const LOG = path.resolve("LOG.md");
const SEQ = path.resolve(".log.seq");
const LOCK = path.resolve(".log.lock");

function iso() { return new Date().toISOString(); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function withLock(fn, ttlMs = 30000) {
  const start = Date.now();
  while (true) {
    try {
      const fd = fs.openSync(LOCK, "wx"); // fail if exists
      try { await fn(); }
      finally { fs.closeSync(fd); fs.rmSync(LOCK, { force: true }); }
      return;
    } catch {
      if (fs.existsSync(LOCK)) {
        const st = fs.statSync(LOCK);
        if (Date.now() - st.mtimeMs > ttlMs) { fs.rmSync(LOCK, { force: true }); continue; }
      }
      if (Date.now() - start > ttlMs) throw new Error("lock-timeout");
      await sleep(50 + Math.floor(Math.random() * 150));
    }
  }
}

function nextSeq() {
  let n = 0;
  if (fs.existsSync(SEQ)) {
    const s = fs.readFileSync(SEQ, "utf8").trim();
    if (s) n = parseInt(s, 10);
  }
  const next = Number.isFinite(n) ? n + 1 : 1;
  fs.writeFileSync(SEQ, String(next));
  return next;
}

function getLastOtherSeq(me) {
  if (!fs.existsSync(LOG)) return 0;
  const lines = fs.readFileSync(LOG, "utf8").trim().split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/^### \[agent=(\S+) seq=(\d+) ack=(\d+) type=(\S+) ts=([^\]]+)\]$/);
    if (m) {
      const agent = m[1], seq = parseInt(m[2], 10);
      if (agent !== me) return seq;
    }
  }
  return 0;
}

export async function appendEntry({
  agent, type, ack, ts, sections = {}
}) {
  await withLock(async () => {
    const seq = nextSeq();
    const _ts = ts || iso();
    const header = `### [agent=${agent} seq=${seq} ack=${ack} type=${type} ts=${_ts}]`;
    const parts = [];

    const order = [
      "Summary", "Did", "Working", "Not working / risks",
      "Files changed", "Next (awaiting approval)", "Questions for USER", "Approval"
    ];
    for (const title of order) {
      const val = sections[title];
      if (!val) continue;
      parts.push(`\n#### ${title}\n${typeof val === "string" ? val.trim() : val.join("\n")}\n`);
    }

    const block = [header, ...parts, "\n"].join("\n");
    fs.appendFileSync(LOG, block);
  });
}

// simple helper that computes ack automatically
export function computeAck(me) { return getLastOtherSeq(me); }