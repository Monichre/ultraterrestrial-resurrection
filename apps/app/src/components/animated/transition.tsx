import { AnimatePresence, usePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface TransitionContentProps {
  children: any
  timeout: any
  enterTimeout: any
  exitTimeout: any
  onEnter?: () => void
  onEntered?: () => void
  onExit?: () => void
  onExited?: () => void
  initial: boolean
  nodeRef: React.RefObject<any>
  show: boolean
  defaultNodeRef: any
}
export const TransitionContent = ({
  children,
  timeout,
  enterTimeout,
  exitTimeout,
  onEnter,
  onEntered,
  onExit,
  onExited,
  initial,
  defaultNodeRef,
  show,
}: TransitionContentProps) => {
  const [status, setStatus] = useState(initial ? 'exited' : 'entered')
  const [isPresent, safeToRemove] = usePresence()
  const [hasEntered, setHasEntered] = useState(initial ? false : true)
  const splitTimeout = typeof timeout === 'object'
  const internalNodeRef = useRef(null)
  const nodeRef = defaultNodeRef || internalNodeRef
  const visible = hasEntered && show ? isPresent : false

  useEffect(() => {
    if (hasEntered || !show) return

    const actualTimeout = splitTimeout ? timeout.enter : timeout

    clearTimeout(enterTimeout.current)
    clearTimeout(exitTimeout.current)

    setHasEntered(true)
    setStatus('entering')
    onEnter?.()

    // Force reflow
    nodeRef.current?.offsetHeight

    enterTimeout.current = setTimeout(() => {
      setStatus('entered')
      onEntered?.()
    }, actualTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onEnter, onEntered, timeout, status, show])

  useEffect(() => {
    if (isPresent && show) return

    const actualTimeout = splitTimeout ? timeout.exit : timeout

    clearTimeout(enterTimeout.current)
    clearTimeout(exitTimeout.current)

    setStatus('exiting')
    onExit?.()

    // Force reflow
    nodeRef.current?.offsetHeight

    exitTimeout.current = setTimeout(() => {
      setStatus('exited')
      safeToRemove?.()
      onExited?.()
    }, actualTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPresent, onExit, safeToRemove, timeout, onExited, show])

  return children({ visible, status, nodeRef })
}
export const Transition = ({
  children,
  in: show,
  unmount,
  initial = true,
  ...props
}: any) => {
  const enterTimeout = useRef()
  const exitTimeout = useRef()

  useEffect(() => {
    if (show) {
      clearTimeout(exitTimeout.current)
    } else {
      clearTimeout(enterTimeout.current)
    }
  }, [show])

  return (
    <AnimatePresence>
      {(show || !unmount) && (
        <TransitionContent
          enterTimeout={enterTimeout}
          exitTimeout={exitTimeout}
          in={show}
          initial={initial}
          {...props}
        >
          {children}
        </TransitionContent>
      )}
    </AnimatePresence>
  )
}
