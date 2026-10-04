'use client'

import {useState, type ReactNode} from 'react'

interface Command {
  name: string
  icon: ReactNode
}

interface GroupCommands {
  [category: string]: Command[]
}

export interface CommandKProps {
  commands?: GroupCommands
}

interface CommandItemProps {
  title: string
  icon: ReactNode
  isActive: boolean
}

interface KeyboardKeyProps {
  children: ReactNode
  className?: string
}

export function CommandK({commands = {}}: CommandKProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className='flex h-[440px] items-center justify-center'>
      <div className='relative'>
        <div
          className='absolute'
          style={{top: -25, left: 10, transform: 'rotate(-40deg)'}}
        >
          <KeyboardKey className='w-[100px] items-end text-xs'>
            <div>⌘</div>
            <div>command</div>
          </KeyboardKey>
        </div>
        <div
          className='absolute z-[2]'
          style={{
            top: -30,
            right: 30,
            transform: 'rotate(15deg)',
            background: 'rgb(22 22 22)',
          }}
        >
          <KeyboardKey className='h-9 w-9 text-xs'>K</KeyboardKey>
        </div>

        <div
          className='relative flex w-[460px] flex-col overflow-hidden rounded-xl border border-white/10 p-2'
          style={{
            height: 304,
            backdropFilter: 'blur(16px)',
          }}
        >
          <div
            className='pointer-events-none absolute inset-0 rounded-[inherit]'
            style={{
              boxShadow: '0 -28px 84px -24px rgba(255,255,255, 0.1) inset',
            }}
          />

          <div className='p-1.5'>
            <span className='inline-block rounded-md bg-white/[0.08] px-2 py-[3px] text-xs font-normal text-white/55'>
              Actions
            </span>
          </div>
          <input
            type='text'
            placeholder='Type a command or search...'
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full border-0 border-b border-white/[0.08] bg-transparent px-2 py-3 font-[inherit] text-white/65 placeholder:text-white/50 focus:outline-none'
          />

          <div className='flex flex-1 flex-col overflow-y-auto pt-1.5'>
            {Object.entries(commands).map(([category, categoryCommands]) => (
              <div key={category}>
                <div
                  className='flex items-center px-1.5 text-xs text-white/55'
                  style={{
                    transition:
                      'height .35s cubic-bezier(.6,.6,0,1), opacity .35s cubic-bezier(.6,.6,0,1)',
                    height: searchQuery ? 0 : 30,
                    opacity: searchQuery ? 0 : 1,
                    pointerEvents: searchQuery ? 'none' : 'auto',
                  }}
                >
                  {category}
                </div>
                {categoryCommands.map((command, i) => {
                  const isMatch = command.name
                    .toLocaleLowerCase()
                    .includes(searchQuery.toLocaleLowerCase())
                  return (
                    <CommandItem
                      key={category + i}
                      icon={command.icon}
                      title={command.name}
                      isActive={isMatch}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CommandItem({title, icon, isActive}: CommandItemProps) {
  return (
    <div
      className='flex cursor-pointer items-center gap-3 rounded-lg px-3 text-[13px] text-white/75 hover:bg-white/[0.06] [&_img]:h-auto [&_img]:w-4 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-inherit'
      style={{
        transition:
          'opacity .35s cubic-bezier(.6,.6,0,1), height .35s cubic-bezier(.6,.6,0,1), background .15s cubic-bezier(.6,.6,0,1)',
        height: isActive ? 36 : 0,
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {typeof icon === 'string' ? (
        // String icons are arbitrary URLs from callers; Next Image requires known domains.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt='' />
      ) : (
        icon
      )}
      <div>{title}</div>
    </div>
  )
}

function KeyboardKey({children, className = ''}: KeyboardKeyProps) {
  return (
    <div
      className={`relative flex h-11 w-11 shrink-0 cursor-pointer select-none flex-col items-center justify-center gap-0.5 rounded-[5px] p-1 text-[10px] leading-4 text-white/75 ${className}`}
      style={{
        background: 'rgba(255,255,255,.01)',
        boxShadow: '0 0 0 1px #414143',
      }}
    >
      <div
        className='pointer-events-none absolute inset-0 rounded-[inherit] border border-white/5'
        style={{width: 'calc(100% - 2px)', height: 'calc(100% - 2px)'}}
      />
      <div
        className='pointer-events-none absolute inset-0 rounded-[inherit]'
        style={{
          background:
            'linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.08) 100%)',
        }}
      />
      {children}
    </div>
  )
}
