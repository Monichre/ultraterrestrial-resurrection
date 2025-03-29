import {useRef, useState, useEffect, useCallback} from 'react'
import gsap from 'gsap'
import {Draggable} from 'gsap/Draggable'
import {InertiaPlugin} from 'gsap/InertiaPlugin'
import './SightingsTimeline.css'

// Declare the tweakpane module as a global to avoid errors
declare global {
  interface Window {
    Pane?: unknown
  }
}

// Define type for Tweakpane since the module can't be found
interface PaneChangeEvent<T> {
  value: T
}

interface PaneInputOptions {
  min?: number
  max?: number
  step?: number
  options?: Record<string, string>
}

interface PaneInput<T> {
  on: (event: string, callback: (ev: PaneChangeEvent<T>) => void) => void
}

interface Pane {
  hidden: boolean
  dispose: () => void
  addInput: <T>(
    object: Record<string, unknown>,
    key: string,
    options?: PaneInputOptions
  ) => PaneInput<T>
}

// Define a type for the draggable instance
interface DraggableInstance {
  x: number
  kill: () => void
  addEventListener: (event: string, callback: () => void) => void
}

export const SightingsTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement[]>([])
  const [itemWidth, setItemWidth] = useState(0)
  const [draggableInstance, setDraggableInstance] = useState<DraggableInstance | null>(null)
  const paneRef = useRef<Pane | null>(null)
  const debug = true

  const [settings, setSettings] = useState({
    throwResistance: 1000,
    dragResistance: -0.2,
    transformRange: 3,
    ease: 'none' as
      | 'none'
      | 'inQuad'
      | 'outQuad'
      | 'inOutQuad'
      | 'inCubic'
      | 'outCubic'
      | 'inOutCubic'
      | 'inQuart'
      | 'outQuart'
      | 'inOutQuart',
  })

  // Define updateItemWidth as a useCallback to use in dependency arrays
  const updateItemWidth = useCallback(() => {
    if (itemsRef.current.length) {
      setItemWidth(itemsRef.current[0].offsetWidth)
    }
  }, [])

  // Define easing function before it's used
  const ease = useCallback(
    (inputX: number): number => {
      const eases: Record<typeof settings.ease, (x: number) => number> = {
        none: (x: number) => x,
        inQuad: (x: number) => x * x,
        outQuad: (x: number) => x * (2 - x),
        inOutQuad: (x: number) => (x < 0.5 ? 2 * x * x : -1 + (4 - 2 * x) * x),
        inCubic: (x: number) => x * x * x,
        outCubic: (x: number) => {
          const val = x - 1
          return val * val * val + 1
        },
        inOutCubic: (x: number) =>
          x < 0.5 ? 4 * x * x * x : (x - 1) * (2 * x - 2) * (2 * x - 2) + 1,
        inQuart: (x: number) => x * x * x * x,
        outQuart: (x: number) => {
          const val = x - 1
          return 1 - val * val * val * val
        },
        inOutQuart: (x: number) => {
          if (x < 0.5) {
            return 8 * x * x * x * x
          }
          const val = x - 1
          return 1 - 8 * val * val * val * val
        },
      }

      return eases[settings.ease](inputX)
    },
    [settings.ease]
  )

  const updateItems = useCallback(() => {
    if (!draggableInstance || !itemsRef.current.length) return

    // Get the current center of the viewport based on draggable position
    const centerPos = window.outerWidth / 2 + Math.abs(draggableInstance.x)
    const currentIdx = Math.round(centerPos / itemWidth)

    itemsRef.current.forEach((item, idx) => {
      const minScale = 0.3

      // Set the active class on the current item
      item.classList.remove('is-active')
      item.style.setProperty('--distance', minScale.toString())

      if (currentIdx === idx) {
        item.classList.add('is-active')
      }

      // If the items index is within the range of the current index, show it
      if (
        idx >= currentIdx - settings.transformRange &&
        idx <= currentIdx + settings.transformRange
      ) {
        // Get the items position
        const itemPos = Math.abs(itemWidth * idx)
        const distFromCenter = Math.abs(itemPos - centerPos)

        // Set a CSS variable based on distance from center
        const distanceValue = ease(distFromCenter / (itemWidth * settings.transformRange))
        const clampedMin = Math.max(distanceValue, 0)
        const clampedFinal = Math.min(clampedMin, 1 - minScale)
        item.style.setProperty('--distance', (1 - clampedFinal).toString())
      }
    })
  }, [draggableInstance, itemWidth, settings.transformRange, ease])

  // Register GSAP plugins on component mount
  useEffect(() => {
    gsap.registerPlugin(Draggable, InertiaPlugin)

    return () => {
      // Cleanup
      window.removeEventListener('resize', updateItemWidth)
      if (draggableInstance) {
        draggableInstance.kill()
      }
      if (paneRef.current) {
        paneRef.current.dispose()
      }
    }
  }, [draggableInstance, updateItemWidth])

  const createDraggable = useCallback(() => {
    if (!innerRef.current || !containerRef.current) return

    if (draggableInstance) {
      draggableInstance.kill()
    }

    const instance = Draggable.create(innerRef.current, {
      bounds: containerRef.current,
      inertia: true,
      type: 'x',
      lockAxis: true,
      throwResistance: settings.throwResistance,
      dragResistance: settings.dragResistance,
      snap: (value) => {
        return Math.round(value / itemWidth) * itemWidth
      },
    })[0] as unknown as DraggableInstance

    instance.addEventListener('drag', updateItems)
    instance.addEventListener('throwupdate', updateItems)

    setDraggableInstance(instance)
  }, [
    draggableInstance,
    itemWidth,
    settings.throwResistance,
    settings.dragResistance,
    updateItems,
    containerRef,
    innerRef,
  ])

  const addEventListeners = useCallback(() => {
    window.addEventListener('resize', updateItemWidth)
    updateItemWidth()
  }, [updateItemWidth])

  const addItems = useCallback(() => {
    if (!innerRef.current) return

    // Clear existing items
    innerRef.current.innerHTML = ''
    itemsRef.current = []

    // For each year from 1940 to 2020, create a new element and add it to the inner container
    for (let idx = 1940; idx <= 2020; idx++) {
      const el = document.createElement('div')
      el.classList.add('timeline__item')
      innerRef.current.appendChild(el)
      itemsRef.current.push(el)

      // Show text for decade years
      if (idx % 10 === 0) {
        el.classList.add('timeline__item--text')
        el.textContent = idx.toString()
      }
    }
  }, [innerRef])

  const createGui = useCallback(() => {
    if (!debug) return

    try {
      if (typeof window !== 'undefined' && window.Pane) {
        // Use the Pane constructor if it exists
        const paneConstructor = window.Pane as {new (options: {title: string}): Pane}
        const paneInstance = new paneConstructor({title: 'Grid Settings'})

        paneRef.current = paneInstance

        // Hide initially
        paneRef.current.hidden = true
        window.setTimeout(() => {
          if (paneRef.current) {
            paneRef.current.hidden = false
          }
        }, 4000)

        // Add inputs with properly typed event handlers
        const throwInput = paneRef.current.addInput<number>(
          settings as Record<string, unknown>,
          'throwResistance',
          {
            min: 0,
            max: 10000,
            step: 1000,
          }
        )

        throwInput.on('change', (ev) => {
          setSettings((prev) => ({...prev, throwResistance: ev.value}))
          createDraggable()
        })

        const dragInput = paneRef.current.addInput<number>(
          settings as Record<string, unknown>,
          'dragResistance',
          {
            min: -3,
            max: 0.3,
            step: 0.1,
          }
        )

        dragInput.on('change', (ev) => {
          setSettings((prev) => ({...prev, dragResistance: ev.value}))
          createDraggable()
        })

        const rangeInput = paneRef.current.addInput<number>(
          settings as Record<string, unknown>,
          'transformRange',
          {
            min: 3,
            max: 20,
            step: 1,
          }
        )

        rangeInput.on('change', (ev) => {
          setSettings((prev) => ({...prev, transformRange: ev.value}))
          updateItems()
        })

        const easeInput = paneRef.current.addInput<string>(
          settings as Record<string, unknown>,
          'ease',
          {
            options: {
              none: 'none',
              inQuad: 'inQuad',
              outQuad: 'outQuad',
              inOutQuad: 'inOutQuad',
              inCubic: 'inCubic',
              outCubic: 'outCubic',
              inOutCubic: 'inOutCubic',
              inQuart: 'inQuart',
              outQuart: 'outQuart',
              inOutQuart: 'inOutQuart',
            },
          }
        )

        easeInput.on('change', (ev) => {
          setSettings((prev) => ({
            ...prev,
            ease: ev.value as typeof settings.ease,
          }))
          updateItems()
        })
      }
    } catch (error) {
      console.error('Error initializing Tweakpane:', error)
    }
  }, [settings, createDraggable, updateItems, debug])

  // Initialize the component
  useEffect(() => {
    createGui()
    addItems()
    createDraggable()
    addEventListeners()
    updateItems()

    // Capture the ref value for cleanup
    const innerRefCurrent = innerRef.current

    return () => {
      // Clean up any items created
      if (innerRefCurrent) {
        innerRefCurrent.innerHTML = ''
      }
      itemsRef.current = []
    }
  }, [createGui, addItems, createDraggable, addEventListeners, updateItems])

  return (
    <div className='sightings-timeline' data-module-timeline ref={containerRef}>
      <div className='sightings-timeline__inner' data-timeline='inner' ref={innerRef} />
    </div>
  )
}
