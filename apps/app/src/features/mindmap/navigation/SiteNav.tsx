'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {cn} from '@/lib/utils'

interface NavLink {
  href: string
  label: string
}

interface NavGroup {
  label: string
  links: NavLink[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Research',
    links: [
      {href: '/research-canvas', label: 'Canvas'},
      {href: '/timeline', label: 'Timeline'},
      {href: '/sightings', label: 'Sightings'},
      {href: '/spacetime', label: 'Spacetime'},
    ],
  },
  {
    label: 'Records',
    links: [
      {href: '/key-figures', label: 'Key figures'},
      {href: '/events', label: 'Events'},
      {href: '/history', label: 'History'},
      {href: '/prometheus', label: 'Prometheus'},
    ],
  },
]

const isCurrent = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

export function SiteNav() {
  const pathname = usePathname()
  if (!pathname || pathname === '/') return null

  return (
    <nav
      aria-label='Site'
      className='flex shrink-0 flex-wrap items-center gap-x-8 gap-y-2 border-b border-white/10 px-5 py-2.5'
    >
      <Link
        href='/'
        className='text-xs tracking-[0.22em] text-neutral-400 hover:text-white'
      >
        ULTRATERRESTRIAL
      </Link>
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className='flex items-center gap-3'>
          <p className='m-0 text-[10px] uppercase tracking-[0.16em] text-neutral-600'>{group.label}</p>
          <ul className='m-0 flex list-none flex-wrap gap-1 p-0'>
            {group.links.map((link) => {
              const current = isCurrent(pathname, link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'rounded-md px-2 py-1 text-sm',
                      current ? 'text-white' : 'text-neutral-400 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
