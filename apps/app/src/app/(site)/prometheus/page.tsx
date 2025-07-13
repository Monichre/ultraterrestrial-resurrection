'use client'
import {Prometheus} from '@/features/agents/prometheus'
import {PrometheusPage} from '@repo/ai'
import {useEffect} from 'react'

// Import the CSS for styling
import './prometheus.css'

export default function PrometheusPageWrapper() {
  // Apply body class for proper styling
  useEffect(() => {
    document.body.classList.add('prometheus-page')

    return () => {
      document.body.classList.remove('prometheus-page')
    }
  }, [])

  return <PrometheusPage PrometheusAgent={Prometheus} breadcrumbBasePath='/explore' />
}
