'use client'

import type {ReactNode} from 'react'

import {Toaster} from '@/components/ui/toaster'
import {Toaster as SonnerToaster} from '@/components/ui/sonner'

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({children}: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster />
      <SonnerToaster />
    </>
  )
}
