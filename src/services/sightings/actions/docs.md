# Aggregations

Starting with January 10, 2025, this functionality will no longer be part of the Free plan. It will continue to be available as documented to users on the Pro and Enterprises plans. For more details see this blog post.

The /aggregate API allows you to use the search/analytics engine to perform aggregations on your data. Similar to the search API aggregations run in the optional Search store, which means: it is eventually consistent with the main transactional store, and it cannot access the linked fields from a table. The Search store is enabled by default and can be disabled in the Database Settings from the Web UI. The aggregate API and features described in this page require the Search store to be enabled. If these limitations are not acceptable for your use case, you should use the Summarize API. The advantages of using the Aggregation API, over the Summarize API, are:

it generally offers better performance, because the underlying store is column oriented.
it offers composable aggregations that can be combined into complex aggregations / visualizations.
Operations which are available both in the Aggregation and the Summarize API, such as sum, may present small deviations due to differences in the order of reading data from storage and subsequent rounding, as well as in case of in-flight data until consistency is achieved across the different stores.

An example of a relatively complex visualization that can be created with the Aggregation API could be: a multi-line chart, where each line represents a movie genre, and the Y axis represents the average rating of the movies in that genre, per year. This chart can be obtained with a single aggregation request, looking something like this:

```
const results = await xata.db.titles.aggregate({
  movieGenres: {
    topValues: {
      column: 'genre',
      size: 50,
      aggs: {
        byReleaseDate: {
          dateHistogram: {
            column: 'releaseDate',
            calendarInterval: 'year',
            aggs: {
              avgRating: {
                average: {
                  column: 'rating'
                }
              }
            }
          }
        }
      }
    }
  }
});
```

```
const results = await xata.db.titles.aggregate({
  movieGenres: {
    topValues: {
      column: 'genre',
      size: 50,
      aggs: {
        byReleaseDate: {
          dateHistogram: {
            column: 'releaseDate',
            calendarInterval: 'year',
            aggs: {
              avgRating: {
                average: {
                  column: 'rating'
                }
              }
            }
          }
        }
      }
    }
  }
},
{
  "director":"Peter Jackson"
})
```

# Data Analysis Prompts for Geospatial UFO Sighting Data

Based on the data provided, I'll create several analysis prompts that would help an AI geospatial assistant extract meaningful insights from this UFO sighting dataset.

## Spatial Analysis Prompts

1. "Generate a heatmap visualization showing the concentration of UFO sightings across the United States. Identify any notable geographic clusters or hotspots."
2. "Analyze the distribution of UFO sightings in coastal versus inland cities. Is there a statistically significant difference in sighting frequency?"
3. "Compare UFO sighting rates in the top 10 cities with highest counts, adjusting for population density. Which locations have the highest per capita sighting rates?"
4. "Examine the spatial correlation between major airport locations and high-frequency UFO sighting cities. Are sightings more common near air traffic hubs?"
5. "Map the geographic distribution of triangle-shaped UFO sightings versus disk-shaped sightings. Do certain shapes appear more frequently in specific regions?"

## Pattern Analysis Prompts

1. "Analyze whether there's a correlation between UFO shape and geographic location. For example, are 'fireball' sightings more common in desert regions like Arizona and Nevada?"
2. "Identify any regional preferences in UFO shape reporting. Do witnesses in the Pacific Northwest report different shapes than those in the Southeast?"
3. "Determine if there's a correlation between city elevation and specific UFO shapes reported, particularly for 'light' and 'fireball' sightings."
4. "Examine whether cities with high tourism rates (like Las Vegas, Orlando) report different UFO shapes compared to less tourism-focused cities."
5. "Compare sighting frequencies between major metropolitan areas versus smaller cities. Is there a population threshold that correlates with increased sighting reports?"

## Temporal-Spatial Analysis Prompts

1. "Create a time-series analysis of UFO sightings in Las Vegas, Phoenix, and Orlando over the past decade. Identify any seasonal patterns or yearly trends."
2. "Analyze night-time light pollution data against UFO sighting frequencies for the top 30 cities. Do areas with more light pollution report more or fewer sightings?"
3. "Examine the correlation between local weather patterns and UFO sighting reports in the top reporting cities. Are sightings more common during certain weather conditions?"
4. "Map the progression of UFO sighting waves across geographic regions. Do sightings tend to cluster temporally and spatially?"
5. "Analyze whether military base proximity correlates with specific UFO shape reports, particularly 'triangle' and 'chevron' shaped objects."

## Visualization Prompts

1. "Create an interactive map visualization that shows the distribution of different UFO shapes across the United States, with the ability to filter by shape category."
2. "Develop a 3D terrain visualization showing UFO sighting densities overlaid on topographical features to identify any correlation with landscape features."
3. "Generate a comparative dashboard showing the top 5 reported UFO shapes in the 10 cities with highest sighting frequencies."
4. "Create a network analysis visualization showing relationships between neighboring cities with similar UFO shape reporting patterns."
5. "Develop a multi-layer map that overlays UFO sighting data with astronomical events, air traffic patterns, and military training exercise schedules to identify potential correlations."

These prompts should provide a solid foundation for extracting valuable insights from your UFO sighting dataset using a geospatial AI assistant. They cover spatial patterns, temporal trends, and comparative analyses that would be most relevant for understanding the geographic distribution of these phenomena.
