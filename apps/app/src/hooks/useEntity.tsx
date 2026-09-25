'use client'

import {useMindMap} from '@/contexts'
import {saveEventForUser} from '@/features/user/api/save-event'
import {objectMapToSingular} from '@/utils'
import {useAuth} from '@clerk/nextjs'
import {useCallback, useState} from 'react'

export const useEntity = ({card}: any) => {
  const {
    loadNodesFromTableQuery,
    getNode,

    screenToFlowPosition,
    updateNode,
  } = useMindMap()
  const {
    description,
    latitude,
    location,
    longitude,
    photos,
    photo,
    name,
    role,
    date,
    color,
    type,
    label,
    fill,
    id,
  } = card

  const image = photos?.length
    ? photos[0]
    : photo?.length
    ? photo[0]
    : {url: '/foofighters.webp', signedUrl: '/foofighters.webp'}

  // Check if image is a string URL or an object
  const imageData =
    typeof image === 'string' ? {url: image, src: image} : {...image, src: image.url}

  const [showMenu, setShowMMenu] = useState(false)
  const handleHoverLeave = () => {
    setShowMMenu(false)
  }
  const handleHoverEnter = () => {
    setShowMMenu(true)
  }
  // !IMPORTANT: This is for the connectionList UI only
  const [connectionListConnections, setConnectionListConnections]: any = useState()

  const [userNote, setUserNote] = useState({
    title: '',
    content: '',
  })

  const updateNote = ({title, content}: any) => {
    setUserNote({title, content})
  }

  const user: any = useAuth()
  const [relatedDataPoints, setRelatedDataPoints]: any = useState(null)

  // NOTE: previously called initiateRagEnrichedDatabaseSearch, which hit
  // /api/disclosure/data-layer/enrich — a route that does not exist (404).
  // The endpoint was removed with actions/search.ts (dead-code purge); this
  // is a no-op stub so existing call sites keep working without inventing a
  // new backend.
  const findEntityConnectionsWithAI = useCallback(async () => {
    console.warn('findEntityConnectionsWithAI: disabled, backend endpoint does not exist')
  }, [])

  const addEntityToMindMap = (cardId: any) => {
    console.log('🚀 ~ file: useEntity.tsx:81 ~ addEntityToMindMap ~ cardId:', cardId)
    const siblingSourceNode: any = getNode(cardId)
    console.log(
      '🚀 ~ file: useEntity.tsx:83 ~ addEntityToMindMap ~ siblingSourceNode:',
      siblingSourceNode
    )

    const domId = `entity-group-node-child-card-${cardId}`

    const element: any = document.getElementById(domId) // Select your element

    const rect = element.getBoundingClientRect()

    const x = rect.left // X position
    const y = rect.top // Y position
    const cardNode = {
      ...siblingSourceNode,
      hidden: false,
      position: screenToFlowPosition({
        x,
        y,
      }),
    }
    // getNodesBounds
    // const updatedNode = {s
    //   ...siblingSourceNode,
    //   hidden: false,
    // }
    updateNode(cardId, cardNode)
    return cardNode
  }

  // NOTE: previously called initiateDatabaseWideConnectionSearch, which hit
  // /api/disclosure/data-layer/search/connections — a route that does not
  // exist (404). The endpoint was removed with actions/search.ts (dead-code
  // purge); this is a no-op stub so existing call sites keep working
  // without inventing a new backend.
  const findEntityConnections = useCallback(async () => {
    console.warn('findEntityConnections: disabled, backend endpoint does not exist')
  }, [])

  const [bookmarked, setBookmarked] = useState(false)

  const saveNote = async () => {
    setBookmarked(true)
    const model = objectMapToSingular[card?.type]

    const saved = await saveEventForUser({
      user,
      event: {id: card.id},
      userNote,
      theory: 'test',
    })
  }

  return {
    entity: card,
    saveNote,
    updateNote,
    showMenu,
    setShowMMenu,
    connectionListConnections,
    setConnectionListConnections,
    userNote,

    handleHoverLeave,
    handleHoverEnter,
    relatedDataPoints,
    setRelatedDataPoints,
    findEntityConnectionsWithAI,
    addEntityToMindMap,
    findConnections: findEntityConnections,
    bookmarked,
    setBookmarked,
  }
}
