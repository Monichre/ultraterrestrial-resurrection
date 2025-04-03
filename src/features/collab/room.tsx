'use client'

import type {ReactNode} from 'react'
import {LiveblocksProvider, RoomProvider, ClientSideSuspense} from '@liveblocks/react/suspense'

export function Room({children}: {children: ReactNode}) {
  return (
    <LiveblocksProvider
      publicApiKey={'pk_prod_ax3sMdnrFtfsG0nmtFT-mAg3EPHo246eV2SOU2Z_GUYuc2Y0or13S-8T6JOsacId'}>
      <RoomProvider id='my-room'>
        <ClientSideSuspense fallback={<div>Loading…</div>}>{children}</ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  )
}
