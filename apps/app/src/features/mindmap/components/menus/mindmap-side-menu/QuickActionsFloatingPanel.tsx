import {
  FloatingPanelRoot,
  FloatingPanelTrigger,
  FloatingPanelContent,
  FloatingPanelBody,
  FloatingPanelButton,
  FloatingPanelFooter,
  FloatingPanelCloseButton,
} from '@/components/cult-ui'
import {useMindMap} from '@/contexts'
import type {MindMapNode} from '@/features/mindmap/actions/fetch-next-mindmap-records'
import {xataToXYFlow} from '@/features/mindmap/actions/xata-to-xyflow'
import {ENTITY_TYPES} from '@/features/mindmap/components/menus/mindmap-bottom-menu/entity-types'
import {ICON_GREEN} from '@/utils'
import {AnimatePresence, motion} from 'framer-motion'
import {Plus} from 'lucide-react'
import {useRef, useState, useCallback} from 'react'

export const QuickActionsFloatingPanel = () => {
  const idCounter = useRef(0)
  const [isOpen, setIsOpen] = useState(false)

  // Function to get the next sequential ID
  const getNextId = useCallback(() => {
    idCounter.current += 1
    return `userInputNode-${idCounter.current}`
  }, [])

  const {
    addNextEntitiesToMindMap,
    loadNodesFromTableQuery,
    addConnectionNodesFromSearch,
    addUserInputNode,
    addNodes,
    updateNodeData,
    addEdges,
    screenToFlowPosition,
    retrieveEntitiesFromStore,

    setEdges,
    setNodes,
    getNodes,
    addNode,

    getNode,
  } = useMindMap()

  const computeChildPositions = useCallback((parentNode: MindMapNode, numberOfChildren: number) => {
    console.log('🚀 ~ computeChildPositions ~ parentNode:', parentNode)

    // NOTE: We dont need to use the DOM position of the parent node as the chld nodes will be positioned relatively to the parent by default (bc of the parentId prop)

    const parentRect = document
      .querySelector(`[data-id="${parentNode.id}"]`)
      ?.getBoundingClientRect()

    console.log('🚀 ~ computeChildPositions ~ parentRect:', parentRect)

    const parentWidth = parentRect?.width || 250
    const parentHeight = parentRect?.height || 100

    const entityWidth = 250 // Default width for each child node
    const entitySpacing = 100 // Space between child nodes
    const totalWidth = numberOfChildren * entityWidth + (numberOfChildren - 1) * entitySpacing

    // Parent's center is its left position plus half its width
    const parentCenterX = parentWidth / 2
    // Start so that the children (as a group) are centered below the parent's center
    const startX = 0 - totalWidth / 2

    const verticalSpacing = 200 // Vertical offset from the bottom of the parent
    const childY = parentHeight + verticalSpacing

    return {startX, childY, entityWidth, entitySpacing}
  }, [])

  const calculateCenterOfScreen = useCallback(() => {
    return {x: window.innerWidth / 2, y: window.innerHeight / 2}
  }, [])

  const handleLoadingRecords = useCallback(
    async ({data: {type}}: {data: {type: string}}) => {
      console.log('🚀 ~ MindMapSideMenu ~ type:', type)

      const amount = 3
      const center = screenToFlowPosition(calculateCenterOfScreen())

      // Create a user input node first
      const potentialUserNode = {
        id: getNextId(),
        type: 'userInputNode',
        position: {...center},
        data: {
          label: 'Your Query',
          input: `Beginning your exploration by loading ${amount} ${type}. Fetching Data...`,
          type: type,
        },
      }

      // Add the user node to the graph
      addNode(potentialUserNode)

      try {
        // Instead of retrieveEntitiesFromStore, use xataToXYFlow
        const question = `Show me ${amount} interesting ${type} records and explain the relationships between them.`
        const flowData = await xataToXYFlow({
          question,
          table: type,
          prompt: `Find the most interesting ${type} records that have clear relationships between them`,
          context: `The user is exploring the ${type} database and wants to see ${amount} records with interesting relationships.`,
        })

        console.log('🚀 ~ handleLoadingRecords ~ flowData:', flowData)

        if (flowData && flowData.nodes.length > 0) {
          // Update the user input node with the AI analysis
          if (flowData.context) {
            updateNodeData(potentialUserNode.id, {
              input: flowData.context,
            })
          }

          // Position nodes relative to the user input node
          const adjustedNodes = flowData.nodes
            .map((node) => {
              if (node.id !== 'query-result-node') {
                // Only adjust entity nodes, not the AI analysis node which we already have
                return {
                  ...node,
                  position: {
                    x: potentialUserNode.position.x + node.position.x,
                    y: potentialUserNode.position.y + 10, // Fixed vertical distance
                  },
                  parentId: potentialUserNode.id, // Connect to our user node instead
                }
              }
              return null
            })
            .filter(Boolean)

          // Add the entity nodes
          addNodes(adjustedNodes)

          // Create edges from the user node to each entity node
          const newEdges = adjustedNodes.map((node) => ({
            id: `${potentialUserNode.id}-${node.id}`,
            source: potentialUserNode.id,
            target: node.id,
            type: 'smoothstep',
            animated: true,
          }))

          // Add the edges
          addEdges(newEdges)
        } else {
          // Update user node to show no results
          updateNodeData(potentialUserNode.id, {
            input: `No ${type} data found or there was an error fetching the data.`,
          })
        }
      } catch (error) {
        console.error('Error loading data for mind map:', error)
        // Update user node to show error
        updateNodeData(potentialUserNode.id, {
          input: `Error loading ${type} data: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        })
      }
    },
    [
      calculateCenterOfScreen,
      screenToFlowPosition,
      getNextId,
      addNode,
      getNodes,
      addNodes,
      addEdges,
      updateNodeData,
      xataToXYFlow,
    ]
  )

  // Use the unified ENTITY_TYPES to generate actions
  const actions = ENTITY_TYPES.map((entity) => ({
    icon: entity.icon({className: 'w-4 h-4'}),
    label: entity.label,
    action: async () => {
      await handleLoadingRecords({data: {type: entity.type}})
      // Only add setOpen(false) for the first item to maintain original behavior
      if (entity.type === 'events') {
        setIsOpen(false)
      }
    },
  }))

  return (
    <>
      <FloatingPanelTrigger
        title='Entity Menu'
        className='flex items-center space-x-4 px-4 py-2 dark:bg-black text-white rounded-md transition-colors text-center'
        onClick={(e) => {
          e.preventDefault()
          setIsOpen(true)
        }}>
        <Plus className='w-5 h-5 stroke-1' stroke={ICON_GREEN} />
      </FloatingPanelTrigger>
      <FloatingPanelContent className='w-56 bg-black' forceMount={isOpen}>
        <FloatingPanelBody>
          <AnimatePresence>
            {actions.map((action, index) => (
              <motion.div
                key={`entity-action-${index}`}
                initial={{opacity: 0, y: -10}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: 10}}
                transition={{delay: index * 0.1}}>
                <FloatingPanelButton
                  onClick={action.action}
                  className='w-full flex items-center space-x-1 space-y-2 px-2 py-1 bg-black text-white'>
                  {action.icon}
                  <span>{action.label}</span>
                </FloatingPanelButton>
              </motion.div>
            ))}
          </AnimatePresence>
        </FloatingPanelBody>
        <FloatingPanelFooter>
          <FloatingPanelCloseButton
            onClick={(e) => {
              e.preventDefault()
              setIsOpen(false)
            }}
          />
        </FloatingPanelFooter>
      </FloatingPanelContent>
    </>
  )
}
