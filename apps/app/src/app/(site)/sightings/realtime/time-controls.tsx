'use client'

import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {useCallback, useMemo} from 'react'

export default function TimeControls({
  defaultStartYear,
  defaultEndYear,
}: {
  defaultStartYear?: number
  defaultEndYear?: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const startYear = useMemo(
    () => Number(params.get('startYear') || defaultStartYear || 1947),
    [params, defaultStartYear]
  )
  const endYear = useMemo(
    () => Number(params.get('endYear') || defaultEndYear || new Date().getFullYear()),
    [params, defaultEndYear]
  )

  const setYears = useCallback(
    (s: number, e: number) => {
      const sp = new URLSearchParams(params.toString())
      sp.set('startYear', String(s))
      sp.set('endYear', String(e))
      router.replace(`${pathname}?${sp.toString()}`)
    },
    [router, pathname, params]
  )

  return (
    <div className='flex flex-wrap gap-2'>
      <div className='text-sm text-muted-foreground'>Timeline:</div>
      <button
        className='rounded bg-secondary px-2 py-1 text-sm'
        onClick={() => setYears(1947, 1970)}>
        1947–1970
      </button>
      <button
        className='rounded bg-secondary px-2 py-1 text-sm'
        onClick={() => setYears(1970, 1990)}>
        1970–1990
      </button>
      <button
        className='rounded bg-secondary px-2 py-1 text-sm'
        onClick={() => setYears(1990, 2010)}>
        1990–2010
      </button>
      <button
        className='rounded bg-secondary px-2 py-1 text-sm'
        onClick={() => setYears(2010, new Date().getFullYear())}>
        2010–Now
      </button>
    </div>
  )
}
