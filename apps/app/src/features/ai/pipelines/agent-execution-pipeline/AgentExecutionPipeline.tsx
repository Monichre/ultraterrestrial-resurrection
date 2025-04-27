/**
 * AgentSandbox - A decent AI agent testing environment
 *
 * This component provides an interactive sandbox for testing different AI agents.
 * It features a dual-panel interface with input configuration and output display,
 * supporting multiple agent types, parameter customization, and response visualization.
 */
'use client'

import {useState, useCallback} from 'react'
import {toast} from 'sonner'

import {AgentHeader} from './agent-header'
import {ActionButtons, InputPanel} from './agent-input-panel'
import {OutputPanel} from './agent-output-panel'
import {MobileOutputPanel} from './agent-mobile-output-panel'
import {testAgent} from '@/features/ai/actions/agent-patterns.actions'
import type {agentTypes, examplePrompts} from '@/features/ai/pipelines/types'
import {useMediaQuery} from 'usehooks-ts'

// Default parameters for AI model configuration
// Could be made dynamic in the future
const initialParams = {
  maxTokens: 700, // Maximum number of tokens in the response
  temperature: 0.7, // Controls randomness (0 = deterministic, 1 = creative)
  topP: 1, // Nucleus sampling parameter
  frequencyPenalty: 0, // Reduces repetition of similar tokens
  presencePenalty: 0, // Encourages covering new topics
}

export function AgentExecutionPipeline() {
  // State Management
  const [inputs, setInputs] = useState<Record<string, string>>({}) // Stores user input fields
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(null) // Currently selected example index
  const [output, setOutput] = useState('') // Raw output from the agent
  const [loading, setLoading] = useState(false) // Loading state during API calls
  const [parsedOutput, setParsedOutput] = useState<any>(null) // Parsed JSON output if available
  const [selectedAgent, setSelectedAgent] = useState<(typeof agentTypes)[number]['id']>(
    agentTypes[0].id
  ) // Currently selected agent
  const [params, setParams] = useState(initialParams) // AI model parameters
  const [inputHistory, setInputHistory] = useState<Record<string, string[]>>({}) // History of previous inputs by agent type
  const [outputDrawerOpen, setOutputDrawerOpen] = useState(false) // Mobile output drawer state

  // Responsive design hook for mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)')
  const selectedAgentDetails = agentTypes.find((agent) => agent.id === selectedAgent)

  // Get current agent's history
  const currentAgentHistory = inputHistory[selectedAgent] || []

  /**
   * Updates a specific input field value
   * @param fieldName - The name of the input field
   * @param value - The new value for the field
   */
  const handleInputChange = (fieldName: string, value: string) => {
    setInputs((prev) => ({...prev, [fieldName]: value}))
  }

  /**
   * Resets all state variables to their initial values
   */
  const resetState = useCallback(() => {
    setInputs({})
    setOutput('')
    setLoading(false)
    setParsedOutput(null)
    setParams(initialParams)
    setSelectedExampleIndex(null)
  }, [])

  /**
   * Handles agent type changes and resets state
   */
  const handleAgentChange = useCallback(
    (newAgent: (typeof agentTypes)[number]['id']) => {
      setSelectedAgent(newAgent)
      resetState()
    },
    [resetState]
  )

  /**
   * Populates input fields with an example prompt
   */
  const handleExampleSelect = (example: any, index: number) => {
    setInputs(example)
    setSelectedExampleIndex(index)
  }

  /**
   * Loads a previous input configuration from history
   */
  const handleHistorySelect = (historyItem: string) => {
    try {
      const parsedItem = JSON.parse(historyItem) as Record<string, string>
      setInputs(parsedItem)
      toast.success('Loaded from history')
    } catch (error) {
      toast.error('Failed to load history item')
    }
  }

  /**
   * Utility functions for input management
   */
  const handleCopyInput = () => {
    navigator.clipboard.writeText(JSON.stringify(inputs, null, 2))
    toast.success('Copied to clipboard')
  }

  const handleClearInput = () => {
    setInputs({})
    toast.success('Input cleared')
  }

  /**
   * Processes the input and makes an API call to the selected agent
   * Handles the response and updates the UI accordingly
   */
  const handleInputSubmit = async () => {
    if (!selectedAgentDetails) return

    if (Object.values(inputs).every((v) => v.trim() === '')) {
      toast.error('Please enter an input or select an example')
      return
    }

    setLoading(true)
    setOutputDrawerOpen(true)

    try {
      const result = await testAgent(selectedAgent, inputs, params)
      if (typeof result === 'string') {
        setOutput(result)
        // Attempt to parse the output as JSON
        try {
          setParsedOutput(JSON.parse(result))
        } catch {
          setParsedOutput(null)
        }
      } else {
        // Handle error responses
        setOutput(result?.error?.message || 'Unknown error')
        toast.error(result?.error?.message || 'Unknown error')
        setParsedOutput({error: true, message: result?.error?.message || 'Unknown error'})
      }
      // Add current input to agent-specific history
      setInputHistory((prev) => ({
        ...prev,
        [selectedAgent]: [JSON.stringify(inputs), ...(prev[selectedAgent] || [])],
      }))
    } catch (error) {
      toast.error('Failed to process request')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleMobileReOpenOutputDrawer = () => {
    if (!outputDrawerOpen && parsedOutput) {
      setOutputDrawerOpen(true)
    }
  }

  return (
    <div className='flex flex-col h-screen overflow-x-hidden'>
      {/* Header component with agent selection and input controls */}
      <AgentHeader
        selectedAgent={selectedAgent}
        onAgentChange={handleAgentChange}
        onCopyInput={handleCopyInput}
        onClearInput={handleClearInput}
        hasInput={Object.values(inputs).some((v) => v.trim())}
        agentTypes={agentTypes}
      />

      {/* Main content area with input and output panels */}
      <div className='flex-1 flex flex-col min-h-0 pb-4 bg-muted overflow-hidden relative'>
        <h2 className='hidden md:block text-[9px] font-medium text-neutral-400 px-2 sm:px-4 pt-4'>
          Input
        </h2>
        <div className='flex-1 flex flex-col md:flex-row min-h-0 w-[calc(100vw-1rem)] lg:w-full py-2'>
          {selectedAgentDetails && (
            <InputPanel
              inputs={inputs}
              resetState={resetState}
              onInputChange={handleInputChange}
              selectedAgent={selectedAgentDetails}
              onExampleSelect={handleExampleSelect}
              selectedExampleIndex={selectedExampleIndex}
              examplePrompts={examplePrompts[selectedAgent as keyof typeof examplePrompts] || []}>
              <ActionButtons
                inputs={inputs}
                loading={loading}
                isMobile={isMobile}
                resetState={resetState}
                inputHistory={currentAgentHistory}
                handleInputSubmit={handleInputSubmit}
                handleHistorySelect={handleHistorySelect}
                mobileReOpenOutputDrawer={handleMobileReOpenOutputDrawer}
              />
            </InputPanel>
          )}

          {/* Responsive Output Panel */}
          {isMobile ? (
            <MobileOutputPanel
              selectedAgent={selectedAgentDetails!}
              loading={loading}
              outputDrawerOpen={outputDrawerOpen}
              setOutputDrawerOpen={setOutputDrawerOpen}>
              <OutputPanel
                selectedAgent={selectedAgentDetails!}
                loading={loading}
                output={output}
                parsedOutput={parsedOutput}
              />
            </MobileOutputPanel>
          ) : (
            <OutputPanel
              selectedAgent={selectedAgentDetails!}
              loading={loading}
              output={output}
              parsedOutput={parsedOutput}
            />
          )}
        </div>
      </div>
    </div>
  )
}
