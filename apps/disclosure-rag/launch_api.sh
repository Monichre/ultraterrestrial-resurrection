#!/bin/bash
# Launch Knowledge Base API Server

echo "🛸 Starting Disclosure RAG Knowledge Base API..."

# Load environment variables
if [ -f .env ]; then
    set -a
    source .env
    set +a
    echo "✅ Environment variables loaded"
else
    echo "⚠️ No .env file found"
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source ./venv/bin/activate

# Install API dependencies
echo "📦 Installing API dependencies..."
pip install -r requirements_api.txt

# Launch API server
echo "🚀 Launching Knowledge Base API..."
echo "📱 API will be available at: http://localhost:8000"
echo "📖 Interactive docs at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the API server"

python3 api_server.py