'use client'

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function ErrorComponent( {
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
} ) {
  useEffect( () => {
    console.error( error )
  }, [error] )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-muted-foreground mb-6">
          There was an error loading the sightings data.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
} 