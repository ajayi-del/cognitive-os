// Clean Architecture - Cognitive OS
// Router → Specialist Model → Tools → State

import type { AIProvider, TaskType } from './ai-router'

// Context Types
interface SystemContext {
  userState: UserState
  recentCaptures: CaptureItem[]
  activeGoals: Goal[]
  currentFocus: CurrentFocus
  systemMetrics: SystemMetrics
}

interface UserState {
  alignment_score: number
  primary_goal: string
  recent_topics: string[]
  drift_level: string
  energy_level: number
  focus_mode: boolean
}

interface CaptureItem {
  id: string
  content: string
  timestamp: Date
  source: string
  processed: boolean
  energy?: number
}

interface Goal {
  id: string
  name: string
  isPrimary: boolean
  progress?: number
}

interface CurrentFocus {
  project: string
  nextAction: string
  momentum: number
  status: string
}

interface SystemMetrics {
  totalCaptures: number
  activeProjects: number
  focusTimeToday: number
  energyATP: number
  curiositySignals: number
}

// Tools Interface
interface Tool {
  name: string
  execute: (input: any, ...args: any[]) => Promise<any>
  description: string
}

// State Management
export interface SystemState {
  captures: CaptureItem[]
  goals: Goal[]
  focus: CurrentFocus
  metrics: SystemMetrics
  lastUpdated: Date
}

export class ContextRetriever {
  /**
   * Retrieve only relevant context for AI processing
   * Follows principle: Don't send entire system to AI
   */
  static retrieveRelevantContext(
    userQuery: string,
    fullState: SystemState
  ): Partial<SystemContext> {
    const queryLower = userQuery.toLowerCase()
    
    // Determine what context is relevant based on query
    const context: Partial<SystemContext> = {
      userState: {
        alignment_score: fullState.metrics.energyATP,
        primary_goal: fullState.goals.find(g => g.isPrimary)?.name || '',
        recent_topics: this.extractRecentTopics(fullState.captures.slice(-10)),
        drift_level: this.calculateDrift(fullState),
        energy_level: fullState.metrics.energyATP,
        focus_mode: fullState.focus.momentum > 50
      }
    }

    // Add relevant captures based on query content
    if (this.needsCaptureContext(queryLower)) {
      context.recentCaptures = this.getRelevantCaptures(queryLower, fullState.captures)
    }

    // Add goals if query mentions planning or goals
    if (queryLower.includes('goal') || queryLower.includes('plan') || queryLower.includes('objective')) {
      context.activeGoals = fullState.goals
    }

    // Add focus context if query mentions current work
    if (queryLower.includes('focus') || queryLower.includes('current') || queryLower.includes('working')) {
      context.currentFocus = fullState.focus
    }

    // Add system metrics for analysis queries
    if (queryLower.includes('progress') || queryLower.includes('status') || queryLower.includes('how')) {
      context.systemMetrics = fullState.metrics
    }

    return context
  }

  private static needsCaptureContext(query: string): boolean {
    const captureKeywords = ['capture', 'note', 'thought', 'idea', 'remember', 'wrote']
    return captureKeywords.some(keyword => query.includes(keyword))
  }

  private static getRelevantCaptures(query: string, captures: CaptureItem[]): CaptureItem[] {
    // Get last 10 captures, filter by relevance to query
    return captures
      .slice(-10)
      .filter(capture => 
        capture.content.toLowerCase().includes(query) ||
        this.isRecent(capture.timestamp)
      )
      .slice(0, 5) // Max 5 captures to avoid overwhelming AI
  }

  private static isRecent(timestamp: Date): boolean {
    const hoursAgo = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60)
    return hoursAgo < 24 // Last 24 hours
  }

  private static extractRecentTopics(captures: CaptureItem[]): string[] {
    const topics: string[] = []
    captures.forEach(capture => {
      const words = capture.content.toLowerCase().split(/\s+/)
      words.forEach(word => {
        if (word.length > 5 && !topics.includes(word)) {
          topics.push(word)
        }
      })
    })
    return topics.slice(0, 5) // Top 5 topics
  }

  private static calculateDrift(state: SystemState): string {
    const primaryGoal = state.goals.find(g => g.isPrimary)
    if (!primaryGoal) return 'unknown'
    
    const recentCaptures = state.captures.slice(-20)
    const alignedCaptures = recentCaptures.filter(c => 
      c.content.toLowerCase().includes(primaryGoal.name.toLowerCase())
    )
    
    const alignment = alignedCaptures.length / recentCaptures.length
    if (alignment > 0.7) return 'low'
    if (alignment > 0.4) return 'medium'
    return 'high'
  }
}

// Specialist Model Tools
export class SpecialistTools {
  private tools: Map<string, Tool> = new Map()

  constructor() {
    this.initializeTools()
  }

  private initializeTools() {
    // Memory Analysis Tools
    this.tools.set('analyze_patterns', {
      name: 'analyze_patterns',
      description: 'Analyze patterns in recent captures',
      execute: async (captures: CaptureItem[]) => {
        const patterns = this.extractPatterns(captures)
        return { patterns, insights: this.generateInsights(patterns) }
      }
    })

    // Task Generation Tools
    this.tools.set('generate_tasks', {
      name: 'generate_tasks',
      description: 'Generate actionable tasks from content',
      execute: async (content: string) => {
        const tasks = this.extractTasks(content)
        return { tasks, priority: this.calculatePriority(content) }
      }
    })

    // Routing Tools
    this.tools.set('suggest_routing', {
      name: 'suggest_routing',
      description: 'Suggest best destination for content',
      execute: async (input: {content: string, context: UserState}) => {
        const suggestion = this.analyzeRouting(input.content, input.context)
        return { destination: suggestion, confidence: this.calculateConfidence(input.content) }
      }
    })

    // Energy Calculation Tools
    this.tools.set('calculate_energy', {
      name: 'calculate_energy',
      description: 'Calculate energy impact of action',
      execute: async (input: {action: string, currentEnergy: number}) => {
        const impact = this.assessEnergyImpact(input.action)
        return { newEnergy: input.currentEnergy + impact, impact }
      }
    })

    // Focus Tools
    this.tools.set('assess_focus', {
      name: 'assess_focus',
      description: 'Assess current focus state',
      execute: async (input: {captures: CaptureItem[], goals: Goal[]}) => {
        const focusScore = this.calculateFocusScore(input.captures, input.goals)
        return { focusScore, recommendations: this.generateFocusRecommendations(focusScore) }
      }
    })
  }

  private extractPatterns(captures: CaptureItem[]): string[] {
    // Pattern extraction logic
    const topics: string[] = []
    captures.forEach(capture => {
      const words = capture.content.toLowerCase().split(/\s+/)
      words.forEach(word => {
        if (word.length > 4 && topics.filter(t => t.includes(word)).length === 0) {
          topics.push(word)
        }
      })
    })
    return topics.slice(0, 10)
  }

  private generateInsights(patterns: string[]): string[] {
    // Generate insights from patterns
    return patterns.slice(0, 3).map(pattern => 
      `Strong pattern detected: ${pattern}`
    )
  }

  private extractTasks(content: string): Array<{title: string, priority: string}> {
    // Extract actionable tasks from content
    const tasks: Array<{title: string, priority: string}> = []
    
    // Look for action words
    const actionWords = ['build', 'create', 'implement', 'fix', 'review', 'update']
    const sentences = content.split('.').filter(s => s.trim())
    
    sentences.forEach(sentence => {
      if (actionWords.some(word => sentence.toLowerCase().includes(word))) {
        tasks.push({
          title: sentence.trim(),
          priority: this.calculatePriority(sentence)
        })
      }
    })
    
    return tasks.slice(0, 3)
  }

  private calculatePriority(content: string): string {
    if (content.includes('urgent') || content.includes('asap')) return 'high'
    if (content.includes('important') || content.includes('priority')) return 'medium'
    return 'low'
  }

  private analyzeRouting(content: string, context: UserState): string {
    const contentLower = content.toLowerCase()
    
    if (contentLower.includes('task') || contentLower.includes('todo')) return 'action_queue'
    if (contentLower.includes('project') || contentLower.includes('goal')) return 'project'
    if (contentLower.includes('idea') || contentLower.includes('think')) return 'idea_bucket'
    
    return 'idea_bucket' // Default
  }

  private calculateConfidence(content: string): number {
    // Calculate routing confidence based on content clarity
    const clarity = content.split(' ').length
    return Math.min(clarity / 20, 0.95)
  }

  private assessEnergyImpact(action: string): number {
    // Assess energy impact (-10 to +10)
    if (action.includes('break') || action.includes('rest')) return 5
    if (action.includes('focus') || action.includes('work')) return -3
    if (action.includes('complete') || action.includes('finish')) return 2
    return 0
  }

  private calculateFocusScore(captures: CaptureItem[], goals: Goal[]): number {
    // Calculate focus score based on goal alignment
    const primaryGoal = goals.find(g => g.isPrimary)
    if (!primaryGoal) return 50
    
    const recentCaptures = captures.slice(-10)
    const aligned = recentCaptures.filter(c => 
      c.content.toLowerCase().includes(primaryGoal.name.toLowerCase())
    )
    
    return (aligned.length / recentCaptures.length) * 100
  }

  private generateFocusRecommendations(score: number): string[] {
    if (score > 80) return ['Maintain current focus', 'Consider taking a break soon']
    if (score > 50) return ['Reconnect with primary goal', 'Minimize distractions']
    return ['Review primary goal', 'Consider refocusing session']
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name)
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values())
  }
}

// Clean Architecture Orchestrator
export class CleanArchitectureOrchestrator {
  private contextRetriever: typeof ContextRetriever
  private specialistTools: SpecialistTools

  constructor() {
    this.contextRetriever = ContextRetriever
    this.specialistTools = new SpecialistTools()
  }

  /**
   * Process request through clean architecture
   * Router → Specialist Model → Tools → State
   */
  async processRequest(
    userQuery: string,
    provider: AIProvider,
    taskType: TaskType,
    fullState: SystemState
  ): Promise<{
    response: string
    metadata: any
    stateUpdates?: Partial<SystemState>
  }> {
    // 1. Retrieve relevant context (don't send everything)
    const relevantContext = this.contextRetriever.retrieveRelevantContext(userQuery, fullState)
    
    // 2. Route to specialist model with minimal context
    const specialistResponse = await this.callSpecialistModel(
      userQuery,
      provider,
      taskType,
      relevantContext
    )
    
    // 3. Execute tools based on specialist response
    const toolResults = await this.executeTools(specialistResponse.tools || [], relevantContext)
    
    // 4. Update system state
    const stateUpdates = this.calculateStateUpdates(toolResults, fullState)
    
    // 5. Return final response with metadata
    return {
      response: specialistResponse.response,
      metadata: {
        provider,
        taskType,
        contextSize: JSON.stringify(relevantContext).length,
        toolsUsed: toolResults.map(t => t.name),
        stateChanges: Object.keys(stateUpdates || {})
      },
      stateUpdates
    }
  }

  private async callSpecialistModel(
    query: string,
    provider: AIProvider,
    taskType: TaskType,
    context: Partial<SystemContext>
  ): Promise<{
    response: string
    tools?: string[]
    confidence: number
  }> {
    // Call the appropriate AI model with minimal context
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        context: context, // Only relevant context, not full state
        routing: { provider, taskType },
        tools: this.getRelevantTools(taskType)
      })
    })

    if (!response.ok) throw new Error('Specialist model call failed')
    
    return await response.json()
  }

  private getRelevantTools(taskType: TaskType): string[] {
    const toolMap: Record<TaskType, string[]> = {
      summary: ['analyze_patterns'],
      tagging: ['analyze_patterns'],
      planning: ['generate_tasks', 'suggest_routing'],
      coding: ['generate_tasks'],
      debugging: ['generate_tasks'],
      architecture: ['generate_tasks', 'suggest_routing'],
      memory_analysis: ['analyze_patterns', 'assess_focus'],
      external_research: ['suggest_routing'],
      market_context: ['suggest_routing'],
      drift_explanation: ['assess_focus', 'analyze_patterns'],
      general: ['suggest_routing']
    }
    
    return toolMap[taskType] || ['suggest_routing']
  }

  private async executeTools(toolNames: string[], context: Partial<SystemContext>): Promise<Array<{name: string, result: any}>> {
    const results: Array<{name: string, result: any}> = []
    
    for (const toolName of toolNames) {
      const tool = this.specialistTools.getTool(toolName)
      if (tool) {
        try {
          let input: any = context
          
          // Prepare specific input for tools that need it
          if (toolName === 'suggest_routing' && context.userState) {
            input = { content: 'user query', context: context.userState }
          } else if (toolName === 'calculate_energy' && context.userState) {
            input = { action: 'focus work', currentEnergy: context.userState.energy_level }
          } else if (toolName === 'assess_focus' && context.recentCaptures && context.activeGoals) {
            input = { captures: context.recentCaptures, goals: context.activeGoals }
          }
          
          const result = await tool.execute(input)
          results.push({ name: toolName, result })
        } catch (error) {
          console.error(`Tool ${toolName} failed:`, error)
        }
      }
    }
    
    return results
  }

  private calculateStateUpdates(
    toolResults: Array<{name: string, result: any}>,
    currentState: SystemState
  ): Partial<SystemState> {
    const updates: Partial<SystemState> = {}
    
    toolResults.forEach(({ name, result }) => {
      switch (name) {
        case 'calculate_energy':
          updates.metrics = {
            ...currentState.metrics,
            energyATP: result.newEnergy
          }
          break
        case 'generate_tasks':
          // Add new tasks to action queue
          break
        case 'suggest_routing':
          // Update routing suggestions
          break
        // Add more state update logic as needed
      }
    })
    
    updates.lastUpdated = new Date()
    return updates
  }
}

// Singleton instance
export const cleanArchitecture = new CleanArchitectureOrchestrator()
