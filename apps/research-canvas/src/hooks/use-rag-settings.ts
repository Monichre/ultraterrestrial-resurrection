import { useState, useEffect } from 'react'

interface RAGSettings {
  mode: 'local' | 'remote'
  localUrl: string
  remoteUrl: string
  enabled: boolean
  hasApiKey: boolean
}

export function useRAGSettings() {
  const [settings, setSettings] = useState<RAGSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/rag-settings')
      
      if (!response.ok) {
        throw new Error('Failed to load settings')
      }
      
      const data = await response.json()
      setSettings(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setSettings(null)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (newSettings: Partial<RAGSettings>) => {
    try {
      const response = await fetch('/api/admin/rag-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update settings')
      }
      
      // Reload settings after update
      await loadSettings()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return false
    }
  }

  return {
    settings,
    loading,
    error,
    reload: loadSettings,
    update: updateSettings,
    enabled: settings?.enabled ?? false
  }
}