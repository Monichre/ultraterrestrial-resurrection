/*
  Cross-language YAML prompt loader (TypeScript)
  - Requires: yaml
  - Respects PROMPTS_DIR or defaults to packages/prompts
*/
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

export type LoadedPrompt = {
  id: string
  version?: string
  prompt: string
  schema?: unknown
  meta: Record<string, unknown>
}

export type PromptRegistryEntry = {
  id: string
  file: string
  schema?: string
  version?: string
  tags?: string[]
  aliases?: string[]
}

function interpolate( template: string, params: Record<string, unknown> = {} ): string {
  return template.replace( /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, ( _m, key ) => {
    const v = params[key]
    return v === undefined || v === null ? '' : String( v )
  } )
}

function fileExistsSync( p: string ): boolean {
  try {
    fs.accessSync( p )
    return true
  } catch {
    return false
  }
}

async function fileExists( p: string ) {
  try {
    await fsPromises.access( p )
    return true
  } catch {
    return false
  }
}

function resolvePromptsDirSync( custom?: string ): string {
  if ( custom ) return custom
  if ( process.env.PROMPTS_DIR ) return process.env.PROMPTS_DIR

  const moduleDir = path.dirname( fileURLToPath( import.meta.url ) )
  const candidates = [
    path.join( process.cwd(), 'packages', 'prompts' ),
    path.join( process.cwd(), 'prompts' ),
    moduleDir,
  ]

  for ( const p of candidates ) {
    if ( fileExistsSync( path.join( p, 'registry.yaml' ) ) ) return p
  }

  return moduleDir
}

async function resolvePromptsDir( custom?: string ): Promise<string> {
  return resolvePromptsDirSync( custom )
}

function findRegistryEntry(
  entries: PromptRegistryEntry[],
  id: string
): PromptRegistryEntry | undefined {
  return entries.find( ( p ) => p.id === id || ( p.aliases ?? [] ).includes( id ) )
}

function readRegistrySync( dir: string ): PromptRegistryEntry[] {
  const indexPath = path.join( dir, 'registry.yaml' )
  if ( !fileExistsSync( indexPath ) ) {
    throw new Error( `Prompt registry not found: ${indexPath}` )
  }
  const raw = fs.readFileSync( indexPath, 'utf8' )
  const parsed = YAML.parse( raw ) as { prompts: PromptRegistryEntry[] }
  return parsed.prompts
}

async function readRegistry( dir: string ): Promise<PromptRegistryEntry[]> {
  return readRegistrySync( dir )
}

function loadPromptFromEntry(
  dir: string,
  id: string,
  entry: PromptRegistryEntry,
  params?: Record<string, unknown>
): LoadedPrompt {
  const tplPath = path.join( dir, entry.file )
  const tplRaw = fs.readFileSync( tplPath, 'utf8' )
  const tpl = YAML.parse( tplRaw ) as Record<string, unknown>

  const rendered = interpolate( String( tpl.prompt ?? '' ), params )

  let schema: unknown
  const schemaRef = ( tpl.schema_ref as string | undefined ) ?? entry.schema
  if ( schemaRef ) {
    const schemaPath = path.join( dir, schemaRef )
    if ( fileExistsSync( schemaPath ) ) {
      try {
        schema = JSON.parse( fs.readFileSync( schemaPath, 'utf8' ) )
      } catch {
        schema = undefined
      }
    }
  }

  const meta = {
    id: ( tpl.id as string | undefined ) ?? id,
    version: ( tpl.version as string | undefined ) ?? entry.version,
    description: tpl.description,
    owner: tpl.owner,
    tags: tpl.tags,
    runtime: tpl.runtime,
    variables: tpl.variables,
    schema_ref: schemaRef,
    source: path.relative( process.cwd(), tplPath ),
  }

  return { id, version: meta.version as string | undefined, prompt: rendered, schema, meta }
}

export function loadPromptSync(
  id: string,
  params?: Record<string, unknown>,
  options?: { promptsDir?: string }
): LoadedPrompt {
  const dir = resolvePromptsDirSync( options?.promptsDir )
  const idx = readRegistrySync( dir )
  const entry = findRegistryEntry( idx, id )
  if ( !entry ) throw new Error( `Prompt not found in registry: ${id}` )
  return loadPromptFromEntry( dir, id, entry, params )
}

export async function loadPrompt(
  id: string,
  params?: Record<string, unknown>,
  options?: { promptsDir?: string }
): Promise<LoadedPrompt> {
  const dir = await resolvePromptsDir( options?.promptsDir )
  const idx = await readRegistry( dir )
  const entry = findRegistryEntry( idx, id )
  if ( !entry ) throw new Error( `Prompt not found in registry: ${id}` )
  return loadPromptFromEntry( dir, id, entry, params )
}

export async function listPrompts( options?: { promptsDir?: string } ) {
  const dir = await resolvePromptsDir( options?.promptsDir )
  return readRegistry( dir )
}

export function listPromptsSync( options?: { promptsDir?: string } ) {
  const dir = resolvePromptsDirSync( options?.promptsDir )
  return readRegistrySync( dir )
}
