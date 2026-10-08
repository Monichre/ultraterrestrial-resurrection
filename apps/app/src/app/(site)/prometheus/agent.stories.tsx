import type {Meta, StoryObj} from '@storybook/react'
import {expect, userEvent, waitFor, within} from '@storybook/test'
import {useLayoutEffect} from 'react'
import {Agent} from './agent'
import {Toaster} from 'sonner'

const meta = {
  title: 'Pages/Prometheus/Agent',
  component: Agent,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#0A0A0B'}]},
    chromatic: {
      delay: 500,
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#0A0A0B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <Toaster />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Agent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

type FetchWindow = Window & {__prometheusBodies?: string[]}

function requestUrl(input: RequestInfo | URL) {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return input.url
}

function sse(part: Record<string, unknown>) {
  return `data: ${JSON.stringify(part)}\n`
}

function splitSse(events: string[]) {
  const body = `${events.join('')}data: [DONE]\n`
  const mid = Math.floor(body.length / 2)
  return [body.slice(0, mid), body.slice(mid)]
}

const MARKDOWN_CHUNKS = splitSse([
  sse({
    type: 'text-delta',
    delta:
      'The 1947 press release **claimed** a flying disc.\n\n- The Army later said it was a weather balloon.\n- Both readings stay on the record.',
  }),
])

const PARTIAL_CHUNKS = splitSse([
  sse({type: 'text-delta', delta: 'The debris field was described as thin metal.'}),
  sse({type: 'error', errorText: 'searchUAP timed out'}),
])

const ERROR_CHUNKS = splitSse([sse({type: 'error', errorText: 'NO CARRIER'})])

function installPrometheusFetch(chunks: string[]) {
  const win = window as FetchWindow
  const original = win.fetch.bind(win)
  const bodies: string[] = []
  win.__prometheusBodies = bodies
  win.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    if (!requestUrl(input).includes('/api/prometheus/chat')) return original(input, init)
    bodies.push(typeof init?.body === 'string' ? init.body : '')
    const encoder = new TextEncoder()
    let index = 0
    return new Response(
      new ReadableStream({
        async pull(controller) {
          if (index >= chunks.length) {
            controller.close()
            return
          }
          controller.enqueue(encoder.encode(chunks[index]))
          index += 1
        },
      }),
      {status: 200, headers: {'Content-Type': 'text/event-stream'}}
    )
  }) as typeof fetch
  return () => {
    win.fetch = original
    delete win.__prometheusBodies
  }
}

function StreamedAgent({chunks}: {chunks: string[]}) {
  useLayoutEffect(() => installPrometheusFetch(chunks), [chunks])
  return <Agent />
}

const PROMPT = 'Ask about UAPs/UFOs or request to ingest specific URLs...'

async function ask(canvas: ReturnType<typeof within>, text: string) {
  const box = canvas.getByPlaceholderText(PROMPT)
  await userEvent.type(box, text)
  await waitFor(() => {
    const send = canvas.getByRole('button', {name: 'Send'}) as HTMLButtonElement
    if (send.disabled) throw new Error('Send is still disabled')
  })
  await userEvent.click(canvas.getByRole('button', {name: 'Send'}))
}

export const StreamsMarkdown: Story = {
  name: 'Streams markdown from SSE data parts',
  render: () => <StreamedAgent chunks={MARKDOWN_CHUNKS} />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await ask(canvas, 'What was said about the Roswell debris?')
    const claimed = await canvas.findByText('claimed')
    await expect(claimed.tagName).toBe('STRONG')
    await expect(canvas.getByText(/weather balloon/)).toBeTruthy()
  },
}

export const PartialStepError: Story = {
  name: 'Keeps partial text when a later step errors',
  render: () => <StreamedAgent chunks={PARTIAL_CHUNKS} />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    await ask(canvas, 'What was claimed about the debris field?')
    await canvas.findByText(/thin metal/)
    await page.findByText(/Response may be incomplete: searchUAP timed out/)
    await waitFor(() => {
      const send = canvas.getByRole('button', {name: 'Send'}) as HTMLButtonElement
      if (send.disabled) throw new Error('Send is still disabled')
    })
    await ask(canvas, 'What remains open?')
    await waitFor(() => {
      const bodies = (window as FetchWindow).__prometheusBodies ?? []
      if (bodies.length < 2) throw new Error('second request has not been sent')
      const second = JSON.parse(bodies[1]) as {messages: Array<{role: string; content: string}>}
      if (second.messages.some((message) => message.role === 'assistant')) {
        throw new Error('partial answer was stored in history')
      }
      if (JSON.stringify(second.messages).includes('thin metal')) {
        throw new Error('partial answer text was sent with the next turn')
      }
    })
  },
}

export const ErrorOnly: Story = {
  name: 'An error with no text is not stored as an answer',
  render: () => <StreamedAgent chunks={ERROR_CHUNKS} />,
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)
    await ask(canvas, 'Show me the carrier')
    await within(document.body).findByText('NO CARRIER')
    await canvas.findByText(/I apologize, but I encountered an error/)
  },
}
