'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {NAV_GROUPS} from './SiteNav'

export function MenuTrigger() {
  const pathname = usePathname()
  if (pathname !== '/') return null

  return (
    <nav
      aria-label='Site'
      className='pointer-events-auto fixed inset-x-5 top-5 z-50 flex items-start justify-between gap-4 font-monumentMono'
    >
      <Link
        href='/'
        aria-current='page'
        aria-label='Ultraterrestrial home'
        className='flex min-h-11 items-center rounded-lg border border-white/10 bg-black/40 px-4 text-xs tracking-wider text-white/80 backdrop-blur-md hover:bg-black/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'
      >
        ULTRATERRESTRIAL
      </Link>
      <div className='hidden min-h-11 items-center gap-1 rounded-lg border border-white/10 bg-black/40 p-1 backdrop-blur-md xl:flex'>
        {NAV_GROUPS.flatMap((group) => group.links).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            prefetch={false}
            className='flex min-h-9 items-center rounded-md px-3 text-xs text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white'
          >
            {link.label}
          </Link>
        ))}
      </div>
      <details className='relative xl:hidden'>
        <summary className='flex min-h-11 cursor-pointer list-none items-center gap-3 rounded-lg border border-white/10 bg-black/60 px-4 text-xs text-white backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
          Explore <span aria-hidden='true'>☰</span>
        </summary>
        <div className='absolute right-0 top-full mt-3 max-h-[calc(100dvh-100px)] w-64 overflow-y-auto rounded-lg border border-white/15 bg-black/95 p-3 shadow-xl'>
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className='mb-1 mt-3 px-3 text-[10px] uppercase tracking-wider text-white/50'>
                {group.label}
              </p>
              <ul className='m-0 list-none p-0'>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className='flex min-h-11 items-center rounded-md px-3 text-sm text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </details>
    </nav>
  )
}
