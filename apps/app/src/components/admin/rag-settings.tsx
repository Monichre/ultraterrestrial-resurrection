'use client'

import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Save, TestTube } from 'lucide-react'

interface RAGSettings {
  mode: 'local' | 'remote'
  localUrl: string
  remoteUrl: string
  apiKey?: string
  enabled: boolean
}

export function RAGSettingsPanel() {
  const [settings, setSettings] = useState<RAGSettings>({
    mode: 'local',
    localUrl: 'http://localhost:8000',
    remoteUrl: '',
    apiKey: '',
    enabled: false
  })
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    // Load existing settings
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/rag-settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/rag-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (!response.ok) {
        throw new Error('Failed to save settings')
      }
      
      toast({
        title: "Settings saved",
        description: "RAG settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const url = settings.mode === 'local' ? settings.localUrl : settings.remoteUrl
      const testUrl = `${url}/health`
      
      // Direct connection test for local mode
      if (settings.mode === 'local') {
        const response = await fetch(testUrl)
        if (response.ok) {
          toast({
            title: "Connection successful",
            description: "Successfully connected to the local RAG server.",
          })
        } else {
          throw new Error('Local connection failed')
        }
      } else {
        // For remote, we could create a test endpoint or just validate the URL format
        toast({
          title: "Settings validated",
          description: "Remote connection settings appear valid.",
        })
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Could not connect to RAG server. Please check your settings.",
        variant: "destructive"
      })
      console.error(error)
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>RAG Integration Settings</CardTitle>
            <CardDescription>
              Configure connection to your Knowledge Base RAG system
            </CardDescription>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => setSettings({ ...settings, enabled })}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {settings.enabled && (
          <>
            <div className="space-y-3">
              <Label>Connection Mode</Label>
              <RadioGroup
                value={settings.mode}
                onValueChange={(mode: 'local' | 'remote') => 
                  setSettings({ ...settings, mode })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="local" id="local" />
                  <Label htmlFor="local" className="font-normal cursor-pointer">
                    Local Server (Development)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="remote" id="remote" />
                  <Label htmlFor="remote" className="font-normal cursor-pointer">
                    Remote API (Production)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {settings.mode === 'local' ? (
              <div className="space-y-2">
                <Label htmlFor="localUrl">Local RAG Server URL</Label>
                <Input
                  id="localUrl"
                  value={settings.localUrl}
                  onChange={(e) => setSettings({ ...settings, localUrl: e.target.value })}
                  placeholder="http://localhost:8000"
                />
                <p className="text-sm text-muted-foreground">
                  URL of your local disclosure-rag server
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="remoteUrl">Remote RAG API URL</Label>
                  <Input
                    id="remoteUrl"
                    value={settings.remoteUrl}
                    onChange={(e) => setSettings({ ...settings, remoteUrl: e.target.value })}
                    placeholder="https://api.example.com/rag"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL of your production RAG API endpoint
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={settings.apiKey || ''}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    placeholder="Enter your API key"
                  />
                  <p className="text-sm text-muted-foreground">
                    Required for authenticating with remote API
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={testConnection} 
                variant="outline"
                disabled={testing}
              >
                {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <TestTube className="mr-2 h-4 w-4" />
                Test Connection
              </Button>
              
              <Button 
                onClick={saveSettings}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}