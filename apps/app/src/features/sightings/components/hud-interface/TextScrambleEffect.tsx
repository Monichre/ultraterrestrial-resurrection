import {useState, useEffect, useRef} from 'react'

interface TextScrambleEffectProps {
  phrases?: string[]
  interval?: number
  className?: string
}

const TextScrambleEffect = ({
  phrases = [
    'Neo,',
    'sooner or later',
    "you're going to realize",
    'just as I did',
    "that there's a difference",
    'between knowing the path',
    'and walking the path',
  ],
  interval = 800,
  className = '',
}: TextScrambleEffectProps) => {
  const [output, setOutput] = useState('')
  const [counter, setCounter] = useState(0)
  const textRef = useRef<HTMLDivElement>(null)
  const queueRef = useRef<
    Array<{
      from: string
      to: string
      start: number
      end: number
      char?: string
    }>
  >([])
  const frameRef = useRef(0)
  const frameRequestRef = useRef<number | null>(null)
  const resolveRef = useRef<() => void>(() => {})

  const chars = '!<>-_\\/[]{}—=+*^?#________'

  const randomChar = () => {
    return chars[Math.floor(Math.random() * chars.length)]
  }

  const update = () => {
    let outputText = ''
    let complete = 0
    const queue = queueRef.current

    for (let i = 0, n = queue.length; i < n; i++) {
      let {from, to, start, end, char} = queue[i]

      if (frameRef.current >= end) {
        complete++
        outputText += to
      } else if (frameRef.current >= start) {
        if (!char || Math.random() < 0.28) {
          char = randomChar()
          queue[i].char = char
        }
        outputText += `<span class="text-neutral-500">${char}</span>`
      } else {
        outputText += from
      }
    }

    setOutput(outputText)

    if (complete === queue.length) {
      resolveRef.current()
    } else {
      frameRef.current++
      frameRequestRef.current = requestAnimationFrame(update)
    }
  }

  const setText = (newText: string) => {
    const oldText = textRef.current?.innerText || ''
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => {
      resolveRef.current = resolve
    })

    const queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      queue.push({from, to, start, end})
    }

    queueRef.current = queue

    if (frameRequestRef.current) {
      cancelAnimationFrame(frameRequestRef.current)
    }

    frameRef.current = 0
    update()

    return promise
  }

  const nextPhrase = () => {
    setText(phrases[counter]).then(() => {
      setTimeout(() => {
        setCounter((prevCounter) => (prevCounter + 1) % phrases.length)
      }, interval)
    })
  }

  useEffect(() => {
    nextPhrase()

    return () => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current)
      }
    }
  }, [counter])

  return (
    <div className={`flex justify-center items-center h-full ${className}`}>
      <div
        ref={textRef}
        className='font-mono font-thin text-2xl text-white'
        dangerouslySetInnerHTML={{__html: output}}
      />
    </div>
  )
}

export default TextScrambleEffect
