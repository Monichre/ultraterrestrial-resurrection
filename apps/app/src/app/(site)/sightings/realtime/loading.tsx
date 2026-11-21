import { GlobeLoading } from '@/components/ui/loading/globe-loading'
import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingState() {
  return (
    <div className="flex flex-col gap-8">
      {/* Globe Loading */}
      <div className="h-[600px] w-full relative bg-card rounded-lg overflow-hidden">
        <GlobeLoading />
      </div>

      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />

        <div className="grid gap-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-[400px] w-full" />
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid gap-4">
              {Array.from( { length: 5 } ).map( ( _, i ) => (
                <div key={i} className="border border-border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-20 w-full mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ) )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 