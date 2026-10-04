// ./src/components/ui/card/grid-layout-examples.tsx

import { cn } from "@/utils"
import { motion } from 'framer-motion'
import { GridLayout } from './grid-layout'

// Basic Example
export const BasicGridExample = () => {
  return (
    <GridLayout className="w-full gap-4">
      {[1, 2, 3, 4].map( ( item ) => (
        <div
          key={item}
          className="rounded-lg border bg-card p-4 shadow-sm"
        >
          <h3 className="text-lg font-semibold">Card {item}</h3>
          <p className="text-muted-foreground">
            This is a basic card example in the grid layout.
          </p>
        </div>
      ) )}
    </GridLayout>
  )
}

// Responsive Grid Example
export const ResponsiveGridExample = () => {
  return (
    <GridLayout
      className="w-full"
      minChildWidth={200}
      gap={6}
    >
      {[1, 2, 3, 4, 5, 6].map( ( item ) => (
        <div
          key={item}
          className="aspect-square rounded-lg border bg-card"
        >
          <div className="flex h-full items-center justify-center">
            <span className="text-2xl font-bold text-muted-foreground">
              {item}
            </span>
          </div>
        </div>
      ) )}
    </GridLayout>
  )
}

// Featured Grid Example
export const FeaturedGridExample = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="md:col-span-2 lg:col-span-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-bold">Featured Content</h2>
          <p className="text-muted-foreground">
            This spans the full width of the grid.
          </p>
        </div>
      </div>
      <GridLayout gap={4} minChildWidth={250}>
        {[1, 2, 3, 4].map( ( item ) => (
          <div
            key={item}
            className="rounded-lg border bg-card p-4"
          >
            <h3 className="text-lg font-semibold">Card {item}</h3>
            <p className="text-muted-foreground">Regular grid item.</p>
          </div>
        ) )}
      </GridLayout>
    </div>
  )
}

// Masonry-style Grid Example
export const MasonryGridExample = () => {
  const items = [
    { height: 'h-48', color: 'bg-blue-100' },
    { height: 'h-64', color: 'bg-green-100' },
    { height: 'h-56', color: 'bg-yellow-100' },
    { height: 'h-72', color: 'bg-red-100' },
    { height: 'h-48', color: 'bg-purple-100' },
    { height: 'h-64', color: 'bg-pink-100' },
  ]

  return (
    <GridLayout
      className="w-full"
      minChildWidth={250}
      gap={4}
    >
      {items.map( ( item, index ) => (
        <div
          key={index}
          className={cn(
            "rounded-lg border",
            item.height,
            item.color
          )}
        >
          <div className="flex h-full items-center justify-center">
            <span className="text-lg font-semibold">
              Card {index + 1}
            </span>
          </div>
        </div>
      ) )}
    </GridLayout>
  )
}

// Interactive Grid Example
export const InteractiveGridExample = () => {
  return (
    <GridLayout
      className="w-full"
      minChildWidth={200}
      gap={4}
    >
      {[1, 2, 3, 4].map( ( item ) => (
        <motion.div
          key={item}
          className="rounded-lg border bg-card p-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-lg font-semibold">Interactive Card {item}</h3>
          <p className="text-muted-foreground">
            Hover or click me!
          </p>
        </motion.div>
      ) )}
    </GridLayout>
  )
}

// Content Grid Example
export const ContentGridExample = () => {
  const content = [
    {
      title: "Getting Started",
      description: "Learn the basics and get up running quickly.",
      icon: "📚"
    },
    {
      title: "Components",
      description: "Explore our library of reusable components.",
      icon: "🧩"
    },
    {
      title: "Themes",
      description: "Customize the look and feel of your application.",
      icon: "🎨"
    },
    {
      title: "Plugins",
      description: "Extend functionality with our plugin system.",
      icon: "🔌"
    }
  ]

  return (
    <GridLayout
      className="w-full"
      minChildWidth={280}
      gap={6}
    >
      {content.map( ( item, index ) => (
        <div
          key={index}
          className="rounded-lg border bg-card p-6"
        >
          <div className="mb-4 text-4xl">{item.icon}</div>
          <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
          <p className="text-muted-foreground">{item.description}</p>
        </div>
      ) )}
    </GridLayout>
  )
}

// Dashboard Grid Example
export const DashboardGridExample = () => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {['Users', 'Revenue', 'Orders', 'Conversion'].map( ( metric, index ) => (
          <div
            key={index}
            className="rounded-lg border bg-card p-4"
          >
            <h3 className="text-sm font-medium text-muted-foreground">
              {metric}
            </h3>
            <p className="mt-2 text-2xl font-bold">
              {Math.floor( Math.random() * 1000 )}
            </p>
          </div>
        ) )}
      </div>
      <GridLayout
        className="w-full"
        minChildWidth={300}
        gap={4}
      >
        <div className="col-span-2 rounded-lg border bg-card p-4">
          <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
          {[1, 2, 3].map( ( item ) => (
            <div
              key={item}
              className="mb-2 rounded border p-2 text-sm"
            >
              Activity {item}
            </div>
          ) )}
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
          <div className="space-y-2">
            {['Add User', 'Create Order', 'Generate Report'].map( ( action, index ) => (
              <button
                key={index}
                className="w-full rounded-lg border p-2 text-sm hover:bg-muted"
              >
                {action}
              </button>
            ) )}
          </div>
        </div>
      </GridLayout>
    </div>
  )
}