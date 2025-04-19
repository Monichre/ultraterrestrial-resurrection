
# <https://docs.firecrawl.dev/introduction> llms-full.txt

## Firecrawl API Service

[Firecrawl Docs home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/logo/logo.png)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/logo/logo-dark.png)](https://firecrawl.dev/)

v1

Search or ask...

Ctrl K

Search...

Navigation

Get Started

Quickstart

[Documentation](https://docs.firecrawl.dev/introduction) [SDKs](https://docs.firecrawl.dev/sdks/overview) [Learn](https://www.firecrawl.dev/blog/category/tutorials) [Integrations](https://www.firecrawl.dev/app) [API Reference](https://docs.firecrawl.dev/api-reference/introduction)

![Hero Light](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/hero.png)

## [​](https://docs.firecrawl.dev/introduction\#welcome-to-firecrawl)  Welcome to Firecrawl

[Firecrawl](https://firecrawl.dev/?ref=github) is an API service that takes a URL, crawls it, and converts it into clean markdown. We crawl all accessible subpages and give you clean markdown for each. No sitemap required.

## [​](https://docs.firecrawl.dev/introduction\#how-to-use-it%3F)  How to use it?

We provide an easy to use API with our hosted version. You can find the playground and documentation [here](https://firecrawl.dev/playground). You can also self host the backend if you’d like.

Check out the following resources to get started:

- [x] **API**: [Documentation](https://docs.firecrawl.dev/api-reference/introduction)
- [x] **SDKs**: [Python](https://docs.firecrawl.dev/sdks/python), [Node](https://docs.firecrawl.dev/sdks/node), [Go](https://docs.firecrawl.dev/sdks/go), [Rust](https://docs.firecrawl.dev/sdks/rust)
- [x] **LLM Frameworks**: [Langchain (python)](https://python.langchain.com/docs/integrations/document_loaders/firecrawl/), [Langchain (js)](https://js.langchain.com/docs/integrations/document_loaders/web_loaders/firecrawl), [Llama Index](https://docs.llamaindex.ai/en/latest/examples/data_connectors/WebPageDemo/#using-firecrawl-reader), [Crew.ai](https://docs.crewai.com/), [Composio](https://composio.dev/tools/firecrawl/all), [PraisonAI](https://docs.praison.ai/firecrawl/), [Superinterface](https://superinterface.ai/docs/assistants/functions/firecrawl), [Vectorize](https://docs.vectorize.io/integrations/source-connectors/firecrawl)
- [x] **Low-code Frameworks**: [Dify](https://dify.ai/blog/dify-ai-blog-integrated-with-firecrawl), [Langflow](https://docs.langflow.org/), [Flowise AI](https://docs.flowiseai.com/integrations/langchain/document-loaders/firecrawl), [Cargo](https://docs.getcargo.io/integration/firecrawl), [Pipedream](https://pipedream.com/apps/firecrawl/)
- [x] **Others**: [Zapier](https://zapier.com/apps/firecrawl/integrations), [Pabbly Connect](https://www.pabbly.com/connect/integrations/firecrawl/)
- [ ]  Want an SDK or Integration? Let us know by opening an issue.

**Self-host:** To self-host refer to guide [here](https://docs.firecrawl.dev/contributing/self-host).

### [​](https://docs.firecrawl.dev/introduction\#api-key)  API Key

To use the API, you need to sign up on [Firecrawl](https://firecrawl.dev/) and get an API key.

### [​](https://docs.firecrawl.dev/introduction\#features)  Features

- [**Scrape**](https://docs.firecrawl.dev/introduction#scraping): scrapes a URL and get its content in LLM-ready format (markdown, structured data via [LLM Extract](https://docs.firecrawl.dev/introduction#extraction), screenshot, html)
- [**Crawl**](https://docs.firecrawl.dev/introduction#crawling): scrapes all the URLs of a web page and return content in LLM-ready format
- [**Map**](https://docs.firecrawl.dev/features/map): input a website and get all the website urls - extremely fast
- [**Extract**](https://docs.firecrawl.dev/features/extract): get structured data from single page, multiple pages or entire websites with AI.

### [​](https://docs.firecrawl.dev/introduction\#powerful-capabilities)  Powerful Capabilities

- **LLM-ready formats**: markdown, structured data, screenshot, HTML, links, metadata
- **The hard stuff**: proxies, anti-bot mechanisms, dynamic content (js-rendered), output parsing, orchestration
- **Customizability**: exclude tags, crawl behind auth walls with custom headers, max crawl depth, etc…
- **Media parsing**: pdfs, docx, images.
- **Reliability first**: designed to get the data you need - no matter how hard it is.
- **Actions**: click, scroll, input, wait and more before extracting data

You can find all of Firecrawl’s capabilities and how to use them in our [documentation](https://docs.firecrawl.dev/)

## [​](https://docs.firecrawl.dev/introduction\#crawling)  Crawling

Used to crawl a URL and all accessible subpages. This submits a crawl job and returns a job ID to check the status of the crawl.

### [​](https://docs.firecrawl.dev/introduction\#installation)  Installation

Python

Node

Go

Rust

Copy

```bash
pip install firecrawl-py

```

### [​](https://docs.firecrawl.dev/introduction\#usage)  Usage

Python

Node

Go

Rust

cURL

Copy

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

# Crawl a website:
crawl_status = app.crawl_url(
  'https://firecrawl.dev',
  limit=100,
  scrape_options={'formats': ['markdown', 'html']},
  poll_interval=30
)
print(crawl_status)

```

If you’re using cURL or `async crawl` functions on SDKs, this will return an `ID` where you can use to check the status of the crawl.

Copy

```json
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.firecrawl.dev/v1/crawl/123-456-789"
}

```

### [​](https://docs.firecrawl.dev/introduction\#check-crawl-job)  Check Crawl Job

Used to check the status of a crawl job and get its result.

Python

Node

Go

Rust

cURL

Copy

```python
crawl_status = app.check_crawl_status("<crawl_id>")
print(crawl_status)

```

#### [​](https://docs.firecrawl.dev/introduction\#response)  Response

The response will be different depending on the status of the crawl. For not completed or large responses exceeding 10MB, a `next` URL parameter is provided. You must request this URL to retrieve the next 10MB of data. If the `next` parameter is absent, it indicates the end of the crawl data.

Scraping

Completed

Copy

```json
{
  "status": "scraping",
  "total": 36,
  "completed": 10,
  "creditsUsed": 10,
  "expiresAt": "2024-00-00T00:00:00.000Z",
  "next": "https://api.firecrawl.dev/v1/crawl/123-456-789?skip=10",
  "data": [\
    {\
      "markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",\
      "html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\"\">...",\
      "metadata": {\
        "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",\
        "language": "en",\
        "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",\
        "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",\
        "ogLocaleAlternate": [],\
        "statusCode": 200\
      }\
    },\
    ...\
  ]\
}\
\
```\
\
## [​](https://docs.firecrawl.dev/introduction\#scraping)  Scraping\
\
To scrape a single URL, use the `scrape_url` method. It takes the URL as a parameter and returns the scraped data as a dictionary.\
\
Python\
\
Node\
\
Go\
\
Rust\
\
cURL\
\
Copy\
\
```python\
from firecrawl import FirecrawlApp\
\
app = FirecrawlApp(api_key="fc-YOUR_API_KEY")\
\
# Scrape a website:\
scrape_result = app.scrape_url('firecrawl.dev', formats=['markdown', 'html'])\
print(scrape_result)\
\
```\
\
### [​](https://docs.firecrawl.dev/introduction\#response-2)  Response\
\
SDKs will return the data object directly. cURL will return the payload exactly as shown below.\
\
Copy\
\
```json\
{\
  "success": true,\
  "data" : {\
    "markdown": "Launch Week I is here! [See our Day 2 Release 🚀](https://www.firecrawl.dev/blog/launch-week-i-day-2-doubled-rate-limits)[💥 Get 2 months free...",\
    "html": "<!DOCTYPE html><html lang=\"en\" class=\"light\" style=\"color-scheme: light;\"><body class=\"__variable_36bd41 __variable_d7dc5d font-inter ...",\
    "metadata": {\
      "title": "Home - Firecrawl",\
      "description": "Firecrawl crawls and converts any website into clean markdown.",\
      "language": "en",\
      "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",\
      "robots": "follow, index",\
      "ogTitle": "Firecrawl",\
      "ogDescription": "Turn any website into LLM-ready data.",\
      "ogUrl": "https://www.firecrawl.dev/",\
      "ogImage": "https://www.firecrawl.dev/og.png?123",\
      "ogLocaleAlternate": [],\
      "ogSiteName": "Firecrawl",\
      "sourceURL": "https://firecrawl.dev",\
      "statusCode": 200\
    }\
  }\
}\
\
```\
\
## [​](https://docs.firecrawl.dev/introduction\#extraction)  Extraction\
\
With LLM extraction, you can easily extract structured data from any URL. We support pydantic schemas to make it easier for you too. Here is how you to use it:\
\
v1 is only supported on node, python and cURL at this time.\
\
Python\
\
Node\
\
cURL\
\
Copy\
\
```python\
from firecrawl import FirecrawlApp, JsonConfig\
from pydantic import BaseModel, Field\
\
# Initialize the FirecrawlApp with your API key\
app = FirecrawlApp(api_key='your_api_key')\
\
class ExtractSchema(BaseModel):\
    company_mission: str\
    supports_sso: bool\
    is_open_source: bool\
    is_in_yc: bool\
\
json_config = JsonConfig(\
    extractionSchema=ExtractSchema.model_json_schema(),\
    mode="llm-extraction",\
    pageOptions={"onlyMainContent": True}\
)\
\
llm_extraction_result = app.scrape_url(\
    'https://news.ycombinator.com',\
    formats=["json"],\
    json_options=json_config\
)\
print(llm_extraction_result)\
\
```\
\
Output:\
\
JSON\
\
Copy\
\
```json\
{\
    "success": true,\
    "data": {\
      "json": {\
        "company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",\
        "supports_sso": true,\
        "is_open_source": false,\
        "is_in_yc": true\
      },\
      "metadata": {\
        "title": "Mendable",\
        "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",\
        "robots": "follow, index",\
        "ogTitle": "Mendable",\
        "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",\
        "ogUrl": "https://docs.firecrawl.dev/",\
        "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",\
        "ogLocaleAlternate": [],\
        "ogSiteName": "Mendable",\
        "sourceURL": "https://docs.firecrawl.dev/"\
      },\
    }\
}\
\
```\
\
### [​](https://docs.firecrawl.dev/introduction\#extracting-without-schema-new)  Extracting without schema (New)\
\
You can now extract without a schema by just passing a `prompt` to the endpoint. The llm chooses the structure of the data.\
\
cURL\
\
Copy\
\
```bash\
curl -X POST https://api.firecrawl.dev/v1/scrape \\
    -H 'Content-Type: application/json' \\
    -H 'Authorization: Bearer YOUR_API_KEY' \\
    -d '{\
      "url": "https://docs.firecrawl.dev/",\
      "formats": ["json"],\
      "jsonOptions": {\
        "prompt": "Extract the company mission from the page."\
      }\
    }'\
\
```\
\
Output:\
\
JSON\
\
Copy\
\
```json\
{\
    "success": true,\
    "data": {\
      "json": {\
        "company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",\
      },\
      "metadata": {\
        "title": "Mendable",\
        "description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",\
        "robots": "follow, index",\
        "ogTitle": "Mendable",\
        "ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",\
        "ogUrl": "https://docs.firecrawl.dev/",\
        "ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",\
        "ogLocaleAlternate": [],\
        "ogSiteName": "Mendable",\
        "sourceURL": "https://docs.firecrawl.dev/"\
      },\
    }\
}\
\
```\
\
### [​](https://docs.firecrawl.dev/introduction\#extraction-v0)  Extraction (v0)\
\
Python\
\
JavaScript\
\
Go\
\
Rust\
\
cURL\
\
Copy\
\
```python\
\
app = FirecrawlApp(version="v0")\
\
class ArticleSchema(BaseModel):\
    title: str\
    points: int\
    by: str\
    commentsURL: str\
\
class TopArticlesSchema(BaseModel):\
top: List[ArticleSchema] = Field(..., max_items=5, description="Top 5 stories")\
\
data = app.scrape_url('https://news.ycombinator.com', {\
'extractorOptions': {\
'extractionSchema': TopArticlesSchema.model_json_schema(),\
'mode': 'llm-extraction'\
},\
'pageOptions':{\
'onlyMainContent': True\
}\
})\
print(data["llm_extraction"])\
\
```\
\
## [​](https://docs.firecrawl.dev/introduction\#interacting-with-the-page-with-actions)  Interacting with the page with Actions\
\
Firecrawl allows you to perform various actions on a web page before scraping its content. This is particularly useful for interacting with dynamic content, navigating through pages, or accessing content that requires user interaction.\
\
Here is an example of how to use actions to navigate to google.com, search for Firecrawl, click on the first result, and take a screenshot.\
\
It is important to almost always use the `wait` action before/after executing other actions to give enough time for the page to load.\
\
### [​](https://docs.firecrawl.dev/introduction\#example)  Example\
\
Python\
\
Node\
\
cURL\
\
Copy\
\
```python\
from firecrawl import FirecrawlApp\
\
app = FirecrawlApp(api_key="fc-YOUR_API_KEY")\
\
# Scrape a website:\
scrape_result = app.scrape_url('firecrawl.dev',\
    formats=['markdown', 'html'],\
    actions=[\
        {"type": "wait", "milliseconds": 2000},\
        {"type": "click", "selector": "textarea[title=\"Search\"]"},\
        {"type": "wait", "milliseconds": 2000},\
        {"type": "write", "text": "firecrawl"},\
        {"type": "wait", "milliseconds": 2000},\
        {"type": "press", "key": "ENTER"},\
        {"type": "wait", "milliseconds": 3000},\
        {"type": "click", "selector": "h3"},\
        {"type": "wait", "milliseconds": 3000},\
        {"type": "scrape"},\
        {"type": "screenshot"}\
    ]\
)\
print(scrape_result)\
\
```\
\
### [​](https://docs.firecrawl.dev/introduction\#output)  Output\
\
JSON\
\
Copy\
\
```json\
{\
  "success": true,\
  "data": {\
    "markdown": "Our first Launch Week is over! [See the recap 🚀](blog/firecrawl-launch-week-1-recap)...",\
    "actions": {\
      "screenshots": [\
        "https://alttmdsdujxrfnakrkyi.supabase.co/storage/v1/object/public/media/screenshot-75ef2d87-31e0-4349-a478-fb432a29e241.png"\
      ],\
      "scrapes": [\
        {\
          "url": "https://www.firecrawl.dev/",\
          "html": "<html><body><h1>Firecrawl</h1></body></html>"\
        }\
      ]\
    },\
    "metadata": {\
      "title": "Home - Firecrawl",\
      "description": "Firecrawl crawls and converts any website into clean markdown.",\
      "language": "en",\
      "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",\
      "robots": "follow, index",\
      "ogTitle": "Firecrawl",\
      "ogDescription": "Turn any website into LLM-ready data.",\
      "ogUrl": "https://www.firecrawl.dev/",\
      "ogImage": "https://www.firecrawl.dev/og.png?123",\
      "ogLocaleAlternate": [],\
      "ogSiteName": "Firecrawl",\
      "sourceURL": "http://google.com",\
      "statusCode": 200\
    }\
  }\
}\
\
```\
\
## [​](https://docs.firecrawl.dev/introduction\#open-source-vs-cloud)  Open Source vs Cloud\
\
Firecrawl is open source available under the [AGPL-3.0 license](https://github.com/mendableai/firecrawl/blob/main/LICENSE).\
\
To deliver the best possible product, we offer a hosted version of Firecrawl alongside our open-source offering. The cloud solution allows us to continuously innovate and maintain a high-quality, sustainable service for all users.\
\
Firecrawl Cloud is available at [firecrawl.dev](https://firecrawl.dev/) and offers a range of features that are not available in the open source version:\
\
![Firecrawl Cloud vs Open Source](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/open-source-cloud.png)\
\
## [​](https://docs.firecrawl.dev/introduction\#contributing)  Contributing\
\
We love contributions! Please read our [contributing guide](https://github.com/mendableai/firecrawl/blob/main/CONTRIBUTING.md) before submitting a pull request.\
\
[Suggest edits](https://github.com/hellofirecrawl/docs/edit/main/introduction.mdx) [Raise issue](https://github.com/hellofirecrawl/docs/issues/new?title=Issue%20on%20docs&body=Path:%20/introduction)\
\
[Launch Week III (New)](https://docs.firecrawl.dev/launch-week)\
\
On this page\
\
- [Welcome to Firecrawl](https://docs.firecrawl.dev/introduction#welcome-to-firecrawl)\
- [How to use it?](https://docs.firecrawl.dev/introduction#how-to-use-it%3F)\
- [API Key](https://docs.firecrawl.dev/introduction#api-key)\
- [Features](https://docs.firecrawl.dev/introduction#features)\
- [Powerful Capabilities](https://docs.firecrawl.dev/introduction#powerful-capabilities)\
- [Crawling](https://docs.firecrawl.dev/introduction#crawling)\
- [Installation](https://docs.firecrawl.dev/introduction#installation)\
- [Usage](https://docs.firecrawl.dev/introduction#usage)\
- [Check Crawl Job](https://docs.firecrawl.dev/introduction#check-crawl-job)\
- [Response](https://docs.firecrawl.dev/introduction#response)\
- [Scraping](https://docs.firecrawl.dev/introduction#scraping)\
- [Response](https://docs.firecrawl.dev/introduction#response-2)\
- [Extraction](https://docs.firecrawl.dev/introduction#extraction)\
- [Extracting without schema (New)](https://docs.firecrawl.dev/introduction#extracting-without-schema-new)\
- [Extraction (v0)](https://docs.firecrawl.dev/introduction#extraction-v0)\
- [Interacting with the page with Actions](https://docs.firecrawl.dev/introduction#interacting-with-the-page-with-actions)\
- [Example](https://docs.firecrawl.dev/introduction#example)\
- [Output](https://docs.firecrawl.dev/introduction#output)\
- [Open Source vs Cloud](https://docs.firecrawl.dev/introduction#open-source-vs-cloud)\
- [Contributing](https://docs.firecrawl.dev/introduction#contributing)\
\
![Hero Light](https://docs.firecrawl.dev/introduction)

