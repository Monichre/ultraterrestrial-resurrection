'use client'

/**
 * Debug Test Component for xataToXYFlow Issues
 * 
 * Created: July 10, 2025 at 10:30 AM PST
 * Purpose: Client component to run debug tests and display results
 * 
 * Usage:
 * 1. Import this component in a page or dev tool
 * 2. Click "Run Debug Tests" to execute the comprehensive test suite
 * 3. View detailed results and identify specific issues
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, CheckCircle, Clock, Play } from 'lucide-react'

import { 
  runComprehensiveDebug, 
  generateDebugReport, 
  quickDebugCheck,
  type DebugSuite,
  type DebugResult 
} from './comprehensive-debug'

export function DebugTestComponent() {
  const [isRunning, setIsRunning] = useState(false)
  const [debugSuite, setDebugSuite] = useState<DebugSuite | null>(null)
  const [quickCheck, setQuickCheck] = useState<{
    success: boolean
    criticalIssues: string[]
    summary: string
  } | null>(null)
  const [selectedTest, setSelectedTest] = useState<DebugResult | null>(null)

  const runFullDebugSuite = async () => {
    setIsRunning(true)
    setDebugSuite(null)
    setQuickCheck(null)
    
    try {
      console.log('🚀 Starting debug suite from UI component...')
      const results = await runComprehensiveDebug()
      setDebugSuite(results)
      console.log('✅ Debug suite completed successfully')
    } catch (error) {
      console.error('❌ Debug suite failed:', error)
      // Create a minimal error result
      setDebugSuite({
        results: [{
          step: 'Debug Suite Execution',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: 0
        }],
        summary: { total: 1, passed: 0, failed: 1, totalDuration: 0 }
      })
    } finally {
      setIsRunning(false)
    }
  }

  const runQuickCheck = async () => {
    setIsRunning(true)
    try {
      const result = await quickDebugCheck()
      setQuickCheck(result)
    } catch (error) {
      console.error('Quick check failed:', error)
      setQuickCheck({
        success: false,
        criticalIssues: ['Quick check execution failed'],
        summary: `Error: ${error}`
      })
    } finally {
      setIsRunning(false)
    }
  }

  const downloadReport = () => {
    if (!debugSuite) return
    
    const report = generateDebugReport(debugSuite)
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `xata-debug-report-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">xataToXYFlow Debug Suite</h1>
          <p className="text-muted-foreground">
            Comprehensive testing for database query and transformation issues
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={runQuickCheck} 
            disabled={isRunning}
            variant="outline"
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Quick Check
              </>
            )}
          </Button>
          
          <Button 
            onClick={runFullDebugSuite} 
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Full Debug Suite
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Check Results */}
      {quickCheck && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {quickCheck.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              Quick Check Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>{quickCheck.summary}</p>
              {quickCheck.criticalIssues.length > 0 && (
                <div>
                  <p className="font-medium text-red-600">Critical Issues:</p>
                  <ul className="list-disc list-inside text-sm">
                    {quickCheck.criticalIssues.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debug Suite Results */}
      {debugSuite && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Test Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Total Tests:</span>
                <Badge variant="outline">{debugSuite.summary.total}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Passed:</span>
                <Badge variant="default" className="bg-green-500">
                  {debugSuite.summary.passed}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Failed:</span>
                <Badge variant="destructive">
                  {debugSuite.summary.failed}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <Badge variant="outline">
                  {debugSuite.summary.totalDuration.toFixed(0)}ms
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <Badge variant={debugSuite.summary.failed === 0 ? "default" : "secondary"}>
                  {((debugSuite.summary.passed / debugSuite.summary.total) * 100).toFixed(1)}%
                </Badge>
              </div>
              
              <Button 
                onClick={downloadReport} 
                className="w-full mt-4"
                variant="outline"
              >
                Download Report
              </Button>
            </CardContent>
          </Card>

          {/* Test Results List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {debugSuite.results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTest === result 
                          ? 'bg-accent border-accent-foreground' 
                          : 'hover:bg-accent/50'
                      } ${
                        result.success ? 'border-green-200' : 'border-red-200'
                      }`}
                      onClick={() => setSelectedTest(result)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-medium">{result.step}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {result.duration.toFixed(0)}ms
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Test Details */}
      {selectedTest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedTest.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              {selectedTest.step} - Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Badge variant={selectedTest.success ? "default" : "destructive"}>
                  {selectedTest.success ? 'PASSED' : 'FAILED'}
                </Badge>
                <Badge variant="outline">
                  {selectedTest.duration.toFixed(2)}ms
                </Badge>
              </div>
              
              {selectedTest.success && selectedTest.data && (
                <div>
                  <h4 className="font-medium mb-2">Test Data:</h4>
                  <ScrollArea className="h-48">
                    <pre className="text-sm bg-muted p-3 rounded overflow-x-auto">
                      {JSON.stringify(selectedTest.data, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              )}
              
              {!selectedTest.success && selectedTest.error && (
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Error Details:</h4>
                  <ScrollArea className="h-32">
                    <pre className="text-sm bg-red-50 p-3 rounded text-red-800 overflow-x-auto">
                      {selectedTest.error.toString()}
                    </pre>
                  </ScrollArea>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!debugSuite && !quickCheck && (
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Quick Check:</strong> Runs critical tests only to identify major issues quickly.</p>
            <p><strong>Full Debug Suite:</strong> Comprehensive testing of all components in the xataToXYFlow pipeline.</p>
            <p>Click on individual test results to see detailed information about what was tested and any errors encountered.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}