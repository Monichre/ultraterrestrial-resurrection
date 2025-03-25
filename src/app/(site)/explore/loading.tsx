import { MultiStepLoader } from '@/components/multistep-loader'

export default function Loading() {
  const loadingStates = [
    { text: 'Verifying Majestic Level Security Clearance' },
    { text: 'Fetching Data' },
    { text: 'Loading Data' },
    { text: 'Making Shit Look Good' },
  ]
  return <MultiStepLoader loadingStates={loadingStates} />
}
