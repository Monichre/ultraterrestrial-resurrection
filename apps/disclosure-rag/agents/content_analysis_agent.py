import json
import logging
import os
from typing import Dict, Any, Optional, List, Union
import time

from agno.agent import Agent
from agno.models.anthropic import AnthropicChat
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from openai import OpenAI

# Import research prompt 
from research.research_prompt import research_prompt

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class ContentAnalysisAgent:
    """
    Agent for analyzing content using structured research methodology.
    Supports multiple LLM providers for comprehensive analysis.
    """
    
    def __init__(self, storage_path="tmp/content_analysis.db", vector_store_id=None):
        """
        Initialize the ContentAnalysisAgent with multiple LLM providers.
        
        Args:
            storage_path: Path to SQLite storage for conversation history
            vector_store_id: Optional ID of vector store for file search
        """
        self.claude_model = AnthropicChat(id="claude-3-5-sonnet")
        self.openai_model = OpenAIChat(id="gpt-4o")
        self.storage_path = storage_path
        self.vector_store_id = vector_store_id
        
        # Initialize OpenAI client for Assistants API
        self.openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        
        # Get Assistant ID from environment variable or create a new assistant
        self.assistant_id = os.environ.get("DISCLOSURE_ASSISTANT_ID")
        if not self.assistant_id:
            logger.warning("DISCLOSURE_ASSISTANT_ID not found. Creating a new assistant.")
            self.assistant_id = self._create_assistant()
        
        # Initialize traditional agents
        self.claude_agent = self._create_claude_agent()
        self.openai_agent = self._create_openai_agent()
        
    def _create_assistant(self) -> str:
        """
        Create a new OpenAI Assistant for content analysis.
        
        Returns:
            The ID of the created assistant
        """
        try:
            logger.info("Creating new OpenAI Assistant for content analysis")
            
            # Create the assistant with tools
            assistant = self.openai_client.beta.assistants.create(
                name="Disclosure Analysis Assistant",
                instructions="""You are a Research Analyst specialized in UFO/UAP content analysis.
                Follow these core principles:
                1. PERSISTENCE: Keep working until the user's query is completely resolved
                2. TOOL CALLING: When unsure, use available tools; do NOT guess
                3. PLANNING: Plan extensively before each analysis step and reflect afterward
                
                Organize information into clear categories: topics, personnel, events, and organizations.
                Provide relevance and credibility assessments for identified entities.
                Be factual and precise, avoiding speculative claims while noting claimed evidence.
                
                When analyzing content:
                1. First identify key entities, dates, and claims
                2. Research connections between entities using file search when available
                3. Evaluate credibility of sources and claims
                4. Summarize findings in structured format
                """,
                model="gpt-4o",
                tools=[
                    {"type": "code_interpreter"},
                    {"type": "file_search"}
                ],
                response_format={"type": "text"}
            )
            
            logger.info(f"Created assistant with ID: {assistant.id}")
            return assistant.id
            
        except Exception as e:
            logger.error(f"Failed to create assistant: {e}")
            # Fallback to default behavior if assistant creation fails
            return None
    
    def _create_claude_agent(self) -> Agent:
        """Create agent using Anthropic's Claude model."""
        
        claude_agent = Agent(
            name="Claude Research Analyst",
            model=self.claude_model,
            instructions=[
                "You are a Research Analyst specialized in UFO/UAP content analysis.",
                "Your task is to analyze transcripts and documents according to the structured research methodology.",
                "Always organize information into clear categories: topics, personnel, events, organizations.",
                "Provide relevance and credibility assessments for identified entities.",
                "Be factual and precise, avoiding speculative claims while noting claimed evidence."
            ],
            storage=SqliteStorage(
                table_name="claude_analysis", 
                db_file=self.storage_path
            ),
            system_prompt=research_prompt,
            add_datetime_to_instructions=True,
            add_history_to_messages=True,
            markdown=True
        )
        
        return claude_agent
    
    def _create_openai_agent(self) -> Agent:
        """Create agent using OpenAI's GPT-4 model."""
        
        openai_agent = Agent(
            name="GPT Research Analyst",
            model=self.openai_model,
            instructions=[
                "You are a Research Analyst specialized in UFO/UAP content analysis.",
                "Your task is to analyze transcripts and documents according to the structured research methodology.",
                "Always organize information into clear categories: topics, personnel, events, organizations.",
                "Provide relevance and credibility assessments for identified entities.",
                "Be factual and precise, avoiding speculative claims while noting claimed evidence."
            ],
            storage=SqliteStorage(
                table_name="openai_analysis", 
                db_file=self.storage_path
            ),
            system_prompt=research_prompt,
            add_datetime_to_instructions=True,
            add_history_to_messages=True,
            markdown=True
        )
        
        return openai_agent
    
    async def analyze_content(self, content: str, use_multiple_models: bool = False, use_assistant: bool = True) -> Dict[str, Any]:
        """
        Analyze content using structured research methodology.
        
        Args:
            content: The text content to analyze
            use_multiple_models: Whether to use multiple models for analysis
            use_assistant: Whether to use OpenAI Assistant for analysis
            
        Returns:
            Structured analysis results
        """
        try:
            results = {}
            
            # Use Claude as primary model (async)
            claude_prompt = f"Analyze the following content according to our research methodology. Provide structured output with clear sections for topics, personnel, events, and organizations:\n\n{content}"
            claude_analysis = await self.claude_agent.generate_response(claude_prompt)
            results["claude_analysis"] = claude_analysis
            
            # Use OpenAI Assistant API if requested
            if use_assistant and self.assistant_id:
                try:
                    assistant_analysis = self._run_assistant_analysis(content)
                    results["assistant_analysis"] = assistant_analysis
                    
                    # If we have both analyses, combine them
                    if "claude_analysis" in results:
                        combination_prompt = f"""Synthesize these two analyses into a comprehensive research report. 
                        Incorporate the strengths of both analyses and resolve any contradictions.
                        
                        Analysis 1 (Claude): {claude_analysis}
                        
                        Analysis 2 (OpenAI Assistant): {assistant_analysis}
                        """
                        
                        combined_analysis = await self.claude_agent.generate_response(combination_prompt)
                        results["combined_analysis"] = combined_analysis
                    else:
                        results["combined_analysis"] = assistant_analysis
                except Exception as e:
                    logger.error(f"Error using OpenAI Assistant: {e}")
                    results["assistant_error"] = str(e)
                    results["combined_analysis"] = claude_analysis  # Fall back to Claude analysis
            
            # Optionally use traditional OpenAI model
            if use_multiple_models and not use_assistant:
                openai_prompt = f"Analyze the following content according to our research methodology. Provide structured output with clear sections for topics, personnel, events, and organizations:\n\n{content}"
                openai_analysis = await self.openai_agent.generate_response(openai_prompt)
                results["openai_analysis"] = openai_analysis
                
                # Combine analyses from both models
                combination_prompt = f"""Synthesize these two analyses into a comprehensive research report. 
                Incorporate the strengths of both analyses and resolve any contradictions.
                
                Analysis 1: {claude_analysis}
                
                Analysis 2: {openai_analysis}
                """
                
                combined_analysis = await self.claude_agent.generate_response(combination_prompt)
                results["combined_analysis"] = combined_analysis
            elif not use_assistant:
                # Default to Claude analysis if no assistant and not using multiple models
                results["combined_analysis"] = claude_analysis
            
            # Generate structured output from the combined analysis
            if "combined_analysis" in results:
                structured_data = await self.generate_structured_output(results["combined_analysis"])
                results["structured_data"] = structured_data
            
            return {
                "status": "success",
                "results": results
            }
            
        except Exception as e:
            logger.error(f"Error analyzing content: {e}")
            return {
                "status": "error",
                "error": str(e)
            }
    
    def _run_assistant_analysis(self, content: str) -> str:
        """
        Run analysis using OpenAI Assistant API with proper handling of threads and runs.
        
        Args:
            content: The text content to analyze
            
        Returns:
            Analysis from the assistant
        """
        try:
            logger.info("Starting OpenAI Assistant analysis")
            
            # Create a new thread
            thread = self.openai_client.beta.threads.create()
            
            # Add content as a message to the thread
            self.openai_client.beta.threads.messages.create(
                thread_id=thread.id,
                role="user",
                content=f"Analyze the following content according to our research methodology:\n\n{content}"
            )
            
            # Create run parameters with custom instructions
            run_params = {
                "thread_id": thread.id,
                "assistant_id": self.assistant_id,
                "instructions": "Organize your analysis into clear sections for topics, personnel, events, and organizations. Provide detailed research findings using all available tools and evidence."
            }
            
            # Add vector store if available
            if self.vector_store_id:
                run_params["tool_resources"] = {
                    "file_search": {"vector_store_ids": [self.vector_store_id]}
                }
            
            # Execute the run and wait for completion
            run = self.openai_client.beta.threads.runs.create(**run_params)
            
            # Poll for completion
            run = self._wait_on_run(thread.id, run.id)
            
            if run.status == "completed":
                # Retrieve messages
                messages = self.openai_client.beta.threads.messages.list(
                    thread_id=thread.id,
                    order="asc"  # Chronological order
                )
                
                # Extract assistant's messages after our query
                assistant_responses = []
                user_message_seen = False
                
                for msg in messages.data:
                    # Mark when we've seen the user's query
                    if msg.role == "user" and user_message_seen == False:
                        user_message_seen = True
                        continue
                    
                    # Collect assistant's responses that came after user's query
                    if user_message_seen and msg.role == "assistant":
                        for content_item in msg.content:
                            if content_item.type == "text":
                                assistant_responses.append(content_item.text.value)
                
                # Join all responses
                return "\n".join(assistant_responses)
            else:
                error_msg = f"Assistant run failed with status: {run.status}"
                if hasattr(run, "last_error") and run.last_error:
                    error_msg += f" - {run.last_error.message}"
                logger.error(error_msg)
                return f"Analysis failed: {error_msg}"
                
        except Exception as e:
            logger.error(f"Error in assistant analysis: {e}")
            return f"Error: {str(e)}"
    
    def _wait_on_run(self, thread_id: str, run_id: str) -> Any:
        """
        Poll the status of a run until it completes.
        
        Args:
            thread_id: The thread ID
            run_id: The run ID
            
        Returns:
            The completed run object
        """
        while True:
            run = self.openai_client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run_id
            )
            
            if run.status in ["completed", "failed", "cancelled", "expired"]:
                return run
                
            # Handle tool calls if required
            if run.status == "requires_action":
                self._handle_tool_calls(thread_id, run_id, run)
            
            # Wait before polling again
            time.sleep(1)
    
    def _handle_tool_calls(self, thread_id: str, run_id: str, run: Any) -> None:
        """
        Handle any required tool actions during a run.
        
        Args:
            thread_id: The thread ID
            run_id: The run ID
            run: The run object requiring action
        """
        if run.required_action and run.required_action.type == "submit_tool_outputs":
            tool_outputs = []
            
            for tool_call in run.required_action.submit_tool_outputs.tool_calls:
                tool_call_id = tool_call.id
                function_name = tool_call.function.name
                arguments = json.loads(tool_call.function.arguments)
                
                # Handle custom functions here if needed
                # For now, just log the function call
                logger.info(f"Tool call: {function_name} with args: {arguments}")
                
                # Tool output would go here if we had custom functions
                tool_outputs.append({
                    "tool_call_id": tool_call_id,
                    "output": json.dumps({"status": "success", "message": "Tool call processed"})
                })
            
            # Submit tool outputs
            self.openai_client.beta.threads.runs.submit_tool_outputs(
                thread_id=thread_id,
                run_id=run_id,
                tool_outputs=tool_outputs
            )
    
    async def generate_structured_output(self, analysis_text: str) -> Dict[str, Any]:
        """
        Generate structured JSON output from text analysis.
        
        Args:
            analysis_text: The analysis text to structure
            
        Returns:
            Structured JSON output
        """
        try:
            # Use Claude for structured extraction
            extraction_prompt = f"""
            From the following analysis, extract structured information in JSON format with these categories:
            
            1. topics: Array of topic objects with name, relevance, and description
            2. personnel: Array of person objects with name, role, credibility, and details
            3. events: Array of event objects with name, date, location, and description
            4. organizations: Array of organization objects with name, type, and description
            
            Only return valid JSON without any explanation or additional text:
            
            {analysis_text}
            """
            
            extraction_response = await self.claude_agent.generate_response(extraction_prompt)
            
            # Try to parse JSON from response
            try:
                # First try to parse directly
                structured_data = json.loads(extraction_response)
                return structured_data
            except json.JSONDecodeError:
                # Try to extract JSON block from markdown
                import re
                json_match = re.search(r'```json\n(.*?)\n```', extraction_response, re.DOTALL)
                if json_match:
                    json_str = json_match.group(1)
                    try:
                        structured_data = json.loads(json_str)
                        return structured_data
                    except json.JSONDecodeError:
                        logger.error(f"Failed to parse JSON from code block")
            
            # Fallback - return empty structure
            logger.error(f"Could not extract valid JSON from response")
            return {
                "topics": [],
                "personnel": [],
                "events": [],
                "organizations": []
            }
            
        except Exception as e:
            logger.error(f"Error generating structured output: {e}")
            return {
                "topics": [],
                "personnel": [],
                "events": [],
                "organizations": []
            }
            
    async def upload_file_to_vector_store(self, file_path: str, vector_store_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Upload a file to a vector store for use with Assistant file search.
        
        Args:
            file_path: Path to the file to upload
            vector_store_id: Optional ID of an existing vector store
            
        Returns:
            Status dict with file and vector store information
        """
        try:
            store_id = vector_store_id or self.vector_store_id
            
            # Create a new vector store if needed
            if not store_id:
                logger.info("Creating new vector store")
                store = self.openai_client.beta.vector_stores.create(
                    name="disclosure-research-kb"
                )
                store_id = store.id
                self.vector_store_id = store_id
            
            # Upload file to OpenAI
            logger.info(f"Uploading file: {file_path}")
            with open(file_path, "rb") as f:
                file = self.openai_client.files.create(
                    file=f,
                    purpose="assistants"
                )
            
            # Add file to vector store
            logger.info(f"Adding file to vector store: {store_id}")
            file_upload = self.openai_client.beta.vector_stores.files.create_and_poll(
                vector_store_id=store_id,
                file_id=file.id
            )
            
            return {
                "status": "success",
                "vector_store_id": store_id,
                "file_id": file.id,
                "details": file_upload
            }
            
        except Exception as e:
            logger.error(f"Error uploading file to vector store: {e}")
            return {
                "status": "error",
                "error": str(e)
            }