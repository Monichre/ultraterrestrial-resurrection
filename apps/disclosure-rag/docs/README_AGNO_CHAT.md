# Disclosure Assistant Chat with Agno

This implementation provides a simple chat interface for interacting with the Disclosure Assistant using Agno Playground.

## Features

- Interactive chat interface via Agno Playground
- Direct access to Disclosure Assistant capabilities
- Support for analyzing text content
- Support for analyzing uploaded files
- Cross-reference analysis tool for enhanced insights

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
   python agno_disclosure_chat.py
   ```
   
   Or with file upload support:
   ```
   python agno_disclosure_chat_with_files.py
   ```

## Usage

- **Analyze Content**: Simply paste text into the chat and the assistant will analyze it using the Disclosure Assistant.
- **Upload Files**: Upload text files to have them analyzed automatically.
- **Cross-Reference Analysis**: Send an existing analysis to be enhanced with data from the knowledge base.

## Example Prompts

- "Analyze this testimony about UAP sightings: [paste testimony]"
- "Can you cross-reference this analysis with the knowledge base? [paste analysis]"
- "I'll upload a transcript file for you to analyze"

## Environment Setup

If you don't provide assistant or vector store IDs, the system will attempt to create a new assistant with default settings. For optimal results, create a specialized assistant in the OpenAI platform and provide its ID.

## Extending

You can extend this implementation by:

1. Adding more specialized tools to the Agno Assistant
2. Enhancing the file processing capabilities to handle more formats
3. Integrating other assistants from the project
4. Adding visualization tools for analysis results 