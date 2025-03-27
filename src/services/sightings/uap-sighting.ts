
import fs from 'fs'
import path from 'path'
import { z } from 'zod'

export const UAPSightingSchema = z.object( {
  id: z.string(),
  source: z.enum( ['twitter', 'news', 'rss'] ),
  title: z.string().optional(),
  content: z.string(),
  location: z.object( {
    city: z.string().optional(),
    state: z.literal( 'NJ' ),
    coordinates: z.object( {
      lat: z.number(),
      lng: z.number()
    } ).optional()
  } ),
  timestamp: z.date(),
  mediaUrls: z.array( z.string() ),
  sourceUrl: z.string(),
  category: z.array( z.string() ).optional(),
  confidence: z.enum( ['high', 'medium', 'low'] ),
  type: z.enum( ['sighting', 'incident', 'news', 'analysis'] )
} )

export type ValidatedUAPSighting = z.infer<typeof UAPSightingSchema>

export const getSightingsGeoJSON = async () => {

  let sightingsFileContents, ufoPostsFileContents, militaryBasesFileContents;
  
  try {
    // Try to load the real data files if they exist
    const sightingsFilePath = path.join(
      process.cwd(),
      'public',
      'sightings.geojson'
    );
    sightingsFileContents = await fs.promises.readFile(
      sightingsFilePath,
      'utf8'
    );
    
    const ufoPostsFilePath = path.join(
      process.cwd(),
      'public',
      'ufo-posts.geojson'
    );
    ufoPostsFileContents = await fs.promises.readFile(
      ufoPostsFilePath,
      'utf8'
    );
    
    const militaryBasesFilePath = path.join(
      process.cwd(),
      'public',
      'military-bases.geojson'
    );
    militaryBasesFileContents = await fs.promises.readFile(
      militaryBasesFilePath,
      'utf8'
    );
  } catch (error) {
    // If real data files don't exist, use mock data
    console.log("Using mock data files since real data files weren't found");
    
    const mockSightingsFilePath = path.join(
      process.cwd(),
      'public',
      'mock-sightings.geojson'
    );
    sightingsFileContents = await fs.promises.readFile(
      mockSightingsFilePath,
      'utf8'
    );
    
    const mockUfoPostsFilePath = path.join(
      process.cwd(),
      'public',
      'mock-ufo-posts.geojson'
    );
    ufoPostsFileContents = await fs.promises.readFile(
      mockUfoPostsFilePath,
      'utf8'
    );
    
    const mockMilitaryBasesFilePath = path.join(
      process.cwd(),
      'public',
      'mock-military-bases.geojson'
    );
    militaryBasesFileContents = await fs.promises.readFile(
      mockMilitaryBasesFilePath,
      'utf8'
    );
  }

  // Parse the JSON content
  const sightings = JSON.parse( sightingsFileContents )
  const militaryBases = JSON.parse( militaryBasesFileContents )
  const ufoPosts = JSON.parse( ufoPostsFileContents )
  console.log( "🚀 ~ file: uap-sighting.ts:65 ~ getSightingsGeoJSON ~ ufoPosts:", ufoPosts )
  console.log( "🚀 ~ file: uap-sighting.ts:65 ~ getSightingsGeoJSON ~ militaryBases:", militaryBases )
  console.log( "🚀 ~ file: uap-sighting.ts:65 ~ getSightingsGeoJSON ~ sightings:", sightings )
  // Return the parsed GeoJSON content
  return {
    sightings,
    militaryBases,

    ufoPosts
  }
}