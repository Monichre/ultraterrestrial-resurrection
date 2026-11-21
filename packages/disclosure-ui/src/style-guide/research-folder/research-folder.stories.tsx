import type { Meta, StoryObj } from '@storybook/react'
import { useEffect, useRef, useState } from 'react'
import { ResearchFolder } from './research-folder'
import type { ResearchFolderProps } from './research-folder'
import { PolaroidStack } from './polaroid-stack'
import type { FolderPhotograph } from './polaroid-stack'
import './research-folder.stories.css'

const meta: Meta<typeof ResearchFolder> = {
  title: 'Reference Studies/Research Folder',
  component: ResearchFolder,
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  argTypes: {
    width: { control: { type: 'range', min: 420, max: 720, step: 20 } },
    paperGrain: { control: { type: 'range', min: 0, max: 0.3, step: 0.02 } },
    bodyType: { control: 'select', options: ['technical', 'artifact', 'ui'] },
    stiffness: { control: { type: 'range', min: 120, max: 500, step: 20 } },
    damping: { control: { type: 'range', min: 18, max: 50, step: 2 } },
    stackStagger: {
      control: { type: 'range', min: 0, max: 0.15, step: 0.015 },
    },
    side: { control: 'select', options: ['left', 'right'] },
    panels: { table: { disable: true } },
    value: { table: { disable: true } },
    open: { table: { disable: true } },
    title: { table: { disable: true } },
    returnFocusRef: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
}
export default meta
type Story = StoryObj<typeof ResearchFolder>

// The same stock portrait used by the existing Polaroid stories; never source evidence.
const portraitStudy: FolderPhotograph[] = [1, 2, 3].map((index) => ({
  id: `portrait-${index}`,
  src: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop',
  alt: 'Stock portrait of a man used for the key-figure interface study',
  caption: `Portrait study / 0${index}`,
}))

function FolderDesk(args: ResearchFolderProps) {
  const launcherRef = useRef<HTMLButtonElement | null>(null)
  const [open, setOpen] = useState(true)
  const [value, setValue] = useState('record')
  const [record, setRecord] = useState('Field observation')
  const [photos, setPhotos] = useState<FolderPhotograph[]>([])
  const [loadVersion, setLoadVersion] = useState(0)
  const keyFigure = record === 'Key figure study'
  const restartPhotos = () => {
    setPhotos([])
    setLoadVersion((version) => version + 1)
  }

  useEffect(() => {
    setPhotos([])
    if (!keyFigure) return
    // Simulate independent data arrivals, canceling when the selected record changes.
    const timers = portraitStudy.map((_, index) =>
      window.setTimeout(
        () => {
          setPhotos(portraitStudy.slice(0, index + 1))
        },
        400 + index * 200,
      ),
    )
    return () => timers.forEach(window.clearTimeout)
  }, [keyFigure, loadVersion])
  const panels = [
    {
      id: 'record',
      label: 'Record',
      children: (
        <>
          <p className="du-folder-meta">
            {keyFigure ? 'Key figure' : 'Document record'} / interface study
          </p>
          <h2>{record}</h2>
          <p>
            {keyFigure
              ? 'A key-figure record with stock photographs for this interface study.'
              : 'This paper surface presents one selected record. Its title, text, and references belong to the material; the canvas holds its position and connections.'}
          </p>
          {!keyFigure && (
            <p>
              A folder gives the related material a place to sit together.
              Changing its tabs brings one sheet forward without losing the
              others.
            </p>
          )}
          {!keyFigure && (
            <>
              <hr />
              <dl>
                <dt>Record type</dt>
                <dd>{keyFigure ? 'Key figure' : 'Document'}</dd>
                <dt>Collection</dt>
                <dd>Design study</dd>
                <dt>Source</dt>
                <dd>Demonstration text</dd>
              </dl>
              <hr />
              <p className="du-folder-meta">
                Prototype fixture — not an archival source
              </p>
            </>
          )}
          {keyFigure && (
            <>
              <button
                type="button"
                className="du-folder-reload-photos"
                onClick={restartPhotos}
              >
                Replay photograph arrival
              </button>
              <PolaroidStack key={`${record}-${loadVersion}`} photos={photos} />
            </>
          )}
        </>
      ),
    },
    {
      id: 'sources',
      label: 'Sources',
      children: (
        <>
          <p className="du-folder-meta">Attached material / 02 items</p>
          <h2>Source material</h2>
          <p>
            A source belongs here with its original title, origin, and document
            reference.
          </p>
          <hr />
          <p>01 / Original document</p>
          <p>02 / Related transcript</p>
          <p className="du-folder-meta">
            Placeholders for layout review; no source files attached.
          </p>
        </>
      ),
    },
    {
      id: 'connections',
      label: 'Links',
      children: (
        <>
          <p className="du-folder-meta">Record relationships</p>
          <h2>Follow the connection.</h2>
          <p>
            The selected record stays connected to the surrounding desk. Select
            the other record on the canvas while this folder is open.
          </p>
          <hr />
          <p>
            The canvas remains usable. Opening a folder does not dim or lock it.
          </p>
        </>
      ),
    },
    {
      id: 'details',
      label: 'Details',
      children: (
        <>
          <p className="du-folder-meta">Presentation notes</p>
          <h2>A place for the detail.</h2>
          <p>
            Labels use technical monospace. The body can use JetBrains Mono,
            Special Elite, or the application reading face.
          </p>
          <p>
            The paper grain stays light enough to preserve the text. Use the
            Storybook controls to tune its strength and the drawer spring.
          </p>
          <hr />
          <p>
            Close the folder with its close control, Escape, or an outward drag
            from the header.
          </p>
        </>
      ),
    },
  ]
  return (
    <main className="du-folder-study">
      <header>
        <span>ULTRATERRESTRIAL / RESEARCH DESK</span>
        <span>Folder study</span>
      </header>
      <div className="du-folder-desk">
        <svg
          aria-hidden="true"
          viewBox="0 0 600 600"
          preserveAspectRatio="none"
        >
          <path d="M 150 220 C 320 220 160 410 350 410" />
        </svg>
        {['Field observation', 'Interview transcript', 'Key figure study'].map(
          (label, index) => (
            <button
              key={label}
              ref={(node) => {
                if (index === 0 && !launcherRef.current)
                  launcherRef.current = node
              }}
              className={`du-folder-record du-folder-record-${index}`}
              aria-pressed={record === label && open}
              onClick={(event) => {
                launcherRef.current = event.currentTarget
                setRecord(label)
                if (label === 'Key figure study')
                  setLoadVersion((version) => version + 1)
                setValue('record')
                setOpen(true)
              }}
            >
              <span>
                {index === 2 ? 'KEY FIGURE' : 'DOCUMENT'} / 0{index + 1}
              </span>
              <strong>{label}</strong>
              <span>Expand record ↗</span>
            </button>
          ),
        )}
        <p className="du-folder-desk-note">
          Select a record to open its folder.
          <br />
          Demonstration records for visual review.
        </p>
      </div>
      <ResearchFolder
        {...args}
        returnFocusRef={launcherRef}
        open={open}
        onOpenChange={setOpen}
        title={record}
        panels={panels}
        value={value}
        onValueChange={setValue}
      />
    </main>
  )
}

export const Tuned: Story = {
  args: {
    width: 540,
    paperGrain: 0.12,
    bodyType: 'technical',
    stiffness: 280,
    damping: 32,
    stackStagger: 0.045,
    side: 'right',
  },
  render: (args) => <FolderDesk {...args} />,
}
export const ArtifactBody: Story = {
  ...Tuned,
  args: { ...Tuned.args, bodyType: 'artifact' },
}
export const NoGrain: Story = {
  ...Tuned,
  args: { ...Tuned.args, paperGrain: 0 },
}
