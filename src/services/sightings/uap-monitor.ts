import { load } from 'cheerio'
import { XMLParser } from 'fast-xml-parser'
import { TwitterApi } from 'twitter-api-v2'

interface RSSEntry {
  title: string
  link: string
  pubDate: string
  description: string
  source: string
  category?: string[]
}

interface UAPSighting {
  id: string
  source: 'twitter' | 'news' | 'rss'
  title?: string
  content: string
  location: {
    city?: string
    state: 'NJ'
    coordinates?: {
      lat: number
      lng: number
    }
  }
  timestamp: Date
  mediaUrls: string[]
  sourceUrl: string
  category?: string[]
  confidence: 'high' | 'medium' | 'low'
  type?: 'sighting' | 'incident' | 'news' | 'analysis'
}

const NEWS_SOURCES = [
  'nj.com',
  'northjersey.com',
  'app.com',
  'pressofatlanticcity.com',
]

const RSS_FEED_URL = 'https://www.google.com/alerts/feeds/16053521018490207112/10287189927525032770'

export class UAPMonitorService {
  private twitter: TwitterApi
  private xmlParser: XMLParser

  constructor() {
    this.twitter = new TwitterApi( process.env.TWITTER_BEARER_TOKEN! )
    this.xmlParser = new XMLParser( {
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    } )
  }

  async getAllSightings(): Promise<UAPSighting[]> {
    const [twitterSightings, newsSightings, rssSightings] = await Promise.all( [
      this.getTwitterSightings(),
      this.getNewsSightings(),
      this.getRSSSightings()
    ] )

    return this.categorizeAndEnrichSightings( [
      ...twitterSightings,
      ...newsSightings,
      ...rssSightings
    ] )
  }

  private async getTwitterSightings(): Promise<UAPSighting[]> {
    const query = '(UFO OR UAP) (NJ OR "New Jersey") -is:retweet'
    const tweets = await this.twitter.v2.search( {
      query,
      'tweet.fields': ['created_at', 'geo', 'entities'],
      'media.fields': ['url'],
      expansions: ['attachments.media_keys'],
    } )

    return tweets.data.map( tweet => ( {
      id: `twitter-${tweet.id}`,
      source: 'twitter' as const,
      content: tweet.text,
      location: {
        state: 'NJ',
        // Extract city from tweet if possible
        city: this.extractNJCity( tweet.text ),
      },
      timestamp: new Date( tweet.created_at! ),
      mediaUrls: tweet.attachments?.media_keys || [],
      sourceUrl: `https://twitter.com/i/web/status/${tweet.id}`,
    } ) )
  }

  private async getNewsSightings(): Promise<UAPSighting[]> {
    const sightings: UAPSighting[] = []

    for ( const source of NEWS_SOURCES ) {
      const response = await fetch( `https://${source}` )
      const html = await response.text()
      const $ = load( html )

      // Search for articles containing UAP/UFO keywords
      $( 'article' ).each( ( _, article ) => {
        const content = $( article ).text().toLowerCase()
        if ( content.includes( 'ufo' ) || content.includes( 'uap' ) ) {
          const title = $( article ).find( 'h1, h2' ).first().text()
          const url = $( article ).find( 'a' ).first().attr( 'href' )
          const images = $( article ).find( 'img' ).map( ( _, img ) => $( img ).attr( 'src' ) ).get()

          sightings.push( {
            id: `news-${Buffer.from( url || '' ).toString( 'base64' )}`,
            source: 'news',
            title,
            content: content.substring( 0, 500 ),
            location: {
              state: 'NJ',
              city: this.extractNJCity( content ),
            },
            timestamp: new Date(),
            mediaUrls: images,
            sourceUrl: url || '',
          } )
        }
      } )
    }

    return sightings
  }

  private async getRSSSightings(): Promise<UAPSighting[]> {
    try {
      const response = await fetch( RSS_FEED_URL )
      const xmlData = await response.text()
      const result = this.xmlParser.parse( xmlData )

      const entries = result.feed.entry || []

      return entries.map( ( entry: any ) => {
        const content = this.stripHtmlTags( entry.content || entry.summary || '' )

        return {
          id: `rss-${entry.id || Buffer.from( entry.link ).toString( 'base64' )}`,
          source: 'rss',
          title: entry.title,
          content: content.substring( 0, 500 ),
          location: {
            state: 'NJ',
            city: this.extractNJCity( content )
          },
          timestamp: new Date( entry.published || entry.updated ),
          mediaUrls: this.extractMediaUrls( content ),
          sourceUrl: entry.link,
          category: this.categorizeContent( content ),
          confidence: this.determineConfidence( content ),
          type: this.determineType( content )
        }
      } )
    } catch ( error ) {
      console.error( 'Error fetching RSS feed:', error )
      return []
    }
  }

  private categorizeAndEnrichSightings( sightings: UAPSighting[] ): UAPSighting[] {
    return sightings.map( sighting => ( {
      ...sighting,
      category: sighting.category || this.categorizeContent( sighting.content ),
      confidence: sighting.confidence || this.determineConfidence( sighting.content ),
      type: sighting.type || this.determineType( sighting.content )
    } ) )
  }

  private categorizeContent( content: string ): string[] {
    const categories = []
    const keywords = {
      lights: ['lights', 'glowing', 'illuminated', 'bright'],
      shape: ['triangle', 'disc', 'cylinder', 'sphere'],
      movement: ['hovering', 'zigzag', 'acceleration', 'stationary'],
      military: ['base', 'restricted', 'airspace', 'military'],
      multiple: ['fleet', 'formation', 'multiple', 'group']
    }

    for ( const [category, terms] of Object.entries( keywords ) ) {
      if ( terms.some( term => content.toLowerCase().includes( term ) ) ) {
        categories.push( category )
      }
    }

    return categories
  }

  private determineConfidence( content: string ): 'high' | 'medium' | 'low' {
    const confidenceFactors = {
      high: ['video evidence', 'multiple witnesses', 'radar confirmation', 'official report'],
      medium: ['photograph', 'reliable witness', 'detailed description'],
      low: ['unconfirmed', 'single witness', 'brief sighting']
    }

    for ( const [level, factors] of Object.entries( confidenceFactors ) ) {
      if ( factors.some( factor => content.toLowerCase().includes( factor ) ) ) {
        return level as 'high' | 'medium' | 'low'
      }
    }

    return 'low'
  }

  private determineType( content: string ): 'sighting' | 'incident' | 'news' | 'analysis' {
    if ( content.toLowerCase().includes( 'analysis' ) || content.toLowerCase().includes( 'study' ) ) {
      return 'analysis'
    }
    if ( content.toLowerCase().includes( 'incident' ) || content.toLowerCase().includes( 'encounter' ) ) {
      return 'incident'
    }
    if ( content.toLowerCase().includes( 'report' ) || content.toLowerCase().includes( 'article' ) ) {
      return 'news'
    }
    return 'sighting'
  }

  private stripHtmlTags( html: string ): string {
    return html.replace( /<[^>]*>/g, '' )
  }

  private extractMediaUrls( content: string ): string[] {
    const imgRegex = /<img[^>]+src="([^">]+)"/g
    const urls: string[] = []
    let match

    while ( ( match = imgRegex.exec( content ) ) !== null ) {
      urls.push( match[1] )
    }

    return urls
  }

  private extractNJCity( text: string ): string | undefined {
    // This is a simplified version - you'd want a more comprehensive list
    const njCities = ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Trenton']
    const found = njCities.find( city => text.toLowerCase().includes( city.toLowerCase() ) )
    return found
  }
} 