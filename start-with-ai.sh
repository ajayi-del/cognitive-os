#!/bin/bash

# Cognitive OS - BAZINGA AI Service Startup Script
# This script starts the Python AI service alongside the Next.js app

echo "🚀 Starting Cognitive OS with BAZINGA AI Integration..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "${RED}❌ Python 3 is not installed. Please install Python 3.8+${NC}"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "${RED}❌ pip3 is not installed. Please install pip.${NC}"
    exit 1
fi

# Navigate to AI service directory
cd ai-service

# Check if virtual environment exists, if not create it
if [ ! -d "venv" ]; then
    echo "${BLUE}📦 Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo "${BLUE}🔌 Activating virtual environment...${NC}"
source venv/bin/activate

# Install dependencies
echo "${BLUE}📥 Installing BAZINGA and dependencies...${NC}"
pip install -q -r requirements.txt

# Check if BAZINGA is installed
if ! python3 -c "import bazinga" &> /dev/null; then
    echo "${YELLOW}⚠️  BAZINGA not found. Installing...${NC}"
    pip install bazinga-indeed
fi

# Start the AI service in the background
echo "${GREEN}🤖 Starting BAZINGA AI Service on port 8000...${NC}"
python3 main.py &
AI_SERVICE_PID=$!

# Save PID for later cleanup
echo $AI_SERVICE_PID > .ai-service.pid

# Wait a moment for the service to start
sleep 2

# Check if service is running
if kill -0 $AI_SERVICE_PID 2>/dev/null; then
    echo "${GREEN}✅ AI Service started successfully (PID: $AI_SERVICE_PID)${NC}"
else
    echo "${RED}❌ Failed to start AI Service${NC}"
    exit 1
fi

cd ..

echo ""
echo "${BLUE}🌐 Starting Next.js application...${NC}"
echo "${YELLOW}⏳ This may take a moment...${NC}"
echo ""

# Start Next.js
npm run dev &
NEXTJS_PID=$!

# Save PID
echo $NEXTJS_PID > .nextjs.pid

# Wait for Next.js to start
sleep 5

echo ""
echo "${GREEN}✨ Cognitive OS is running!${NC}"
echo ""
echo "📱 Web App:    http://localhost:3000"
echo "🤖 AI Service: http://localhost:8000"
echo "📊 AI Health:  http://localhost:8000/health"
echo ""
echo "${YELLOW}Press Ctrl+C to stop both services${NC}"
echo ""

# Function to cleanup processes
cleanup() {
    echo ""
    echo "${YELLOW}🛑 Shutting down services...${NC}"
    
    if [ -f ai-service/.ai-service.pid ]; then
        kill $(cat ai-service/.ai-service.pid) 2>/dev/null
        rm ai-service/.ai-service.pid
        echo "${GREEN}✅ AI Service stopped${NC}"
    fi
    
    if [ -f .nextjs.pid ]; then
        kill $(cat .nextjs.pid) 2>/dev/null
        rm .nextjs.pid
        echo "${GREEN}✅ Next.js stopped${NC}"
    fi
    
    exit 0
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

# Keep script running
wait
