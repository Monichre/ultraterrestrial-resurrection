import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { SightingsGlobe } from './sightings-globe'
import { Suspense } from 'react'

// Create mock GeoJSON data for the stories
const createMockGeoJSON = () => {
  // Mock sightings data
  const sightings = {
    type: 'FeatureCollection',
    features: Array.from({ length: 50 }, (_, i) => ({
      type: 'Feature',
      properties: {
        id: `sighting-${i}`,
        date: new Date(1980 + Math.floor(i/2), i % 12, (i % 28) + 1).toISOString(),
        timestamp: new Date(1980 + Math.floor(i/2), i % 12, (i % 28) + 1).getTime(),
        city: `City ${i}`,
        state: `State ${i % 50}`,
        country: `Country ${i % 10}`,
        description: `This is a mock sighting description ${i}. It was reported by multiple witnesses.`,
        comments: `Witness reported seeing unusual lights in the sky that moved in patterns inconsistent with known aircraft. Sighting lasted approximately ${(i % 10) + 1} minutes.`,
        shape: ['Disc', 'Triangle', 'Sphere', 'Cylinder', 'Oval', 'Cigar', 'Unknown'][i % 7],
        duration: `${(i % 60) + 1} minutes`,
        sourceUrl: `https://example.com/sighting/${i}`
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -180 + (i * 7.2) % 360, // longitude spread around the world
          (Math.sin(i) * 60) % 85  // latitude with some variation
        ]
      }
    }))
  }

  // Mock military bases data
  const militaryBases = {
    type: 'FeatureCollection',
    features: Array.from({ length: 20 }, (_, i) => ({
      type: 'Feature',
      properties: {
        id: `base-${i}`,
        name: `Military Base ${i}`,
        type: ['Air Force', 'Navy', 'Army', 'Space Force', 'Research Facility'][i % 5],
        country: `Country ${i % 8}`,
        established: 1950 + (i * 3),
        description: `Military installation with reported UAP activity nearby.`
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -160 + (i * 16) % 320, // longitude spread
          (Math.cos(i) * 50) % 70  // latitude with variation
        ]
      }
    }))
  }

  // Mock UFO posts data (e.g. social media posts or reports)
  const ufoPosts = {
    type: 'FeatureCollection',
    features: Array.from({ length: 30 }, (_, i) => ({
      type: 'Feature',
      properties: {
        id: `post-${i}`,
        username: `user${i * 7}`,
        date: new Date(2010 + Math.floor(i/3), i % 12, (i % 28) + 1).toISOString(),
        timestamp: new Date(2010 + Math.floor(i/3), i % 12, (i % 28) + 1).getTime(),
        content: `I just saw something strange in the sky! #UFO #sighting ${i}`,
        platform: ['Twitter', 'Facebook', 'Instagram', 'TikTok', 'Reddit'][i % 5],
        mediaAttached: i % 3 === 0,
        verified: i % 5 === 0
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -170 + (i * 11.3) % 340, // longitude spread
          (Math.tan(i) * 30) % 75  // latitude with variation
        ]
      }
    }))
  }

  return { sightings, militaryBases, ufoPosts }
}

// Mock component for replacing the Map in Storybook
// This allows us to show the component without Mapbox token
const MockMap = ({ children, ...props }) => {
  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute inset-0 opacity-20">
          {/* Fake stars background */}
          {Array.from({ length: 200 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 'px',
                height: Math.random() * 2 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-white text-opacity-30">
          <div className="text-3xl font-monumentMono">
            3D Globe Visualization
          </div>
        </div>
      </div>
      
      {/* Render the UI controls from the original component */}
      {props.children?.filter(child => 
        typeof child === 'object' && 
        child?.type === 'div' &&
        !child?.props?.children?.find?.(c => c?.type?.name === 'Map')
      )}
    </div>
  )
}

// Override the Map component for Storybook
const withMockMap = (Story) => {
  // Override the Map component in Storybook
  const OriginalMap = require('react-map-gl').default
  require('react-map-gl').default = MockMap
  
  return (
    <div className="h-screen w-screen bg-black">
      <Story />
    </div>
  )
}

const meta = {
  title: 'Features/Data Viz/Sightings Globe',
  component: SightingsGlobe,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    // Disable the actual rendering of deck.gl in storybook
    deck: {
      disableLayerCanvas: true,
    },
    // Add a note about Mapbox token requirement
    docs: {
      description: {
        component: 'This component requires a Mapbox token to run properly outside of Storybook.'
      },
    },
  },
  decorators: [
    withMockMap,
    (Story) => (
      <Suspense fallback={<div className="w-full h-screen flex items-center justify-center text-white">Loading...</div>}>
        <Story />
      </Suspense>
    ),
  ],
  argTypes: {
    geoJSONSightings: { 
      control: false,
      description: 'GeoJSON data for sightings, military bases and UFO posts'
    },
  },
} satisfies Meta<typeof SightingsGlobe>

export default meta
type Story = StoryObj<typeof meta>

// Create the mock data
const mockData = createMockGeoJSON()

// Default story with full dataset
export const Default: Story = {
  args: {
    geoJSONSightings: mockData
  },
}

// Story with only sightings data
export const SightingsOnly: Story = {
  args: {
    geoJSONSightings: {
      sightings: mockData.sightings,
      militaryBases: null,
      ufoPosts: null
    }
  },
}

// Story with sightings in a specific region (North America)
export const NorthAmericaRegion: Story = {
  args: {
    geoJSONSightings: {
      sightings: {
        ...mockData.sightings,
        features: mockData.sightings.features.filter(f => {
          const [lng, lat] = f.geometry.coordinates
          return lng > -170 && lng < -50 && lat > 15 && lat < 75
        })
      },
      militaryBases: {
        ...mockData.militaryBases,
        features: mockData.militaryBases.features.filter(f => {
          const [lng, lat] = f.geometry.coordinates
          return lng > -170 && lng < -50 && lat > 15 && lat < 75
        })
      },
      ufoPosts: null
    }
  },
}

// Story with dense sightings cluster
export const DenseCluster: Story = {
  args: {
    geoJSONSightings: {
      sightings: {
        ...mockData.sightings,
        features: [
          ...mockData.sightings.features,
          // Add 100 sightings in a small area
          ...Array.from({ length: 100 }, (_, i) => ({
            type: 'Feature',
            properties: {
              id: `cluster-${i}`,
              date: new Date(2022, i % 12, (i % 28) + 1).toISOString(),
              timestamp: new Date(2022, i % 12, (i % 28) + 1).getTime(),
              city: 'Cluster City',
              state: 'Cluster State',
              description: `Cluster sighting ${i}`,
              comments: `Part of a major wave of sightings in this area`
            },
            geometry: {
              type: 'Point',
              coordinates: [
                -119 + (Math.random() * 8) - 4, // Centered around Area 51-ish
                37 + (Math.random() * 6) - 3
              ]
            }
          }))
        ]
      },
      militaryBases: mockData.militaryBases,
      ufoPosts: mockData.ufoPosts
    }
  },
}

// Story with historical timeline emphasis
export const HistoricalTimeline: Story = {
  args: {
    geoJSONSightings: {
      sightings: {
        ...mockData.sightings,
        features: [
          // Famous historical cases
          {
            type: 'Feature',
            properties: {
              id: 'roswell',
              date: '1947-07-07T00:00:00.000Z',
              timestamp: new Date(1947, 6, 7).getTime(),
              city: 'Roswell',
              state: 'New Mexico',
              country: 'USA',
              description: 'The Roswell incident',
              comments: 'Allegedly a crashed flying saucer recovered by the military',
              shape: 'Disc',
              duration: 'N/A',
              sourceUrl: 'https://example.com/roswell'
            },
            geometry: {
              type: 'Point',
              coordinates: [-104.5230, 33.3943]
            }
          },
          {
            type: 'Feature',
            properties: {
              id: 'rendlesham',
              date: '1980-12-26T00:00:00.000Z',
              timestamp: new Date(1980, 11, 26).getTime(),
              city: 'Rendlesham Forest',
              state: 'Suffolk',
              country: 'UK',
              description: 'The Rendlesham Forest incident',
              comments: 'Series of reported sightings of unexplained lights near RAF Woodbridge',
              shape: 'Triangular',
              duration: 'Multiple nights',
              sourceUrl: 'https://example.com/rendlesham'
            },
            geometry: {
              type: 'Point',
              coordinates: [1.4346, 52.0931]
            }
          },
          {
            type: 'Feature',
            properties: {
              id: 'phoenix-lights',
              date: '1997-03-13T00:00:00.000Z',
              timestamp: new Date(1997, 2, 13).getTime(),
              city: 'Phoenix',
              state: 'Arizona',
              country: 'USA',
              description: 'The Phoenix Lights',
              comments: 'Mass sighting of lights in a V-shaped formation',
              shape: 'V-formation',
              duration: 'Several hours',
              sourceUrl: 'https://example.com/phoenix'
            },
            geometry: {
              type: 'Point',
              coordinates: [-112.0740, 33.4484]
            }
          },
          {
            type: 'Feature',
            properties: {
              id: 'nimitz',
              date: '2004-11-14T00:00:00.000Z',
              timestamp: new Date(2004, 10, 14).getTime(),
              city: 'Pacific Ocean',
              state: 'Off San Diego',
              country: 'USA',
              description: 'USS Nimitz encounter',
              comments: 'Navy pilots encountered a tic-tac shaped object performing impossible maneuvers',
              shape: 'Tic-tac',
              duration: 'Multiple encounters',
              sourceUrl: 'https://example.com/nimitz'
            },
            geometry: {
              type: 'Point',
              coordinates: [-117.5, 32.0]
            }
          },
          {
            type: 'Feature',
            properties: {
              id: 'gimbal',
              date: '2015-01-21T00:00:00.000Z',
              timestamp: new Date(2015, 0, 21).getTime(),
              city: 'Atlantic Ocean',
              state: 'East Coast',
              country: 'USA',
              description: 'Gimbal UAP',
              comments: 'Navy pilots recorded a rotating object with unusual movements',
              shape: 'Rotating disc',
              duration: 'Unknown',
              sourceUrl: 'https://example.com/gimbal'
            },
            geometry: {
              type: 'Point',
              coordinates: [-75.0, 30.0]
            }
          }
        ]
      },
      militaryBases: mockData.militaryBases,
      ufoPosts: mockData.ufoPosts
    }
  },
}

// Empty data view
export const NoData: Story = {
  args: {
    geoJSONSightings: {
      sightings: {
        type: 'FeatureCollection',
        features: []
      },
      militaryBases: {
        type: 'FeatureCollection',
        features: []
      },
      ufoPosts: {
        type: 'FeatureCollection',
        features: []
      }
    }
  },
}