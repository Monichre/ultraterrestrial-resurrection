# Disclosure Assistant Chat Interface

This implementation provides a local chat interface for interacting with the Disclosure Assistant using Agno Playground, with direct access to the local knowledge base.

## Features

- Interactive chat interface via Agno Playground
- Direct access to Disclosure Assistant's analysis capabilities
- Support for analyzing text content and uploaded files
- Cross-reference analysis tool for enhanced insights
- Browse and read local knowledge base files

## Setup

1. Ensure you have the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up your environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_ASSISTANT_ID`: ID of your disclosure assistant (optional)
   - `OPENAI_VECTOR_STORE_ID`: ID of your vector store for knowledge base (optional)

3. Run the chat interface:
   ```
   python disclosure_chat.py
   ```

## Available Tools

The chat interface exposes the following tools:

### 1. Content Analysis

Analyze any text content using the Disclosure Assistant:

```
analyze_content(content: str, custom_instructions: Optional[str])
```

### 2. Cross-Reference Analysis

Enhance an existing analysis with data from the knowledge base:

```
cross_reference_analysis(original_analysis: str, custom_instructions: Optional[str])
```

### 3. Browse Knowledge Base Files

List files in a specific directory of the knowledge base:

```
list_knowledge_base_files(directory: str, pattern: Optional[str])
```

Key directories include:
- `transcripts` - UFO/UAP testimonies and interviews
- `case_files` - Detailed information on specific UFO/UAP cases
- `vector-store-files` - Processed documents for vector search

### 4. Read Knowledge Base Files

Read the content of specific knowledge base files:

```
read_knowledge_base_file(file_path: str)
```

## Example Workflows

### Analyzing New Content

1. Paste text directly into the chat or upload a file
2. The assistant will use the Disclosure Assistant to analyze the content

### Researching Specific Cases

1. Use `list_knowledge_base_files` to browse available case files
2. Use `read_knowledge_base_file` to read specific files of interest
3. Use `analyze_content` to get insights on the content

### Cross-Referencing Information

1. Analyze content to get initial insights
2. Use `cross_reference_analysis` to enhance the analysis with data from the knowledge base

## Extending

You can extend this implementation by:

1. Adding more specialized tools to the Agno Assistant
2. Enhancing the file processing capabilities to handle more formats
3. Integrating other assistants from the project
4. Adding visualization tools for analysis results 