'use client'

import type React from 'react'
import {useState, useRef, useEffect} from 'react'
import {FileText, Globe, Loader2, Send} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from '@/components/ui/chat/expandable-chat'
import {Badge} from '@/components/ui/badge'
import {ChatResourceForm} from '@/components/chat-resource-form'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ScrollArea} from '@/components/ui/scroll-area'
import {useAssistant} from '@ai-sdk/react'
import {cn} from '@/utils'
import type {ResearchDepth, ResearchCategory} from '@/lib/firecrawl/firecrawl'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ResourceContext {
  type: 'url' | 'file'
  title: string
  summary: string
  sourceUrl?: string
  fileName?: string
  resourceId: string
}

interface ChatWithContextProps {
  apiEndpoint?: string
  position?: 'bottom-right' | 'bottom-left'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  icon?: React.ReactNode
  title?: string
  contextSummary?: string
  initialMessages?: ChatMessage[]
}

export function ChatWithContext({
  apiEndpoint = '/api/disclosure/chat',
  position = 'bottom-right',
  size = 'lg',
  icon,
  title = 'AI Assistant',
  contextSummary,
  initialMessages = [],
}: ChatWithContextProps) {
  const [activeTab, setActiveTab] = useState<string>('chat')
  const [processingResource, setProcessingResource] = useState(false)
  const [resources, setResources] = useState<ResourceContext[]>([])
  const [activeResource, setActiveResource] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    input,
    handleInputChange,
    submitMessage: originalSubmitMessage,
    isLoading,
    error,
  } = useAssistant({
    api: apiEndpoint,
    initialMessages,
  })

  // Override submitMessage to include resource context
  const submitMessage = () => {
    if (activeResource) {
      const resource = resources.find((r) => r.resourceId === activeResource)
      if (resource) {
        return originalSubmitMessage(input, {
          resourceContext: {
            resourceId: resource.resourceId,
            summary: resource.summary,
            sourceUrl: resource.sourceUrl,
            fileName: resource.fileName,
          },
        })
      }
    }
    return originalSubmitMessage()
  }

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({behavior: 'smooth'})
    }
  }, [messages])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      submitMessage()
    }
  }

  // Handle resource form submission
  const handleResourceSubmit = async (
    values: {
      resourceType: 'url' | 'file'
      url?: string
      researchDepth: ResearchDepth
      categories: ResearchCategory[]
      recursiveLinks: boolean
      linkDepth: number
      maxResults: number
    },
    file?: File
  ) => {
    setProcessingResource(true)

    try {
      let response

      if (values.resourceType === 'url' && values.url) {
        // Process URL with deep research
        response = await fetch('/api/disclosure/process-resource', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resourceUrl: values.url,
            options: {
              useDeepResearch: true,
              researchDepth: values.researchDepth,
              categories: values.categories,
              recursiveLinks: values.recursiveLinks,
              linkDepth: values.linkDepth,
              maxResults: values.maxResults,
            },
          }),
        })
      } else if (values.resourceType === 'file' && file) {
        // Process file upload
        const formData = new FormData()
        formData.append('file', file)
        formData.append(
          'options',
          JSON.stringify({
            researchDepth: values.researchDepth,
            categories: values.categories,
          })
        )

        response = await fetch('/api/disclosure/process-file', {
          method: 'POST',
          body: formData,
        })
      }

      if (response?.ok) {
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Unknown error occurred')
        }

        // Add processed resource to resources list
        const newResource: ResourceContext = {
          type: values.resourceType,
          title: values.resourceType === 'url' ? values.url || 'Website' : file?.name || 'Document',
          summary: result.summary || 'No summary available',
          sourceUrl: values.resourceType === 'url' ? values.url : undefined,
          fileName: values.resourceType === 'file' ? file?.name : undefined,
          resourceId: result.resourceId || `resource-${Date.now()}`,
        }

        setResources((prev) => [...prev, newResource])
        setActiveResource(newResource.resourceId)

        // Generate a prompt based on the resource type and categories
        let analysisPrompt = `I've just loaded the following resource: "${newResource.title}". `

        if (values.resourceType === 'url') {
          analysisPrompt += `This website has been analyzed with depth level "${values.researchDepth}" `
        } else {
          analysisPrompt += `This document has been processed `
        }

        analysisPrompt += `focusing on ${values.categories.join(', ')}. Please provide a summary of the key information and insights from this content.`

        // Submit system message to inform the AI
        originalSubmitMessage(analysisPrompt, {
          resourceContext: {
            resourceId: newResource.resourceId,
            summary: newResource.summary,
            sourceUrl: newResource.sourceUrl,
            fileName: newResource.fileName,
          },
        })

        // Switch to chat tab
        setActiveTab('chat')
      } else {
        const errorData = await response?.json()
        throw new Error(errorData?.error || 'Failed to process resource')
      }
    } catch (err: any) {
      console.error('Error processing resource:', err)
      // Add error message to chat
      originalSubmitMessage(
        `There was an error processing your resource: ${err.message}. Please try again.`
      )
    } finally {
      setProcessingResource(false)
    }
  }

  return (
    <ExpandableChat position={position} size={size} icon={icon}>
      <ExpandableChatHeader className='border-b bg-background'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center'>
            <h3 className='font-semibold'>{title}</h3>
            {activeResource && (
              <Badge variant='outline' className='ml-2'>
                {resources.find((r) => r.resourceId === activeResource)?.type === 'url' ? (
                  <Globe className='mr-1 h-3 w-3' />
                ) : (
                  <FileText className='mr-1 h-3 w-3' />
                )}
                {resources.find((r) => r.resourceId === activeResource)?.title.substring(0, 20)}
                {(resources.find((r) => r.resourceId === activeResource)?.title.length || 0) > 20
                  ? '...'
                  : ''}
              </Badge>
            )}
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className='w-auto'>
            <TabsList className='grid w-[180px] grid-cols-2'>
              <TabsTrigger value='chat'>Chat</TabsTrigger>
              <TabsTrigger value='resource'>Add Resource</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </ExpandableChatHeader>

      <ExpandableChatBody className='p-4 overflow-y-auto flex-1'>
        <TabsContent value='chat' className='mt-0 h-full'>
          <ScrollArea className='h-full pr-4'>
            {contextSummary && (
              <div className='mb-4 p-3 bg-accent/20 rounded-lg text-sm'>
                <p className='font-medium mb-1'>Context Summary:</p>
                <p className='text-muted-foreground'>{contextSummary}</p>
              </div>
            )}

            {resources.length > 0 && activeResource && (
              <div className='mb-4 p-3 bg-accent/20 rounded-lg text-sm'>
                <p className='font-medium mb-1'>
                  Resource: {resources.find((r) => r.resourceId === activeResource)?.title}
                </p>
                <p className='text-muted-foreground'>
                  {resources.find((r) => r.resourceId === activeResource)?.summary}
                </p>
              </div>
            )}

            <div className='space-y-4'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'rounded-lg px-3 py-2 max-w-[85%] text-sm',
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className='flex justify-start'>
                  <div className='rounded-lg px-3 py-2 max-w-[85%] text-sm bg-muted'>
                    <Loader2 className='h-4 w-4 animate-spin' />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value='resource' className='mt-0 h-full'>
          <ScrollArea className='h-full pr-4'>
            <div className='space-y-4'>
              <ChatResourceForm onSubmit={handleResourceSubmit} isProcessing={processingResource} />

              {resources.length > 0 && (
                <div className='mt-6'>
                  <h4 className='text-sm font-medium mb-2'>Loaded Resources</h4>
                  <div className='space-y-2'>
                    {resources.map((resource) => (
                      <div
                        key={resource.resourceId}
                        className={cn(
                          'p-2 rounded-md border flex items-center justify-between cursor-pointer',
                          activeResource === resource.resourceId
                            ? 'border-primary bg-primary/5'
                            : 'border-muted'
                        )}
                        onClick={() => {
                          setActiveResource(resource.resourceId)
                          setActiveTab('chat')
                        }}>
                        <div className='flex items-center'>
                          {resource.type === 'url' ? (
                            <Globe className='h-4 w-4 mr-2' />
                          ) : (
                            <FileText className='h-4 w-4 mr-2' />
                          )}
                          <span className='text-sm'>
                            {resource.title.length > 30
                              ? `${resource.title.substring(0, 30)}...`
                              : resource.title}
                          </span>
                        </div>
                        <Badge variant='outline' size='sm'>
                          {resource.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </ExpandableChatBody>

      <ExpandableChatFooter className='border-t p-4 bg-background'>
        <form onSubmit={handleSubmit} className='flex space-x-2'>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder='Ask a question about the document...'
            className='flex-1'
            disabled={isLoading || activeTab !== 'chat'}
          />
          <Button
            type='submit'
            size='icon'
            disabled={isLoading || !input.trim() || activeTab !== 'chat'}>
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Send className='h-4 w-4' />
            )}
          </Button>
        </form>
        {error && (
          <p className='text-destructive text-xs mt-1'>{error.message || 'An error occurred'}</p>
        )}
      </ExpandableChatFooter>
    </ExpandableChat>
  )
}
