import {cn} from '@/lib/utils'
import {TooltipProvider} from '@/components/ui/tooltip'
import {Inter} from 'next/font/google'
import type {ReactNode} from 'react'

const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'AI Document Processor',
  description: 'Analyze and extract key information from documents.',
}

export default function Layout({children}: {children: ReactNode}) {
  return (
    <html lang='en'>
      <body className={cn('flex min-h-svh flex-col antialiased', inter.className)}>
        <div vaul-drawer-wrapper=''>
          <div className='relative flex min-h-svh flex-col bg-background'>{children}</div>
        </div>
      </body>
    </html>
  )
}
