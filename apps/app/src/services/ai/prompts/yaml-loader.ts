/*
  Cross-language YAML prompt loader (TypeScript)
  - Requires: npm i yaml
  - Respects PROMPTS_DIR or defaults to repoRoot/prompts
*/
import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export type LoadedPrompt = {
  id: string;
  version?: string;
  prompt: string;
  schema?: any;
  meta: Record<string, any>;
};

function interpolate(template: string, params: Record<string, any> = {}): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_m, key) => {
    const v = params[key];
    return v === undefined || v === null ? '' : String(v);
  });
}

async function fileExists(p: string) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function resolvePromptsDir(custom?: string): Promise<string> {
  if (custom) return custom;
  if (process.env.PROMPTS_DIR) return process.env.PROMPTS_DIR;
  const cwd = process.cwd();
  const candidates = [
    // Prefer new monorepo location
    path.join(cwd, 'packages', 'prompts'),
    // Legacy root-level prompts folder
    path.join(cwd, 'prompts'),
    // Resolve relative to this file back to repo root
    path.resolve(__dirname, '../../../../..', 'packages', 'prompts'),
    path.resolve(__dirname, '../../../../..', 'prompts'),
  ];
  for (const p of candidates) {
    if (await fileExists(p)) return p;
  }
  // Fallback to last candidate if none exist
  return candidates[candidates.length - 1];
}

export async function listPrompts(options?: { promptsDir?: string }) {
  const dir = await resolvePromptsDir(options?.promptsDir);
  let indexPath = path.join(dir, 'registry.yaml');
  if (!(await fileExists(indexPath))) {
    indexPath = path.join(dir, 'index.yaml');
  }
  const raw = await fs.readFile(indexPath, 'utf8');
  const parsed = YAML.parse(raw) as { prompts: Array<Record<string, any>> };
  return parsed.prompts as Array<{ id: string; file: string; schema?: string; version?: string; tags?: string[]; aliases?: string[] }>;
}

export async function loadPrompt(
  id: string,
  params?: Record<string, any>,
  options?: { promptsDir?: string }
): Promise<LoadedPrompt> {
  const dir = await resolvePromptsDir(options?.promptsDir);
  const idx = await listPrompts({ promptsDir: dir });
  const entry = idx.find(p => p.id === id);
  if (!entry) throw new Error(`Prompt not found in index: ${id}`);

  const tplPath = path.join(dir, entry.file);
  const tplRaw = await fs.readFile(tplPath, 'utf8');
  const tpl = YAML.parse(tplRaw) as any;

  const rendered = interpolate(String(tpl.prompt ?? ''), params);

  let schema: any | undefined;
  const schemaRef = tpl.schema_ref ?? entry.schema; // allow either
  if (schemaRef) {
    const schemaPath = path.join(dir, schemaRef);
    if (await fileExists(schemaPath)) {
      const sRaw = await fs.readFile(schemaPath, 'utf8');
      try { schema = JSON.parse(sRaw); } catch { schema = undefined; }
    }
  }

  const meta = {
    id: tpl.id ?? id,
    version: tpl.version ?? entry.version,
    description: tpl.description,
    owner: tpl.owner,
    tags: tpl.tags,
    runtime: tpl.runtime,
    variables: tpl.variables,
    schema_ref: schemaRef,
    source: path.relative(process.cwd(), tplPath),
  };

  return { id, version: meta.version, prompt: rendered, schema, meta };
}
