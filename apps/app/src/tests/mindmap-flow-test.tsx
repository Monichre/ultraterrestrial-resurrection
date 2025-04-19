import React, {useEffect, useState} from 'react'
import {useMindMap} from '@/contexts/mindmap/mindmap-context'
import {traceLogger} from '@/utils/trace-logger'
import type {MindMapNode} from '@/features/mindmap/actions/fetch-next-mindmap-records'
import type {DatabaseSchema} from '@/db/types'
import type {Node, Edge, XYPosition} from '@xyflow/react'

interface TestState {
  isLoading: boolean
  entities: MindMapNode[]
  error: string | null
  testComplete: boolean
}

interface NodeWithParentId extends Node {
  parentId?: string
}

/**
 * A component to test the data flow from addDataToMindMap to retrieveEntitiesFromStore
 * and verify entities are being added to the graph correctly
 */
export const MindMapFlowTest = ({entityType = 'events'}: {entityType?: string}) => {
  const {retrieveEntitiesFromStore, addNodes, addNode, addEdges, getNodes, screenToFlowPosition} =
    useMindMap()

  const [testState, setTestState] = useState<TestState>({
    isLoading: false,
    entities: [],
    error: null,
    testComplete: false,
  })

  // Simulates computeChildPositions from MindMapBottomMenu
  const computeChildPositions = (parentNode: NodeWithParentId, numberOfChildren: number) => {
    traceLogger.functionStart('computeChildPositions', {
      parentNode,
      numberOfChildren,
    })

    const parentWidth = 250
    const parentHeight = 100

    const entityWidth = 250
    const entitySpacing = 100
    const totalWidth = numberOfChildren * entityWidth + (numberOfChildren - 1) * entitySpacing

    const parentCenterX = parentWidth / 2
    const startX = 0 - totalWidth / 2

    const verticalSpacing = 200
    const childY = parentHeight + verticalSpacing

    const result = {startX, childY, entityWidth, entitySpacing}
    traceLogger.functionEnd('computeChildPositions', result)
    return result
  }

  // Simulates calculateCenterOfScreen from MindMapBottomMenu
  const calculateCenterOfScreen = (): XYPosition => {
    traceLogger.functionStart('calculateCenterOfScreen')
    const result = {x: window.innerWidth / 2, y: window.innerHeight / 2}
    traceLogger.functionEnd('calculateCenterOfScreen', result)
    return result
  }

  // Simulates handleLoadingRecords from MindMapBottomMenu
  const handleLoadingRecords = async (type: string) => {
    traceLogger.functionStart('handleLoadingRecords', {type})
    setTestState((prev) => ({...prev, isLoading: true, error: null}))

    try {
      traceLogger.info('Starting retrieval for type:', type)

      const center = screenToFlowPosition(calculateCenterOfScreen())
      traceLogger.debug('Center position calculated:', center)

      // Create user input node
      const potentialUserNode: NodeWithParentId = {
        id: `test-user-node-${Date.now()}`,
        type: 'userInputNode',
        position: {...center},
        data: {
          label: 'Test Query',
          input: `Testing data retrieval for ${type}...`,
          type: type,
        },
      }

      traceLogger.debug('Created user node:', potentialUserNode)

      // Add the user node to the graph
      addNode(potentialUserNode)
      traceLogger.info('Added user node to graph')

      const nodes = getNodes()
      traceLogger.debug('Current nodes in graph:', nodes)

      // Retrieve entities from store
      traceLogger.info('Calling retrieveEntitiesFromStore for type:', type)
      const entities = await retrieveEntitiesFromStore(type as keyof DatabaseSchema)
      traceLogger.info('Retrieved entities count:', entities?.length)
      traceLogger.debug('Retrieved entities:', entities)

      if (!entities || entities.length === 0) {
        throw new Error('No entities returned from retrieveEntitiesFromStore')
      }

      // Calculate positions for child nodes
      const {startX, childY, entityWidth, entitySpacing} = computeChildPositions(
        potentialUserNode,
        entities.length
      )

      // Create child nodes with positions
      const childNodes: NodeWithParentId[] = entities.map((entity: MindMapNode, index: number) => ({
        ...entity,
        type: 'entityNode',
        position: {
          x: startX + index * (entityWidth + entitySpacing),
          y: childY,
        },
        parentId: potentialUserNode.id,
      }))

      traceLogger.debug('Created child nodes with positions:', childNodes)

      // Add entities to the graph
      addNodes(childNodes)
      traceLogger.info('Added entity nodes to graph')

      // Create edges
      const newEdges: Edge[] = entities.map((entity: MindMapNode) => ({
        id: `${potentialUserNode.id}-${entity.id}`,
        source: potentialUserNode.id,
        target: entity.id,
        type: 'smoothstep',
      }))

      traceLogger.debug('Created edges:', newEdges)

      // Add edges to the graph
      addEdges(newEdges)
      traceLogger.info('Added edges to graph')

      // Update test state
      setTestState({
        isLoading: false,
        entities: entities,
        error: null,
        testComplete: true,
      })

      const result = {
        userNode: potentialUserNode,
        childNodes,
        edges: newEdges,
      }
      traceLogger.functionEnd('handleLoadingRecords', result)
      return result
    } catch (error: any) {
      traceLogger.error('Error during test:', error)
      setTestState({
        isLoading: false,
        entities: [],
        error: error.message || 'Unknown error occurred',
        testComplete: true,
      })
      return null
    }
  }

  // Simulates addDataToMindMap from MindMapBottomMenu
  const addDataToMindMap = (model: string) => {
    traceLogger.functionStart('addDataToMindMap', {model})
    traceLogger.info('Starting test sequence for model:', model)
    handleLoadingRecords(model)
      .then((result) => {
        traceLogger.functionEnd('addDataToMindMap', {success: !!result})
      })
      .catch((error) => {
        traceLogger.error('Error in addDataToMindMap:', error)
      })
  }

  // Run the test when the component mounts
  useEffect(() => {
    traceLogger.info('MindMapFlowTest component mounted')
    addDataToMindMap(entityType)

    return () => {
      traceLogger.info('MindMapFlowTest component unmounted')
    }
  }, [entityType])

  return (
    <div className='p-4 border border-gray-200 rounded-md'>
      <h2 className='text-lg font-semibold mb-2'>MindMap Flow Test</h2>
      <div className='mb-2'>
        <span className='font-medium'>Testing entity type:</span> {entityType}
      </div>
      <div className='mb-2'>
        <span className='font-medium'>Status:</span>{' '}
        {testState.isLoading ? 'Loading...' : testState.testComplete ? 'Complete' : 'Not started'}
      </div>
      {testState.error && (
        <div className='text-red-500 mb-2'>
          <span className='font-medium'>Error:</span> {testState.error}
        </div>
      )}
      <div className='mb-2'>
        <span className='font-medium'>Entities retrieved:</span> {testState.entities.length}
      </div>
      {testState.testComplete && !testState.error && (
        <div className='text-green-500'>Test completed successfully!</div>
      )}
    </div>
  )
}

export default MindMapFlowTest
