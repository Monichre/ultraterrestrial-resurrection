#!/usr/bin/env ts-node
/*
  packages/ai/prompts/scripts/promptctl.ts
  Tiny CLI to list / validate / render / bump prompt templates.

  Requirements:
    - npm i yaml ajv semver
  Optional:
    - --dir <path> flag, or PROMPTS_DIR env var, to override the default
      (the package root, packages/ai/prompts)
*/
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

( async () => {
  const rawArgs = process.argv.slice( 2 )
  // --dir <path> or --dir=<path> overrides PROMPTS_DIR and the package root.
  let dirFlag: string | undefined
  const args: string[] = []
  for ( let i = 0; i < rawArgs.length; i++ ) {
    const a = rawArgs[i]
    if ( a === '--dir' ) {
      dirFlag = rawArgs[++i]
      if ( !dirFlag ) {
        console.error( 'Missing value for --dir' )
        process.exit( 2 )
      }
    } else if ( a.startsWith( '--dir=' ) ) {
      dirFlag = a.slice( '--dir='.length )
    } else {
      args.push( a )
    }
  }
  const cmd = args[0]
  const scriptDir = path.dirname( fileURLToPath( import.meta.url ) )
  const packageRoot = path.resolve( scriptDir, '..' )
  const base = path.resolve( dirFlag || process.env.PROMPTS_DIR || packageRoot )

  async function fileExists( p: string ) {
    try { await fs.access( p ); return true } catch { return false }
  }

  async function loadRegistry() {
    const p = path.join( base, 'registry.yaml' )
    if ( !( await fileExists( p ) ) ) {
      console.error( `Prompt registry not found: ${p}` )
      process.exit( 1 )
    }
    const raw = await fs.readFile( p, 'utf8' )
    const data = YAML.parse( raw )
    return { file: p, data }
  }

  // Read and parse a registry entry's template; null (with a message) when the file is missing.
  async function readTemplate( entry: any ): Promise<{ path: string, tpl: any } | null> {
    if ( !entry.file ) {
      console.error( `Registry entry ${entry.id} has no file` )
      return null
    }
    const tplPath = path.join( base, entry.file )
    if ( !( await fileExists( tplPath ) ) ) {
      console.error( `Template missing for ${entry.id}: ${entry.file}` )
      return null
    }
    return { path: tplPath, tpl: YAML.parse( await fs.readFile( tplPath, 'utf8' ) ) }
  }

  function parseVars( rest: string[] ) {
    const vars: Record<string, string> = {}
    for ( const token of rest ) {
      const m = token.match( /^([A-Za-z0-9_\-.]+)=(.*)$/ )
      if ( m ) vars[m[1]] = m[2]
    }
    return vars
  }

  function bump( version: string, kind: 'patch' | 'minor' | 'major' = 'patch' ) {
    const [ma, mi, pa] = version.split( '.' ).map( n => parseInt( n, 10 ) )
    if ( kind === 'patch' ) return `${ma}.${mi}.${pa + 1}`
    if ( kind === 'minor' ) return `${ma}.${mi + 1}.0`
    return `${ma + 1}.0.0`
  }

  async function list() {
    const { data } = await loadRegistry()
    const list = ( data.prompts || [] ) as any[]
    for ( const p of list ) {
      console.log( `${p.id}\t${p.version}\t${p.file}` )
    }
  }

  async function render() {
    const id = args[1]
    if ( !id ) {
      console.error( 'Usage: promptctl render <id> [VAR=value ...]' )
      process.exit( 2 )
    }
    const { data } = await loadRegistry()
    const entry = ( data.prompts || [] ).find( ( p: any ) => p.id === id || ( p.aliases || [] ).includes( id ) )
    if ( !entry ) {
      console.error( `Prompt not found: ${id}` )
      process.exit( 1 )
    }
    const loaded = await readTemplate( entry )
    if ( !loaded ) process.exit( 1 )
    const { tpl } = loaded
    const vars = parseVars( args.slice( 2 ) )
    const rendered = String( tpl.prompt || '' ).replace( /\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g, ( _m, k ) => vars[k] ?? '' )
    console.log( rendered )
  }

  async function validate() {
    const { data } = await loadRegistry()
    const Ajv = ( await import( 'ajv' ) ).default
    const ajv = new Ajv( { allErrors: true, strict: false } )

    // Load prompt schema
    const promptSchemaPath = path.join( base, 'schemas', 'prompt.schema.json' )
    if ( !( await fileExists( promptSchemaPath ) ) ) {
      // schemas/ is not git-tracked yet (T-077), so a fresh clone lands here.
      console.error( `Prompt schema not found: ${promptSchemaPath}` )
      process.exit( 1 )
    }
    const promptSchema = JSON.parse( await fs.readFile( promptSchemaPath, 'utf8' ) )
    const validatePrompt = ajv.compile( promptSchema )

    let failures = 0
    for ( const entry of ( data.prompts || [] ) ) {
      const loaded = await readTemplate( entry )
      if ( !loaded ) { failures++; continue }
      const { tpl } = loaded
      const ok = validatePrompt( tpl )
      if ( !ok ) {
        failures++
        console.error( `Invalid prompt YAML: ${entry.id}` )
        console.error( validatePrompt.errors )
      }
      // Validate that referenced output schema exists
      const schemaRef = tpl.schema_ref || entry.schema
      if ( schemaRef ) {
        const sPath = path.join( base, schemaRef )
        if ( !( await fileExists( sPath ) ) ) {
          failures++
          console.error( `Missing output schema for ${entry.id}: ${schemaRef}` )
        }
      }
    }
    if ( failures > 0 ) process.exit( 1 )
    console.log( 'All prompts valid' )
  }

  async function bumpCmd() {
    const id = args[1]
    const kind = ( args[2] as any ) || 'patch'
    if ( !id ) {
      console.error( 'Usage: promptctl bump <id> [patch|minor|major]' )
      process.exit( 2 )
    }
    const { file: regPath, data } = await loadRegistry()
    const entry = ( data.prompts || [] ).find( ( p: any ) => p.id === id || ( p.aliases || [] ).includes( id ) )
    if ( !entry ) {
      console.error( `Prompt not found: ${id}` )
      process.exit( 1 )
    }
    // Bump in template
    const loaded = await readTemplate( entry )
    if ( !loaded ) process.exit( 1 )
    const { path: tplPath, tpl } = loaded
    const next = bump( String( tpl.version || entry.version || '0.0.0' ), kind )
    tpl.version = next
    await fs.writeFile( tplPath, YAML.stringify( tpl ) )
    // Bump in registry
    entry.version = next
    await fs.writeFile( regPath, YAML.stringify( data ) )
    console.log( `${id} bumped to ${next}` )
  }

  switch ( cmd ) {
    case 'list':
      await list(); break
    case 'render':
      await render(); break
    case 'validate':
      await validate(); break
    case 'bump':
      await bumpCmd(); break
    default:
      console.log( `Usage:
  promptctl list [--dir path]
  promptctl validate [--dir path]
  promptctl render <id> [VAR=value ...]
  promptctl bump <id> [patch|minor|major]
`)
      process.exit( 2 )
  }
} )().catch( err => { console.error( err ); process.exit( 1 ) } )
