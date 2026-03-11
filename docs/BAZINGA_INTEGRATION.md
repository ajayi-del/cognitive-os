# BAZINGA AI Integration Guide

## 🚀 Quick Start

Cognitive OS now uses **BAZINGA** for AI capabilities via Google's Gemini API.

### Start with AI Enabled

```bash
# Use the startup script (recommended)
./start-with-ai.sh

# Or start manually:
# Terminal 1: Start AI Service
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# Terminal 2: Start Next.js
npm run dev
```

## 🔧 Configuration

The Gemini API key is already configured in:
- `.env.local` (Next.js)
- `ai-service/.env` (Python service)

**API Key:** `AIzaSyB-APtrgunj5h93y-mJ_Z2LYSUAxMCl3yI`

## 🤖 AI Features Available

### 1. **AI Chat Assistant** (`/api/ai/chat`)
- Natural language conversations
- Context-aware responses
- Suggested actions based on user state

### 2. **Capture Analysis** (`/api/ai/analyze`)
- Sentiment analysis
- Automatic summarization
- Keyword extraction
- Smart routing suggestions

### 3. **Routing Suggestions** (`/api/ai/routing`)
- AI determines best destination:
  - `project` - Long-term initiatives
  - `idea_bucket` - Ideas to explore
  - `action_queue` - Immediate tasks
  - `archived` - Not relevant

### 4. **Drift Analysis** (`/api/ai/drift`)
- Monitors alignment with primary goal
- Detects cognitive drift patterns
- Provides reconnection suggestions

### 5. **Task Generation** (`/api/ai/tasks`)
- Extracts actionable tasks from captures
- Prioritizes based on content
- Links to relevant projects

## 📡 API Endpoints

All AI functionality is available via REST API:

```typescript
// Chat with AI
POST /api/ai/chat
{
  "message": "How's my focus today?",
  "history": [],
  "userState": {
    "alignment_score": 72,
    "primary_goal": "Trading System",
    "recent_topics": ["AI", "patterns"]
  }
}

// Analyze capture
POST /api/ai/analyze
{
  "content": "Need to improve risk management in trading...",
  "userContext": {}
}

// Get routing suggestion
POST /api/ai/routing
{
  "content": "Build a new dashboard component",
  "captureHistory": []
}
```

## 🧠 Using in Components

```typescript
import { useAI } from '@/lib/hooks/useAI'

function MyComponent() {
  const { chat, analyzeCapture, isLoading, isAvailable } = useAI()

  // Chat with AI
  const handleChat = async () => {
    const response = await chat("What's my cognitive state?")
    console.log(response.response)
  }

  // Analyze a capture
  const handleAnalyze = async (content: string) => {
    const analysis = await analyzeCapture(content)
    console.log(analysis.suggested_route)
  }
}
```

## 🔌 Direct Python API Access

```python
from bazinga import ask, multi_ai, analyze_sentiment

# Simple question
answer = ask("What is flow state?", model="gemini")

# Multi-AI consensus
results = multi_ai("Explain neural networks")

# Sentiment analysis
sentiment = analyze_sentiment("I'm excited about this project!")
```

## 🏥 Troubleshooting

### AI Service Not Running
```bash
# Check if service is running
curl http://localhost:8000/health

# Restart service
cd ai-service
source venv/bin/activate
python main.py
```

### BAZINGA Not Installed
```bash
cd ai-service
source venv/bin/activate
pip install bazinga-indeed
```

### Fallback Mode
If BAZINGA is unavailable, the system automatically falls back to:
- Template-based responses
- Rule-based routing
- Basic sentiment detection

## 🔒 Security

- API keys stored in environment variables
- No keys exposed in client-side code
- All AI requests go through Next.js API routes
- Python service only accessible locally

## 📊 Performance

- **Response Time:** 1-3 seconds for most queries
- **Rate Limits:** Governed by Gemini API (60 req/min free tier)
- **Fallback:** Immediate response if AI unavailable

## 🛣️ Roadmap

- [ ] Voice transcription via Whisper API
- [ ] Image analysis for captures
- [ ] Multi-model consensus (Gemini + Groq + Ollama)
- [ ] Local Ollama mode for offline usage
- [ ] Telegram bot integration

---

**Powered by BAZINGA + Google Gemini**
