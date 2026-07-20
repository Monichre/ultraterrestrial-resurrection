import json
import os
from textwrap import dedent
from typing import Any, Dict, Optional

from anthropic import Anthropic
from dotenv import load_dotenv
from groq import Groq
from openai import OpenAI
from pydantic import BaseModel

from lib.prompt_loader import get_prompt
from processing.rag_prompt_pipeline import RagPromptPipeline
from rich.console import Console
from rich.panel import Panel
from rich.style import Style
from rich.table import Table

# Load environment variables when module is imported
load_dotenv()

openai_api_key = os.environ.get("OPENAI_API_KEY")
anthropic_api_key = os.environ.get("ANTHROPIC_API_KEY")
deepseek_api_key = os.environ.get("DEEPSEEK_API_KEY")
groq_api_key = os.environ.get("GROQ_API_KEY")

console = Console()

research_prompt = get_prompt("disclosure.research")
ner_prompt = get_prompt("disclosure.ner")

conversation_history = [
    {"role": "system", "content": research_prompt}
]


class AssistantResponse(BaseModel):
    assistant_reply: str


class ContentAnalysisEngine:
    def __init__(self):
        self.openai_client = OpenAI(api_key=openai_api_key)
        self.anthropic_client = Anthropic(api_key=anthropic_api_key)
        self.deepseek_client_groq = Groq(
            api_key=os.environ.get("GROQ_API_KEY"))
        self.deepseek_client_openai = OpenAI(
            api_key=os.getenv("DEEPSEEK_API_KEY"),
            base_url="https://api.deepseek.com"
        )  # Configure for DeepSeek API

    def get_claude_analysis(self, transcript):
        """Get analysis from Claude"""
        try:
            if not anthropic_api_key:
                print("❌ ANTHROPIC_API_KEY not found in environment variables")
                return None

            message = self.anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                system=research_prompt,
                messages=[
                    {
                        "role": "user",
                        "content": transcript
                    }
                ]
            )
            # Extract the text content from the message
            return message.content[0].text
        except Exception as e:
            print(f"Claude Analysis Error: {e}")
            return None

    def get_openai_analysis(self, transcript):
        stream = self.deepseek_client_openai.chat.completions.create(
            model="deepseek-reasoner",
            messages=[
                {
                    "role": "system",
                    "content": dedent("""
                    You are an AI research assistant focused on gathering, organizing, analyzing and documenting the resources you are presented with to assist in evaluating their introduction into the platform knowledge layer

You will help users and other researchers investigate, understand, and analyze the UFO phenomeon by organizing and documenting all the information presented to you according to the following structured research methodology.

Your responses should always be organized as precisely as possible according the this strict architecture and be ready for processing and insertion into the platform database.
                    """)
                },
                {
                    "role": "user",
                    "content": transcript
                },

            ],
            max_completion_tokens=8000,
            stream=True,
            # response_format={"type": "json_object"}
        )
        return stream.choices[0].message

    def get_deepseek_groq_analysis(self, transcript):

        completion = self.deepseek_client_groq.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",

            messages=[
                {
                    "role": "system",
                    "content": dedent("""
                    You are an AI research assistant focused on gathering, organizing, analyzing and documenting the resources you are presented with to assist in evaluating their introduction into the platform knowledge layer

You will help users and other researchers investigate, understand, and analyze the UFO phenomeon by organizing and documenting all the information presented to you according to the following structured research methodology.

Your responses should always be organized as precisely as possible according the this strict architecture and be ready for processing and insertion into the platform database.
                    """)
                },
                {
                    "role": "user",
                    "content": transcript
                },
                {
                    "role": "assistant",
                    "content": ""
                }
            ],
            temperature=0.6,
            max_completion_tokens=4096,
            top_p=0.95,
            stream=True,
            # response_format={"type": "json_object"}
            stop=None,
        )

        return completion.choices[0].message

    def stream_openai_response(self, transcript):
        stream = self.deepseek_client_openai.chat.completions.create(
            model="deepseek-reasoner",
            messages=conversation_history,
            max_completion_tokens=8000,
            stream=True,

        )

        console.print("\nThinking...", style="bold yellow")
        return stream.choices[0].message
        # reasoning_content = ""
        # final_content = ""

        # for chunk in stream:
        #     print(chunk.choices[0].delta.content or "", end="")
        #     if chunk.choices[0].delta.content:
        #         content_chunk = chunk.choices[0].delta.content
        #         full_content += content_chunk
        #         print(content_chunk, end="")

        #         if chunk.choices[0].delta.reasoning_content:
        #             reasoning_content += chunk.choices[0].delta.reasoning_content
        #         elif chunk.choices[0].delta.content:
        #             if not final_content:  # When we start getting content, show reasoning first
        #                 if reasoning_content:
        #                     console.print("\nReasoning:", style="bold yellow")
        #                     console.print(
        #                         Panel(reasoning_content, border_style="yellow"))
        #                     console.print("\nAssistant> ",
        #                                 style="bold blue", end="")
        #             final_content += chunk.choices[0].delta.content
        #             console.print(chunk.choices[0].delta.content, end="")

        # try:
        #     parsed_response = json.loads(final_content)

        #     if "assistant_reply" not in parsed_response:
        #         parsed_response["assistant_reply"] = ""
        #     conversation_history.append({
        #             "role": "assistant",
        #             "content": final_content  # Store the full JSON response string
        #     })

        #     response_obj = AssistantResponse(**parsed_response)

        #     # Store the complete JSON response in conversation history
        #     conversation_history.append({
        #         "role": "assistant",
        #         "content": final_content  # Store the full JSON response string
        #     })

        #     return response_obj

        # except json.JSONDecodeError:
        #     error_msg = "Failed to parse JSON response from assistant"
        #     console.print(f"[red]✗[/red] {error_msg}", style="red")
        #     return AssistantResponse(
        #         assistant_reply=error_msg,
        #         files_to_create=[]
        #     )

    def analyze_content(self, content_text):
        """Analyze transcript text using both OpenAI and Claude"""
        try:

            # openai_analysis = self.get_openai_analysis(content_text)
            # deepseek_analysis = self.get_openai_analysis(content_text)
            claude_analysis = self.get_claude_analysis(content_text)

            analysis_section = "=== APPLIED RESEARCH METHODOLOGY CONTENT ANALYSIS ===\n\n"

            # if deepseek_analysis:
            #     analysis_section += "DeepSeek Analysis:\n"
            #     analysis_section += deepseek_analysis
            #     analysis_section += "\n\n"

            # TO DO: Prime a subagent with information to search existing database records

            # if openai_analysis:
            #     analysis_section += "OpenAI Analysis:\n"
            #     analysis_section += openai_analysis
            #     analysis_section += "\n\n"

            if claude_analysis:
                analysis_section += "Research Agent Analysis:\n"
                analysis_section += claude_analysis
                analysis_section += "\n\n"

            analysis_section += "=== ORIGINAL CONTENT ===\n\n"

            return analysis_section

        except Exception as e:
            print(f"Analysis Error: {e}")
            return None

    def process_for_rag(
        self,
        content_text: str,
        *,
        provenance: str = "",
        filename_hint: str = "",
        content_type_override: Optional[str] = None,
        skip_ner: bool = False,
        run_ner: bool = True,
    ) -> Dict[str, Any]:
        """
        Run the registry-backed RAG/NER document pipeline.

        Returns structured classification, analysis, Evidence chunks, NER, and
        embeddable_texts suitable for vector indexing (Inference excluded).
        """
        pipeline = RagPromptPipeline(run_ner=run_ner)
        return pipeline.process(
            content_text,
            provenance=provenance,
            filename_hint=filename_hint,
            content_type_override=content_type_override,
            skip_ner=skip_ner,
        ).to_dict()

    def analyze_content_with_rag_pipeline(
        self,
        content_text: str,
        *,
        provenance: str = "",
        filename_hint: str = "",
        include_legacy_summary: bool = True,
        skip_ner: bool = False,
    ) -> Dict[str, Any]:
        """Legacy narrative summary + structured RAG pipeline artifact."""
        rag = self.process_for_rag(
            content_text,
            provenance=provenance,
            filename_hint=filename_hint,
            skip_ner=skip_ner,
        )
        legacy = None
        if include_legacy_summary:
            legacy = self.analyze_content(content_text)
        return {
            "legacy_analysis": legacy,
            "rag_pipeline": rag,
            "embeddable_texts": rag.get("embeddable_texts") or [],
            "status": rag.get("status"),
        }
