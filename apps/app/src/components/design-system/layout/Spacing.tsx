'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SpacingDemoProps {
  className?: string
}

export const SpacingDemo = ({ className }: SpacingDemoProps) => {
  const spacingValues = [
    { name: '0', value: '0px', class: 'p-0' },
    { name: '1', value: '4px', class: 'p-1' },
    { name: '2', value: '8px', class: 'p-2' },
    { name: '3', value: '12px', class: 'p-3' },
    { name: '4', value: '16px', class: 'p-4' },
    { name: '5', value: '20px', class: 'p-5' },
    { name: '6', value: '24px', class: 'p-6' },
    { name: '8', value: '32px', class: 'p-8' },
    { name: '10', value: '40px', class: 'p-10' },
    { name: '12', value: '48px', class: 'p-12' },
    { name: '16', value: '64px', class: 'p-16' },
    { name: '20', value: '80px', class: 'p-20' },
    { name: '24', value: '96px', class: 'p-24' },
  ]

  return (
    <div className={cn('space-y-6', className)}>
      <h2 className="text-xl font-bold">Spacing Scale</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {spacingValues.map(({ name, value, class: className }) => (
          <div key={name} className="flex items-center gap-4">
            <div className="w-16 text-sm font-mono">{name}</div>
            <div className="w-20 text-xs text-gray-600">{value}</div>
            <div className="flex-1">
              <div className="bg-blue-100 border border-blue-300">
                <div className={cn(className, 'bg-blue-300 text-blue-800 text-xs font-mono')}>
                  {className}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const LayoutGrid = ({ className }: { className?: string }) => {
  return (
    <div className={cn('', className)}>
      <h2 className="text-xl font-bold mb-4">Layout Grid Examples</h2>
      
      {/* Document Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Document Grid (12 columns)</h3>
        <div className="grid grid-cols-12 gap-2">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="bg-amber-100 border border-amber-300 p-2 text-center text-xs font-mono">
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Data Table Grid */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Data Table Layout</h3>
        <div className="grid grid-cols-4 gap-1 bg-white border border-gray-300 p-4">
          <div className="bg-gray-100 p-2 text-xs font-mono border">FIELD</div>
          <div className="bg-gray-100 p-2 text-xs font-mono border">VALUE</div>
          <div className="bg-gray-100 p-2 text-xs font-mono border">STATUS</div>
          <div className="bg-gray-100 p-2 text-xs font-mono border">NOTES</div>
          
          <div className="p-2 text-xs border">Date</div>
          <div className="p-2 text-xs border">1947-07-08</div>
          <div className="p-2 text-xs border text-red-600">CLASSIFIED</div>
          <div className="p-2 text-xs border">█████</div>
          
          <div className="p-2 text-xs border">Location</div>
          <div className="p-2 text-xs border">Roswell, NM</div>
          <div className="p-2 text-xs border text-yellow-600">RESTRICTED</div>
          <div className="p-2 text-xs border">Verified</div>
        </div>
      </div>

      {/* File Folder Layout */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">File Folder Layout</h3>
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-sm font-mono uppercase tracking-wide text-amber-800">Case Details</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs uppercase">File No:</span>
                  <span className="text-xs font-mono">UFO-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs uppercase">Class:</span>
                  <span className="text-xs font-mono text-red-600">TOP SECRET</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-sm font-mono uppercase tracking-wide text-amber-800">Investigation</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs uppercase">Agent:</span>
                  <span className="text-xs font-mono">████████</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs uppercase">Status:</span>
                  <span className="text-xs font-mono">ONGOING</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const DocumentMargins = ({ className }: { className?: string }) => {
  return (
    <div className={cn('', className)}>
      <h2 className="text-xl font-bold mb-4">Document Margins & Padding</h2>
      
      {/* Standard Document */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Standard Document Layout</h3>
        <div className="max-w-2xl bg-white border-2 border-gray-300 shadow-lg">
          {/* Header with tight padding */}
          <div className="border-b-2 border-red-600 p-4 text-center bg-red-50">
            <div className="text-lg font-black uppercase tracking-wide">CLASSIFIED DOCUMENT</div>
            <div className="text-xs font-mono mt-1">AUTHORIZATION REQUIRED</div>
          </div>
          
          {/* Content with comfortable reading margins */}
          <div className="p-8 space-y-4">
            <div className="text-base leading-relaxed">
              This demonstrates standard document padding and margins for comfortable reading.
              The content area has generous padding (p-8 = 32px) for easy reading.
            </div>
            
            {/* Indented section */}
            <div className="pl-8 border-l-2 border-amber-300 bg-amber-50 p-4">
              <div className="text-sm">
                Indented sections use additional left padding (pl-8) with border accent
                for visual hierarchy and better information organization.
              </div>
            </div>
            
            {/* Compact data section */}
            <div className="bg-gray-50 p-2 border border-gray-200">
              <div className="text-xs font-mono space-y-1">
                <div>FILE: UFO-1947-001.pdf</div>
                <div>SIZE: 1.2MB</div>
                <div>MODIFIED: 2024-01-15</div>
              </div>
            </div>
          </div>
          
          {/* Footer with minimal padding */}
          <div className="border-t p-2 bg-gray-50 text-xs text-gray-600 text-center">
            Document processed with standard margins and padding
          </div>
        </div>
      </div>
    </div>
  )
}