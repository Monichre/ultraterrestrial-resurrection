import { GraphPaper } from '@/components/graph-paper'
import { Protect } from '@clerk/nextjs'

export default async function Index() {
  return (
    <Protect>
      <div className='h-screen w-screen'>
        <GraphPaper />
      </div>
    </Protect>
  )
}
