// Test the correct Xata aggregation format

import { xata } from "./db"; // This is just a placeholder

async function testAggregation() {
  // Format 1: With filter as part of the aggregation definition (OLD STYLE)
  try {
    // This approach will likely fail with "invalid key [filter] in request"
    const oldStyleResult = await xata.db.sightings.aggregate({
      shapeDistribution: {
        topValues: {
          column: "shape",
          size: 20,
        },
        filter: { // This is the problematic placement
          date: {
            $ge: new Date("2020-01-01"),
            $le: new Date("2023-12-31")
          }
        }
      }
    });
    console.log("Old style succeeded:", oldStyleResult);
  } catch (error) {
    console.error("Old style failed:", error);
  }
  
  // Format 2: With filter as a second argument (NEW STYLE)
  try {
    // This is the correct format according to your example
    const newStyleResult = await xata.db.sightings.aggregate(
      {
        shapeDistribution: {
          topValues: {
            column: "shape",
            size: 20,
          }
        }
      },
      { // Second argument is the filter
        date: {
          $ge: new Date("2020-01-01"),
          $le: new Date("2023-12-31")
        }
      }
    );
    console.log("New style succeeded:", newStyleResult);
  } catch (error) {
    console.error("New style failed:", error);
  }
  
  // Format 3: Using filter() method before aggregate (ALTERNATIVE)
  try {
    const filteredQueryResult = await xata.db.sightings
      .filter({
        date: {
          $ge: new Date("2020-01-01"),
          $le: new Date("2023-12-31")
        }
      })
      .aggregate({
        shapeDistribution: {
          topValues: {
            column: "shape",
            size: 20,
          }
        }
      });
    console.log("Filtered query succeeded:", filteredQueryResult);
  } catch (error) {
    console.error("Filtered query failed:", error);
  }
}

// This is just a test file to demonstrate the correct format
console.log("Test file created. According to Xata documentation, the second format with filter as a second argument to aggregate() is correct.");