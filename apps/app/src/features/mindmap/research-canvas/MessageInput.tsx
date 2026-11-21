'use client'

import {type ChangeEvent, type FormEvent} from 'react'
import {PaperclipIcon} from 'lucide-react'
import {DROP_ACCEPT_ATTR} from '@/features/mindmap/drop/drop-contract'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
  onFileSelected?: (file: File) => void
}

export default function MessageInput({
  value,
  onChange,
  onSubmit,
  onFileSelected,
}: MessageInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(e)
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onFileSelected?.(file)
    event.target.value = ''
  }

  return (
    <div className='relative w-full max-w-xl'>
      <form
        onSubmit={handleSubmit}
        className='flex w-full items-center gap-3 border-b border-[var(--ut-line-strong)] pb-2 focus-within:border-[var(--ut-paper)]'
      >
        <input
          type='text'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Ask a question, or drop a file / URL'
          className='w-full flex-1 border-none bg-transparent text-sm text-[var(--ut-paper)] outline-none ring-0 placeholder:text-[var(--ut-ink-dim)] focus:outline-none focus:ring-0'
          style={{outline: 'none'}}
        />
        <label
          title='Attach file to canvas'
          className='relative cursor-pointer rounded-sm p-1 text-[var(--ut-paper)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--ut-paper)]'
        >
          <PaperclipIcon size={18} />
          <input
            type='file'
            accept={DROP_ACCEPT_ATTR}
            onChange={handleFileChange}
            className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
            aria-label='Attach file to canvas'
          />
        </label>
        <button
          type='submit'
          className='rounded-sm px-1 py-1 font-[family-name:var(--font-martian-mono),var(--font-jetbrains-mono),monospace] text-[12px] text-[var(--ut-paper)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ut-paper)] disabled:cursor-not-allowed disabled:text-[var(--ut-ink-faint)]'
          disabled={!value.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}
