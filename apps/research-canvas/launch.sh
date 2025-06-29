#!/bin/bash

# Research Canvas Launch Script
echo "🛸 Starting Research Canvas..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the research-canvas directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if the knowledge base API is running
echo "🔍 Checking knowledge base API..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Knowledge base API is running at http://localhost:8000"
else
    echo "⚠️  Knowledge base API is not running at http://localhost:8000"
    echo "   Please start the API server first:"
    echo "   cd ../disclosure-rag && ./launch_api.sh"
    echo ""
    echo "   Continuing anyway - you can start the API later..."
fi

echo ""
echo "🚀 Starting Research Canvas development server..."
echo "   Open http://localhost:3000 in your browser"
echo ""

# Start the development server
npm run dev