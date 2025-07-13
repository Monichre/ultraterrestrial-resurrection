/**
 * Famous Events Tour Launcher Component
 * Provides UI to start and control the chronological famous events tour
 */

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause,
  RotateCcw,
  Info
} from 'lucide-react'
import { useFamousEventsTour } from '../hooks/use-famous-events-tour'
import { cn } from '@/lib/utils'

export function FamousEventsTourLauncher() {
  const {
    tour,
    isLoading,
    currentWaypoint,
    tourProgress,
    initializeTour,
    navigateNext,
    navigatePrevious
  } = useFamousEventsTour()

  const [isPlaying, setIsPlaying] = React.useState(false)

  // Auto-advance tour when playing
  React.useEffect(() => {
    if (isPlaying && !isLoading) {
      const timer = setTimeout(() => {
        if (tourProgress.current < tourProgress.total) {
          navigateNext()
        } else {
          setIsPlaying(false)
        }
      }, 5000) // 5 seconds per waypoint

      return () => clearTimeout(timer)
    }
  }, [isPlaying, isLoading, tourProgress, navigateNext])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    setIsPlaying(false)
    initializeTour()
  }

  if (!tour) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Famous UFO Events Tour
          </CardTitle>
          <CardDescription>
            Journey through the most significant UFO events in chronological order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={initializeTour} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Loading Tour...' : 'Start Chronological Journey'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {tour.name}
        </CardTitle>
        <CardDescription>
          {currentWaypoint ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {currentWaypoint.metadata?.era}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {currentWaypoint.metadata?.year}
                </span>
              </div>
              <h3 className="font-semibold">{currentWaypoint.title}</h3>
              <p className="text-sm">{currentWaypoint.description}</p>
            </div>
          ) : (
            tour.description
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{tourProgress.current} of {tourProgress.total}</span>
          </div>
          <Progress value={tourProgress.percentage} className="h-2" />
        </div>

        {/* Waypoint Info */}
        {currentWaypoint?.narrative && (
          <div className="rounded-lg bg-muted p-3 space-y-2">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-sm">{currentWaypoint.narrative}</p>
            </div>
          </div>
        )}

        {/* Tour Controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={navigatePrevious}
            disabled={tourProgress.current <= 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              disabled={isLoading}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleRestart}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={navigateNext}
            disabled={tourProgress.current >= tourProgress.total || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Era Indicators */}
        {currentWaypoint?.metadata?.aiInsights && 
         currentWaypoint.metadata.aiInsights.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Suggested Explorations:</p>
            <div className="space-y-1">
              {currentWaypoint.metadata.aiInsights.slice(0, 3).map((insight, index) => (
                <div 
                  key={index}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <ChevronRight className="h-3 w-3" />
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}