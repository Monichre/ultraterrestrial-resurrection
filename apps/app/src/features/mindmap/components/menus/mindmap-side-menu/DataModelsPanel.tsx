'use client'

import {ENTITY_TYPES} from './entity-types'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {useCallback} from 'react'

export function DataModelsPanel() {
  const {addUserInputNode} = useMindMap()

  const handleAddDataModel = useCallback(
    (entityType: string) => {
      // Create a user input node for the data model
      addUserInputNode({
        input: `Add ${entityType} data`,
        user: 'data-models-panel',
      })
    },
    [addUserInputNode]
  )

  return (
    <div className='bg-neutral-800 rounded-lg p-3 shadow-lg border border-neutral-700 min-w-[200px]'>
      <div className='text-white text-sm font-medium mb-3'>Data Models</div>
      <div className='space-y-2'>
        {ENTITY_TYPES.map((entity) => (
          <button
            key={entity.type}
            onClick={() => handleAddDataModel(entity.type)}
            className='w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-white hover:bg-neutral-700 rounded-md transition-colors'>
            <div className='text-neutral-400'>{entity.icon({width: 16, height: 16})}</div>
            <div className='flex flex-col'>
              <span className='font-medium'>{entity.displayName}</span>
              <span className='text-xs text-neutral-400'>{entity.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
