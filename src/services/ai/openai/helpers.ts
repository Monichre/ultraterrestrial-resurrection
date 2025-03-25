export function parseApiResponse( { text }: any ): object | null {
  // Extract the message value
  const messageValue = text.value

  // Locate the JSON-like string start and end positions
  const jsonStartIndex = messageValue.indexOf( '```json\n' ) + 8
  const jsonEndIndex = messageValue.indexOf( '```', jsonStartIndex )

  // Extract the JSON-like string
  const jsonString = messageValue.substring( jsonStartIndex, jsonEndIndex )

  // Parse the JSON string into an object
  try {
    const parsedObject = JSON.parse( jsonString )
    console.log( 'parsedObject: ', parsedObject )
    return parsedObject
  } catch ( error ) {
    console.error( 'Error parsing JSON string:', error )
    return null
  }
}
// Rest of the code...

export const formatRelatedItems = (
  items: {
    type: string
    name: string
    role?: string
    bio?: string
    description?: string
    date?: string
  }[]
) => {
  return items
    .map( ( item ) => `${item.name} - ${item.role || item?.date}` )
    .join( ', ' )
}
export const filterConnectionsByRelevance = ( connections: any ) => {
  const relevant: any = {}
  const irrelevant: any = {}
  for ( const key in connections ) {
    if ( connections[key]['Relevance Score'] > 5 ) {
      relevant[key] = connections[key]
    } else {
      irrelevant[key] = connections[key]
    }
  }
  return {
    relevant,
    irrelevant,
  }
}
export const askHow = ( items: string | any[] ) =>
  items?.length && items?.length < 2 ? `How is` : 'How are'

export const formatSubject = ( items: any[] ) => {
  const values = items.map( ( item: any ) => {
    const nonNullValues = Object.entries( item )
      .filter( ( [key, value] ) => value !== undefined && value !== null )
      .map( ( [key, value] ) => `${key}: ${value}` )
    return nonNullValues.join( ' - ' )
  } )
  return values.join( ', ' )
}

export const searchDatabaseFunction: any = {
  type: 'function',
  function: {
    name: 'search_database',
    description:
      'Search a specified table in the Xata (Postgres) database using provided search terms.',
    parameters: {
      type: 'object',
      properties: {
        table: {
          type: 'string',
          description:
            'The dynamic name of the table to search in the database.',
        },
        search_terms: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'List of search terms to use in the query.',
        },
        search_fields: {
          type: 'array',
          items: {
            type: 'string',
          },
          description:
            'Fields to search within the table. If omitted, all text fields are searched.',
        },
        limit: {
          type: 'integer',
          description: 'Maximum number of records to retrieve.',
          default: 10,
        },
      },
      required: ['table', 'search_terms'],
    },
  },
}
