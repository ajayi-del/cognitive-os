# BAZINGA AI Service for Cognitive OS
# Provides AI capabilities via Gemini, Groq, or local Ollama

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Cognitive OS AI Service",
    description="BAZINGA-powered AI backend for Cognitive OS",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Keys from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")

# Import BAZINGA
try:
    from bazinga import ask, multi_ai, analyze_sentiment, summarize, generate_tasks
    BAZINGA_AVAILABLE = True
    logger.info("✅ BAZINGA loaded successfully")
except ImportError:
    BAZINGA_AVAILABLE = False
    logger.warning("⚠️  BAZINGA not installed. Running in fallback mode.")

# Pydantic models
class AskRequest(BaseModel):
    question: str
    context: Optional[str] = None
    model: Optional[str] = "gemini"  # gemini, groq, ollama, auto

class AnalyzeRequest(BaseModel):
    text: str
    analysis_type: str = "sentiment"  # sentiment, summary, topics, routing

class MultiAIRequest(BaseModel):
    question: str
    models: Optional[List[str]] = None

class CaptureAnalysisRequest(BaseModel):
    content: str
    user_context: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []
    user_state: Optional[Dict[str, Any]] = None

class RoutingSuggestionRequest(BaseModel):
    content: str
    capture_history: Optional[List[str]] = []

class DriftAnalysisRequest(BaseModel):
    recent_captures: List[str]
    primary_goal: str
    alignment_score: float

class Task:
    def __init__(self, title: str, description: str, priority: str = "medium"):
        self.title = title
        self.description = description
        self.priority = priority

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "bazinga_available": BAZINGA_AVAILABLE,
        "gemini_configured": bool(GEMINI_API_KEY),
        "groq_configured": bool(GROQ_API_KEY),
        "openrouter_configured": bool(OPENROUTER_API_KEY)
    }

# Simple ask endpoint
@app.post("/ask")
async def ask_ai(request: AskRequest):
    """Ask AI a question using BAZINGA"""
    try:
        if not BAZINGA_AVAILABLE:
            # Fallback response
            return {
                "answer": f"[Fallback Mode] Question received: {request.question}\n\nNote: BAZINGA is not installed. Please run: pip install bazinga-indeed",
                "model": "fallback",
                "confidence": 0.0
            }
        
        # Set API key in environment for this request
        if request.model == "gemini" and GEMINI_API_KEY:
            os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
        
        # Call BAZINGA
        if request.context:
            question = f"Context: {request.context}\n\nQuestion: {request.question}"
        else:
            question = request.question
        
        answer = ask(question, model=request.model)
        
        return {
            "answer": answer,
            "model": request.model,
            "confidence": 0.85  # BAZINGA provides this in real implementation
        }
    
    except Exception as e:
        logger.error(f"Error in ask endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Multi-AI consensus endpoint
@app.post("/multi-ai")
async def multi_ai_consensus(request: MultiAIRequest):
    """Get consensus from multiple AI models"""
    try:
        if not BAZINGA_AVAILABLE:
            return {
                "consensus": "[Fallback Mode] Multi-AI not available without BAZINGA",
                "individual_results": {},
                "agreement_score": 0.0
            }
        
        # Set API keys
        if GEMINI_API_KEY:
            os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
        if GROQ_API_KEY:
            os.environ["GROQ_API_KEY"] = GROQ_API_KEY
        
        results = multi_ai(request.question, models=request.models)
        
        return {
            "consensus": results.get("consensus", ""),
            "individual_results": results.get("individual", {}),
            "agreement_score": results.get("agreement", 0.0)
        }
    
    except Exception as e:
        logger.error(f"Error in multi-ai endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Analyze capture endpoint
@app.post("/analyze-capture")
async def analyze_capture(request: CaptureAnalysisRequest):
    """Analyze a capture and provide insights"""
    try:
        if not BAZINGA_AVAILABLE:
            return {
                "summary": request.content[:100] + "...",
                "sentiment": "neutral",
                "suggested_route": "idea_bucket",
                "keywords": [],
                "confidence": 0.5
            }
        
        if GEMINI_API_KEY:
            os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
        
        # Get summary
        summary_result = summarize(request.content, max_length=150)
        
        # Get sentiment
        sentiment_result = analyze_sentiment(request.content)
        
        # Determine routing suggestion based on content analysis
        routing_prompt = f"""Analyze this thought/capture and suggest the best route:
        
Content: {request.content}

Available routes:
- project: Long-term goal or major initiative
- idea_bucket: Interesting idea to explore later  
- action_queue: Immediate task or to-do
- archived: Not relevant anymore

Respond with ONLY ONE word: project, idea_bucket, action_queue, or archived"""

        route_suggestion = ask(routing_prompt, model="gemini")
        route = route_suggestion.strip().lower()
        
        # Validate route
        valid_routes = ["project", "idea_bucket", "action_queue", "archived"]
        if route not in valid_routes:
            route = "idea_bucket"  # Default fallback
        
        # Extract keywords (simplified)
        words = request.content.lower().split()
        keywords = list(set([w for w in words if len(w) > 4][:5]))
        
        return {
            "summary": summary_result,
            "sentiment": sentiment_result,
            "suggested_route": route,
            "keywords": keywords,
            "confidence": 0.82
        }
    
    except Exception as e:
        logger.error(f"Error in analyze-capture endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Chat endpoint for AI assistant
@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """Chat with AI assistant about cognitive patterns"""
    try:
        if not BAZINGA_AVAILABLE:
            return {
                "response": f"[Fallback] I received your message: '{request.message}'. Install BAZINGA for full AI capabilities.",
                "suggested_actions": [],
                "context_update": {}
            }
        
        if GEMINI_API_KEY:
            os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
        
        # Build context-aware prompt
        user_state = request.user_state or {}
        alignment_score = user_state.get("alignment_score", 50)
        primary_goal = user_state.get("primary_goal", "Not set")
        
        context_prompt = f"""You are an AI cognitive assistant helping a user manage their thoughts, ideas, and focus.

User Context:
- Primary Goal: {primary_goal}
- Alignment Score: {alignment_score}%
- Recent Topics: {', '.join(user_state.get('recent_topics', []))}

User Message: {request.message}

Provide a helpful, concise response (2-3 sentences max). If relevant, suggest:
1. A specific action they could take
2. A connection to their primary goal
3. A question to deepen their thinking

Keep it conversational and supportive."""

        response = ask(context_prompt, model="gemini")
        
        # Generate suggested actions based on context
        actions = []
        if "capture" in request.message.lower() or "thought" in request.message.lower():
            actions.append({"label": "Create Capture", "action": "create_capture"})
        if "focus" in request.message.lower():
            actions.append({"label": "Start Focus Session", "action": "start_focus"})
        if alignment_score < 60:
            actions.append({"label": "Review Alignment", "action": "review_alignment"})
        
        return {
            "response": response,
            "suggested_actions": actions,
            "context_update": {
                "last_interaction": "chat",
                "topics_discussed": user_state.get("recent_topics", []) + [request.message[:20]]
            }
        }
    
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Generate tasks from context
@app.post("/generate-tasks")
async def generate_tasks_endpoint(request: CaptureAnalysisRequest):
    """Generate actionable tasks from a capture"""
    try:
        if not BAZINGA_AVAILABLE:
            # Fallback: extract simple tasks
            return {
                "tasks": [
                    {"title": "Review capture", "description": request.content[:50], "priority": "medium"}
                ],
                "confidence": 0.3
            }
        
        if GEMINI_API_KEY:
            os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
        
        tasks_result = generate_tasks(request.content, count=3)
        
        return {
            "tasks": tasks_result,
            "confidence": 0.78
        }
    
    except Exception as e:
        logger.error(f"Error in generate-tasks endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Drift analysis endpoint
@app.post("/analyze-drift")
async def analyze_drift(request: DriftAnalysisRequest):
    """Analyze if user is drifting from primary goal"""
    try:
        if not BAZINGA_AVAILABLE:
            return {
                "drift_risk": "low" if request.alignment_score > 60 else "medium",
                "reason": "Alignment analysis unavailable without BAZINGA",
                "suggestion": "Continue monitoring your captures",
                "confidence": 0.3
            }
        
        if GEMINI_API_KEY:
            os.environ["GEMINI_API_KEY"] = GEMINI_API_KEY
        
        prompt = f"""Analyze whether this user is drifting from their primary goal:

Primary Goal: {request.primary_goal}
Alignment Score: {request.alignment_score}%
Recent Captures (last 7 days):
{chr(10).join([f"- {c[:100]}" for c in request.recent_captures[:5]])}

Drift Risk Assessment:
1. Are recent captures aligned with the primary goal?
2. Is there a pattern of unrelated topics?
3. What is the emotional/sentiment trend?

Respond in JSON format:
{{
    "drift_risk": "low|medium|high",
    "reason": "brief explanation",
    "suggestion": "actionable recommendation",
    "confidence": 0.0-1.0
}}"""

        result = ask(prompt, model="gemini")
        
        # Parse JSON response (BAZINGA returns structured data)
        import json
        try:
            drift_analysis = json.loads(result)
        except:
            # Fallback parsing
            drift_analysis = {
                "drift_risk": "low" if request.alignment_score > 70 else "medium" if request.alignment_score > 50 else "high",
                "reason": "Based on alignment score and recent activity",
                "suggestion": "Review your recent captures and reconnect with your primary goal",
                "confidence": request.alignment_score / 100
            }
        
        return drift_analysis
    
    except Exception as e:
        logger.error(f"Error in drift analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get AI status and available models
@app.get("/status")
async def get_status():
    """Get AI service status and available models"""
    available_models = []
    
    if GEMINI_API_KEY:
        available_models.append("gemini")
    if GROQ_API_KEY:
        available_models.append("groq")
    
    # Check for Ollama
    try:
        import requests
        response = requests.get("http://localhost:11434/api/tags", timeout=2)
        if response.status_code == 200:
            available_models.append("ollama")
    except:
        pass
    
    return {
        "bazinga_available": BAZINGA_AVAILABLE,
        "available_models": available_models,
        "default_model": "gemini" if GEMINI_API_KEY else ("groq" if GROQ_API_KEY else "ollama"),
        "api_keys_configured": {
            "gemini": bool(GEMINI_API_KEY),
            "groq": bool(GROQ_API_KEY),
            "openrouter": bool(OPENROUTER_API_KEY)
        }
    }

# Run the server
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
