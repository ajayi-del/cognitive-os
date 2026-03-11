// BAZINGA AI Service Client
// Communicates with the Python FastAPI backend

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

interface AIResponse {
  success: boolean
  data?: any
  error?: string
}

class BazingaClient {
  private baseUrl: string

  constructor(baseUrl: string = AI_SERVICE_URL) {
    this.baseUrl = baseUrl
  }

  private async fetch(endpoint: string, options: RequestInit = {}): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const error = await response.text()
        return { success: false, error }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Health check
  async health(): Promise<AIResponse> {
    return this.fetch('/health')
  }

  // Simple ask
  async ask(question: string, context?: string, model: string = 'gemini'): Promise<AIResponse> {
    return this.fetch('/ask', {
      method: 'POST',
      body: JSON.stringify({ question, context, model }),
    })
  }

  // Chat with AI assistant
  async chat(message: string, history: any[] = [], userState?: any): Promise<AIResponse> {
    return this.fetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history, user_state: userState }),
    })
  }

  // Analyze a capture
  async analyzeCapture(content: string, userContext?: any): Promise<AIResponse> {
    return this.fetch('/analyze-capture', {
      method: 'POST',
      body: JSON.stringify({ content, user_context: userContext }),
    })
  }

  // Get routing suggestion
  async getRoutingSuggestion(content: string, captureHistory: string[] = []): Promise<AIResponse> {
    return this.fetch('/routing-suggestion', {
      method: 'POST',
      body: JSON.stringify({ content, capture_history: captureHistory }),
    })
  }

  // Generate tasks from capture
  async generateTasks(content: string): Promise<AIResponse> {
    return this.fetch('/generate-tasks', {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
  }

  // Analyze drift
  async analyzeDrift(recentCaptures: string[], primaryGoal: string, alignmentScore: number): Promise<AIResponse> {
    return this.fetch('/analyze-drift', {
      method: 'POST',
      body: JSON.stringify({ 
        recent_captures: recentCaptures, 
        primary_goal: primaryGoal, 
        alignment_score: alignmentScore 
      }),
    })
  }

  // Get service status
  async status(): Promise<AIResponse> {
    return this.fetch('/status')
  }
}

// Singleton instance
export const bazingaClient = new BazingaClient()

// Export for use in components
export { BazingaClient }
