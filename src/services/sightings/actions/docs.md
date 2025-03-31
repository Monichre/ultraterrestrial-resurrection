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
