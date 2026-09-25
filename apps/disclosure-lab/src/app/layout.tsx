import type { ReactNode } from 'react'
import Link from 'next/link'
import '@repo/disclosure-ui/styles/tokens.css'
import './globals.css'

const NAV = [
  { href: '/', label: 'Lab' },
  { href: '/overview', label: 'Overview' },
  { href: '/corpus', label: 'Corpus' },
  { href: '/sql', label: 'SQL' },
  { href: '/charts', label: 'Charts' },
  { href: '/search', label: 'Search' },
  { href: '/audit', label: 'Audit' },
]

export const metadata = {
  title: 'Disclosure Lab',
  description: 'Neon admin console for Ultraterrestrial',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '10px 16px',
            borderBottom: '1px solid var(--lab-border)',
            background: 'var(--lab-panel)',
          }}
        >
          <strong className="lab-mono" style={{ letterSpacing: '0.08em' }}>
            DISCLOSURE LAB
          </strong>
          <span style={{ color: 'var(--lab-muted)', fontSize: 11 }}>
            Neon · knowledge-base · vector store · no DELETE
          </span>
          <nav style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="lab-mono" style={{ fontSize: 11 }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main style={{ minHeight: 'calc(100vh - 44px)' }}>{children}</main>
      </body>
    </html>
  )
}
