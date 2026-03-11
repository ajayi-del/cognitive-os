// AI Provider Router - Cognitive OS
// Lightweight, deterministic routing system for 5 AI providers

export type AIProvider = 'ollama' | 'deepseek' | 'gemini' | 'grok' | 'openai' | 'auto'

export type TaskType = 
  | 'summary' 
  | 'tagging' 
  | 'planning' 
  | 'coding' 
  | 'debugging' 
  | 'architecture' 
  | 'memory_analysis' 
  | 'external_research' 
  | 'market_context' 
  | 'drift_explanation'
  | 'general'

// Routing table - deterministic mapping with better distribution
const ROUTING_TABLE: Record<TaskType, AIProvider> = {
  summary: 'gemini',          // Gemini for summaries
  tagging: 'gemini',          // Gemini for categorization
  drift_explanation: 'gemini', // Gemini for analysis
  coding: 'deepseek',         // DeepSeek for coding
  debugging: 'deepseek',     // DeepSeek for debugging
  memory_analysis: 'gemini', // Gemini for memory tasks
  external_research: 'grok',  // Grok for research
  market_context: 'grok',     // Grok for market data
  planning: 'gemini',         // Gemini for planning (changed from OpenAI)
  architecture: 'deepseek',   // DeepSeek for architecture
  general: 'gemini'           // Gemini for general (changed from Ollama)
}

// Provider configurations
interface ProviderConfig {
  name: string
  baseUrl: string
  apiKey?: string
  model: string
  enabled: boolean
}

// Tag-based routing hints
const TAG_ROUTING: Record<string, AIProvider> = {
  coding: 'deepseek',
  bugfix: 'deepseek',
  debug: 'deepseek',
  planning: 'openai',
  strategy: 'openai',
  memory: 'gemini',
  review: 'gemini',
  trading: 'grok',
  news: 'grok',
  market: 'grok',
  summary: 'ollama',
  tag: 'ollama',
  drift: 'ollama'
}

export class TaskClassifier {
  /**
   * Classify a request into a task type based on content analysis
   */
  static classify(content: string): TaskType {
    const lower = content.toLowerCase()
    
    // Check for coding patterns
    if (this.hasPattern(lower, [
      'code', 'function', 'bug', 'error', 'debug', 'fix', 
      'syntax', 'compile', 'runtime', 'exception', 'stack trace'
    ])) {
      return lower.includes('fix') || lower.includes('debug') || lower.includes('error')
        ? 'debugging' 
        : 'coding'
    }
    
    // Check for architecture
    if (this.hasPattern(lower, [
      'architecture', 'design', 'system', 'structure', 
      'pattern', 'framework', 'infrastructure'
    ])) {
      return 'architecture'
    }
    
    // Check for planning
    if (this.hasPattern(lower, [
      'plan', 'strategy', 'roadmap', 'goal', 'objective',
      'milestone', 'timeline', 'schedule'
    ])) {
      return 'planning'
    }
    
    // Check for external research
    if (this.hasPattern(lower, [
      'research', 'find', 'search', 'look up', 'news', 
      'current', 'recent', 'latest', 'trend'
    ])) {
      return 'external_research'
    }
    
    // Check for market context
    if (this.hasPattern(lower, [
      'market', 'trading', 'stock', 'price', 'crypto',
      'bitcoin', 'forex', 'trend', 'analysis', 'signal'
    ])) {
      return 'market_context'
    }
    
    // Check for memory analysis
    if (this.hasPattern(lower, [
      'analyze', 'review', 'synthesize', 'connect', 'pattern',
      'memory', 'past', 'history', 'recall', 'remember'
    ])) {
      return 'memory_analysis'
    }
    
    // Check for drift explanation
    if (this.hasPattern(lower, [
      'drift', 'alignment', 'focus', 'goal', 'track',
      'progress', 'status', 'how am i doing'
    ])) {
      return 'drift_explanation'
    }
    
    // Check for tagging
    if (this.hasPattern(lower, [
      'tag', 'label', 'categorize', 'organize', 'sort'
    ])) {
      return 'tagging'
    }
    
    // Check for summary
    if (this.hasPattern(lower, [
      'summarize', 'summary', 'brief', 'overview', 'recap',
      'tl;dr', 'tldr', 'main points'
    ])) {
      return 'summary'
    }
    
    return 'general'
  }
  
  /**
   * Extract tags from content for routing hints
   */
  static extractTags(content: string): string[] {
    const words = content.toLowerCase().split(/\s+/)
    const tags: string[] = []
    
    Object.keys(TAG_ROUTING).forEach(tag => {
      if (words.some(w => w.includes(tag))) {
        tags.push(tag)
      }
    })
    
    return tags
  }
  
  private static hasPattern(text: string, patterns: string[]): boolean {
    return patterns.some(p => text.includes(p))
  }
}

export class ProviderRouter {
  private providers: Map<AIProvider, ProviderConfig>
  private fallbackProvider: AIProvider = 'ollama'
  
  constructor() {
    this.providers = new Map()
    this.initializeProviders()
  }
  
  private initializeProviders() {
    // OLLAMA - Local default
    this.providers.set('ollama', {
      name: 'Ollama',
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'llama2',
      enabled: true // Always enabled as fallback
    })
    
    // DEEPSEEK - Coding specialist
    this.providers.set('deepseek', {
      name: 'DeepSeek',
      baseUrl: 'https://api.deepseek.com/v1',
      apiKey: process.env.DEEPSEEK_API_KEY,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      enabled: !!process.env.DEEPSEEK_API_KEY // Will be true if API key is set
    })
    
    // GEMINI - Long context specialist
    this.providers.set('gemini', {
      name: 'Gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1',
      apiKey: process.env.GEMINI_API_KEY || 'AIzaSyB-APtrgunj5h93y-mJ_Z2LYSUAxMCl3yI',
      model: process.env.GEMINI_MODEL || 'gemini-pro',
      enabled: true // Always enabled with fallback key
    })
    
    // GROK - External research
    this.providers.set('grok', {
      name: 'Grok',
      baseUrl: 'https://api.x.ai/v1',
      apiKey: process.env.GROK_API_KEY,
      model: process.env.GROK_MODEL || 'grok-1',
      enabled: !!process.env.GROK_API_KEY
    })
    
    // OPENAI - Strategic planning
    this.providers.set('openai', {
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4',
      enabled: !!process.env.OPENAI_API_KEY
    })
  }
  
  /**
   * Route a request to the appropriate provider
   */
  route(content: string, manualOverride?: AIProvider): { 
    provider: AIProvider
    taskType: TaskType
    reason: string
    config: ProviderConfig
  } {
    // Manual override takes precedence
    if (manualOverride && manualOverride !== 'auto') {
      const config = this.providers.get(manualOverride)
      if (config && config.enabled) {
        return {
          provider: manualOverride,
          taskType: 'general',
          reason: 'Manual override selected',
          config
        }
      }
    }
    
    // Classify the task
    const taskType = TaskClassifier.classify(content)
    
    // Check for tag-based routing
    const tags = TaskClassifier.extractTags(content)
    for (const tag of tags) {
      if (TAG_ROUTING[tag]) {
        const provider = TAG_ROUTING[tag]
        const config = this.providers.get(provider)
        if (config && config.enabled) {
          return {
            provider,
            taskType,
            reason: `Tag-based routing: "${tag}" → ${provider}`,
            config
          }
        }
      }
    }
    
    // Use routing table
    const preferredProvider = ROUTING_TABLE[taskType]
    const config = this.providers.get(preferredProvider)
    
    // If preferred provider not available, fallback to ollama
    if (!config || !config.enabled) {
      const fallback = this.providers.get(this.fallbackProvider)
      return {
        provider: this.fallbackProvider,
        taskType,
        reason: `${preferredProvider} unavailable, falling back to ${this.fallbackProvider} for ${taskType} task`,
        config: fallback!
      }
    }
    
    return {
      provider: preferredProvider,
      taskType,
      reason: `Task-based routing: ${taskType} → ${preferredProvider}`,
      config
    }
  }
  
  /**
   * Get available providers
   */
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.entries())
      .filter(([_, config]) => config.enabled)
      .map(([provider]) => provider)
  }
  
  /**
   * Check if a provider is available
   */
  isProviderAvailable(provider: AIProvider): boolean {
    const config = this.providers.get(provider)
    return config?.enabled || false
  }
  
  /**
   * Get provider configuration
   */
  getProviderConfig(provider: AIProvider): ProviderConfig | undefined {
    return this.providers.get(provider)
  }
}

// Singleton instance
export const providerRouter = new ProviderRouter()

// React hook for provider selection
export function useAIProvider() {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('auto')
  const [lastRoute, setLastRoute] = useState<{
    provider: AIProvider
    taskType: TaskType
    reason: string
  } | null>(null)
  
  const route = (content: string) => {
    const result = providerRouter.route(content, selectedProvider)
    setLastRoute(result)
    return result
  }
  
  return {
    selectedProvider,
    setSelectedProvider,
    availableProviders: providerRouter.getAvailableProviders(),
    route,
    lastRoute,
    isAuto: selectedProvider === 'auto'
  }
}

import { useState } from 'react'
