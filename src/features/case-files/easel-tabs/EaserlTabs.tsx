'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import {motion, AnimatePresence} from 'framer-motion'
import {cn} from '@/utils'

const EaselTabs = TabsPrimitive.Root

const EaselTabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({className, ...props}, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'relative flex h-14 items-center justify-start gap-2 rounded-xl bg-muted/20 p-2',
      'before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-linear-to-b before:from-background before:to-muted/50 before:shadow-lg',
      'after:absolute after:inset-0 after:-z-20 after:rounded-xl after:bg-linear-to-t after:from-primary/5 after:to-muted/5',
      className
    )}
    {...props}
  />
))
EaselTabsList.displayName = TabsPrimitive.List.displayName

const EaselTabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    'data-state'?: string
  }
>(({className, children, ...props}, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'group relative flex h-10 items-center justify-center whitespace-nowrap rounded-lg px-4 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
      // Paper-like texture
      "before:absolute before:-z-10 before:h-full before:w-full before:rounded-lg before:bg-linear-to-b before:from-white/95 before:to-white/75 before:opacity-0 before:transition-opacity before:duration-300 before:content-[''] data-[state=active]:before:opacity-100 dark:before:from-zinc-900/95 dark:before:to-zinc-900/75",
      // Paint splash effect
      "after:absolute after:-bottom-1 after:left-1/2 after:h-6 after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-linear-to-t after:from-primary/0 after:to-primary/0 after:blur-md after:transition-all after:duration-300 after:content-[''] data-[state=active]:after:from-primary/30 data-[state=active]:after:to-primary/10",
      // Shadow and border effects
      'data-[state=active]:bg-background/50 data-[state=active]:shadow-lg data-[state=active]:shadow-primary/10',
      className
    )}
    {...props}>
    <motion.div
      initial={false}
      animate={props['data-state'] === 'active' ? 'active' : 'inactive'}
      variants={{
        active: {
          scale: 1.05,
          y: -2,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
          },
        },
        inactive: {
          scale: 1,
          y: 0,
          transition: {
            duration: 0.2,
          },
        },
      }}
      className='relative'>
      {children}
      <motion.div
        className='absolute inset-x-0 -bottom-1 h-[2px] bg-primary'
        initial={false}
        animate={props['data-state'] === 'active' ? 'active' : 'inactive'}
        variants={{
          active: {
            width: '100%',
            opacity: 1,
            transition: {duration: 0.3},
          },
          inactive: {
            width: '0%',
            opacity: 0,
            transition: {duration: 0.2},
          },
        }}
      />
    </motion.div>
  </TabsPrimitive.Trigger>
))
EaselTabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const EaselTabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({className, children, ...props}, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-6 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}>
    <AnimatePresence mode='wait'>
      <motion.div
        initial={{opacity: 0, x: 10}}
        animate={{opacity: 1, x: 0}}
        exit={{opacity: 0, x: -10}}
        transition={{
          type: 'spring',
          stiffness: 250,
          damping: 25,
        }}>
        {children}
      </motion.div>
    </AnimatePresence>
  </TabsPrimitive.Content>
))
EaselTabsContent.displayName = TabsPrimitive.Content.displayName

export {EaselTabs, EaselTabsList, EaselTabsTrigger, EaselTabsContent}
https://artifactui.in/docs/components/easel-tabs