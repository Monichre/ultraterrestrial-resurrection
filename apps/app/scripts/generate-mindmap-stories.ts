/*
  Mindmap Story Generator
  - Scans apps/app/src/features/mindmap/components for .tsx files
  - Creates a colocated .stories.tsx for any component without one
  - Skips index.tsx and existing *.stories.tsx
  - Uses CSF3 format and groups under Mindmap/<subpath>
  - Heuristically creates placeholder stories for components requiring heavy providers/contexts
*/

import { promises as fs } from 'fs'
import * as path from 'path'

const COMPONENTS_ROOT = path.resolve( __dirname, '../src/features/mindmap/components' )

async function pathExists( p: string ): Promise<boolean> {
  try {
    await fs.access( p )
    return true
  } catch {
    return false
  }
}

async function* walk( dir: string ): AsyncGenerator<string> {
  const entries = await fs.readdir( dir, { withFileTypes: true } )
  for ( const entry of entries ) {
    const fullPath = path.join( dir, entry.name )
    if ( entry.isDirectory() ) {
      yield* walk( fullPath )
    } else if ( entry.isFile() ) {
      yield fullPath
    }
  }
}

function toStoryTitle( fullFilePath: string ): string {
  const rel = path.relative( COMPONENTS_ROOT, fullFilePath )
  const withoutExt = rel.replace( /\.tsx?$/, '' )
  const parts = withoutExt.split( path.sep )
  // Build title as Mindmap/<subdir>/<FileName>
  return ['Mindmap', ...parts].join( '/' )
}

function detectExport( fileContent: string ): {
  importName: string | null
  importKind: 'named' | 'default' | null
  isHeavy: boolean
} {
  const namedMatch = fileContent.match( /export\s+(?:const|function)\s+([A-Z][A-Za-z0-9_]*)/ )
  const defaultNamedFn = fileContent.match( /export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)/ )
  const defaultRef = fileContent.match( /export\s+default\s+([A-Z][A-Za-z0-9_]*)/ )

  const heavyPatterns = /(useMindMap|useMindMapStore|useAssistant|useAIMindMap|useSessionNotes|useResearch|useRouter\(|useParams\(|usePathname\()/
  const isHeavy = heavyPatterns.test( fileContent )

  if ( namedMatch ) return { importName: namedMatch[1], importKind: 'named', isHeavy }
  if ( defaultNamedFn ) return { importName: defaultNamedFn[1], importKind: 'default', isHeavy }
  if ( defaultRef ) return { importName: defaultRef[1], importKind: 'default', isHeavy }
  return { importName: null, importKind: null, isHeavy }
}

function storyTemplate( opts: {
  title: string
  componentImportPath: string
  componentName: string | null
  importKind: 'named' | 'default' | null
  placeholder: boolean
} ): string {
  const { title, componentImportPath, componentName, importKind, placeholder } = opts

  const importLine = componentName
    ? importKind === 'named'
      ? `import { ${componentName} } from '${componentImportPath}'`
      : `import ${componentName} from '${componentImportPath}'`
    : ''

  const componentId = componentName || 'Placeholder'

  const placeholderBlock = placeholder || !componentName
    ? `
const Placeholder = () => (
  <div style={{ padding: 16, color: '#9CA3AF' }}>
    Placeholder for ${path.basename( componentImportPath )} (complex providers required)
  </div>
)
`
    : ''

  const componentRef = placeholder || !componentName ? 'Placeholder' : componentId

  return `import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
${importLine}
${placeholderBlock}

const meta = {
  title: '${title}',
  component: ${componentRef},
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof ${componentRef}>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
}
`
}

async function generateStoryForFile( filePath: string ): Promise<void> {
  const baseName = path.basename( filePath )
  if ( baseName.endsWith( '.stories.tsx' ) ) return
  if ( baseName === 'index.tsx' ) return
  if ( !baseName.endsWith( '.tsx' ) ) return

  const storyPath = filePath.replace( /\.tsx$/, '.stories.tsx' )
  if ( await pathExists( storyPath ) ) return

  const content = await fs.readFile( filePath, 'utf8' )
  const { importName, importKind, isHeavy } = detectExport( content )

  const relImport = './' + path.basename( filePath ).replace( /\.tsx$/, '' )
  const title = toStoryTitle( filePath )

  const story = storyTemplate( {
    title,
    componentImportPath: relImport,
    componentName: importName,
    importKind: importKind,
    placeholder: isHeavy,
  } )

  await fs.writeFile( storyPath, story, 'utf8' )
  console.log( `Created: ${path.relative( COMPONENTS_ROOT, storyPath )}` )
}

async function main() {
  console.log( `Scanning: ${COMPONENTS_ROOT}` )
  let created = 0
  for await ( const file of walk( COMPONENTS_ROOT ) ) {
    if ( file.endsWith( '.tsx' ) ) {
      await generateStoryForFile( file )
      created += 1
    }
  }
  console.log( 'Done.' )
}

main().catch( ( err ) => {
  console.error( err )
  process.exit( 1 )
} )


