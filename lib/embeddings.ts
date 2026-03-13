// NEXUS COGNITIVE OS - EMBEDDING SERVICE
// Provider-agnostic embedding generation for semantic search

export interface EmbeddingsProvider {
  generate(text: string): Promise<number[]>
  dimensions: number
}

// DeepSeek implementation (using their embedding API)
export class DeepSeekEmbeddings implements EmbeddingsProvider {
  dimensions = 1536
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || ''
    this.baseUrl = 'https://api.deepseek.com/v1'
    if (!this.apiKey) console.warn('DEEPSEEK_API_KEY missing, using fallback')
  }

  async generate(text: string): Promise<number[]> {
    if (!this.apiKey) {
      // Fallback: generate simple hash-based embedding
      return this.generateFallbackEmbedding(text)
    }

    const res = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'deepseek-chat',
      }),
    })
    
    if (!res.ok) throw new Error(`DeepSeek error: ${res.status}`)
    const data = await res.json()
    return data.data[0].embedding
  }

  // Simple fallback embedding generator (hash-based, not semantic)
  private generateFallbackEmbedding(text: string): number[] {
    const embedding = new Array(1536).fill(0)
    const hash = this.simpleHash(text)
    
    // Distribute hash across embedding dimensions
    for (let i = 0; i < 1536; i++) {
      embedding[i] = ((hash * (i + 1)) % 1000) / 1000.0
    }
    
    return embedding
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}

// OpenAI implementation
export class OpenAIEmbeddings implements EmbeddingsProvider {
  dimensions = 1536
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ''
    this.baseUrl = 'https://api.openai.com/v1'
    if (!this.apiKey) console.warn('OPENAI_API_KEY missing, using fallback')
  }

  async generate(text: string): Promise<number[]> {
    if (!this.apiKey) {
      // Fallback: generate simple hash-based embedding
      return this.generateFallbackEmbedding(text)
    }

    const res = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-3-small',
      }),
    })

    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`)
    const data = await res.json()
    return data.data[0].embedding
  }

  // Simple fallback embedding generator (hash-based, not semantic)
  private generateFallbackEmbedding(text: string): number[] {
    const embedding = new Array(1536).fill(0)
    const hash = this.simpleHash(text)
    
    // Distribute hash across embedding dimensions
    for (let i = 0; i < 1536; i++) {
      embedding[i] = ((hash * (i + 1)) % 1000) / 1000.0
    }
    
    return embedding
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}

// Ollama implementation (local)
export class OllamaEmbeddings implements EmbeddingsProvider {
  dimensions = 768 // for nomic-embed-text
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
  }

  async generate(text: string): Promise<number[]> {
    const res = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: text,
      }),
    })
    if (!res.ok) throw new Error(`Ollama error: ${res.status}`)
    const data = await res.json()
    return data.embedding
  }
}

// Factory to get the configured provider
export function getEmbeddingsProvider(): EmbeddingsProvider {
  const provider = process.env.EMBEDDINGS_PROVIDER || 'deepseek'
  
  switch (provider) {
    case 'deepseek':
      return new DeepSeekEmbeddings()
    case 'openai':
      return new OpenAIEmbeddings()
    case 'ollama':
      return new OllamaEmbeddings()
    default:
      console.warn(`Unknown embeddings provider: ${provider}, falling back to DeepSeek`)
      return new DeepSeekEmbeddings()
  }
}

// Helper function to convert embedding array to PostgreSQL vector string
export function embeddingToVectorString(embedding: number[]): string {
  return `[${embedding.join(',')}]`
}

// Helper function to parse PostgreSQL vector string to array
export function vectorStringToEmbedding(vectorStr: string): number[] {
  return vectorStr
    .slice(1, -1) // Remove [ and ]
    .split(',')
    .map(num => parseFloat(num))
}
