import {SessionNotesProvider} from '@/contexts/mindmap/session-notes-context'

export default function SiteLayout({children}: {children: React.ReactNode}) {
  return (
    <SessionNotesProvider>
      {/* Rest of your layout */}
      {children}
      {/* Other components */}
    </SessionNotesProvider>
  )
}
