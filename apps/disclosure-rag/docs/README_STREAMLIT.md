# 🛸 Disclosure RAG Interactive Dashboard

A real-time web interface for UFO/UAP document analysis with AI-powered entity extraction and interactive visualizations.

## ✨ Features

- **📄 Multi-format Document Processing**: Text, files, and URLs
- **🔍 Real-time NER**: Anthropic Claude-powered entity extraction
- **📊 Interactive Visualizations**: Live Plotly charts and dashboards
- **💬 AI Chat Interface**: Direct integration with Disclosure Bot
- **🌐 Web-based**: No installation needed for end users
- **🎨 Dark Theme**: UFO-research aesthetic with sci-fi styling

## 🚀 Quick Start

### Option 1: One-Command Launch
```bash
cd apps/disclosure-rag
./launch_dashboard.sh
```

### Option 2: Manual Setup
```bash
cd apps/disclosure-rag

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements_streamlit.txt

# Launch app
streamlit run streamlit_app.py
```

## 🎛️ Usage

1. **Open your browser** to `http://localhost:8501`
2. **Choose input method**:
   - **Text Input**: Paste UFO/UAP content directly
   - **File Upload**: Upload TXT, PDF, DOCX, or MD files
   - **URL Processing**: Analyze web content directly
3. **Watch real-time processing**: Entities extracted and visualized instantly
4. **Chat with Disclosure Bot**: Ask questions about the extracted data
5. **Explore interactive dashboards**: Filter, zoom, and analyze

## 📊 Dashboard Features

### Real-time NER Processing
- **Entity Categories**: Personnel, Organizations, Events, Topics, Locations
- **Confidence Scoring**: Visual confidence analysis for all extractions
- **Interactive Filtering**: Filter by category and confidence threshold

### Interactive Visualizations
- **Entity Distribution**: Bar charts showing category breakdowns
- **Confidence Analysis**: Scatter plots and metrics for quality assessment
- **Network Graphs**: Relationship visualization between entities
- **Live Metrics**: Real-time statistics and updates

### Chat Integration
- **Context-Aware**: Bot has access to currently processed entities
- **UFO Expertise**: Trained exclusively on UFO/UAP research material
- **Multi-turn Conversations**: Persistent chat history per session

## 🔧 Configuration

Set these environment variables in your `.env` file:

```env
# Required
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Optional - for enhanced chat features
DISCLOSURE_ASSISTANT_ID=asst_xxx
UFO_DATA_STORE_ID=vs_xxx
```

## 🛠️ Architecture

```
streamlit_app.py              # Main web interface
├── NER Processing            # Real-time entity extraction
├── Interactive Dashboard     # Live visualizations
├── Chat Interface           # Disclosure Bot integration
└── Document Management      # Multi-format processing
```

## 📱 Screenshots

The interface features:
- **Dark sci-fi theme** with UFO-appropriate styling
- **Tabbed interface**: Dashboard, Chat, Documents
- **Real-time updates** as new documents are processed
- **Responsive design** for desktop and mobile

## 🚧 Extending the Dashboard

The modular design makes it easy to add:
- **New entity types**: Modify the NER prompts
- **Additional visualizations**: Add new Plotly charts
- **More AI integrations**: Connect other assistants
- **Custom data sources**: Integrate databases or APIs

## 🔍 Troubleshooting

**App won't start?**
- Check Python 3.8+ is installed
- Verify all dependencies are installed
- Ensure environment variables are set

**Slow processing?**
- Large documents take longer to process
- API rate limits may apply
- Check your internet connection

**Chat not working?**
- Verify OpenAI API key is valid
- Check DISCLOSURE_ASSISTANT_ID is set
- Ensure sufficient API credits

## 📚 Learn More

See `docs/LEARNING_RESOURCES.md` for comprehensive learning paths covering:
- Streamlit development
- Interactive data visualization
- NER and NLP techniques
- RAG system architecture
- AI integration patterns

## 🎯 Perfect For

- **UFO Researchers**: Analyze testimonies and documents
- **Data Scientists**: Learn real-time dashboard techniques
- **AI Developers**: Study RAG and NER integration
- **Students**: Hands-on AI and visualization learning

---

**Happy researching! 🛸✨**