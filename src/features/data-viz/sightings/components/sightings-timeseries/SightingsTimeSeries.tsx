import {useRef, useState, useEffect, useCallback, type FC} from 'react'
import gsap from 'gsap'
import {Draggable} from 'gsap-trial/dist/Draggable'
import {InertiaPlugin} from 'gsap-trial/dist/InertiaPlugin'
// import './SightingsTimeline.css'

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

interface TimelineItemProps {
  year: number
  isActive: boolean
  distance: number
  showText: boolean
}

const TimelineItem: FC<TimelineItemProps> = ({year, isActive, distance, showText}) => {
  return (
    <div
      className={`timeline__item ${isActive ? 'is-active' : ''} ${
        showText ? 'timeline__item--text' : ''
      }`}
      style={
        {
          '--distance': distance.toString(),
        } as React.CSSProperties
      }>
      {showText ? year : null}
    </div>
  )
}

interface YearsRange {
  start: number
  end: number
}

interface SightingsTimeSeriesProps {
  years: YearsRange
}

export const SightingsTimeSeries: FC<SightingsTimeSeriesProps> = ({
  years = {start: 1940, end: 2025},
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [itemWidth, setItemWidth] = useState(0)
  const [draggableInstance, setDraggableInstance] = useState<DraggableInstance | null>(null)
  const paneRef = useRef<Pane | null>(null)
  const debug = true

  // Generate years array
  const yearsArray = Array.from({length: years.end - years.start + 1}, (_, i) => years.start + i)

  // State for active year and distances
  const [activeYear, setActiveYear] = useState<number | null>(null)
  const [yearDistances, setYearDistances] = useState<Record<number, number>>({})

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

  // Update item width when resizing
  const updateItemWidth = useCallback(() => {
    if (innerRef.current?.children.length) {
      setItemWidth(innerRef.current.children[0].clientWidth)
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

  // Update distances and active year based on draggable position
  const updateItems = useCallback(() => {
    if (!draggableInstance || !innerRef.current || !itemWidth) return

    // Get the current center of the viewport based on draggable position
    const centerPos = window.outerWidth / 2 + Math.abs(draggableInstance.x)
    const currentIdx = Math.round(centerPos / itemWidth)

    // Convert index to year
    const currentYear = years.start + currentIdx
    setActiveYear(currentYear)

    // Calculate distances for each year
    const minScale = 0.3
    const newDistances: Record<number, number> = {}

    yearsArray.forEach((year, idx) => {
      // Default distance
      newDistances[year] = minScale

      // If the year is within range of the current year, calculate distance
      if (
        idx >= currentIdx - settings.transformRange &&
        idx <= currentIdx + settings.transformRange
      ) {
        const itemPos = Math.abs(itemWidth * idx)
        const distFromCenter = Math.abs(itemPos - centerPos)

        const distanceValue = ease(distFromCenter / (itemWidth * settings.transformRange))
        const clampedMin = Math.max(distanceValue, 0)
        const clampedFinal = Math.min(clampedMin, 1 - minScale)
        newDistances[year] = 1 - clampedFinal
      }
    })

    setYearDistances(newDistances)
  }, [draggableInstance, itemWidth, years.start, yearsArray, settings.transformRange, ease])

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

  // Create draggable instance
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
  }, [draggableInstance, itemWidth, settings.throwResistance, settings.dragResistance, updateItems])

  // Add event listeners
  const addEventListeners = useCallback(() => {
    window.addEventListener('resize', updateItemWidth)
    updateItemWidth()
  }, [updateItemWidth])

  // Create debug GUI
  const createGui = useCallback(() => {
    if (!debug) return

    try {
      if (typeof window !== 'undefined' && window.Pane) {
        // Use the Pane constructor if it exists
        const paneConstructor = window.Pane as {
          new (options: {title: string}): Pane
        }
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
  }, [createDraggable, updateItems, settings])

  // Initialize the component
  useEffect(() => {
    createGui()
    updateItemWidth()
    createDraggable()
    addEventListeners()
    updateItems()
  }, [createGui, updateItemWidth, createDraggable, addEventListeners, updateItems])

  return (
    <div className='sightings-timeline' data-module-timeline ref={containerRef}>
      <div className='sightings-timeline__inner' data-timeline='inner' ref={innerRef}>
        {yearsArray.map((year) => (
          <TimelineItem
            key={year}
            year={year}
            isActive={year === activeYear}
            distance={yearDistances[year] || 0.3}
            showText={year % 10 === 0}
          />
        ))}
      </div>
    </div>
  )
}
