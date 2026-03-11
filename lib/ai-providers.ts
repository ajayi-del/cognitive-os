// AI Provider Abstraction Layer
// Supports OpenAI, DeepSeek, Kimi K2, and other OpenAI-compatible APIs

export type AIProvider = 'openai' | 'deepseek' | 'kimik2' | 'ollama' | 'custom';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string;
  defaultModel: string;
  models: string[];
  supportsStreaming: boolean;
  supportsEmbeddings: boolean;
  isFree?: boolean;
}

// Provider configurations
export const AI_PROVIDERS: Record<AIProvider, Omit<AIProviderConfig, 'apiKey'>> = {
  openai: {
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    supportsStreaming: true,
    supportsEmbeddings: true,
    isFree: false,
  },
  deepseek: {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
    supportsStreaming: true,
    supportsEmbeddings: false, // DeepSeek doesn't have embeddings yet
    isFree: false, // Very cheap but not free
  },
  kimik2: {
    provider: 'kimik2',
    baseUrl: 'https://api.moonshot.cn/v1',
    defaultModel: 'kimi-k2',
    models: ['kimi-k2', 'kimi-k1', 'kimi-moonshot'],
    supportsStreaming: true,
    supportsEmbeddings: true,
    isFree: false,
  },
  ollama: {
    provider: 'ollama',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'llama3.2',
    models: ['llama3.2', 'mistral', 'qwen2.5', 'deepseek-coder-v2', 'phi4'],
    supportsStreaming: true,
    supportsEmbeddings: true,
    isFree: true, // Local = free
  },
  custom: {
    provider: 'custom',
    baseUrl: '', // User must provide
    defaultModel: '',
    models: [],
    supportsStreaming: true,
    supportsEmbeddings: false,
    isFree: false,
  },
};

// Main AI Service class
export class AIService {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async chat(request: AIRequest): Promise<AIResponse> {
    const url = `${this.config.baseUrl || AI_PROVIDERS[this.config.provider].baseUrl}/chat/completions`;
    
    const body = {
      model: request.model || this.config.defaultModel,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 2000,
      stream: false,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`AI Provider Error: ${error}`);
      }

      const data = await response.json();

      return {
        content: data.choices?.[0]?.message?.content || '',
        usage: data.usage,
        model: data.model,
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async *streamChat(request: AIRequest): AsyncGenerator<string> {
    if (!this.config.supportsStreaming && !AI_PROVIDERS[this.config.provider].supportsStreaming) {
      // Fallback to non-streaming
      const response = await this.chat(request);
      yield response.content;
      return;
    }

    const url = `${this.config.baseUrl || AI_PROVIDERS[this.config.provider].baseUrl}/chat/completions`;
    
    const body = {
      model: request.model || this.config.defaultModel,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 2000,
      stream: true,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI Provider Error: ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '' || line.startsWith(':')) continue;
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content;
            if (content) yield content;
          } catch {
            // Ignore parse errors for malformed chunks
          }
        }
      }
    }
  }

  async createEmbedding(text: string): Promise<number[]> {
    if (!this.config.supportsEmbeddings) {
      throw new Error('Provider does not support embeddings');
    }

    const url = `${this.config.baseUrl || AI_PROVIDERS[this.config.provider].baseUrl}/embeddings`;
    
    const body = {
      model: 'text-embedding-3-small', // Default embedding model
      input: text,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('Failed to create embedding');
    }

    const data = await response.json();
    return data.data?.[0]?.embedding || [];
  }

  // Static methods for provider management
  static getProviderConfig(provider: AIProvider): Omit<AIProviderConfig, 'apiKey'> {
    return AI_PROVIDERS[provider];
  }

  static getAllProviders(): Record<AIProvider, Omit<AIProviderConfig, 'apiKey'>> {
    return AI_PROVIDERS;
  }

  static isFreeProvider(provider: AIProvider): boolean {
    return AI_PROVIDERS[provider].isFree || false;
  }
}

// Helper functions for common AI tasks
export async function generateSummary(
  service: AIService,
  text: string,
  maxLength: number = 200
): Promise<string> {
  const response = await service.chat({
    messages: [
      {
        role: 'system',
        content: `You are a summarization assistant. Create a concise summary in ${maxLength} characters or less.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.3,
    max_tokens: Math.ceil(maxLength / 2),
  });

  return response.content;
}

export async function analyzeSentiment(
  service: AIService,
  text: string
): Promise<'positive' | 'negative' | 'neutral'> {
  const response = await service.chat({
    messages: [
      {
        role: 'system',
        content: 'Analyze the sentiment and respond with only: positive, negative, or neutral.',
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.1,
    max_tokens: 10,
  });

  const sentiment = response.content.toLowerCase().trim();
  if (sentiment.includes('positive')) return 'positive';
  if (sentiment.includes('negative')) return 'negative';
  return 'neutral';
}

export async function generateTasks(
  service: AIService,
  context: string,
  count: number = 3
): Promise<string[]> {
  const response = await service.chat({
    messages: [
      {
        role: 'system',
        content: `Generate ${count} actionable tasks based on the context. Respond with a JSON array of task strings.`,
      },
      {
        role: 'user',
        content: context,
      },
    ],
    temperature: 0.5,
    max_tokens: 500,
  });

  try {
    // Try to parse JSON
    const tasks = JSON.parse(response.content);
    if (Array.isArray(tasks)) return tasks.slice(0, count);
  } catch {
    // Fallback to splitting by newlines
    return response.content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, count);
  }

  return [];
}
