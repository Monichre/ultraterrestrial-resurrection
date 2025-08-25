'use client'

import type React from 'react'
import {motion} from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Progress} from '@/components/ui/progress'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type {
  SightingsAnalysisResult,
  GeoCluster,
  TemporalPattern,
  ShapePattern,
  Anomaly,
  Correlation,
} from '@/services/sightings/actions/sightings-ai-analysis'

// Animated container for insights
const InsightContainer = ({children}: {children: React.ReactNode}) => (
  <motion.div
    initial={{opacity: 0, y: 20}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.5}}
    className='w-full'>
    {children}
  </motion.div>
)

// Geographic Clusters Visualization
const GeographicClustersChart = ({clusters}: {clusters: GeoCluster[]}) => {
  if (!clusters || clusters.length === 0)
    return <EmptyState message='No geographic cluster data available' />

  // Create chart config
  const chartConfig = clusters.reduce((config, cluster) => {
    return {
      ...config,
      [cluster.region]: {
        label: cluster.region,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      },
    }
  }, {})

  // Sort clusters by sighting count (descending)
  const sortedClusters = [...clusters].sort((a, b) => b.sightingCount - a.sightingCount)

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Geographic Hotspots</CardTitle>
        <CardDescription>Regions with concentrated UFO sighting activity</CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        <ChartContainer config={chartConfig}>
          <BarChart data={sortedClusters}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='region' />
            <YAxis />
            <ChartTooltip
              content={({active, payload}) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as GeoCluster
                  return (
                    <div className='rounded-lg border bg-background p-2 shadow-sm'>
                      <div className='font-bold'>{data.region}</div>
                      <div className='text-sm'>Sightings: {data.sightingCount}</div>
                      <div className='text-xs text-muted-foreground'>{data.significance}</div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey='sightingCount' fill='#78efff' />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Temporal Patterns Visualization
const TemporalPatternsChart = ({patterns}: {patterns: TemporalPattern[]}) => {
  if (!patterns || patterns.length === 0)
    return <EmptyState message='No temporal pattern data available' />

  // Create chart config
  const chartConfig = patterns.reduce((config, pattern) => {
    return {
      ...config,
      [pattern.pattern]: {
        label: pattern.pattern,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
      },
    }
  }, {})

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Temporal Patterns</CardTitle>
        <CardDescription>Time-based patterns in sighting reports</CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        <ChartContainer config={chartConfig}>
          <LineChart data={patterns}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='timeframe' />
            <YAxis />
            <ChartTooltip
              content={({active, payload}) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as TemporalPattern
                  return (
                    <div className='rounded-lg border bg-background p-2 shadow-sm'>
                      <div className='font-bold'>{data.pattern}</div>
                      <div className='text-sm'>{data.timeframe}</div>
                      <div className='text-sm'>Frequency: {data.frequency}</div>
                      <div className='text-xs text-muted-foreground'>{data.description}</div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line type='monotone' dataKey='frequency' stroke='#78efff' strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Shape Patterns Visualization
const ShapePatternsChart = ({shapes}: {shapes: ShapePattern[]}) => {
  if (!shapes || shapes.length === 0)
    return <EmptyState message='No shape pattern data available' />

  // Generate consistent colors for shapes
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed', '#8dd1e1']

  // Sort shapes by occurrences (descending)
  const sortedShapes = [...shapes].sort((a, b) => b.occurrences - a.occurrences)

  // Prepare data for pie chart
  const data = sortedShapes.map((shape, index) => ({
    name: shape.shape,
    value: shape.occurrences,
    behaviors: shape.associatedBehaviors,
    notes: shape.notes,
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Shape Distribution</CardTitle>
        <CardDescription>Common UFO shapes reported by witnesses</CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={({active, payload}) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className='rounded-lg border bg-background p-2 shadow-sm'>
                      <div className='font-bold'>{data.name}</div>
                      <div className='text-sm'>Sightings: {data.value}</div>
                      {data.behaviors && (
                        <div className='mt-1'>
                          <div className='text-xs font-semibold'>Associated Behaviors:</div>
                          <ul className='text-xs text-muted-foreground'>
                            {data.behaviors.map((behavior: string, i: number) => (
                              <li key={i}>{behavior}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {data.notes && <div className='mt-1 text-xs italic'>{data.notes}</div>}
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Anomalies Visualization
const AnomaliesVisualization = ({anomalies}: {anomalies: Anomaly[]}) => {
  if (!anomalies || anomalies.length === 0) return <EmptyState message='No anomalies detected' />

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Notable Anomalies</CardTitle>
        <CardDescription>Unusual patterns and outliers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {anomalies.map((anomaly, index) => (
            <div key={index} className='rounded-lg border p-4'>
              <div className='flex justify-between items-center mb-2'>
                <h4 className='font-semibold'>{anomaly.description}</h4>
                <div className='bg-yellow-200 dark:bg-yellow-900 px-2 py-1 rounded text-xs font-medium'>
                  Confidence: {anomaly.confidence}%
                </div>
              </div>
              {(anomaly.location || anomaly.date) && (
                <div className='flex flex-wrap gap-2 mb-2 text-sm text-muted-foreground'>
                  {anomaly.location && <div>🌎 {anomaly.location}</div>}
                  {anomaly.date && <div>🗓️ {anomaly.date}</div>}
                </div>
              )}
              <div className='text-sm'>{anomaly.significance}</div>
              <Progress className='mt-2' value={anomaly.confidence} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Correlations Visualization
const CorrelationsVisualization = ({correlations}: {correlations: Correlation[]}) => {
  if (!correlations || correlations.length === 0)
    return <EmptyState message='No correlation data available' />

  // Sort correlations by sighting count (descending)
  const sortedCorrelations = [...correlations].sort((a, b) => b.sightingCount - a.sightingCount)

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Points of Interest Correlations</CardTitle>
        <CardDescription>
          Correlations with military bases and other significant locations
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[300px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            data={sortedCorrelations}
            layout='vertical'
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis type='number' domain={[0, 'dataMax']} />
            <YAxis dataKey='pointOfInterest' type='category' />
            <Tooltip
              content={({active, payload}) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as Correlation
                  return (
                    <div className='rounded-lg border bg-background p-2 shadow-sm'>
                      <div className='font-bold'>{data.pointOfInterest}</div>
                      <div className='text-sm'>Type: {data.poiType}</div>
                      <div className='text-sm'>Sightings: {data.sightingCount}</div>
                      <div className='text-sm'>Distance: {data.distance}</div>
                      <div className='text-xs text-muted-foreground'>{data.significance}</div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey='sightingCount' fill='#87bdff' />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Empty state component
const EmptyState = ({message = 'No data available'}: {message?: string}) => (
  <div className='flex flex-col items-center justify-center h-[200px] text-center p-4'>
    <div className='text-4xl mb-2'>📊</div>
    <h3 className='text-lg font-medium'>{message}</h3>
    <p className='text-sm text-muted-foreground mt-1'>
      Try analyzing more sightings data to generate insights
    </p>
  </div>
)

// Loading state component
const LoadingState = () => (
  <div className='w-full space-y-4'>
    <div className='flex items-center space-x-4'>
      <div className='h-8 w-8 rounded-full bg-muted animate-pulse'></div>
      <div className='space-y-2'>
        <div className='h-4 w-[250px] bg-muted rounded animate-pulse'></div>
        <div className='h-4 w-[200px] bg-muted rounded animate-pulse'></div>
      </div>
    </div>
    <div className='h-[300px] w-full rounded-lg bg-muted animate-pulse'></div>
    <div className='space-y-2'>
      <div className='h-4 w-full bg-muted rounded animate-pulse'></div>
      <div className='h-4 w-full bg-muted rounded animate-pulse'></div>
      <div className='h-4 w-2/3 bg-muted rounded animate-pulse'></div>
    </div>
  </div>
)

// Error state component
const ErrorState = ({error}: {error: string}) => (
  <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center'>
    <h3 className='text-lg font-medium text-red-800 dark:text-red-300'>Analysis Error</h3>
    <p className='text-sm text-red-600 dark:text-red-400 mt-2'>
      {error || 'An error occurred while analyzing sightings data'}
    </p>
    <button
      className='mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40 text-red-700 dark:text-red-300 rounded-md text-sm font-medium transition-colors'
      onClick={() => window.location.reload()}>
      Try Again
    </button>
  </div>
)

// Main SightingsAIInsights component
interface SightingsAIInsightsProps {
  data?: SightingsAnalysisResult
  isLoading?: boolean
  error?: string
}

const SightingsAIInsights: React.FC<SightingsAIInsightsProps> = ({
  data,
  isLoading = false,
  error,
}) => {
  // Handle different states
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!data) return <EmptyState message='No analysis data available' />

  const {
    analysisText,
    geographicClusters,
    temporalPatterns,
    shapePatterns,
    anomalies,
    correlations,
  } = data

  return (
    <div className='space-y-6'>
      {/* Analysis Text Section */}
      <InsightContainer>
        <Card className='w-full overflow-hidden border-[#78efff]/20 bg-black/20 backdrop-blur-sm'>
          <CardHeader className='bg-[#78efff]/10'>
            <CardTitle className='text-[#78efff] flex items-center'>
              <span className='mr-2'>🔍</span> AI Analysis Summary
            </CardTitle>
            <CardDescription>
              Advanced pattern recognition analysis of UAP sightings data
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-6'>
            <div className='prose prose-sm dark:prose-invert max-w-none'>
              {analysisText.split('\n\n').map((paragraph, index) => (
                <p key={index} className='text-sm leading-relaxed mb-4 last:mb-0'>
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
          <CardFooter className='bg-[#78efff]/5 text-xs text-muted-foreground'>
            Generated using advanced AI pattern recognition algorithms
          </CardFooter>
        </Card>
      </InsightContainer>

      {/* Tabbed Visualizations */}
      <InsightContainer>
        <Tabs defaultValue='geographic' className='w-full'>
          <TabsList className='grid grid-cols-5 mb-4'>
            <TabsTrigger value='geographic'>Geographic</TabsTrigger>
            <TabsTrigger value='temporal'>Temporal</TabsTrigger>
            <TabsTrigger value='shapes'>Shapes</TabsTrigger>
            <TabsTrigger value='anomalies'>Anomalies</TabsTrigger>
            <TabsTrigger value='correlations'>Correlations</TabsTrigger>
          </TabsList>

          <TabsContent value='geographic' className='mt-0'>
            <GeographicClustersChart clusters={geographicClusters} />
          </TabsContent>

          <TabsContent value='temporal' className='mt-0'>
            <TemporalPatternsChart patterns={temporalPatterns} />
          </TabsContent>

          <TabsContent value='shapes' className='mt-0'>
            <ShapePatternsChart shapes={shapePatterns} />
          </TabsContent>

          <TabsContent value='anomalies' className='mt-0'>
            <AnomaliesVisualization anomalies={anomalies} />
          </TabsContent>

          <TabsContent value='correlations' className='mt-0'>
            <CorrelationsVisualization correlations={correlations} />
          </TabsContent>
        </Tabs>
      </InsightContainer>

      {/* Data Quality Indicator */}
      <InsightContainer>
        <div className='w-full flex items-center space-x-4 bg-black/20 backdrop-blur-sm rounded-lg p-4'>
          <div className='flex-1'>
            <h4 className='text-sm font-medium mb-1'>Analysis Confidence Score</h4>
            <Progress value={data.confidenceScore || 0} className='h-2' />
          </div>
          <div className='text-right'>
            <span className='text-lg font-semibold'>{data.confidenceScore || 0}%</span>
            <p className='text-xs text-muted-foreground'>Based on data quality and quantity</p>
          </div>
        </div>
      </InsightContainer>
    </div>
  )
}

export default SightingsAIInsights
