# Integration Options Research for Prometheus AI

This document outlines research on potential integration options for enhancing the Prometheus AI application with vector storage capabilities, OpenAI Assistants, and alternative RAG platforms like SciPhi.ai and R2R.

## OpenAI Vector Store Integration

### Overview
OpenAI's vector store capabilities can be integrated into the Prometheus AI application to enable more powerful semantic search and context-aware responses. This integration would allow the application to process and query large amounts of unstructured data related to UAP/UFO phenomena.

### Implementation Approach

1. **Set Up Vector Embeddings**
   - Use OpenAI's Embeddings API to convert text documents into vector representations
   - Store these embeddings in a suitable vector database (Supabase with pgvector, Pinecone, or FAISS)

2. **Next.js Integration**
   ```javascript
   // Example implementation with Supabase
   import { createClient } from '@supabase/supabase-js';
   import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

   // Initialize Supabase client
   const supabaseClient = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL,
     process.env.SUPABASE_SERVICE_ROLE_KEY
   );

   // Generate embeddings for search
   async function generateEmbeddings(text) {
     const embeddings = new OpenAIEmbeddings({
       openAIApiKey: process.env.OPENAI_API_KEY,
     });
     return await embeddings.embedQuery(text);
   }

   // Perform vector search
   async function performVectorSearch(query, topK = 5) {
     const embedding = await generateEmbeddings(query);
     
     const { data, error } = await supabaseClient.rpc('match_documents', {
       query_embedding: embedding,
       match_threshold: 0.5,
       match_count: topK
     });
     
     if (error) throw error;
     return data;
   }
   ```

3. **API Route for Search**
   ```javascript
   // app/api/search/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { performVectorSearch } from '@/lib/vectorStore';

   export async function POST(request: NextRequest) {
     const { query } = await request.json();
     
     try {
       const results = await performVectorSearch(query);
       return NextResponse.json({ results });
     } catch (error) {
       console.error('Search error:', error);
       return NextResponse.json(
         { error: 'Failed to perform search' },
         { status: 500 }
       );
     }
   }
   ```

4. **Document Processing Pipeline**
   - Create a script to process documents (PDF, text files, etc.)
   - Generate embeddings for document chunks
   - Store documents and embeddings in the vector database

### Benefits
- Enhanced semantic understanding of user queries
- Ability to reference specific documents and provide citations
- Improved accuracy for domain-specific questions about UAP/UFO phenomena
- Reduced hallucinations by grounding responses in actual data

### Required Dependencies
- `@supabase/supabase-js` (if using Supabase)
- `openai` or `langchain` for embeddings generation
- `faiss-node` (if using FAISS locally)

## OpenAI Assistant with Vector Store

### Overview
OpenAI's Assistants API provides a higher-level abstraction for creating AI assistants with built-in capabilities like retrieving information from files. Integrating this with Prometheus AI would allow for a more powerful and context-aware assistant experience.

### Implementation Approach

1. **Create Assistant with Retrieval**
   ```javascript
   // lib/openai-assistant.js
   import OpenAI from 'openai';

   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });

   // Create or load existing assistant
   export async function getOrCreateAssistant() {
     // Check if assistant ID exists in environment variables
     if (process.env.OPENAI_ASSISTANT_ID) {
       return await openai.beta.assistants.retrieve(process.env.OPENAI_ASSISTANT_ID);
     }

     // Create a new assistant
     const assistant = await openai.beta.assistants.create({
       name: "Prometheus AI",
       instructions: "You are Prometheus AI - a research assistant dedicated to illuminating the unknown by gathering, organizing, analyzing, and documenting resources on unexplained aerial phenomena.",
       model: "gpt-4-turbo",
       tools: [{"type": "retrieval"}],
     });

     console.log('Created new assistant:', assistant.id);
     return assistant;
   }
   ```

2. **File Upload and Management**
   ```javascript
   // Upload file to OpenAI and associate with assistant
   export async function uploadFileToAssistant(filePath, fileName, assistantId) {
     const file = await openai.files.create({
       file: fs.createReadStream(filePath),
       purpose: "assistants",
     });

     await openai.beta.assistants.files.create(assistantId, {
       file_id: file.id,
     });

     return file.id;
   }
   ```

3. **Thread and Message Handling**
   ```javascript
   // Create a thread for conversation
   export async function createThread() {
     return await openai.beta.threads.create();
   }

   // Add a message to a thread
   export async function addMessageToThread(threadId, content, fileIds = []) {
     return await openai.beta.threads.messages.create(threadId, {
       role: "user",
       content,
       file_ids: fileIds,
     });
   }

   // Run the assistant on a thread
   export async function runAssistant(threadId, assistantId) {
     return await openai.beta.threads.runs.create(threadId, {
       assistant_id: assistantId,
     });
   }

   // Check run status
   export async function getRunStatus(threadId, runId) {
     return await openai.beta.threads.runs.retrieve(threadId, runId);
   }
   ```

4. **Next.js API Integration**
   ```javascript
   // app/api/assistant/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import {
     getOrCreateAssistant,
     createThread,
     addMessageToThread,
     runAssistant,
     getMessages
   } from '@/lib/openai-assistant';

   export async function POST(request: NextRequest) {
     const { message, threadId } = await request.json();
     
     try {
       const assistant = await getOrCreateAssistant();
       
       // Create a new thread if none exists
       const thread = threadId ? 
         { id: threadId } : 
         await createThread();
       
       // Add message to thread
       await addMessageToThread(thread.id, message);
       
       // Run the assistant
       const run = await runAssistant(thread.id, assistant.id);
       
       // Wait for completion (implement polling logic here)
       // ...
       
       // Get messages
       const messages = await getMessages(thread.id);
       
       return NextResponse.json({
         threadId: thread.id,
         messages: messages.data
       });
     } catch (error) {
       console.error('Assistant error:', error);
       return NextResponse.json(
         { error: 'Failed to process with assistant' },
         { status: 500 }
       );
     }
   }
   ```

5. **UI Component Integration**
   ```jsx
   // components/assistant-chat.tsx
   'use client';
   
   import { useState, useEffect } from 'react';
   
   export function AssistantChat() {
     const [messages, setMessages] = useState([]);
     const [threadId, setThreadId] = useState(null);
     const [input, setInput] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       setIsLoading(true);
       
       try {
         const response = await fetch('/api/assistant', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ message: input, threadId }),
         });
         
         const data = await response.json();
         setThreadId(data.threadId);
         setMessages(data.messages);
         setInput('');
       } catch (error) {
         console.error('Error:', error);
       } finally {
         setIsLoading(false);
       }
     };
     
     // Render chat interface
     return (
       <div>
         {/* Chat messages display */}
         <div className="messages-container">
           {messages.map((msg) => (
             <div key={msg.id} className={`message ${msg.role}`}>
               {msg.content[0].text.value}
             </div>
           ))}
         </div>
         
         {/* Input form */}
         <form onSubmit={handleSubmit}>
           <input
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Ask about UAPs/UFOs..."
             disabled={isLoading}
           />
           <button type="submit" disabled={isLoading || !input.trim()}>
             {isLoading ? 'Thinking...' : 'Send'}
           </button>
         </form>
       </div>
     );
   }
   ```

### Benefits
- Built-in document retrieval system
- Simplified integration with OpenAI's ecosystem
- Thread management for maintaining conversation context
- Ability to use other tools like Code Interpreter

### Required Dependencies
- `openai` npm package (>= 4.0.0)
- Streaming response handling via `ai` package (optional)

## SciPhi.ai Integration

### Overview
SciPhi.ai provides a specialized RAG (Retrieval-Augmented Generation) platform with advanced features like multimodal content ingestion and hybrid search. Integrating SciPhi.ai with Prometheus AI would enhance its capabilities for processing and retrieving information about UAP/UFO phenomena.

### Implementation Approach

1. **SciPhi.ai Client Setup**
   ```javascript
   // lib/sciphi-client.js
   import { SciphiClient } from '@sciphi/sdk';

   export const sciphiClient = new SciphiClient({
     apiKey: process.env.SCIPHI_API_KEY,
   });
   ```

2. **Document Management**
   ```javascript
   // Upload document to SciPhi.ai
   export async function uploadDocument(filePath) {
     return await sciphiClient.documents.create({
       file_path: filePath,
     });
   }

   // List available documents
   export async function listDocuments() {
     return await sciphiClient.documents.list();
   }
   ```

3. **Search and RAG Operations**
   ```javascript
   // Perform search
   export async function performSearch(query) {
     return await sciphiClient.retrieval.search({
       query,
     });
   }

   // Generate RAG response with citations
   export async function generateRAGResponse(query) {
     return await sciphiClient.retrieval.rag({
       query,
     });
   }

   // Use the agent for complex research
   export async function useResearchAgent(message) {
     return await sciphiClient.retrieval.agent({
       message: {
         role: "user",
         content: message,
       },
     });
   }
   ```

4. **Next.js API Integration**
   ```javascript
   // app/api/sciphi/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import {
     performSearch,
     generateRAGResponse,
     useResearchAgent
   } from '@/lib/sciphi-client';

   export async function POST(request: NextRequest) {
     const { query, mode } = await request.json();
     
     try {
       let result;
       
       switch (mode) {
         case 'search':
           result = await performSearch(query);
           break;
         case 'rag':
           result = await generateRAGResponse(query);
           break;
         case 'agent':
           result = await useResearchAgent(query);
           break;
         default:
           return NextResponse.json(
             { error: 'Invalid mode' },
             { status: 400 }
           );
       }
       
       return NextResponse.json({ result });
     } catch (error) {
       console.error('SciPhi error:', error);
       return NextResponse.json(
         { error: 'Failed to process with SciPhi' },
         { status: 500 }
       );
     }
   }
   ```

5. **UI Component Integration**
   ```jsx
   // components/sciphi-search.tsx
   'use client';
   
   import { useState } from 'react';
   
   export function SciphiSearch() {
     const [query, setQuery] = useState('');
     const [mode, setMode] = useState('search'); // 'search', 'rag', or 'agent'
     const [results, setResults] = useState(null);
     const [isLoading, setIsLoading] = useState(false);
     
     const handleSubmit = async (e) => {
       e.preventDefault();
       setIsLoading(true);
       
       try {
         const response = await fetch('/api/sciphi', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ query, mode }),
         });
         
         const data = await response.json();
         setResults(data.result);
       } catch (error) {
         console.error('Error:', error);
       } finally {
         setIsLoading(false);
       }
     };
     
     return (
       <div>
         <form onSubmit={handleSubmit}>
           <input
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder="Search UAP/UFO information..."
           />
           
           <div className="mode-selector">
             <button
               type="button"
               className={mode === 'search' ? 'active' : ''}
               onClick={() => setMode('search')}
             >
               Search
             </button>
             <button
               type="button"
               className={mode === 'rag' ? 'active' : ''}
               onClick={() => setMode('rag')}
             >
               RAG
             </button>
             <button
               type="button"
               className={mode === 'agent' ? 'active' : ''}
               onClick={() => setMode('agent')}
             >
               Research Agent
             </button>
           </div>
           
           <button type="submit" disabled={isLoading || !query.trim()}>
             {isLoading ? 'Processing...' : 'Submit'}
           </button>
         </form>
         
         {results && (
           <div className="results-container">
             {/* Render results based on mode */}
             {mode === 'search' && (
               <div className="search-results">
                 {results.map((result) => (
                   <div key={result.id} className="search-result">
                     <h3>{result.title}</h3>
                     <p>{result.snippet}</p>
                   </div>
                 ))}
               </div>
             )}
             
             {mode === 'rag' && (
               <div className="rag-response">
                 <div className="response-content">{results.content}</div>
                 <div className="citations">
                   <h4>Sources:</h4>
                   <ul>
                     {results.citations.map((citation) => (
                       <li key={citation.id}>{citation.source}</li>
                     ))}
                   </ul>
                 </div>
               </div>
             )}
             
             {mode === 'agent' && (
               <div className="agent-response">
                 <div className="response-content">{results.content}</div>
                 <div className="reasoning">
                   <h4>Research Process:</h4>
                   <pre>{results.reasoning}</pre>
                 </div>
               </div>
             )}
           </div>
         )}
       </div>
     );
   }
   ```

### Benefits
- Advanced RAG capabilities with hybrid search
- Knowledge graph extraction for relationships between UAP/UFO entities
- Multimodal content ingestion (text, PDFs, images, audio)
- Agent-based research for complex queries

### Required Dependencies
- `@sciphi/sdk` (or similar package for SciPhi.ai integration)

## R2R Platform Integration

### Overview
R2R (Reason to Retrieve) is SciPhi.ai's open-source RAG platform with a RESTful API. It provides advanced retrieval-augmented generation capabilities that could enhance Prometheus AI's ability to process and retrieve information about UAP/UFO phenomena.

### Implementation Approach

1. **R2R Client Setup**
   ```javascript
   // lib/r2r-client.js
   import { R2RClient } from 'r2r-js';

   export const r2rClient = new R2RClient({
     apiKey: process.env.R2R_API_KEY,
   });
   ```

2. **Document Management**
   ```javascript
   // Upload document to R2R
   export async function uploadDocument(filePath) {
     return await r2rClient.documents.create({
       file_path: filePath,
     });
   }

   // List available documents
   export async function listDocuments() {
     return await r2rClient.documents.list();
   }
   ```

3. **Search and RAG Operations**
   ```javascript
   // Basic search
   export async function performSearch(query) {
     return await r2rClient.retrieval.search({
       query,
     });
   }

   // RAG with citations
   export async function performRAG(query) {
     return await r2rClient.retrieval.rag({
       query,
     });
   }

   // Agent-based research
   export async function useAgent(message) {
     return await r2rClient.retrieval.agent({
       message: {
         role: "user",
         content: message,
       },
     });
   }
   ```

4. **Next.js API Integration**
   ```javascript
   // app/api/r2r/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import {
     performSearch,
     performRAG,
     useAgent
   } from '@/lib/r2r-client';

   export async function POST(request: NextRequest) {
     const { query, mode } = await request.json();
     
     try {
       let result;
       
       switch (mode) {
         case 'search':
           result = await performSearch(query);
           break;
         case 'rag':
           result = await performRAG(query);
           break;
         case 'agent':
           result = await useAgent(query);
           break;
         default:
           return NextResponse.json(
             { error: 'Invalid mode' },
             { status: 400 }
           );
       }
       
       return NextResponse.json({ result });
     } catch (error) {
       console.error('R2R error:', error);
       return NextResponse.json(
         { error: 'Failed to process with R2R' },
         { status: 500 }
       );
     }
   }
   ```

5. **R2R Dashboard Integration**
   - R2R provides a React+Next.js dashboard application that could be integrated or referenced
   - This dashboard offers document management, analytics, and a playground for testing RAG responses

   ```javascript
   // Possible integration with R2R Dashboard
   import { R2RDashboard } from 'r2r-dashboard';

   export function AdminDashboard() {
     return (
       <div className="admin-dashboard">
         <R2RDashboard 
           apiKey={process.env.R2R_API_KEY}
           endpoint={process.env.R2R_API_ENDPOINT}
         />
       </div>
     );
   }
   ```

### Benefits
- Open-source RAG platform with advanced features
- Comprehensive document management
- Analytics and logging capabilities
- Knowledge graph support
- Hybrid search functionality

### Required Dependencies
- `r2r` or appropriate client package
- React components for the R2R dashboard (if integrating the UI)

## Comparison and Recommendations

### Feature Comparison

| Feature | OpenAI Vector Store | OpenAI Assistant | SciPhi.ai | R2R |
|---------|---------------------|------------------|-----------|-----|
| Vector Search | ✅ | ✅ | ✅ | ✅ |
| Hybrid Search | ❌ | ❌ | ✅ | ✅ |
| Knowledge Graphs | ❌ | ❌ | ✅ | ✅ |
| Multimodal Support | ✅ | ✅ | ✅ | ✅ |
| Agent Capabilities | ❌ | ✅ | ✅ | ✅ |
| Dashboard | ❌ | ❌ | ❌ | ✅ |
| Open Source | ❌ | ❌ | ❌ | ✅ |
| Easy Integration | ✅ | ✅ | ✅ | ✅ |
| Cost | Pay-per-use | Pay-per-use | Varies | Self-hosted or paid |

### Recommendations

1. **Initial Implementation**: Start with OpenAI's Assistants API
   - Simplest to implement
   - Built-in retrieval capabilities
   - Good balance of features and ease of use
   - Direct integration with the existing OpenAI usage in the application

2. **Advanced Implementation**: Progress to R2R platform
   - More advanced RAG capabilities
   - Dashboard for analytics and document management
   - Open-source with self-hosting option for cost control
   - Greater flexibility for specialized UAP/UFO knowledge organization

3. **Hybrid Approach**: Combine OpenAI Assistant with SciPhi.ai
   - Use OpenAI Assistant for general conversation
   - Leverage SciPhi.ai for specialized hybrid search and knowledge graph features
   - Could provide the best balance of simplicity and power

## Next Steps

1. **Assessment Phase**
   - Evaluate the specific requirements of Prometheus AI
   - Determine the volume and types of documents to be processed
   - Assess budget constraints and performance requirements

2. **Proof of Concept**
   - Implement a simple integration with OpenAI Assistant
   - Test with a small set of UAP/UFO documents
   - Evaluate response quality and performance

3. **Iterative Enhancement**
   - Gradually expand the document corpus
   - Add more advanced features like hybrid search or knowledge graphs
   - Consider moving to R2R for more complex scenarios

4. **Production Deployment**
   - Optimize for performance and cost
   - Implement monitoring and analytics
   - Establish a document update pipeline

This research provides a foundation for integrating vector store and RAG capabilities into Prometheus AI, enhancing its ability to process and retrieve information about UAP/UFO phenomena.