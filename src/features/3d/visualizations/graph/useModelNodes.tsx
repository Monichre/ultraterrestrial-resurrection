import { DOMAIN_MODEL_COLORS } from '@/utils/constants/colors'
import { useState, useEffect, useMemo } from 'react'

interface ModelNodesProps {
  models: any
}

const rootNodes = [
  {
    label: 'topics',
    id: 'topics',
    fill: DOMAIN_MODEL_COLORS.topics,
    data: {
      x: 0,
      y: 1,
      size: 15,
      color: DOMAIN_MODEL_COLORS.topics,
    },
  },
  {
    label: 'events',
    id: 'events',
    fill: DOMAIN_MODEL_COLORS.events,
    data: {
      x: 0,
      y: 1,
      size: 15,
      color: DOMAIN_MODEL_COLORS.events,
    },
  },
  {
    label: 'personnel',
    id: 'personnel',
    fill: DOMAIN_MODEL_COLORS.personnel,
    data: {
      x: 0,
      y: 1,
      size: 15,
      color: DOMAIN_MODEL_COLORS.personnel,
    },
  },
]

export const useModelNodes = ( { models }: ModelNodesProps ) => {
  const {
    events: {
      all: allEventModels,
      withConnections: eventsSubjectMatterExpertsEdges,
    },
    topics: { all: allTopics, withConnections: topicsSubjectMatterExpertEdges },
    personnel: personnelModels,
  }: any = models

  const [topicsRootNode, eventsRootNode, personnelRootNode] = rootNodes

  const [graphData, setGraphData] = useState( {
    nodes: [],
    edges: [],
    links: [],
  } )

  const [nodes, edges, links] = useMemo( () => {
    const tempNodes = [...rootNodes]
    const tempEdges: any = []
    const tempLinks: any = []

    const createNodeAndEdge = ( rootNode, models, color ) => {
      models.forEach( ( { id, ...model } ) => {
        const node = {
          id,
          label: model?.name,
          fill: color,
          data: {
            ...model,
            color,
          },
        }
        tempNodes.push( node )
        tempEdges.push( {
          color,
          source: rootNode.id,
          target: id,
          id: `${rootNode.id}->${id}`,
        } )
        tempLinks.push( {
          source: rootNode.id,
          target: id,
        } )
      } )
    }

    createNodeAndEdge(
      personnelRootNode,
      personnelModels,
      DOMAIN_MODEL_COLORS.personnel
    )
    createNodeAndEdge( topicsRootNode, allTopics, DOMAIN_MODEL_COLORS.topics )
    createNodeAndEdge(
      eventsRootNode,
      allEventModels,
      DOMAIN_MODEL_COLORS.events
    )

    topicsSubjectMatterExpertEdges.forEach( ( edge ) => {
      tempEdges.push( {
        source: edge.topic,
        target: edge['subject-matter-expert'],
        id: edge.id,
        color: '#fff',
      } )
      tempLinks.push( {
        source: edge.topic,
        target: edge['subject-matter-expert'],
      } )
    } )

    eventsSubjectMatterExpertsEdges.forEach( ( { id, event, ...rest } ) => {
      const target = rest['subject-matter-expert']
      tempEdges.push( {
        source: event,
        target,
        id,
        color: '#fff',
      } )
      tempLinks.push( {
        source: event,
        target,
      } )
    } )

    // const tempLinks = tempEdges.map(({ source, target }) => ({
    //   source,
    //   target,
    // }))

    return [tempNodes, tempEdges, tempLinks]
  }, [] )

  return {
    nodes,
    edges,
    links,
  }
}

// 'use client'

// // import { TopicPersonnelAndEventGraphDataPayload } from'@/db/xata'
// import { DOMAIN_MODEL_COLORS } from '@/utils/colors'
// import { useState, useEffect, useMemo } from 'react'

// interface ModelNodesProps {
//   models: any
// }

// const rootNodes = [
//   {
//     label: 'topics',
//     id: 'topics',
//     fill: DOMAIN_MODEL_COLORS.topics,

//     data: {
//       x: 0,
//       y: 1,
//       size: 15,
//       color: DOMAIN_MODEL_COLORS.topics,
//     },
//   },
//   {
//     label: 'events',
//     id: 'events',
//     fill: DOMAIN_MODEL_COLORS.events,
//     data: {
//       x: 0,
//       y: 1,
//       size: 15,
//       color: DOMAIN_MODEL_COLORS.events,
//     },
//   },
//   {
//     label: 'personnel',
//     id: 'personnel',
//     fill: DOMAIN_MODEL_COLORS.personnel,
//     data: {
//       x: 0,
//       y: 1,
//       size: 15,
//       color: DOMAIN_MODEL_COLORS.personnel,
//     },
//   },
// ]
// const rootEdges: any = []

// export const useModelNodes = ({ models }: ModelNodesProps) => {
//   const {
//     events: {
//       all: allEventModels,
//       withConnections: eventsSubjectMatterExpertsEdges,
//     },
//     topics: { all: allTopics, withConnections: topicsSubjectMatterExpertEdges },
//     personnel: personnelModels,
//   }: any = models

//   const [topicsRootNode, eventsRootNode, personnelRootNode]: any = rootNodes
//   const [keyFigures, setKeyFigures] = useState(personnelModels)
//   const [topics, setTopics] = useState(allTopics)
//   const [events, setEvents] = useState(allEventModels)
//   const [graphData, setGraphData] = useState({
//     nodes: [],
//     edges: [],
//     links: [],
//   })

//   const [nodes, edges, links] = useMemo(() => {
//     const tempNodes: any = [...rootNodes]
//     const tempEdges: any = [...rootEdges]

//     personnelModels.forEach(({ id, ...person }: any) => {
//       const personnelNode: any = {
//         id: id,
//         label: person?.name,
//         fill: DOMAIN_MODEL_COLORS.personnel,
//         data: {
//           ...person,
//           color: DOMAIN_MODEL_COLORS.personnel,
//         },
//       }
//       tempNodes.push(personnelNode)
//       const rootPersonnelToChildNodeEdge = {
//         color: DOMAIN_MODEL_COLORS.personnel,
//         source: personnelRootNode.id,
//         target: id,
//         id: `${personnelRootNode.id}->${id}`,
//         // label: `${personnelRootNode.id}->>${personnelNode.id}`,
//       }
//       tempEdges.push(rootPersonnelToChildNodeEdge)
//     })

//     allTopics.forEach(({ id, ...topic }: any) => {
//       const topicNode: any = {
//         id: id,
//         label: topic?.name,

//         fill: DOMAIN_MODEL_COLORS.topics,
//         data: {
//           ...topic,
//         },
//       }
//       tempNodes.push(topicNode)

//       const rootTopicToChildTopicNodeEdge = {
//         source: topicsRootNode.id,
//         target: id,
//         id: `${topicsRootNode.id}->${id}`,
//         color: DOMAIN_MODEL_COLORS.topics,
//       }

//       tempEdges.push(rootTopicToChildTopicNodeEdge)
//     })

//     topicsSubjectMatterExpertEdges.forEach((edge) => {
//       console.log('edge: ', edge)
//       tempEdges.push({
//         source: edge.topic,
//         target: edge['subject-matter-expert'],
//         id: edge.id,
//         color: '#fff',
//       })
//     })

//     allEventModels.forEach((event) => {
//       console.log('event: ', event)
//       const eventNode = {
//         id: event?.id,
//         label: event?.name,
//         fill: DOMAIN_MODEL_COLORS?.events,
//         data: {
//           ...event,
//         },
//       }
//       tempNodes.push(eventNode)

//       const rootEventToChildEventEdge = {
//         source: eventsRootNode?.id,
//         target: event?.id,
//         id: `${eventsRootNode.id}->${event.id}`,
//         color: DOMAIN_MODEL_COLORS?.events,
//       }
//       tempEdges.push(rootEventToChildEventEdge)
//     })

//     eventsSubjectMatterExpertsEdges.forEach(({ id, event, ...rest }) => {
//       const target: any = rest['subject-matter-expert']

//       const eventToPersonnelEdge = {
//         source: event,
//         target,
//         id,
//         color: '#fff',
//       }
//       tempEdges.push(eventToPersonnelEdge)
//     })
//     const tempLinks = tempEdges.map(({ source, target, id, ...rest }: any) => {
//       return {
//         source,
//         target,
//       }
//     })

//     return [tempNodes, tempEdges, tempLinks]
//   }, [rootNodes, models])

//   return {
//     nodes,
//     edges,
//     links,
//   }
// }
