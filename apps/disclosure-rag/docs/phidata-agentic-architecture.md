# Ultraterrestrial Domain Model Relationships

```mermaid
erDiagram
    Topics ||--o{ Testimonies : contains
    Topics ||--o{ SubjectMatterExperts : has
    Events ||--o{ Testimonies : includes
    Events ||--o{ Sightings : records
    Events ||--o{ Documents : contains
    Events ||--o{ Artifacts : involves
    Events }|--|| Locations : occurs_at
    Organizations ||--o{ OrganizationMembers : has
    Organizations ||--o{ Personnel : employs
    Topics ||--o{ MindMaps : visualizes
    Topics ||--o{ Theories : contains

    SubjectMatterExperts ||--o{ EventExperts : participates
    Events ||--o{ EventExperts : has
    Topics ||--o{ TopicExperts : has
    SubjectMatterExperts ||--o{ TopicExperts : participates
    
    Events ||--o{ Tags : tagged_with



# Phidata

## Assistant Architecture

### **[Auto Rag Assistant](**[https://github.com/phidatahq/phidata/tree/main/cookbook/assistants/examples/auto_rag](https://github.com/phidatahq/phidata/tree/main/cookbook/assistants/examples/auto_rag)**)**

*Auto-RAG is just a fancy name for giving the LLM tools like "search_knowledge", "read_chat_history", "search_the_web" and letting it decide how to retrieve the information it needs to answer the question.*

### [PDF Assistant]([https://github.com/phidatahq/phidata/tree/main/cookbook/assistants/examples/pdf](https://github.com/phidatahq/phidata/tree/main/cookbook/assistants/examples/pdf))

**Seems like a good solution to the local transcript directory in the Youtube Scrape Service**

```

# PDF Assistant

import typer
from typing import Optional, List
from phi.assistant import Assistant
from phi.storage.assistant.postgres import PgAssistantStorage
from phi.knowledge.pdf import PDFUrlKnowledgeBase
from phi.vectordb.pgvector import PgVector2
from resources import vector_db  # type: ignore

db_url = vector_db.get_db_connection_local()
knowledge = PDFUrlKnowledgeBase(
    urls=["https://phi-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"],
    vector_db=PgVector2(collection="recipes", db_url=db_url),
)
knowledge.load(recreate=False)  # Comment out after first run
storage = PgAssistantStorage(table_name="pdf_assistant", db_url=db_url)

def pdf_assistant(new: bool = False, user: str = "user"):
    run_id: Optional[str] = None
    if not new:
        existing_run_ids: List[str] = storage.get_all_run_ids(user)
        if len(existing_run_ids) > 0:
            run_id = existing_run_ids[0]

    assistant = Assistant(
        run_id=run_id,
        user_id=user,
        knowledge=knowledge,
        storage=storage,
        use_tools=True,
        show_tool_calls=True,
    )
    assistant.cli_app(markdown=True)

if __name__ == "__main__":
    typer.run(pdf_assistant)

```

---

# Agent Team Architecture

**[Docs](**[**https://docs.phidata.com/examples/agents/agent-team**](https://docs.phidata.com/examples/agents/agent-team)**)**

```

from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.yfinance import YFinanceTools

web_agent = Agent(
name="Web Agent",
role="Search the web for information",
model=OpenAIChat(id="gpt-4o"),
tools=[DuckDuckGo()],
instructions=["Always include sources"],
show_tool_calls=True,
markdown=True,
)

finance_agent = Agent(
name="Finance Agent",
role="Get financial data",
model=OpenAIChat(id="gpt-4o"),
tools=[YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True)],
instructions=["Use tables to display data"],
show_tool_calls=True,
markdown=True,
)

agent_team = Agent(
team=[web_agent, finance_agent],
instructions=["Always include sources", "Use tables to display data"],
show_tool_calls=True,
markdown=True,
)

agent_team.print_response("Summarize analyst recommendations and share the latest news for NVDA", stream=True)

```

→ [Research Team ([https://docs.phidata.com/examples/agents/research-agent](https://docs.phidata.com/examples/agents/research-agent))

```

from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.newspaper4k import Newspaper4k

agent = Agent(
model=OpenAIChat(id="gpt-4o"),
tools=[DuckDuckGo(), Newspaper4k()],
description="You are a senior NYT researcher writing an article on a topic.",
instructions=[
"For a given topic, search for the top 5 links.",
"Then read each URL and extract the article text, if a URL isn't available, ignore it.",
"Analyse and prepare an NYT worthy article based on the information.",
],
markdown=True,
show_tool_calls=True,
add_datetime_to_instructions=True,

# debug_mode=True

)
agent.print_response("Simulation theory", stream=True)

```

→ [Web Agent]([https://docs.phidata.com/examples/agents/web-search](https://docs.phidata.com/examples/agents/web-search))

```

from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.tools.duckduckgo import DuckDuckGo

web_agent = Agent(
                   name="Web Agent",
                   model=OpenAIChat(id="gpt-4o"),
                   tools=[DuckDuckGo()],
                   instructions=["Always include sources"],
                   show_tool_calls=True,
                   markdown=True,
                   )
web_agent.print_response("Whats happening in France?", stream=True)

```

→[Firecrawl Agent]([https://docs.phidata.com/examples/agents/firecrawl-agent](https://docs.phidata.com/examples/agents/firecrawl-agent))

```

from phi.agent import Agent
from phi.tools.firecrawl import FirecrawlTools

agent = Agent(tools=[FirecrawlTools(scrape=False, crawl=True)], show_tool_calls=True, markdown=True)
agent.print_response("Summarize this <https://finance.yahoo.com/>")

```

→ [RAG Agent]([https://docs.phidata.com/examples/agents/rag-agent](https://docs.phidata.com/examples/agents/rag-agent))

```

from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.embedder.openai import OpenAIEmbedder
from phi.knowledge.pdf import PDFUrlKnowledgeBase
from phi.vectordb.lancedb import LanceDb, SearchType

# Knowledge Base from PDF

knowledge = PDFUrlKnowledgeBase(
    urls=["https://phi-public.s3.amazonaws.com/recipes/ThaiRecipes.pdf"],
    # Use LanceDB as the vector database
    vector_db=LanceDb(
        table_name="recipes",
        uri="tmp/lancedb",
        search_type=SearchType.vector,
        embedder=OpenAIEmbedder(model="text-embedding-3-small"),
    ),
)

# Comment out after first run as the knowledge base is loaded

knowledge.load(recreate=False)

agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    # Add the knowledge base to the agent
    knowledge=knowledge,
    show_tool_calls=True,
    markdown=True,
)
agent.print_response(
    "How do I make chicken and galangal in coconut milk soup", stream=True)
  
```

## Knowledge Graph Generation

**Structured Output Prompt**

> *// ChatGPT 01-mini*
>
> *export* const DATABASE_SCHEMA_PROMPT_V3 **=** `
>
> System Prompt: Web Research Agent Data Model
>
> This system utilizes a structured relational database comprising multiple interconnected tables. Each table is defined with specific columns, data types, constraints, and relationships to other tables. Below is a detailed overview of each table, its fields, and its associations within the database schema.
>
> 1. Topics
>
> Purpose: Stores information about various topics.
>
> Columns:
>
> • name (string): The name of the topic.
>
> • summary (text): A detailed summary of the topic.
>
> • photo (file): A single photo representing the topic.
>
> • photos (file[]): Multiple photos associated with the topic.
>
> • title (string, unique): A unique title for the topic.
>
> Relationships:
>
> • topic-subject-matter-experts: Linked via the topic column.
>
> • topics-testimonies: Linked via the topic column.
>
> • event-topic-subject-matter-experts: Linked via the topic column.
>
> • user-saved-topics: Linked via the topic column.
>
> 2. Personnel
>
> Purpose: Contains information about personnel involved in various capacities.
>
> Columns:
>
> • bio (text): Biography of the personnel.
>
> • role (string): Role or position held.
>
> • facebook (string): Facebook profile link.
>
> • twitter (string): Twitter handle.
>
> • website (string): Personal or professional website.
>
> • instagram (string): Instagram profile link.
>
> • photo (file[]): Multiple photos of the personnel.
>
> • rank (int): Rank or level.
>
> • credibility (int): Credibility score.
>
> • popularity (int): Popularity score.
>
> • name (string, unique): Full name of the personnel.
>
> • authority (int): Authority score.
>
> Relationships:
>
> • organization-members: Linked via the member column.
>
> • event-subject-matter-experts: Linked via the subject-matter-expert column.
>
> • topic-subject-matter-experts: Linked via the subject-matter-expert column.
>
> • testimonies: Linked via the witness column.
>
> • event-topic-subject-matter-experts: Linked via the subject-matter-expert column.
>
> • user-saved-key-figure: Linked via the key-figure column.
>
> • documents: Linked via the author column.
>
> 3. Events
>
> Purpose: Records details about various events.
>
> Columns:
>
> • name (text): Name of the event.
>
> • description (text): Detailed description of the event.
>
> • location (string): Location of the event.
>
> • latitude (float): Latitude coordinate of the event location.
>
> • longitude (float): Longitude coordinate of the event location.
>
> • date (datetime): Date and time of the event.
>
> • photos (file[]): Photos from the event.
>
> • metadata (json, default: “{}”): Additional metadata in JSON format.
>
> • title (string, unique): A unique title for the event.
>
> • summary (text): Summary of the event.
>
> Relationships:
>
> • event-subject-matter-experts: Linked via the event column.
>
> • testimonies: Linked via the event column.
>
> • event-topic-subject-matter-experts: Linked via the event column.
>
> • user-saved-events: Linked via the event column.
>
> 4. Organizations
>
> Purpose: Maintains data about various organizations.
>
> Columns:
>
> • name (string): Name of the organization.
>
> • specialization (string): Area of specialization.
>
> • description (text): Description of the organization.
>
> • photo (text): Photo URL or identifier.
>
> • image (file, defaultPublicAccess: true): Image file with public access.
>
> • title (string, unique): A unique title for the organization.
>
> Relationships:
>
> • organization-members: Linked via the organization column.
>
> • testimonies: Linked via the organization column.
>
> • user-saved-organizations: Linked via the organization column.
>
> • documents: Linked via the organization column.
>
> 5. Sightings
>
> Purpose: Logs sightings with detailed information.
>
> Columns:
>
> • date (datetime): Date of the sighting.
>
> • description (string): Description of the sighting.
>
> • media_link (string): Link to media related to the sighting.
>
> • city (string): City where the sighting occurred.
>
> • state (string): State where the sighting occurred.
>
> • country (string): Country where the sighting occurred.
>
> • shape (string): Shape observed during the sighting.
>
> • duration_seconds (string): Duration in seconds.
>
> • duration_hours_min (string): Duration in hours and minutes.
>
> • comments (string): Additional comments.
>
> • date_posted (datetime): Date the sighting was posted.
>
> • latitude (float): Latitude coordinate.
>
> • longitude (float): Longitude coordinate.
>
> Relationships:
>
> • user-saved-sightings: Linked via the sighting column.
>
> 6. Event-Subject-Matter-Experts
>
> Purpose: Associates events with subject matter experts.
>
> Columns:
>
> • event (link to Events): Reference to the related event.
>
> • subject-matter-expert (link to Personnel): Reference to the subject matter expert.
>
> 7. Topic-Subject-Matter-Experts
>
> Purpose: Links topics with subject matter experts.
>
> Columns:
>
> • topic (link to Topics): Reference to the related topic.
>
> • subject-matter-expert (link to Personnel): Reference to the subject matter expert.
>
> 8. Organization-Members
>
> Purpose: Connects personnel members to organizations.
>
> Columns:
>
> • member (link to Personnel): Reference to the personnel member.
>
> • organization (link to Organizations): Reference to the organization.
>
> 9. Testimonies
>
> Purpose: Captures testimonies related to events and organizations.
>
> Columns:
>
> • claim (text): The claim made in the testimony.
>
> • event (link to Events): Reference to the related event.
>
> • summary (text): Summary of the testimony.
>
> • witness (link to Personnel): Reference to the witness.
>
> • documentation (file[]): Supporting documentation files.
>
> • date (datetime): Date of the testimony.
>
> • organization (link to Organizations): Reference to the related organization.
>
> Relationships:
>
> • topics-testimonies: Linked via the testimony column.
>
> • user-saved-testimonies: Linked via the testimony column.
>
> 10. Topics-Testimonies
>
> Purpose: Associates topics with testimonies.
>
> Columns:
>
> • topic (link to Topics): Reference to the related topic.
>
> • testimony (link to Testimonies): Reference to the testimony.
>
> 11. Documents
>
> Purpose: Stores documents with associated metadata.
>
> Columns:
>
> • file (file[]): Document files.
>
> • content (text): Content of the document.
>
> • embedding (vector, dimension: 1536): Vector embedding for the document.
>
> • title (string): Title of the document.
>
> • date (datetime): Date of the document.
>
> • author (link to Personnel): Reference to the author.
>
> • organization (link to Organizations): Reference to the organization.
>
> • url (text): URL link to the document.
>
> Relationships:
>
> • user-saved-documents: Linked via the document column.
>
> 12. Locations
>
> Purpose: Defines various geographical locations.
>
> Columns:
>
> • name (string): Name of the location.
>
> • coordinates (string): Coordinate representation.
>
> • google-maps-location-id (text): Google Maps Location ID.
>
> • city (string): City of the location.
>
> • state (string): State of the location.
>
> • latitude (float): Latitude coordinate.
>
> • longitude (float): Longitude coordinate.
>
> 13. Event-Topic-Subject-Matter-Experts
>
> Purpose: Links events, topics, and subject matter experts together.
>
> Columns:
>
> • event (link to Events): Reference to the related event.
>
> • topic (link to Topics): Reference to the related topic.
>
> • subject-matter-expert (link to Personnel): Reference to the subject matter expert.
>
> 14. Artifacts
>
> Purpose: Manages artifacts with detailed descriptions and media.
>
>
> I wa
>
> Columns:
>
> • name (string, unique): Name of the artifact.
>
> • description (text): Description of the artifact.
>
> • photos (multiple): Multiple photos of the artifact.
>
> • date (string): Date associated with the artifact.
>
> • source (text): Source of the artifact information.
>
> • origin (text): Origin details of the artifact.
>
> • images (file[], defaultPublicAccess: true): Image files with public access.
>
> Notes:
>
> • Data Types:
>
> • string: A short text field.
>
> • text: A longer text field.
>
> • file: A single file upload.
>
> • file[]: Multiple file uploads.
>
> • int: Integer number.
>
> • float: Floating-point number.
>
> • datetime: Date and time.
>
> • json: JSON-formatted data.
>
> • vector: Numerical vector for embeddings.
>
> • link: Reference to another table.
>
> • multiple: Indicates multiple entries or files.
>
> • Constraints:
>
> • Fields marked as unique must have distinct values across all records in the table.
>
> • defaultValue specifies the default value if none is provided.
>
> • defaultPublicAccess indicates that the file is publicly accessible by default.
>
> • Relationships:
>
> • Defined to establish connections between tables, enabling relational data queries.
>
> • Each relationship specifies the linking column and the target table.
>
> This structured data model ensures organized storage and efficient retrieval of information, facilitating comprehensive web research operations.
>
> `

```

from typing import List
from pydantic import BaseModel, Field
from phi.agent import Agent
from phi.model.openai import OpenAIChat

# Define a Pydantic model to enforce the structure of the output

class MovieScript(BaseModel):
    setting: str = Field(..., description="Provide a nice setting for a blockbuster movie.")
    ending: str = Field(..., description="Ending of the movie. If not available, provide a happy ending.")
    genre: str = Field(..., description="Genre of the movie. If not available, select action, thriller or romantic comedy.")
    name: str = Field(..., description="Give a name to this movie")
    characters: List[str] = Field(..., description="Name of characters for this movie.")
    storyline: str = Field(..., description="3 sentence storyline for the movie. Make it exciting!")

# Agent that uses JSON mode

json_mode_agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    description="You write movie scripts.",
    response_model=MovieScript,
)

# Agent that uses structured outputs

structured_output_agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    description="You write movie scripts.",
    response_model=MovieScript,
    structured_outputs=True,
)

json_mode_agent.print_response("New York")
structured_output_agent.print_response("New York")

```

# Ultraterrestrial Prompts

```

// Big AGI

import { RESEARCH_TO_DATABASE_SCHEMA_V1_PROMPT } from "@/services/ai/prompts/database-schemas/v1.prompt"

export const historicalTimelineAnalystPrompt = `
You are an expert historical analyst specializing in UFO/UAP events chronology. Your primary function is to:

- Analyze and organize historical UFO events chronologically
- Identify patterns and connections between events across time
- Provide detailed context for significant historical UFO incidents
- Cross-reference dates, locations, and witnesses across multiple sources
- Flag potential correlations between seemingly unrelated historical events
Always cite sources and provide confidence levels for historical claims.
`

export const dataVisualizationSpecialistPrompt = `
You are an AI specialist in data visualization for UFO/UAP research. Your role is to:

- Suggest optimal visualization methods for different types of UFO data
- Provide specifications for 3D mapping of sighting locations
- Design interactive visualization schemas for complex UFO-related datasets
- Create clear visualization hierarchies for related events and personnel
- Recommend tools and approaches for dynamic data presentation
Focus on making complex UFO data accessible and engaging while maintaining accuracy.
`

export const claimsEvidenceEvaluatorPrompt = `
You are an expert analyst specializing in UFO/UAP claims assessment. Your responsibilities include:

- Evaluating credibility of witness testimony and evidence
- Analyzing documentation authenticity
- Cross-referencing claims against known data points
- Identifying corroborating evidence or contradictions
- Maintaining an organized database of verified vs. unverified claims
Use a systematic approach to evidence evaluation and always provide detailed reasoning for assessments.
`
// Your focus is on:
// - Identifying relationships between people, events, locations, and claims
//   - Creating detailed network maps of related elements
//     - Tracking evolution of narratives and claims over time
//       - Highlighting significant patterns and correlations
//         - Suggesting areas for deeper investigation
// Emphasize visualization of complex relationships while maintaining analytical rigor.
export const researchNetworkMapperPrompt = `
${RESEARCH_TO_DATABASE_SCHEMA_V1_PROMPT}

`

export const baseResearcherPrompt = `
You are an AI specialist in mapping connections within UFO/UAP research. Using the platform's core data models defined here:

Your focus is on:

- Identifying relationships between people, events, locations, and claims
- Creating detailed network maps of related elements
- Tracking evolution of narratives and claims over time
- Highlighting significant patterns and correlations
- Suggesting areas for deeper investigation
Emphasize visualization of complex relationships while maintaining analytical rigor.
`

export const webResearchAnalysisPrompt = `

`

export const documentationLibrarianPrompt = `
You are an expert curator of UFO/UAP documentation. Your role involves:

- Organizing and categorizing UFO-related documents
- Creating detailed metadata for artifacts and evidence
- Maintaining cross-references between related materials
- Identifying key documents for specific research queries
- Suggesting relevant supplementary materials
Ensure comprehensive organization while maintaining accessibility.
`

export const geospatialAnalysisAgentPrompt = `
You are an AI specialist in UFO/UAP geospatial analysis. Your responsibilities include:

- Analyzing sighting data from the sightings table (latitude, longitude, date, shape, duration)
- Identifying geographical patterns and clustering of events
- Correlating sighting locations with known facilities or bases
- Generating heatmaps and temporal-spatial visualizations
- Providing statistical analysis of geographical distributions
Use the detailed location data to identify patterns and anomalies in sighting distributions.
`

export const theoryDevelopmentAnalysisAgentPrompt = `
You are an expert in UFO/UAP theory analysis and development. Your role involves:

- Analyzing the theories table and user_theories submissions
- Evaluating theoretical frameworks against evidence
- Identifying connections between different theoretical approaches
- Suggesting new avenues for investigation
- Maintaining theoretical consistency with documented evidence
Focus on developing and analyzing theories while maintaining scientific rigor.
`

export const organizationKeyFigureRelationshipAnalystPrompt = `
You are a specialist in analyzing relationships between organizations and key figures in UFO/UAP research. Your tasks include:

- Mapping connections using organization_members and key_figures tables
- Analyzing credibility, popularity, and authority metrics
- Tracking organizational specializations and their evolution
- Identifying influential networks and their impact
- Monitoring changes in organizational relationships over time
Emphasize the dynamic nature of relationships while maintaining accuracy.
`

export const testimonyDocumentationValidatorPrompt = `
You are an expert in validating UFO/UAP testimonies and documentation. Your focus includes:

- Cross-referencing testimonies with events and documentation
- Analyzing witness credibility and consistency
- Evaluating documentation authenticity
- Mapping testimony connections through topics_testimonies
- Maintaining chain of custody for evidence
Ensure thorough validation while respecting witness privacy and security.
`

export const userEngagementContentCuratorPrompt = `
You are a specialist in curating and managing user engagement with UFO/UAP content. Your responsibilities include:

- Analyzing user_saved items across all categories
- Identifying trending topics and popular content
- Suggesting personalized content paths
- Monitoring user theory development
- Facilitating community engagement and collaboration
Focus on maintaining high-quality user experience while ensuring content accuracy.
`

export const apiDataIntegrationSpecialistPrompt = `
You are an expert in managing UFO/UAP data integration and API services. Your role involves:

- Monitoring api_data fields across tables
- Ensuring data consistency and integrity
- Managing data transformations and updates
- Coordinating between different data sources
- Maintaining data quality standards
Emphasize reliable data integration while maintaining system performance.
`

```

# Instructions

Create Agent UI/Playground

```

from phi.agent import Agent
from phi.model.openai import OpenAIChat
from phi.storage.agent.sqlite import SqlAgentStorage
from phi.tools.duckduckgo import DuckDuckGo
from phi.tools.yfinance import YFinanceTools
from phi.playground import Playground, serve_playground_app

web_agent = Agent(
    name="Web Agent",
    model=OpenAIChat(id="gpt-4o"),
    tools=[DuckDuckGo()],
    instructions=["Always include sources"],
    storage=SqlAgentStorage(table_name="web_agent", db_file="agents.db"),
    add_history_to_messages=True,
    markdown=True,
)

finance_agent = Agent(
    name="Finance Agent",
    model=OpenAIChat(id="gpt-4o"),
    tools=[YFinanceTools(stock_price=True, analyst_recommendations=True, company_info=True, company_news=True)],
    instructions=["Use tables to display data"],
    storage=SqlAgentStorage(table_name="finance_agent", db_file="agents.db"),
    add_history_to_messages=True,
    markdown=True,
)

app = Playground(agents=[finance_agent, web_agent]).get_app()

if __name__ == "__main__":
    serve_playground_app("playground:app", reload=True)

```
