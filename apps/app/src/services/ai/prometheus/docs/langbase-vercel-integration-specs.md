
### **⚡️ Prometheus × Langbase Implementation Outline**

*(aka “How to make your UFO-brain actually fly”)*

---

## **0. TL;DR Architecture**

```
[Next.js Client UI] ── POST /api/chat ──► [Edge Function w/ Vercel ai SDK] ──► OpenAI
                                      │                                   │
                                      └──────────── Langbase tool ◄───────┘
```
- **Client:** Fancy React/Tailwind front-end you already built
- **Edge Function:** Single route.ts exported via createAI()
- **Tool Layer:** searchUAP (Langbase) + any other functions you expose
- **Model:** OpenAI (or Anthropic) handles orchestration & streaming output

---

## **1. Project Bootstrapping**

**Step**

**Command / File**

**Notes**

1. Init project

npx create-next-app@latest prometheus-ai

Yes, with Typescript, App Router

2. Packages

bash npm i openai ai @langbase/client sonner framer-motion lucide-react

plus whatever UI libs you already use

3. Env vars

OPENAI_KEY, LANGBASE_KEY in Vercel dashboard

**Never** hard-code these on the client

4. Git

main, protected branch rules, CI pipeline (see §9)

---

## **2. Server-Side Agent (**

## **/app/api/chat/route.ts**

## **)**

```
import { createAI } from "ai";
import OpenAI from "openai";
import { LangbaseClient } from "@langbase/client";

const openai   = new OpenAI({ apiKey: process.env.OPENAI_KEY! });
const langbase = new LangbaseClient({ apiKey: process.env.LANGBASE_KEY! });

export const runtime = "edge";

export const POST = createAI({
  tools: {
    searchUAP: {
      description: "Semantic & graph search across the UAP corpus",
      parameters: { type:"object", properties:{query:{type:"string"}}, required:["query"] },
      execute: async ({ query }) => {
        const res = await langbase.search({ text: query, limit: 10 });
        return res.items;
      },
    },
  },

  async respond({ messages, tools }) {
    return openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages,
      tools,
    });
  },
});
```

*Add more tools (e.g., “ingestURL”, “summarizePDF”) exactly the same way.*

---

## **3. Client Changes (**

## **Agent.tsx**

## **)**
1. **POST target ⇒** /api/chat
2. **Payload shape ⇒**

```
body: JSON.stringify({ messages:[{ role:"user", content: input }] })
```
1. 
2. **Streaming read (optional)**

```
import { streamReader } from "ai/react";
...
const { reader } = streamReader(res);
for await (const delta of reader) setResponse(prev=>prev+delta);
```
1. 
2. **Remove Langbase bearer token** – secrets live server-side.

---

## **4. File Upload & Attachment Flow (optional)**

```
Client selects file ─► upload to S3/Supabase Storage
                               │
                               └─ URL/ID passed in user message
Edge tool “fetchFile→extractText” grabs it → feeds to model
```
- Skip if you only need text queries now; bolt on later.

---

## **5. Security Checklist**
- CSRF: protected by Next.js (same-site cookies), still keep POST only
- Rate limiting: Vercel edge + KV throttle (ai SDK has rateLimit helper)
- Secrets in .env, never leak to browser build
- Validate file MIME/type server-side too, not just client-side toast

---

## **6. Testing Strategy**

**Layer**

**Tooling**

**Focus**

Unit (tools)

vitest + mock LangbaseClient

“searchUAP returns stable schema”

Contract

openai-mock snapshots

Messages ⇒ Expected tool calls

E2E

Playwright

UI flow, streaming update, PDF upload

---

## **7. Observability**
- **AI SDK hooks** → pipe to Vercel Logs or an OTEL exporter
- **Langbase search latency** → console.time wrapper + DataDog/Honeycomb
- **Frontend** → Sentry (React) + Web Vitals reporting

---

## **8. Deployment**
1. Push to GitHub → Vercel CI builds Edge Function & static assets
2. Preview URL auto-generated for PR reviews
3. Production promotes via protected branch merge

---

## **9. Future Upgrades (road-mapped)**

**Idea**

**Rough Effort**

**Note**

🔄 Auto-ingest PDFs via Upload tool

2-3 d

Langbase “document” collection + nightly cron

🕸 Knowledge-graph visualization

1 w

D3/Three.js; fits your UFO graph obsession

🐿️ Memory store

0.5 d

Swap store to Redis/Upstash for convo history

🧪 A/B retrieval strategies

1 d

Pinecone vs Langbase split test

---

### **Ship-it Checklist**
- Packages installed & locked
- /api/chat streaming works locally (curl -N)
- Client sends/receives without CORS errors
- Env vars set in Vercel → build succeeds
- Secrets purged from Git history (git filter-repo)

**Done.** You now have a single-agent, Edge-native, Langbase-powered brain for Prometheus. Time to go probe some data. 🛸

Exactly. The outline glues the two libraries together inside one agentic runtime:

**Piece**

**Powered by**

**What it’s doing**

**Conversation orchestration, streaming, function-calling, rate-limits**

**Vercel ai SDK**(createAI)

Handles the “agent” loop—receives the user message, decides whether to call a tool, streams tokens back to the client.

**Long-term knowledge / retrieval / graph queries**

**Langbase JS client**

Exposed to the model as a *tool* (searchUAP). GPT can invoke it whenever it needs outside knowledge.

**(Optional) Conversation memory store**

**Langbase KV** (or graph)

If you override the store interface in createAI, the SDK will persist messages in Langbase instead of Redis or edge-KV.

### **How the merge works in practice**
1. **One edge function** (/api/chat) is exported with createAI().
2. Inside that function you:
   - Instantiate the Langbase client.
   - Register any Langbase operations (search, graph hops, doc ingestion) as *tools*.
3. When the user’s message hits the endpoint the SDK passes:
   - messages[] (chat history)
   - tools (the function-calling schema you registered)
4. GPT sees the tools schema and, mid-conversation, can respond with:

```
{ "name":"searchUAP", "arguments":{ "query":"Foo Fighter sightings 1944" } }
```
1. 
2. The SDK calls your execute() handler → Langbase query runs → result is injected back into GPT as context → GPT continues generating the final answer.
3. Streaming back to the browser still comes from the SDK, so your React UI doesn’t change.

### **So yes—**

### **one agent, two engines:**
- **Vercel AI SDK →** orchestration, streaming, infra niceties.
- **Langbase →** knowledge retrieval + (optionally) persistent memory.

No micro-services, no extra hops; just a single edge route with both libs side-by-side. 🛠️➕🗄️ = 🛸