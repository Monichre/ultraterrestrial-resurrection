'use client'

import type {Meta, StoryObj} from '@storybook/nextjs'
import {useEffect, useMemo, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type SourceFormat = 'markdown' | 'typescript' | 'text' | 'html' | 'image'

interface BrandBibleSourceProps {
  filePath: string
  format: SourceFormat
  title: string
}

function BrandBibleSource({filePath, format, title}: BrandBibleSourceProps) {
  const [source, setSource] = useState('')
  const [error, setError] = useState('')
  const sourceUrl = useMemo(() => encodeURI(`/brand-bible/${filePath}`), [filePath])
  const isFetchedSource = format === 'markdown' || format === 'typescript' || format === 'text'

  useEffect(() => {
    if (!isFetchedSource) return

    const controller = new AbortController()
    setSource('')
    setError('')

    fetch(sourceUrl, {signal: controller.signal})
      .then((response) => {
        if (!response.ok) throw new Error(`Source request failed with ${response.status}`)
        return response.text()
      })
      .then(setSource)
      .catch((requestError: Error) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })

    return () => controller.abort()
  }, [isFetchedSource, sourceUrl])

  return (
    <main className='min-h-screen w-full bg-[#090a0a] px-6 py-10 text-[#e8e4d8] md:px-12'>
      <header className='mx-auto mb-8 flex w-full max-w-6xl flex-col gap-3 border-b border-[#41433f] pb-6'>
        <span className='font-mono text-[10px] uppercase tracking-[0.18em] text-[#b7b1a3]'>
          Design source · Brand Bible archive
        </span>
        <h1 className='text-3xl font-semibold tracking-[-0.03em] text-[#f2eee3]'>{title}</h1>
        <code className='font-mono text-xs text-[#8f948d]'>{filePath}</code>
      </header>

      {error && (
        <div className='mx-auto max-w-6xl border border-red-900 bg-red-950/40 p-5 font-mono text-sm text-red-200'>
          {error}
        </div>
      )}

      {isFetchedSource && !source && !error && (
        <div className='mx-auto max-w-6xl animate-pulse border border-[#343632] bg-[#111312] p-8 font-mono text-xs uppercase tracking-[0.16em] text-[#8f948d]'>
          Loading source document…
        </div>
      )}

      {format === 'markdown' && source && (
        <article className='mx-auto w-full max-w-6xl space-y-5 text-[15px] leading-7 text-[#d6d2c8]'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({children}) => (
                <h1 className='mt-10 border-b border-[#343632] pb-4 text-3xl font-semibold text-[#f2eee3]'>
                  {children}
                </h1>
              ),
              h2: ({children}) => (
                <h2 className='mt-10 text-xl font-semibold uppercase tracking-[0.04em] text-[#ede8db]'>
                  {children}
                </h2>
              ),
              h3: ({children}) => (
                <h3 className='mt-8 text-lg font-semibold text-[#ded9cd]'>{children}</h3>
              ),
              p: ({children}) => <p className='max-w-4xl'>{children}</p>,
              ul: ({children}) => <ul className='ml-6 list-disc space-y-2'>{children}</ul>,
              ol: ({children}) => <ol className='ml-6 list-decimal space-y-2'>{children}</ol>,
              blockquote: ({children}) => (
                <blockquote className='border-l-2 border-[#9b2f2f] bg-[#121413] px-5 py-3 text-[#c7c2b6]'>
                  {children}
                </blockquote>
              ),
              code: ({children}) => (
                <code className='rounded bg-[#171918] px-1.5 py-0.5 font-mono text-[0.9em] text-[#e5dfd1]'>
                  {children}
                </code>
              ),
              pre: ({children}) => (
                <pre className='overflow-x-auto border border-[#343632] bg-[#101211] p-5 font-mono text-xs leading-6'>
                  {children}
                </pre>
              ),
              table: ({children}) => (
                <div className='overflow-x-auto'>
                  <table className='w-full border-collapse text-left text-sm'>{children}</table>
                </div>
              ),
              th: ({children}) => (
                <th className='border border-[#3b3d39] bg-[#171918] px-3 py-2 font-mono text-xs uppercase tracking-wider'>
                  {children}
                </th>
              ),
              td: ({children}) => (
                <td className='border border-[#343632] px-3 py-2 align-top'>{children}</td>
              ),
              a: ({children, href}) => (
                <a
                  className='text-[#c78563] underline underline-offset-4'
                  href={href}
                  target='_blank'
                  rel='noreferrer'
                >
                  {children}
                </a>
              ),
            }}
          >
            {source}
          </ReactMarkdown>
        </article>
      )}

      {(format === 'typescript' || format === 'text') && source && (
        <pre className='mx-auto max-h-[calc(100vh-14rem)] w-full max-w-6xl overflow-auto border border-[#343632] bg-[#101211] p-6 font-mono text-xs leading-6 text-[#d8d3c7]'>
          {source}
        </pre>
      )}

      {format === 'image' && (
        <figure className='mx-auto flex w-full max-w-6xl justify-center border border-[#343632] bg-[#111312] p-4'>
          <img
            className='max-h-[calc(100vh-14rem)] max-w-full object-contain'
            src={sourceUrl}
            alt={title}
          />
        </figure>
      )}

      {format === 'html' && (
        <iframe
          className='mx-auto h-[calc(100vh-14rem)] w-full max-w-6xl border border-[#343632] bg-white'
          src={sourceUrl}
          title={title}
          sandbox='allow-same-origin allow-scripts'
        />
      )}
    </main>
  )
}

const meta = {
  title: 'Design Sources/Brand Bible/Archive',
  component: BrandBibleSource,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'black'},
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof BrandBibleSource>

export default meta
type Story = StoryObj<typeof meta>

function sourceStory(name: string, filePath: string, format: SourceFormat = 'markdown'): Story {
  return {name, args: {title: name, filePath, format}}
}

export const MasterBrandBible = sourceStory('00 · Master Brand Bible', '00_MASTER_BRAND_BIBLE.md')
export const ResearchUiAgent = sourceStory('01 · Research UI Agent', '01_RESEARCH_UI_AGENT.md')
export const ImplementationRoadmap = sourceStory(
  '02 · Implementation Roadmap',
  '02_IMPLEMENTATION_ROADMAP.md'
)
export const PolaroidsComponentSpec = sourceStory(
  '03 · Polaroids Component Spec',
  '03_POLAROIDS_COMPONENT_SPEC.md'
)
export const DesignReviewNotes = sourceStory(
  '04 · Design Review Notes',
  '04_DESIGN_REVIEW_NOTES.md'
)
export const PromptTokens = sourceStory('05 · Prompt Tokens', '05_PROMPT_TOKENS.md')
export const DesignTokens = sourceStory('06 · Design Tokens', '06_DESIGN_TOKENS.ts', 'typescript')
export const PackageIndex = sourceStory('07 · Package Index', '07_PACKAGE_INDEX.md')
export const PromptLibraryReadme = sourceStory(
  '08 · Prompt Library / README',
  '08_PROMPT_LIBRARY/README.md'
)
export const InvestigativeResearchAssistant = sourceStory(
  '08 · Prompt Library / Investigative Research Assistant',
  '08_PROMPT_LIBRARY/investigative-research-assistant.md'
)
export const MoltpassClientSkill = sourceStory(
  '08 · Prompt Library / Moltpass Client Skill',
  '08_PROMPT_LIBRARY/moltpass-client-skill.md'
)
export const EvidentiarySublime = sourceStory(
  '09 · Canvas Study / Evidentiary Sublime',
  '09_CANVAS_STUDIES/EVIDENTIARY_SUBLIME.md'
)
export const EvidentiarySublimePlate = sourceStory(
  '09 · Canvas Study / Plate 047',
  '09_CANVAS_STUDIES/plate_047.png',
  'image'
)
export const DesignCanonReadme = sourceStory('Design Canon / README', 'Design Canon/README.md')
export const ArchivalDystopianAesthetic = sourceStory(
  'Design Canon / Archival Dystopian Aesthetic',
  'Design Canon/ARCHIVAL_DYSTOPIAN_AESTHETIC.md'
)
export const DesignSystem = sourceStory(
  'Design Canon / Design System',
  'Design Canon/DESIGN_SYSTEM.md'
)
export const ResearchCanvasAesthetic = sourceStory(
  'Design Canon / Research Canvas Aesthetic',
  'Design Canon/RESEARCH_CANVAS_AESTHETIC.md'
)
export const ResearchUiDesignGuide = sourceStory(
  'Design Canon / Research UI Design Guide',
  'Design Canon/RESEARCH_UI_DESIGN_GUIDE.md'
)
export const BrandBibleReadme = sourceStory('Brand Bible / README', 'README.md')
export const UfoFiles = sourceStory('UFO Files', 'UFO files.md')
export const PhotoPromptsHtml = sourceStory(
  'Ultraterrestrial Photo Prompts / HTML',
  'Ultraterrestrial photo prompts.html',
  'html'
)
export const PhotoPromptsText = sourceStory(
  'Ultraterrestrial Photo Prompts / Text',
  'Ultraterrestrial photo prompts.txt',
  'text'
)
