import fs from 'node:fs';

const p = 'packages/knowledge-base/metadata/index.json';
const j = JSON.parse(fs.readFileSync(p, 'utf8'));

const problems = [];
const absPath = /^\/|^[A-Za-z]:\\/; // unix or win abs

for (const [id, rec] of Object.entries(j.documents)) {
  // 1) required fields
  for (const k of ['title','doc_type','path','created_at','updated_at','metadata']) {
    if (!(k in rec)) problems.push([id, `missing ${k}`]);
  }
  // 2) doc_type enum
  if (!['file','transcript','web'].includes(rec.doc_type)) {
    problems.push([id, `bad doc_type: ${rec.doc_type}`]);
  }
  // 3) relative path
  if (absPath.test(rec.path)) {
    problems.push([id, `path is absolute: ${rec.path}`]);
  }
  // 4) metadata.original_path sanity
  const op = rec?.metadata?.original_path;
  if (!op || typeof op !== 'string') {
    problems.push([id, 'missing metadata.original_path']);
  } else {
    if (!op.startsWith('sources/') && !op.startsWith('transcripts/')) {
      problems.push([id, `original_path not under sources/ or transcripts/: ${op}`]);
    }
    if (op.includes('sources/files/sources/files')) {
      problems.push([id, `duplicated sources/files in original_path: ${op}`]);
    }
    if (!op.includes('/')) {
      problems.push([id, `original_path missing directory component: ${op}`]);
    }
  }
  // 5) file_size/file_type
  for (const mk of ['file_size','file_type']) {
    if (!(mk in (rec.metadata || {}))) problems.push([id, `missing metadata.${mk}`]);
  }
}

if (problems.length) {
  console.error('❌ Problems found:');
  for (const [id, msg] of problems) console.error(`- ${id}: ${msg}`);
  process.exitCode = 1;
} else {
  console.log('✅ index.json looks consistent.');
}