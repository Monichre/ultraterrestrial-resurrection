import type { Metadata } from 'next'
import { RecordStack, nimitzCase } from '@/features/record-stack'

export const metadata: Metadata = {
  title: 'Record Anatomy — Ultraterrestrial',
  description:
    'Unpack a case record into its evidentiary layers: event, witnesses, evidence chain, and the analytical inference boundary.',
}

export default function RecordStackPage() {
  return <RecordStack data={nimitzCase} />
}
