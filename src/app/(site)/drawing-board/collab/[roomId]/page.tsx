"use client";
import { use } from "react";
// @ts-ignore
import { Room } from "@/features/collab/room"
import dynamic from 'next/dynamic'

const LiveUsers = dynamic( () => import( '@/features/collab/live-users' ).then( mod => mod.LiveUsers ), { ssr: false } )

export default function Page(props: { params: Promise<{ roomId: string }> }) {
  const params = use(props.params);
  return (
    <Room roomId={params.roomId}>
      <LiveUsers />
    </Room>
  )
}
