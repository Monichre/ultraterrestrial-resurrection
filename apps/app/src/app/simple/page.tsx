'use client'

import dynamicImport from "next/dynamic"

const EditorClient = dynamicImport(
  () => import("./editor-client").then(m => ({ default: m.EditorClient })),
  { ssr: false }
)

export default function Page() {
  return <EditorClient />
}
