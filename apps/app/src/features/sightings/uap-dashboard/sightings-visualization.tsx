'use client'

import { ValidatedUAPSighting } from '@/lib/schemas/uap-sighting'
import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface SightingsVisualizationProps {
  sightings: ValidatedUAPSighting[]
}

export function SightingsVisualization( { sightings }: SightingsVisualizationProps ) {
  const [categoryData, setCategoryData] = useState<any[]>( [] )

  useEffect( () => {
    const categories = sightings.reduce( ( acc, sighting ) => {
      sighting.category?.forEach( cat => {
        acc[cat] = ( acc[cat] || 0 ) + 1
      } )
      return acc
    }, {} as Record<string, number> )

    setCategoryData(
      Object.entries( categories ).map( ( [name, count] ) => ( {
        name,
        count
      } ) )
    )
  }, [sightings] )

  return (
    <div className="w-full h-[400px]">
      <BarChart width={600} height={300} data={categoryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </div>
  )
} 