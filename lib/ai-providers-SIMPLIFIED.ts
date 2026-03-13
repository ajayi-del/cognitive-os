// UNIFIED AI PROVIDER CONFIGURATION - DEEPSEEK & OLLAMA ONLY
// Simplified to only support DeepSeek and Ollama

export type AIProvider = 'deepseek' | 'ollama';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  model?: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export interface AIResponse {
  content: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Provider configurations
export const PROVIDER_CONFIG = {
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY,
    priority: 1
  },
  ollama: {
    endpoint: process.env.OLLAMA_ENDPOINT || 'http://localhost:11434',
    model: 'llama2',
    priority: 2
  }
}

// Default provider
export const DEFAULT_PROVIDER: AIProvider = 'deepseek'
export const FALLBACK_PROVIDER: AIProvider = 'ollama'

// Check if provider is available
export async function isProviderAvailable(provider: AIProvider): Promise<boolean> {
  try {
    if (provider === 'deepseek') {
      const apiKey = PROVIDER_CONFIG.deepseek.apiKey
      if (!apiKey) return false
      
      const response = await fetch(`${PROVIDER_CONFIG.deepseek.endpoint}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      })
      return response.ok
    } else if (provider === 'ollama') {
      const response = await fetch(`${PROVIDER_CONFIG.ollama.endpoint}/api/tags`)
      return response.ok
    }
    return false
  } catch (error) {
    console.error(`Provider ${provider} not available:`, error)
    return false
  }
}

// Get best available provider
export async function getBestProvider(): Promise<AIProvider> {
  // Try DeepSeek first
  if (await isProviderAvailable('deepseek')) {
    return 'deepseek'
  }
  
  // Fallback to Ollama
  if (await isProviderAvailable('ollama')) {
    return 'ollama'
  }
  
  // Return DeepSeek anyway as last resort
  return 'deepseek'
}

// Unified AI call function
export async function callAI(
  request: AIRequest,
  providerId?: AIProvider
): Promise<AIResponse> {
  const provider = providerId || await getBestProvider()
  
  if (provider === 'deepseek') {
    return callDeepSeek(request)
  } else if (provider === 'ollama') {
    return callOllama(request)
  }
  
  throw new Error(`Unknown provider: ${provider}`)
}

// DeepSeek API call
async function callDeepSeek(request: AIRequest): Promise<AIResponse> {
  const config = PROVIDER_CONFIG.deepseek
  
  const response = await fetch(`${config.endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model,
      messages: request.messages,
      stream: request.stream || false,
      temperature: request.temperature || 0.7,
      max_tokens: request.max_tokens
    })
  })
  
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`)
  }
  
  const data = await response.json()
  return {
    content: data.choices[0]?.message?.content || 'No response from DeepSeek',
    model: data.model,
    usage: data.usage
  }
}

// Ollama API call
async function callOllama(request: AIRequest): Promise<AIResponse> {
  const config = PROVIDER_CONFIG.ollama
  
  const response = await fetch(`${config.endpoint}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model,
      messages: request.messages,
      stream: request.stream || false,
      options: {
        temperature: request.temperature || 0.7
      }
    })
  })
  
  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`)
  }
  
  const data = await response.json()
  return {
    content: data.message?.content || 'No response from Ollama',
    model: config.model
  }
}

// Stream response handler
export async function* streamAIResponse(
  request: AIRequest,
  providerId?: AIProvider
): AsyncGenerator<string, void, unknown> {
  const provider = providerId || await getBestProvider()
  
  if (provider === 'deepseek') {
    yield* streamDeepSeek(request)
  } else if (provider === 'ollama') {
    yield* streamOllama(request)
  }
}

// DeepSeek streaming
async function* streamDeepSeek(request: AIRequest): AsyncGenerator<string, void, unknown> {
  const config = PROVIDER_CONFIG.deepseek
  
  const response = await fetch(`${config.endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model,
      messages: request.messages,
      stream: true,
      temperature: request.temperature || 0.7
    })
  })
  
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`)
  }
  
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  
  if (!reader) {
    throw new Error('No response body')
  }
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') return
          
          try {
            const parsed = JSON.parse(data)
            if (parsed.choices?.[0]?.delta?.content) {
              yield parsed.choices[0].delta.content
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

// Ollama streaming
async function* streamOllama(request: AIRequest): AsyncGenerator<string, void, unknown> {
  const config = PROVIDER_CONFIG.ollama
  
  const response = await fetch(`${config.endpoint}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model,
      messages: request.messages,
      stream: true,
      options: {
        temperature: request.temperature || 0.7
      }
    })
  })
  
  if (!response.ok) {
    throw new Error(`Ollama API error: ${response.statusText}`)
  }
  
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  
  if (!reader) {
    throw new Error('No response body')
  }
  
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line)
            if (parsed.message?.content) {
              yield parsed.message.content
            }
          } catch (e) {
            // Ignore parsing errors
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
