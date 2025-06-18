#!/usr/bin/env python3
"""
Disclosure Bot Chat Interface
Exclusive chat with OpenAI Assistant trained on UFO material
"""

import os
import json
import time
from typing import Optional, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv
import argparse

# Load environment
load_dotenv()

class DisclosureBotChat:
    """Direct chat interface with the Disclosure Bot OpenAI Assistant"""
    
    def __init__(self):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.assistant_id = os.environ.get("DISCLOSURE_ASSISTANT_ID")
        self.vector_store_id = os.environ.get("UFO_DATA_STORE_ID")
        self.thread_id = None
        
        if not self.assistant_id:
            raise ValueError("DISCLOSURE_ASSISTANT_ID not found in environment")
            
        print(f"🛸 Disclosure Bot Chat Interface")
        print(f"Assistant ID: {self.assistant_id}")
        print(f"Vector Store: {self.vector_store_id}")
        print("="*60)
    
    def create_thread(self) -> str:
        """Create a new conversation thread"""
        thread = self.client.beta.threads.create(
            tool_resources={
                "file_search": {
                    "vector_store_ids": [self.vector_store_id] if self.vector_store_id else []
                }
            }
        )
        self.thread_id = thread.id
        print(f"📡 New conversation thread created: {thread.id}")
        return thread.id
    
    def send_message(self, message: str, context: Optional[str] = None) -> str:
        """Send a message to the Disclosure Bot and get response"""
        if not self.thread_id:
            self.create_thread()
        
        # Add context if provided
        full_message = message
        if context:
            full_message = f"Context: {context}\\n\\nQuestion: {message}"
        
        # Send message
        self.client.beta.threads.messages.create(
            thread_id=self.thread_id,
            role="user",
            content=full_message
        )
        
        # Run the assistant
        run = self.client.beta.threads.runs.create(
            thread_id=self.thread_id,
            assistant_id=self.assistant_id,
            instructions="""You are the Disclosure Bot, an expert AI assistant trained exclusively on UFO/UAP research material. 
            You have deep knowledge of:
            - Government disclosure documents and testimonies
            - Historical UFO events and cases
            - Key personnel in UFO research
            - Organizations involved in UAP research
            - Technical analysis of UAP capabilities
            
            Provide detailed, evidence-based responses citing specific cases, documents, or testimonies when relevant.
            Maintain a serious, analytical tone while being accessible to researchers at all levels."""
        )
        
        # Wait for completion
        return self._wait_for_completion(run.id)
    
    def _wait_for_completion(self, run_id: str) -> str:
        """Wait for assistant response and handle tool calls"""
        while True:
            run = self.client.beta.threads.runs.retrieve(
                thread_id=self.thread_id,
                run_id=run_id
            )
            
            if run.status == "completed":
                break
            elif run.status == "failed":
                return f"❌ Error: {run.last_error.message if run.last_error else 'Unknown error'}"
            elif run.status == "requires_action":
                # Handle tool calls if needed
                self._handle_tool_calls(run)
            else:
                print("🤔 Thinking...", end="\\r")
                time.sleep(1)
        
        # Get the response
        messages = self.client.beta.threads.messages.list(
            thread_id=self.thread_id,
            order="desc",
            limit=1
        )
        
        if messages.data:
            response = messages.data[0].content[0].text.value
            return response
        else:
            return "❌ No response received"
    
    def _handle_tool_calls(self, run):
        """Handle any tool calls made by the assistant"""
        if run.required_action and run.required_action.submit_tool_outputs:
            tool_outputs = []
            
            for tool_call in run.required_action.submit_tool_outputs.tool_calls:
                if tool_call.type == "file_search":
                    # File search is handled automatically by OpenAI
                    continue
                else:
                    # Handle custom tools if any
                    tool_outputs.append({
                        "tool_call_id": tool_call.id,
                        "output": "Tool executed successfully"
                    })
            
            if tool_outputs:
                self.client.beta.threads.runs.submit_tool_outputs(
                    thread_id=self.thread_id,
                    run_id=run.id,
                    tool_outputs=tool_outputs
                )
    
    def interactive_chat(self):
        """Start interactive chat session"""
        print("\\n🛸 Welcome to Disclosure Bot Chat!")
        print("Type 'exit' to quit, 'new' for new thread, 'help' for commands\\n")
        
        while True:
            try:
                user_input = input("🔍 You: ").strip()
                
                if user_input.lower() in ['exit', 'quit', 'bye']:
                    print("\\n👋 Thank you for using Disclosure Bot!")
                    break
                
                if user_input.lower() == 'new':
                    self.create_thread()
                    print("✨ Started new conversation\\n")
                    continue
                
                if user_input.lower() == 'help':
                    self._show_help()
                    continue
                
                if user_input.lower().startswith('upload '):
                    file_path = user_input[7:].strip()
                    self._upload_file(file_path)
                    continue
                
                if not user_input:
                    continue
                
                print("\\n🛸 Disclosure Bot is analyzing...", end="", flush=True)
                response = self.send_message(user_input)
                print("\\r" + " "*40 + "\\r", end="")  # Clear thinking message
                
                print(f"🛸 Disclosure Bot:\\n{response}\\n")
                
            except KeyboardInterrupt:
                print("\\n\\n👋 Chat interrupted. Goodbye!")
                break
            except Exception as e:
                print(f"\\n❌ Error: {e}\\n")
    
    def _show_help(self):
        """Show available commands"""
        help_text = """
🛸 Disclosure Bot Commands:
        
• exit/quit/bye - End the chat session
• new - Start a new conversation thread
• upload <file_path> - Upload a document to analyze
• help - Show this help message

🔍 Example Questions:
• "What does the Pentagon's UAP report say about underwater sightings?"
• "Tell me about Luis Elizondo's role in AATIP"
• "What are the key findings from the Wilson-Davis memo?"
• "Analyze the Tic Tac UAP incident from the Nimitz encounter"
• "What evidence exists for crash retrieval programs?"

💡 Tips:
• Be specific in your questions for detailed responses
• Ask for citations when you need source verification
• Use follow-up questions to dive deeper into topics
        """
        print(help_text)
    
    def _upload_file(self, file_path: str):
        """Upload a file for the assistant to analyze"""
        if not os.path.exists(file_path):
            print(f"❌ File not found: {file_path}")
            return
        
        try:
            # Upload file to OpenAI
            with open(file_path, "rb") as file:
                uploaded_file = self.client.files.create(
                    file=file,
                    purpose="assistants"
                )
            
            # Add to vector store if available
            if self.vector_store_id:
                self.client.beta.vector_stores.files.create(
                    vector_store_id=self.vector_store_id,
                    file_id=uploaded_file.id
                )
                print(f"✅ File uploaded and added to knowledge base: {uploaded_file.filename}")
            else:
                print(f"✅ File uploaded: {uploaded_file.filename}")
                
        except Exception as e:
            print(f"❌ Upload failed: {e}")
    
    def batch_questions(self, questions_file: str):
        """Process multiple questions from a file"""
        if not os.path.exists(questions_file):
            print(f"❌ Questions file not found: {questions_file}")
            return
        
        with open(questions_file, 'r') as f:
            questions = [line.strip() for line in f if line.strip()]
        
        results = []
        for i, question in enumerate(questions, 1):
            print(f"\\n📝 Question {i}/{len(questions)}: {question}")
            response = self.send_message(question)
            results.append({
                "question": question,
                "response": response
            })
            print(f"🛸 Response: {response[:100]}...")
        
        # Save results
        output_file = f"disclosure_bot_results_{int(time.time())}.json"
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\\n✅ Results saved to: {output_file}")


def main():
    parser = argparse.ArgumentParser(description="Disclosure Bot Chat Interface")
    parser.add_argument("--batch", help="Process questions from file")
    parser.add_argument("--question", help="Ask a single question")
    parser.add_argument("--context", help="Provide context for the question")
    
    args = parser.parse_args()
    
    try:
        bot = DisclosureBotChat()
        
        if args.batch:
            bot.batch_questions(args.batch)
        elif args.question:
            response = bot.send_message(args.question, args.context)
            print(f"\\n🛸 Disclosure Bot Response:\\n{response}")
        else:
            bot.interactive_chat()
            
    except Exception as e:
        print(f"❌ Error initializing Disclosure Bot: {e}")
        print("Make sure your environment variables are set correctly:")
        print("- OPENAI_API_KEY")
        print("- DISCLOSURE_ASSISTANT_ID")
        print("- UFO_DATA_STORE_ID (optional)")


if __name__ == "__main__":
    main()