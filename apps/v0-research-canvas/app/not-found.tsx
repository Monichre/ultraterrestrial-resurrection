"use client"

import Link from "next/link"
import { Home, Search, ArrowLeft, AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-16 h-16 text-primary" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-3">Signal Lost</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for has disappeared into the unknown. Perhaps it was never documented, or the
          coordinates were incorrect.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground 
              rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            href="/search-and-discovery-interface"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground 
              rounded-xl font-medium hover:bg-muted/80 transition-colors"
          >
            <Search className="w-4 h-4" />
            Search Database
          </Link>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    </div>
  )
}
