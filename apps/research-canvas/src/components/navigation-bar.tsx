"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Database, Network, AlertTriangle, BookOpen } from "lucide-react"

export default function NavigationBar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-neutral-800 rounded-lg p-1">
        <Link href="/">
          <div
            className={`relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              pathname === "/" ? "text-neutral-200" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Database className="h-4 w-4" />
            <span className="font-mono text-sm">Dashboard</span>

            {pathname === "/" && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-neutral-800/50 rounded-md -z-10"
                initial={false}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </div>
        </Link>

        <Link href="/connections">
          <div
            className={`relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              pathname === "/connections" ? "text-neutral-200" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Network className="h-4 w-4" />
            <span className="font-mono text-sm">Investigations</span>

            {pathname === "/connections" && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-neutral-800/50 rounded-md -z-10"
                initial={false}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </div>
        </Link>

        <Link href="/anomalies">
          <div
            className={`relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              pathname === "/anomalies" ? "text-neutral-200" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="font-mono text-sm">Anomaly Detection</span>

            {pathname === "/anomalies" && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-neutral-800/50 rounded-md -z-10"
                initial={false}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </div>
        </Link>

        <Link href="/research">
          <div
            className={`relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              pathname === "/research" ? "text-neutral-200" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span className="font-mono text-sm">Research Base</span>

            {pathname === "/research" && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-neutral-800/50 rounded-md -z-10"
                initial={false}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </div>
        </Link>
      </div>
    </div>
  )
}
