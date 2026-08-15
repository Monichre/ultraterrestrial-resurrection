// // Import the necessary module
// import { Client } from '@googlemaps/google-maps-services-js'

// // Define the interface for your input objects
// interface PlaceObject {
//   place: string
// }

// // Define the interface for the response object
// interface LocationInfo {
//   place: string
//   latitude: number
//   longitude: number
// }

// // Function to fetch lat and long for an array of place names
// const fetchLocations = async (
//   placesArray: PlaceObject[]
// ): Promise<LocationInfo[]> => {
//   const client = new Client({})

//   const locations: LocationInfo[] = []

//   for (const item of placesArray) {
//     try {
//       const response = await client.geocode({
//         params: {
//           address: item.place,
//           key: process.env.GOOGLE_MAPS_API_KEY,
//         },
//       })

//       const { lat, lng } = response.data.results[0].geometry.location
//       locations.push({
//         place: item.place,
//         latitude: lat,
//         longitude: lng,
//       })
//     } catch (error) {
//       console.error('Error fetching location for:', item.place, error)
//     }
//   }

//   return locations
// }

// export default fetchLocations
