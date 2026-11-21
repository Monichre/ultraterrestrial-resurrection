# Media Trend Analysis Agent

- ID: BDcW49EEOkNEWUxzT5zIsa
- Name: Media Trend Analysis Agent
- Type: Notebook

Summary
- Trend analysis agent using Agno with ExaTools (keyword search with start date) and FirecrawlTools (scrape only when sparse)
- Guidance on environment variables, dependencies, prompting, error handling, and optional CLI

Original Notebook Content (cleaned)

````markdown
## Overview

Below is a cleaned-up, ready-to-run version of your media trend analysis agent script, with practical enhancements:
* Dependency installation snippet
* Environment variable guidance
* Defensive checks and minor robustness improvements
* Clear function docstrings and comments
* Example prompts and usage patterns
* Notes on model and tool configuration

## Prerequisites

* Python 3.10+
* Accounts/keys for:
    * OpenAI API (for the model)
    * Exa API (for ExaTools)
    * Firecrawl API (for FirecrawlTools)

Set environment variables before running:
* OPENAI_API_KEY
* EXA_API_KEY
* FIRECRAWL_API_KEY

Install dependencies:
    pip install openai exa-py agno firecrawl

## Full Script

```python
from datetime import datetime, timedelta
from textwrap import dedent
import os
import sys

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.exa import ExaTools
from agno.tools.firecrawl import FirecrawlTools


def require_env(var_name: str) -> str:
    """
    Ensure a required environment variable is present; exit cleanly with a message otherwise.
    """
    val = os.getenv(var_name)
    if not val:
        print(f"[ERROR] Missing required environment variable: {var_name}")
        sys.exit(1)
    return val


def calculate_start_date(days: int) -> str:
    """
    Calculate start date ISO string (YYYY-MM-DD) based on number of days.
    """
    if days < 0:
        raise ValueError("days must be non-negative")
    start_date = datetime.now() - timedelta(days=days)
    return start_date.strftime("%Y-%m-%d")


def build_agent(
    lookback_days: int = 30,
    model_id: str = "gpt-4o",
    scrape: bool = True,
) -> Agent:
    """
    Construct the media trend analysis agent with Exa search and Firecrawl scraping tools.
    - lookback_days: timeframe for Exa search start date
    - model_id: OpenAI model id, e.g., 'gpt-4o'
    - scrape: whether Firecrawl should scrape content for sparse sources
    """
    # Validate environment variables early
    require_env("OPENAI_API_KEY")
    require_env("EXA_API_KEY")
    require_env("FIRECRAWL_API_KEY")

    start_date = calculate_start_date(lookback_days)

    return Agent(
        model=OpenAIChat(id=model_id),
        tools=[
            ExaTools(start_published_date=start_date, type="keyword"),
            FirecrawlTools(scrape=scrape),
        ],
        description=dedent("""\
            You are an expert media trend analyst specializing in:
            - Identifying emerging trends across news and digital platforms
            - Recognizing pattern changes in media coverage
            - Providing actionable insights based on data
            - Forecasting potential future developments
        """),
        instructions=[
            "Analyze the provided topic according to the user's specifications:",
            "1. Use keywords to perform targeted searches",
            "2. Identify key influencers and authoritative sources",
            "3. Extract main themes and recurring patterns",
            "4. Provide actionable recommendations",
            "5. If sources are fewer than 2, only then scrape them using the Firecrawl tool (do not crawl broadly) and use them to generate the report",
            "6. Growth rate should be in percentage; if not possible, omit the growth rate",
        ],
        expected_output=dedent("""\
        # Media Trend Analysis Report

        ## Executive Summary
        {High-level overview of findings and key metrics}

        ## Trend Analysis
        ### Volume Metrics
        Peak discussion periods: {dates}
        Growth rate: {percentage or dont show this}

        ## Source Analysis
        ### Top Sources
        {Source 1}

        {Source 2}

        ## Actionable Insights
        {Insight 1}
        Evidence: {data points}
        Recommended action: {action}

        ## Future Predictions
        {Prediction 1}
        Supporting evidence: {evidence}

        ## References
        {Detailed source list with links}
        """),
        markdown=True,
        show_tool_calls=True,
        add_datetime_to_instructions=True,
    )


def main():
    """
    Example usage of the media trend analysis agent.
    """
    agent = build_agent(
        lookback_days=30,
        model_id="gpt-4o",
        scrape=True,
    )

    # Example 1
    analysis_prompt = dedent("""\
        Analyze media trends for:
        Keywords: ai agents
        Sources: verge.com, linkedin.com, x.com
    """)
    print("\n=== Running Example 1: AI Agents ===\n")
    agent.print_response(analysis_prompt, stream=True)

    # Example 2
    crypto_prompt = dedent("""\
        Analyze media trends for:
        Keywords: cryptocurrency, bitcoin, ethereum
        Sources: coindesk.com, cointelegraph.com
    """)
    print("\n=== Running Example 2: Crypto ===\n")
    agent.print_response(crypto_prompt, stream=True)


if __name__ == "__main__":
    main()
```

## Notes and Recommendations
- gpt-4o is a strong default; consider gpt-4.1 or gpt-4o-mini tradeoffs.
- start_published_date is key to trend windows.
- Scrape only when sources are sparse to control cost and noise.
- Growth-rate computation should be data-backed or omitted.
````

