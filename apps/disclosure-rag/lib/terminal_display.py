#!/usr/bin/env python3
"""
Cool terminal display for disclosure-rag processing
Date: June 20, 2025
"""

import time
import sys
import threading
from typing import Optional, Dict, Any
import itertools

class TerminalDisplay:
    """Cool terminal display with animations and progress indicators"""
    
    def __init__(self):
        self.spinner_active = False
        self.spinner_thread = None
        
    def print_header(self):
        """Print cool header"""
        header = """
╔═══════════════════════════════════════════════════════════════╗
║                  🛸 DISCLOSURE RAG PROCESSOR 🛸                ║
║                     Enhanced with AI Analysis                 ║
╚═══════════════════════════════════════════════════════════════╝
"""
        print(f"\033[36m{header}\033[0m")
    
    def print_url_detected(self, url: str, url_type: str):
        """Print URL detection with style"""
        type_icons = {
            "youtube": "📹",
            "web": "🌐", 
            "file": "📄"
        }
        
        icon = type_icons.get(url_type, "🔗")
        print(f"\n{icon} \033[1;32mDetected {url_type.upper()} content:\033[0m")
        print(f"   \033[94m{url}\033[0m")
    
    def start_spinner(self, message: str):
        """Start animated spinner"""
        self.spinner_active = True
        spinner_chars = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"
        
        def spin():
            for char in itertools.cycle(spinner_chars):
                if not self.spinner_active:
                    break
                sys.stdout.write(f"\r\033[36m{char}\033[0m {message}")
                sys.stdout.flush()
                time.sleep(0.1)
        
        self.spinner_thread = threading.Thread(target=spin)
        self.spinner_thread.start()
    
    def stop_spinner(self, success_message: str):
        """Stop spinner and show completion"""
        self.spinner_active = False
        if self.spinner_thread:
            self.spinner_thread.join()
        
        sys.stdout.write(f"\r\033[32m✅\033[0m {success_message}")
        sys.stdout.flush()
        print()
    
    def show_progress_bar(self, current: int, total: int, task: str):
        """Show progress bar"""
        progress = current / total
        bar_length = 40
        filled_length = int(bar_length * progress)
        
        bar = "█" * filled_length + "░" * (bar_length - filled_length)
        percentage = int(progress * 100)
        
        print(f"\r🔄 {task}: \033[36m{bar}\033[0m {percentage}% ({current}/{total})", end="")
        sys.stdout.flush()
        
        if current == total:
            print()  # New line when complete
    
    def print_stage(self, stage: str, emoji: str = "🔧"):
        """Print processing stage"""
        print(f"\n{emoji} \033[1;33m{stage}\033[0m")
    
    def print_success(self, message: str):
        """Print success message"""
        print(f"\n\033[32m✅ {message}\033[0m")
    
    def print_error(self, message: str):
        """Print error message"""
        print(f"\n\033[31m❌ {message}\033[0m")
    
    def print_warning(self, message: str):
        """Print warning message"""
        print(f"\n\033[33m⚠️  {message}\033[0m")
    
    def print_info(self, message: str):
        """Print info message"""
        print(f"   \033[94mℹ️  {message}\033[0m")
    
    def print_file_created(self, file_path: str, file_type: str):
        """Print file creation with icon"""
        icons = {
            "transcript": "📝",
            "summary": "📊", 
            "metadata": "📋",
            "analysis": "🧠"
        }
        
        icon = icons.get(file_type, "📄")
        filename = file_path.split("/")[-1] if "/" in file_path else file_path
        print(f"   {icon} \033[92m{filename}\033[0m")
    
    def print_upload_status(self, file_id: str, status: str):
        """Print upload status"""
        if status == "success":
            print(f"   ☁️  \033[92mUploaded: {file_id}\033[0m")
        else:
            print(f"   ☁️  \033[91mFailed: {status}\033[0m")
    
    def print_agent_analysis(self, analysis_type: str):
        """Print agent analysis status"""
        analysis_icons = {
            "content": "🧠",
            "personnel": "👥",
            "organizations": "🏢", 
            "documents": "📚",
            "testimonies": "🗣️"
        }
        
        icon = analysis_icons.get(analysis_type, "🔍")
        print(f"   {icon} \033[96mAnalyzing {analysis_type}...\033[0m")
    
    def print_completion_summary(self, data: Dict[str, Any]):
        """Print completion summary with stats"""
        title = data.get('title', 'Unknown')
        source = data.get('source', 'Unknown')
        doc_id = data.get('doc_id')
        
        print(f"\n" + "="*60)
        print(f"\033[1;32m🎉 PROCESSING COMPLETE!\033[0m")
        print(f"="*60)
        print(f"📺 \033[1mTitle:\033[0m {title}")
        print(f"🔗 \033[1mSource:\033[0m {source}")
        
        if doc_id:
            print(f"🆔 \033[1mDocument ID:\033[0m {doc_id}")
        
        # File stats
        if 'file_paths' in data:
            file_paths = data['file_paths']
            print(f"\n📁 \033[1mFiles Created:\033[0m")
            for file_type, path in file_paths.items():
                self.print_file_created(path, file_type)
        
        # Upload stats
        if 'upload_results' in data:
            print(f"\n☁️  \033[1mOpenAI Uploads:\033[0m")
            upload_results = data['upload_results']
            if isinstance(upload_results, dict):
                for file_type, result in upload_results.items():
                    if isinstance(result, dict) and 'id' in result:
                        self.print_upload_status(result['id'], "success")
        
        # Search sync
        if doc_id:
            print(f"\n🔍 \033[1mSearch Integration:\033[0m")
            print(f"   🔗 \033[92mSynced to Upstash Search\033[0m")
        
        print(f"\n\033[36m🚀 Ready for frontend access at /documents\033[0m")
        print(f"="*60)
    
    def animate_text(self, text: str, delay: float = 0.05):
        """Animate text typing effect"""
        for char in text:
            sys.stdout.write(char)
            sys.stdout.flush()
            time.sleep(delay)
        print()
    
    def print_ascii_ufo(self):
        """Print cool UFO ASCII art"""
        ufo = '''
                    .-""""-.
                   /        \\
              .-"""-|  o   o  |-"""-.
             /      \\        /      \\
            |  o   o |      o|  o   o |
             \\      /\\      /\\      /
              '-...-'  '-..-'  '-...-'
                  |      |      |
                  |      |      |
                  '------+------'
                         |
                  Disclosure RAG
        '''
        print(f"\033[36m{ufo}\033[0m")

# Global instance
display = TerminalDisplay()

def show_youtube_processing():
    """Show YouTube processing animation"""
    display.print_stage("🎬 YOUTUBE PROCESSING", "📹")
    
    stages = [
        ("Extracting video metadata", "📋"),
        ("Downloading transcript", "📝"),
        ("Running AI analysis", "🧠"),
        ("Generating personnel profiles", "👥"),
        ("Analyzing organizations", "🏢"),
        ("Processing testimonies", "🗣️"),
        ("Creating summary", "📊")
    ]
    
    for i, (stage, emoji) in enumerate(stages):
        display.start_spinner(f"{emoji} {stage}...")
        time.sleep(1.5)  # Simulate processing time
        display.stop_spinner(f"{emoji} {stage} complete")
    
    display.print_success("YouTube processing complete!")

def show_upload_animation(files: list):
    """Show upload animation"""
    display.print_stage("☁️  UPLOADING TO OPENAI", "☁️")
    
    for i, file_info in enumerate(files):
        filename = file_info.split("/")[-1] if "/" in file_info else file_info
        display.start_spinner(f"Uploading {filename}...")
        time.sleep(1)  # Simulate upload time
        display.stop_spinner(f"✅ {filename} uploaded successfully")

if __name__ == "__main__":
    # Demo the display
    display.print_header()
    display.print_url_detected("https://youtube.com/watch?v=test", "youtube")
    show_youtube_processing()
    show_upload_animation(["transcript.txt", "summary.txt", "metadata.json"])
    display.print_completion_summary({
        'title': 'Test Video',
        'source': 'https://youtube.com/watch?v=test',
        'doc_id': 'abc123'
    })