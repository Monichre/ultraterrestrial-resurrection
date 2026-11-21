import {SessionNavBar} from '@/components/ui/sidebar'
import {Suspense} from 'react'

import {DisclosureAssistantProvider} from '@/contexts/ai/assistant'

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return (
    <DisclosureAssistantProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <div className='h-screen w-screen bg-dots-pattern dark:bg-dots-pattern-dark [background-size:4px_4px] [backdrop-filter:brightness(1.2)_blur(3px)]'>
          <SessionNavBar />
          {children}
        </div>
      </Suspense>
    </DisclosureAssistantProvider>
  )
}
