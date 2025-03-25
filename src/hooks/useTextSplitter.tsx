'use client'
// useTextSplitter.js

import { useRef, useEffect, useCallback, useState } from 'react'
import { debounce } from '../utils/debounce'
import SplitType from 'split-type'

export const useTextSplitter = (textElementRef, options: any) => {
  const [lines, setLines] = useState([])
  const [words, setWords] = useState([])
  const [chars, setChars] = useState([])
  const splitTextRef: any = useRef(null)
  const resizeObserverRef: any = useRef()
  const previousContainerWidthRef: any = useRef()

  const { resizeCallback, splitTypeTypes } = options

  useEffect(() => {
    const handleResize = (entries) => {
      const [{ contentRect }] = entries
      const width = Math.floor(contentRect.width)

      if (
        previousContainerWidthRef.current &&
        previousContainerWidthRef.current !== width
      ) {
        splitTextRef.current.split()
        setLines(splitTextRef.current.lines)
        setWords(splitTextRef.current.words)
        setChars(splitTextRef.current.chars)
        resizeCallback()
      }

      previousContainerWidthRef.current = width
    }
    const initResizeObserver = () => () => {
      resizeObserverRef.current = new ResizeObserver(
        debounce((entries) => handleResize(entries), 100)
      )
      resizeObserverRef.current.observe(textElementRef.current)
    }

    if (textElementRef.current) {
      const splitOptions: any = splitTypeTypes ? { types: splitTypeTypes } : {}
      splitTextRef.current = new SplitType(textElementRef.current, splitOptions)

      setLines(splitTextRef.current.lines)
      setWords(splitTextRef.current.words)
      setChars(splitTextRef.current.chars)

      if (typeof resizeCallback === 'function') {
        initResizeObserver()
      }
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [textElementRef, splitTypeTypes, resizeCallback])

  const revert = useCallback(() => {
    if (splitTextRef.current) {
      splitTextRef.current.revert()
    }
  }, [])

  return { lines, words, chars, revert }
}
