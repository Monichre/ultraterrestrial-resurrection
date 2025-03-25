import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge"
import { inngest } from "./inngest-server.client"

import { FunctionInvoker } from "./functions"

const config = new Configuration( { apiKey: process.env.OPENAI_API_KEY } )
const openai = new OpenAIApi( config )

export const aibot = inngest.createFunction(
  {
    id: "openai-linear-bot",
    name: "OpenAI Linear Bot",
    cancelOn: [
      // Cancel this function if we receive a cancellation event with the same request ID can .
      // This prevents wasted execution and increased costs.
      {
        event: "api/collab.cancelled",
        if: "event.data.requestId == async.data.requestId",
      },
    ],
  },
  { event: "api/collab.started" },
  async ( { event, step } ) => {
    const invoker = new FunctionInvoker( {
      openai,
      functions,
      requestId: event.data.requestId,
    } )

    const messages = await invoker.start( event.data.messages as any[], step )
    return messages
  }
)


// All available functions for Linear.
const functions: any = {
  search_issues: {
    docs: {
      name: "search_issues",
      description: "Search all issues for the given text",
      parameters: {
        type: "object",
        properties: {
          search: {
            type: "string",
            description: "The search term",
          },
        },
        required: ["search"],
      },
    },
    invoke: async ( f: any, _m: ChatCompletionRequestMessage[] ) => {
      if ( typeof f.arguments.search !== "string" ) {
        throw new Error( "No search term provided" )
      }
      return linear.issues( {
        last: 5,
        filter: { searchableContent: { contains: f.arguments.search } },
      } )
    },
  },
  delete_issue: {
    docs: {
      name: "delete_issue",
      description: "Delete an issue by ID",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "ID of the issue to delete",
          },
        },
        required: ["id"],
      },
    },
    confirm: true,
    invoke: async ( f: any, _m: ChatCompletionRequestMessage[] ) => {
      console.log( "🤡 Not actually deleting issues!", f.arguments.id )
      return true
    },
  },
};

