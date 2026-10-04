
Docs: <https://lite.xata.io/docs/sdk/ask>

## Overview

Xata’s ask endpoint lets you build ChatGPT-style Q&A over your table data.

How it works:

1. Searches your table (keyword or vector) for the most relevant records.
2. Builds a custom prompt from the top 3 results and your rules/context.
3. Calls OpenAI to generate an answer and returns the response plus record IDs.

Key details:

- Default search type: keyword. Vector search supported via vectorSearch.
- For keyword search, in the top 3 results, string/text columns with more than 150 characters are added to the prompt.
- For vector search, the specified contentColumn from the top 3 results is added.
- OpenAI token limits are handled automatically by trimming the least recent messages (FIFO) while preserving rules and context.
- Each conversation uses a session with cached context and rules; caches expire after 7 days.

## Usage

Basic table-level call (replace Tutorial with your table):

```ts
const result = await xata.db.Tutorial.ask('<question>', {
  rules: [
    // ...array of strings that instruct the model...
  ],
  searchType: 'keyword' | 'vector',
  search: {
    fuzziness: 0 | 1 | 2,
    prefix: 'phrase' | 'disabled',
    target: [
      // columns and optional weights
      // e.g., 'slug', { column: 'title', weight: 4 }
    ],
    filter: {
      // search filter options
    },
    boosters: [
      // relevancy boosters
    ]
  },
  vectorSearch: {
    column: '<embedding column>',
    contentColumn: '<content column>',
    filter: {
      // search filter options
    }
  }
});
```

Response shape:

```json
{
  "answer": "<answer>",
  "sessionId": "cg52bk1eqh5rd5hndhq95jercs",
  "records": [
    "b70d541d114ff54ad15915636450663f",
    "8ae4837002e21f013aa85c30a126ea1c",
    "4b137344a3c53d5152c45ed514188cd2"
  ]
}
```

You can use the record IDs to look up source documents in your table.

## Options

Keyword search options (subset of the Search API):

| Option   | Description |
|---|---|
| target | Select columns to search and optionally set weights. |
| prefix | Configure prefix matching behavior ('phrase' or 'disabled'). |
| fuzziness | Fuzzy matching level (0, 1, or 2). |
| filter | Filter records before/after scoring. |
| boosters | Tune relevancy via boosters. |

Vector search options (subset of the Vector Search API):

| Option | Description |
|---|---|
| column | Column containing embeddings. |
| contentColumn | Column whose text is sent as context. |
| filter | Filter records before/after scoring. |

## Streaming the response (SSE)

Add the header Accept: text/event-stream. The response streams JSON chunks prefixed with data:. The final event includes done, sessionId, and records.

Example stream snippet:

```
data: {"text":""}
data: {"text":"To"}
data: {"text":" perform"}
...
data: {"done":true,"sessionId":"cg52bk1eqh5rd5hndhq95jercs","records":["0415d654cc8dd113e9b9423f425697ae","91301cdc08524e6f6eef5d0b9d66e345","ae0c68966fc0f00cb913b3c209a7c5a1"]}
```

Next.js SSE example: <https://github.com/xataio/examples/tree/main/apps/sample-chatgpt>

## Conversations and follow‑ups (sessions)

Each conversation has a session that caches your rules and context.

Continue a session:

```ts
const result = await xata.db.Tutorial.ask('<your follow-up message>', {
  sessionId: '<session id>'
});
```

Xata ensures rules, context, and as many messages as allowed fit within the OpenAI limits, trimming older messages first if needed.

## Examples

Simplest usage (defaults to keyword search):

```ts
const result = await xata.db.Tutorial.ask('What is this tutorial about?');
```

Keyword search with rules and relevancy tuning:

```ts
const result = await xata.db.Tutorial.ask('How do I retrieve a single record?', {
  rules: [
    'Do not answer questions about pricing or the free tier. Respond that Xata has several options available, please check https://xata.io/pricing for more information.',
    'When you give an example, this example must exist exactly in the context given.',
    'Only answer questions that are relating to the defined context or are general technical questions. If asked about a question outside of the context, you can respond with "It doesn\'t look like I have enough information to answer that. Check the documentation or contact support."',
    'Your name is DanGPT'
  ],
  searchType: 'keyword',
  search: {
    fuzziness: 2,
    prefix: 'phrase',
    target: ['slug', { column: 'title', weight: 4 }, 'content', 'section', { column: 'keywords', weight: 4 }],
    boosters: [
      {
        valueBooster: {
          column: 'section',
          value: 'guide',
          factor: 18
        }
      }
    ]
  }
});
```

Vector search with embeddings:

```ts
const result = await xata.db.Tutorial.ask('How do a retrieve a single record?', {
  rules: [
    'Do not answer questions about pricing or the free tier. Respond that Xata has several options available, please check https://xata.io/pricing for more information.',
    'If the user asks a how-to question, provide a code snippet in the language they asked for with TypeScript as the default.',
    'Only answer questions that are relating to the defined context or are general technical questions. If asked about a question outside of the context, you can respond with "It doesn\'t look like I have enough information to answer that. Check the documentation or contact support."',
    'Results should be relevant to the context provided and match what is expected for a cloud database.',
    'If the question doesn\'t appear to be answerable from the context provided, but seems to be a question about TypeScript, Javascript, or REST APIs, you may answer from outside of the provided context.',
    'Your name is DanGPT'
  ],
  searchType: 'vector',
  vectorSearch: {
    column: 'embeddings',
    contentColumn: 'content',
    filter: { section: 'guide' }
  }
});
```

Conversation example:

```ts
const first = await xata.db.Tutorial.ask("What's the difference between summarize and aggregate?", {
  rules: [
    'Do not answer questions about pricing or the free tier. Respond that Xata has several options available, please check https://xata.io/pricing for more information.',
    'When you give an example, this example must exist exactly in the context given.',
    'Only answer questions that relate to the defined context or are general technical questions. If asked about a question outside of the context, you can respond with "It doesn\'t look like I have enough information to answer that. Check the documentation or contact support."',
    'Your name is DanGPT'
  ],
  searchType: 'keyword',
  search: {
    fuzziness: 2,
    prefix: 'phrase',
    target: ['slug', { column: 'title', weight: 4 }, 'content', 'section', { column: 'keywords', weight: 4 }],
    boosters: [
      {
        valueBooster: {
          column: 'section',
          value: 'guide',
          factor: 18
        }
      }
    ]
  }
});

// Follow-up
const followUp = await xata.db.Tutorial.ask('Can you show me an example of both?', {
  sessionId: first.sessionId
});
```

Example answer payload:

```json
{
  "answer": "Summarize and aggregate both return similar results, but they differ in terms of the underlying store the data is served from. When using summarize, data is retrieved from PostgreSQL, which ensures consistent results. However, PostgreSQL storage is not optimized for these types of queries. On the other hand, the aggregate endpoint retrieves data from the column-store, which is optimized for larger tables and can handle more cardinality. This makes the aggregate endpoint faster and more suitable for workloads with eventual consistency. Please refer to the documentation for more information on the differences between summarize and aggregate.",
  "sessionId": "cg52bk1eqh5rd5hndhq95jercs",
  "records": ["rec_a", "rec_b", "rec_c"]
}
```

## Troubleshooting

No records found:

```
no records found, it seems that I don't have enough data to answer this question.
```

Fixes:

- Ensure your records contain text columns with more than 150 characters.
- Adjust your search target/filter to include the relevant columns.
- For vector search, verify embeddings and contentColumn are populated.

## FAQ

What data is given to OpenAI?

- Your data is only sent to OpenAI when you call ask.
- Xata selects the most relevant fields from the top matches in the table you query and sends them per request (not synced on a schedule).
- Only data from the table and rows that match your parameters is sent.

Ask Your Table a Question
POST
https://{your-workspace-slug}.{region}.xata.sh/db/db_branch_name/tables/table_name/ask
Ask your table a question. If the Accept header is set to text/event-stream, Xata will stream the results back as SSE's.

Request Body Type Definition

```
type AskTable = {
    /**
     * The question you'd like to ask.
     *
     * @minLength 3
     */
    question: string;
    /**
     * The type of search to use. If set to `keyword` (the default), the search can be configured by passing
     * a `search` object with the following fields. For more details about each, see the Search endpoint documentation.
     * All fields are optional.
     *   * fuzziness  - typo tolerance
     *   * target - columns to search into, and weights.
     *   * prefix - prefix search type.
     *   * filter - pre-filter before searching.
     *   * boosters - control relevancy.
     * If set to `vector`, a `vectorSearch` object must be passed, with the following parameters. For more details, see the Vector
     * Search endpoint documentation. The `column` and `contentColumn` parameters are required.
     *   * column - the vector column containing the embeddings.
     *   * contentColumn - the column that contains the text from which the embeddings where computed.
     *   * filter - pre-filter before searching.
     *
     * @default keyword
     */
    searchType?: "keyword" | "vector";
    search?: {
        fuzziness?: FuzzinessExpression;
        target?: TargetExpression;
        prefix?: PrefixExpression;
        filter?: FilterExpression;
        boosters?: BoosterExpression[];
    };
    vectorSearch?: {
        /**
         * The column to use for vector search. It must be of type `vector`.
         */
        column: string;
        /**
         * The column containing the text for vector search. Must be of type `text`.
         */
        contentColumn: string;
        filter?: FilterExpression;
    };
    rules?: string[];
};
/**
 * Maximum [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) for the search terms. The Levenshtein
 * distance is the number of one character changes needed to make two strings equal. The default is 1, meaning that single
 * character typos per word are tolerated by search. You can set it to 0 to remove the typo tolerance or set it to 2
 * to allow two typos in a word.
 * 
 * @default 1
 * @maximum 2
 * @minimum 0
 */
type FuzzinessExpression = number;
/**
 * The target expression is used to filter the search results by the target columns.
 */
type TargetExpression = (string | {
    /**
     * The name of the column.
     */
    column: string;
    /**
     * The weight of the column.
     *
     * @default 1
     * @maximum 10
     * @minimum 1
     */
    weight?: number;
})[];
/**
 * If the prefix type is set to "disabled" (the default), the search only matches full words. If the prefix type is set to "phrase", the search will return results that match prefixes of the search phrase.
 */
type PrefixExpression = "phrase" | "disabled";
/**
 * @minProperties 1
 */
type FilterExpression = {
    $exists?: string;
    $existsNot?: string;
    $any?: FilterList;
    $all?: FilterList;
    $none?: FilterList;
    $not?: FilterList;
} & {
    [key: string]: FilterColumn;
};
/**
 * Booster Expression
 */
type BoosterExpression = {
    valueBooster?: ValueBooster;
} | {
    numericBooster?: NumericBooster;
} | {
    dateBooster?: DateBooster;
};
type FilterList = FilterExpression | FilterExpression[];
type FilterColumn = FilterColumnIncludes | FilterPredicate | FilterList;
/**
 * Boost records with a particular value for a column.
 */
type ValueBooster = {
    /**
     * The column in which to look for the value.
     */
    column: string;
    /**
     * The exact value to boost.
     */
    value: string | number | boolean;
    /**
     * The factor with which to multiply the added boost.
     */
    factor: number;
    /**
     * Only apply this booster to the records for which the provided filter matches.
     */
    ifMatchesFilter?: FilterExpression;
};
/**
 * Boost records based on the value of a numeric column.
 */
type NumericBooster = {
    /**
     * The column in which to look for the value.
     */
    column: string;
    /**
     * The factor with which to multiply the value of the column before adding it to the item score.
     */
    factor: number;
    /**
     * Modifier to be applied to the column value, before being multiplied with the factor. The possible values are:
     *   - none (default).
     *   - log: common logarithm (base 10)
     *   - log1p: add 1 then take the common logarithm. This ensures that the value is positive if the
     *     value is between 0 and 1.
     *   - ln: natural logarithm (base e)
     *   - ln1p: add 1 then take the natural logarithm. This ensures that the value is positive if the
     *     value is between 0 and 1.
     *   - square: raise the value to the power of two.
     *   - sqrt: take the square root of the value.
     *   - reciprocal: reciprocate the value (if the value is `x`, the reciprocal is `1/x`).
     */
    modifier?: "none" | "log" | "log1p" | "ln" | "ln1p" | "square" | "sqrt" | "reciprocal";
    /**
     * Only apply this booster to the records for which the provided filter matches.
     */
    ifMatchesFilter?: FilterExpression;
};
/**
 * Boost records based on the value of a datetime column. It is configured via "origin", "scale", and "decay". The further away from the "origin",
 * the more the score is decayed. The decay function uses an exponential function. For example if origin is "now", and scale is 10 days and decay is 0.5, it
 * should be interpreted as: a record with a date 10 days before/after origin will be boosted 2 times less than a record with the date at origin.
 * The result of the exponential function is a boost between 0 and 1. The "factor" allows you to control how impactful this boost is, by multiplying it with a given value.
 */
type DateBooster = {
    /**
     * The column in which to look for the value.
     */
    column: string;
    /**
     * The datetime (formatted as RFC3339) from where to apply the score decay function. The maximum boost will be applied for records with values at this time.
     * If it is not specified, the current date and time is used.
     */
    origin?: string;
    /**
     * The duration at which distance from origin the score is decayed with factor, using an exponential function. It is formatted as number + units, for example: `5d`, `20m`, `10s`.
     *
     * @pattern ^(\d+)(d|h|m|s|ms)$
     */
    scale: string;
    /**
     * The decay factor to expect at "scale" distance from the "origin".
     */
    decay: number;
    /**
     * The factor with which to multiply the added boost.
     *
     * @minimum 0
     */
    factor?: number;
    /**
     * Only apply this booster to the records for which the provided filter matches.
     */
    ifMatchesFilter?: FilterExpression;
};
/**
 * @maxProperties 1
 * @minProperties 1
 */
type FilterColumnIncludes = {
    $includes?: FilterPredicate;
    $includesAny?: FilterPredicate;
    $includesAll?: FilterPredicate;
    $includesNone?: FilterPredicate;
};
type FilterPredicate = FilterValue | FilterPredicate[] | FilterPredicateOp | FilterPredicateRangeOp;
type FilterValue = number | string | boolean;
/**
 * @maxProperties 1
 * @minProperties 1
 */
type FilterPredicateOp = {
    $any?: FilterPredicate[];
    $all?: FilterPredicate[];
    $none?: FilterPredicate | FilterPredicate[];
    $not?: FilterPredicate | FilterPredicate[];
    $is?: FilterValue | FilterValue[];
    $isNot?: FilterValue | FilterValue[];
    $lt?: FilterRangeValue;
    $le?: FilterRangeValue;
    $gt?: FilterRangeValue;
    $ge?: FilterRangeValue;
    $contains?: string;
    $iContains?: string;
    $startsWith?: string;
    $endsWith?: string;
    $pattern?: string;
    $iPattern?: string;
};
/**
 * @maxProperties 2
 * @minProperties 2
 */
type FilterPredicateRangeOp = {
    $lt?: FilterRangeValue;
    $le?: FilterRangeValue;
    $gt?: FilterRangeValue;
    $ge?: FilterRangeValue;
};
type FilterRangeValue = number | string;
```
