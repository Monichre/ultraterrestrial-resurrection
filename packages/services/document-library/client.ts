import { Search } from "@upstash/search"

const client = new Search( {
  url: "https://devoted-crow-28500-gcp-usc1-search.upstash.io",
  token: "ABsFMGRldm90ZWQtY3Jvdy0yODUwMC1nY3AtdXNjMWFkbWluWkdJM09UWmhOREF0T1RobE5TMDBabVV3TFdFd05tTXRaRFJqT0RVeU16UmhZbVEw",
} )

const index = client.index( "movies" )

await index.upsert( [
  {
    id: "star-wars",
    content: {
      title: "Star Wars: Episode IV, A New Hope",
      genre: "sci-fi"
    },
    metadata: {
      summary: "A long time ago in a distant galaxy, a rebellion rises against an oppressive empire.",
    }
  },
] )

const searchResults = await index.search( {
  query: "space opera",
  limit: 2,
  filter: "genre = 'sci-fi'",
  reranking: true,
} )