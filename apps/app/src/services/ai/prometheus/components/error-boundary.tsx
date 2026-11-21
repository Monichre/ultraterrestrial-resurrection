"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
    this.setState({ errorInfo })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="p-6 max-w-md mx-auto bg-black/80 backdrop-blur-md rounded-xl shadow-xl border border-white/10 text-white/90">
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <div className="bg-black/50 p-4 rounded-md mb-4 overflow-auto max-h-[200px] text-sm">
              <p className="text-red-400">{this.state.error?.toString()}</p>
              {this.state.errorInfo && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-white/60 hover:text-white/90 transition-colors">
                    Stack trace
                  </summary>
                  <pre className="mt-2 text-white/60 text-xs whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            <p className="text-sm text-white/60">
              Please try refreshing the page or contact support if the problem persists.
            </p>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
