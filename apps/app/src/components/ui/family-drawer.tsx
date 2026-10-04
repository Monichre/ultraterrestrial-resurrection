"use client"

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx"
import { AnimatePresence, motion } from "motion/react"
import useMeasure from "react-use-measure"
import { Drawer } from "vaul"

// ============================================================================
// Types
// ============================================================================

type ViewComponent = React.ComponentType<Record<string, unknown>>

interface ViewsRegistry {
  [viewName: string]: ViewComponent
}

// ============================================================================
// Context
// ============================================================================

interface FamilyDrawerContextValue {
  isOpen: boolean
  view: string
  setView: (view: string) => void
  opacityDuration: number
  elementRef: ReturnType<typeof useMeasure>[0]
  bounds: ReturnType<typeof useMeasure>[1]
  views: ViewsRegistry | undefined
}

const FamilyDrawerContext = createContext<FamilyDrawerContextValue | undefined>(
  undefined
)

function useFamilyDrawer() {
  const context = useContext(FamilyDrawerContext)
  if (!context) {
    throw new Error(
      "FamilyDrawer components must be used within FamilyDrawerRoot"
    )
  }
  return context
}

// ============================================================================
// Root Component
// ============================================================================

interface FamilyDrawerRootProps {
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  defaultView?: string
  onViewChange?: (view: string) => void
  views?: ViewsRegistry
}

function FamilyDrawerRoot({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  defaultView = "default",
  onViewChange,
  views: customViews,
}: FamilyDrawerRootProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [view, setView] = useState(defaultView)
  const [elementRef, bounds] = useMeasure()
  const previousHeightRef = useRef<number>(0)

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const opacityDuration = useMemo(() => {
    const currentHeight = bounds.height
    const previousHeight = previousHeightRef.current

    const MIN_DURATION = 0.15
    const MAX_DURATION = 0.27

    if (!previousHeightRef.current) {
      previousHeightRef.current = currentHeight
      return MIN_DURATION
    }

    const heightDifference = Math.abs(currentHeight - previousHeight)
    previousHeightRef.current = currentHeight

    const duration = Math.min(
      Math.max(heightDifference / 500, MIN_DURATION),
      MAX_DURATION
    )

    return duration
  }, [bounds.height])

  const handleViewChange = (newView: string) => {
    setView(newView)
    onViewChange?.(newView)
  }

  // Use custom views if provided, otherwise pass undefined
  const views =
    customViews && Object.keys(customViews).length > 0 ? customViews : undefined

  const contextValue: FamilyDrawerContextValue = {
    isOpen,
    view,
    setView: handleViewChange,
    opacityDuration,
    elementRef,
    bounds,
    views,
  }

  return (
    <FamilyDrawerContext.Provider value={contextValue}>
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        {children}
      </Drawer.Root>
    </FamilyDrawerContext.Provider>
  )
}

// ============================================================================
// Trigger Component
// ============================================================================

interface FamilyDrawerTriggerProps {
  children: ReactNode
  asChild?: boolean
  className?: string
}

function FamilyDrawerTrigger({
  children,
  asChild = false,
  className,
}: FamilyDrawerTriggerProps) {
  if (asChild) {
    return (
      <Drawer.Trigger asChild>
        <Slot>{children}</Slot>
      </Drawer.Trigger>
    )
  }

  return (
    <Drawer.Trigger asChild>
      <button
        className={clsx(
          "fixed top-1/2 left-1/2 antialiased -translate-y-1/2 -translate-x-1/2 h-[44px] rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-gray-950 transition-colors hover:bg-gray-100 focus-visible:shadow-focus-ring-button md:font-medium cursor-pointer dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800",
          className
        )}
        type="button"
      >
        {children}
      </button>
    </Drawer.Trigger>
  )
}

// ============================================================================
// Portal Component
// ============================================================================

function FamilyDrawerPortal({ children }: { children: ReactNode }) {
  return <Drawer.Portal>{children}</Drawer.Portal>
}

// ============================================================================
// Overlay Component
// ============================================================================

interface FamilyDrawerOverlayProps {
  className?: string
  onClick?: () => void
}

function FamilyDrawerOverlay({ className, onClick }: FamilyDrawerOverlayProps) {
  const { setView } = useFamilyDrawer()

  return (
    <Drawer.Overlay
      className={clsx("fixed inset-0 z-10 bg-black/30", className)}
      onClick={onClick || (() => setView("default"))}
    />
  )
}

// ============================================================================
// Content Component
// ============================================================================

interface FamilyDrawerContentProps {
  children: ReactNode
  className?: string
  asChild?: boolean
}

function FamilyDrawerContent({
  children,
  className,
  asChild = false,
}: FamilyDrawerContentProps) {
  const { bounds } = useFamilyDrawer()

  const content = (
    <motion.div
      animate={{
        height: bounds.height,
        transition: {
          duration: 0.27,
          ease: [0.25, 1, 0.5, 1],
        },
      }}
    >
      {children}
    </motion.div>
  )

  if (asChild) {
    return (
      <Drawer.Content
        asChild
        className={clsx(
          "fixed inset-x-4 bottom-4 z-10 mx-auto max-w-[361px] overflow-hidden rounded-[36px] bg-white outline-none md:mx-auto md:w-full dark:bg-gray-950",
          className
        )}
      >
        <Slot>{content}</Slot>
      </Drawer.Content>
    )
  }

  return (
    <Drawer.Content
      asChild
      className={clsx(
        "fixed inset-x-4 bottom-4 z-10 mx-auto max-w-[361px] overflow-hidden rounded-[36px] bg-white outline-none md:mx-auto md:w-full dark:bg-gray-950",
        className
      )}
    >
      {content}
    </Drawer.Content>
  )
}

// ============================================================================
// Animated Wrapper Component
// ============================================================================

interface FamilyDrawerAnimatedWrapperProps {
  children: ReactNode
  className?: string
}

function FamilyDrawerAnimatedWrapper({
  children,
  className,
}: FamilyDrawerAnimatedWrapperProps) {
  const { elementRef } = useFamilyDrawer()

  return (
    <div
      ref={elementRef}
      className={clsx("px-6 pb-6 pt-2.5 antialiased", className)}
    >
      {children}
    </div>
  )
}

// ============================================================================
// Animated Content Component
// ============================================================================

interface FamilyDrawerAnimatedContentProps {
  children: ReactNode
}

function FamilyDrawerAnimatedContent({
  children,
}: FamilyDrawerAnimatedContentProps) {
  const { view, opacityDuration } = useFamilyDrawer()

  return (
    <AnimatePresence initial={false} mode="popLayout" custom={view}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        key={view}
        transition={{
          duration: opacityDuration,
          ease: [0.26, 0.08, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// ============================================================================
// Close Component
// ============================================================================

interface FamilyDrawerCloseProps {
  children?: ReactNode
  asChild?: boolean
  className?: string
}

function FamilyDrawerClose({
  children,
  asChild = false,
  className,
}: FamilyDrawerCloseProps) {
  const defaultClose = (
    <button
      data-vaul-no-drag=""
      className={clsx(
        "absolute right-8 top-7 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-75 cursor-pointer dark:bg-gray-800 dark:text-gray-400",
        className
      )}
      type="button"
    >
      {children || <CloseIcon />}
    </button>
  )

  if (asChild) {
    return (
      <Drawer.Close asChild>
        <Slot>{defaultClose}</Slot>
      </Drawer.Close>
    )
  }

  return <Drawer.Close asChild>{defaultClose}</Drawer.Close>
}

// ============================================================================
// Helper Components
// ============================================================================

interface FamilyDrawerHeaderProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

function FamilyDrawerHeader({
  icon,
  title,
  description,
  className,
}: FamilyDrawerHeaderProps) {
  return (
    <header className={clsx("mt-[21px]", className)}>
      {icon}
      <h2 className="mt-2.5 text-[22px] font-semibold text-gray-950 md:font-medium dark:text-gray-50">
        {title}
      </h2>
      <p className="mt-3 text-[17px] font-medium leading-[24px] text-gray-500 md:font-normal dark:text-gray-400">
        {description}
      </p>
    </header>
  )
}

interface FamilyDrawerButtonProps {
  children: ReactNode
  onClick: () => void
  className?: string
  asChild?: boolean
}

function FamilyDrawerButton({
  children,
  onClick,
  className,
  asChild = false,
}: FamilyDrawerButtonProps) {
  const button = (
    <button
      data-vaul-no-drag=""
      className={clsx(
        "flex h-12 w-full items-center gap-[15px] rounded-[16px] bg-gray-100 px-4 text-[17px] font-semibold text-gray-950 transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium cursor-pointer dark:bg-gray-800 dark:text-gray-50",
        className
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )

  if (asChild) {
    return <Slot>{button}</Slot>
  }

  return button
}

interface FamilyDrawerSecondaryButtonProps {
  children: ReactNode
  onClick: () => void
  className: string
  asChild?: boolean
}

function FamilyDrawerSecondaryButton({
  children,
  onClick,
  className,
  asChild = false,
}: FamilyDrawerSecondaryButtonProps) {
  const button = (
    <button
      data-vaul-no-drag=""
      type="button"
      className={clsx(
        "flex h-12 w-full items-center justify-center gap-[15px] rounded-full text-center text-[19px] font-semibold transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-95 md:font-medium cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )

  if (asChild) {
    return <Slot>{button}</Slot>
  }

  return button
}

// ============================================================================
// View Content Renderer
// ============================================================================

interface FamilyDrawerViewContentProps {
  views?: ViewsRegistry
}

function FamilyDrawerViewContent(
  {
    views: propViews,
  }: FamilyDrawerViewContentProps = {} as FamilyDrawerViewContentProps
) {
  const { view, views: contextViews } = useFamilyDrawer()

  // Use prop views first, then context views
  const views = propViews || contextViews

  if (!views) {
    throw new Error(
      "FamilyDrawerViewContent requires views to be provided via props or FamilyDrawerRoot"
    )
  }

  const ViewComponent = views[view]

  if (!ViewComponent) {
    // Fallback to default view if view not found
    const DefaultComponent = views.default
    return DefaultComponent ? <DefaultComponent /> : null
  }

  return <ViewComponent />
}

// ============================================================================
// Icons
// ============================================================================

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Close Icon</title>
      <path
        d="M10.4854 1.99998L2.00007 10.4853"
        stroke="#999999"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4854 10.4844L2.00007 1.99908"
        stroke="#999999"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ============================================================================
// Exports
// ============================================================================

export {
  FamilyDrawerRoot,
  FamilyDrawerTrigger,
  FamilyDrawerPortal,
  FamilyDrawerOverlay,
  FamilyDrawerContent,
  FamilyDrawerAnimatedWrapper,
  FamilyDrawerAnimatedContent,
  FamilyDrawerClose,
  FamilyDrawerHeader,
  FamilyDrawerButton,
  FamilyDrawerSecondaryButton,
  FamilyDrawerViewContent,
  useFamilyDrawer,
  type ViewsRegistry,
  type ViewComponent,
}
