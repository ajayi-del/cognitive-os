// ─── CHAT CONTEXT BUILDER ─────────────────────────────────────────────────────
// Provides contextual intelligence for Nexus Chat
// Read-only consumer of pattern graph - never mutates canonical data

import { getCaptureEvents, getActionEvents } from './canonical-events'
import { runAdaptiveReorganization } from './organism-adaptation'
import { runCognitiveSynthesis } from './cognitive-synthesis'
import { detectProjectCandidates } from './project-crystallization'
import { generateTasksForProject } from './task-generator'

export interface ChatContext {
  query: string
  timestamp: Date
  recentCaptures: CaptureContext[]
  activePatterns: PatternContext[]
  projectCandidates: ProjectContext[]
  activeProjects: ProjectContext[]
  generatedTasks: TaskContext[]
  cognitiveInsights: InsightContext[]
}

export interface CaptureContext {
  id: string
  content: string
  timestamp: Date
  relevanceScore: number
  relatedPatterns: string[]
}

export interface PatternContext {
  theme: string
  occurrences: number
  stage: 'observation' | 'repetition' | 'crystallization'
  recentActivity: boolean
  relatedCaptures: string[]
  confidence: number
}

export interface ProjectContext {
  id: string
  title: string
  status: 'skeleton' | 'active' | 'completed' | 'archived'
  originPattern: string
  goal: string
  complexity: 'simple' | 'moderate' | 'complex'
  estimatedEffort: 'low' | 'medium' | 'high'
  taskCount: number
  relevanceScore: number
}

export interface TaskContext {
  id: string
  title: string
  type: string
  priority: string
  projectId: string
  projectTitle: string
  status: string
  relevanceScore: number
}

export interface InsightContext {
  id: string
  type: string
  title: string
  domains: string[]
  confidence: number
  novelty: number
  actionable: boolean
  relevanceScore: number
}

export interface ContextConfig {
  maxRecentCaptures: number
  maxActivePatterns: number
  maxActiveProjects: number
  relevanceThreshold: number
  includeInsights: boolean
  includeTasks: boolean
}

// ─── MAIN CONTEXT BUILDER ─────────────────────────────────────────────────────
export async function buildChatContext(
  query: string,
  config: ContextConfig = {
    maxRecentCaptures: 10,
    maxActivePatterns: 5,
    maxActiveProjects: 3,
    relevanceThreshold: 0.3,
    includeInsights: true,
    includeTasks: true
  }
): Promise<ChatContext> {
  try {
    const now = new Date()
    const queryLower = query.toLowerCase()
    
    // Get all necessary data
    const [recentCaptures, adaptationResult, synthesisResult, projectCandidates] = await Promise.all([
      getCaptureEvents(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // Last 7 days
      runAdaptiveReorganization(),
      runCognitiveSynthesis(),
      detectProjectCandidates()
    ])
    
    // Build context components
    const captureContext = await buildCaptureContext(recentCaptures, queryLower, config)
    const patternContext = buildPatternContext(adaptationResult.graph, queryLower, config)
    const projectContext = buildProjectContext(projectCandidates, queryLower, config)
    const taskContext = config.includeTasks ? await buildTaskContext(projectCandidates, queryLower, config) : []
    const insightContext = config.includeInsights ? buildInsightContext(synthesisResult.insights, queryLower, config) : []
    
    return {
      query,
      timestamp: now,
      recentCaptures: captureContext,
      activePatterns: patternContext,
      projectCandidates: projectContext,
      activeProjects: projectContext, // For now, same as candidates
      generatedTasks: taskContext,
      cognitiveInsights: insightContext
    }
  } catch (error) {
    console.error('[chat context builder]', error)
    return {
      query,
      timestamp: new Date(),
      recentCaptures: [],
      activePatterns: [],
      projectCandidates: [],
      activeProjects: [],
      generatedTasks: [],
      cognitiveInsights: []
    }
  }
}

// ─── CAPTURE CONTEXT BUILDING ─────────────────────────────────────────────────
async function buildCaptureContext(
  captures: any[],
  query: string,
  config: ContextConfig
): Promise<CaptureContext[]> {
  const captureContexts: CaptureContext[] = []
  
  // Sort captures by recency and relevance
  const sortedCaptures = captures
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, config.maxRecentCaptures * 2) // Get more for filtering
  
  for (const capture of sortedCaptures) {
    const relevanceScore = calculateCaptureRelevance(capture.data.content, query)
    
    if (relevanceScore >= config.relevanceThreshold) {
      // Extract related patterns (simple keyword matching)
      const words = capture.data.content.toLowerCase().split(/\s+/)
      const relatedPatterns = words.filter((word: string) => word.length > 4)
      
      captureContexts.push({
        id: capture.id,
        content: capture.data.content,
        timestamp: capture.timestamp,
        relevanceScore,
        relatedPatterns
      })
    }
  }
  
  return captureContexts
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, config.maxRecentCaptures)
}

// ─── PATTERN CONTEXT BUILDING ─────────────────────────────────────────────────
function buildPatternContext(
  patternGraph: any,
  query: string,
  config: ContextConfig
): PatternContext[] {
  const patternContexts: PatternContext[] = []
  const now = new Date()
  
  // Convert pattern graph to context
  const patternNodes = (patternGraph.nodes as any) || {}
  const patternEntries = Object.entries(patternNodes) as [string, any][]
  for (const [theme, node] of patternEntries) {
    const relevanceScore = calculatePatternRelevance(theme, node, query)
    
    if (relevanceScore >= config.relevanceThreshold) {
      const recentActivity = (now.getTime() - (node.lastSeen as Date).getTime()) < 7 * 24 * 60 * 60 * 1000
      
      patternContexts.push({
        theme,
        occurrences: node.occurrences,
        stage: node.stage,
        recentActivity,
        relatedCaptures: [], // Would be populated from capture analysis
        confidence: Math.min(node.occurrences / 10, 1.0) // Simple confidence calculation
      })
    }
  }
  
  return patternContexts
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, config.maxActivePatterns)
}

// ─── PROJECT CONTEXT BUILDING ─────────────────────────────────────────────────
function buildProjectContext(
  candidates: any[],
  query: string,
  config: ContextConfig
): ProjectContext[] {
  const projectContexts: ProjectContext[] = []
  
  for (const candidate of candidates) {
    const relevanceScore = calculateProjectRelevance(candidate, query)
    
    if (relevanceScore >= config.relevanceThreshold) {
      projectContexts.push({
        id: candidate.id,
        title: formatProjectTitle(candidate.theme),
        status: 'skeleton',
        originPattern: candidate.theme,
        goal: generateProjectGoal(candidate.theme, candidate.adaptationSignal),
        complexity: determineComplexity(candidate),
        estimatedEffort: determineEffort(candidate, determineComplexity(candidate)),
        taskCount: 0, // Would be populated from task generation
        relevanceScore
      })
    }
  }
  
  return projectContexts
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, config.maxActiveProjects)
}

// ─── TASK CONTEXT BUILDING ───────────────────────────────────────────────────
async function buildTaskContext(
  candidates: any[],
  query: string,
  config: ContextConfig
): Promise<TaskContext[]> {
  const taskContexts: TaskContext[] = []
  
  // For each project candidate, generate tasks and filter by relevance
  for (const candidate of candidates.slice(0, config.maxActiveProjects)) {
    try {
      // Generate a simple project skeleton for task generation
      const { generateProjectSkeleton } = await import('./project-skeleton')
      const project = await generateProjectSkeleton(candidate)
      const tasks = await generateTasksForProject(project)
      
      for (const task of tasks) {
        const relevanceScore = calculateTaskRelevance(task, query)
        
        if (relevanceScore >= config.relevanceThreshold) {
          taskContexts.push({
            id: task.id,
            title: task.title,
            type: task.type,
            priority: task.priority,
            projectId: task.projectId,
            projectTitle: project.title,
            status: task.status,
            relevanceScore
          })
        }
      }
    } catch (error) {
      console.error('[task context generation]', error)
      // Continue with other candidates
    }
  }
  
  return taskContexts
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 10) // Limit total tasks
}

// ─── INSIGHT CONTEXT BUILDING ─────────────────────────────────────────────────
function buildInsightContext(
  insights: any[],
  query: string,
  config: ContextConfig
): InsightContext[] {
  const insightContexts: InsightContext[] = []
  
  for (const insight of insights) {
    const relevanceScore = calculateInsightRelevance(insight, query)
    
    if (relevanceScore >= config.relevanceThreshold) {
      insightContexts.push({
        id: insight.id,
        type: insight.type,
        title: insight.title,
        domains: insight.domains,
        confidence: insight.confidence,
        novelty: insight.novelty,
        actionable: insight.actionable,
        relevanceScore
      })
    }
  }
  
  return insightContexts
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5) // Limit insights
}

// ─── RELEVANCE CALCULATION UTILITIES ───────────────────────────────────────────
function calculateCaptureRelevance(content: string, query: string): number {
  const contentLower = content.toLowerCase()
  const queryWords = query.split(/\s+/).filter(word => word.length > 2)
  
  let relevanceScore = 0
  let matchedWords = 0
  
  for (const queryWord of queryWords) {
    if (contentLower.includes(queryWord)) {
      relevanceScore += 0.3
      matchedWords++
    }
  }
  
  // Boost score for exact phrase matches
  if (contentLower.includes(query)) {
    relevanceScore += 0.5
  }
  
  // Normalize by query length
  return queryWords.length > 0 ? Math.min(relevanceScore, 1.0) : 0
}

function calculatePatternRelevance(theme: string, node: any, query: string): number {
  const themeLower = theme.toLowerCase()
  const queryWords = query.split(/\s+/).filter(word => word.length > 2)
  
  let relevanceScore = 0
  
  // Direct theme match
  if (themeLower.includes(query) || query.includes(themeLower)) {
    relevanceScore += 0.8
  }
  
  // Word-level matches
  for (const queryWord of queryWords) {
    if (themeLower.includes(queryWord)) {
      relevanceScore += 0.3
    }
  }
  
  // Boost by pattern strength
  relevanceScore += Math.min(node.occurrences / 20, 0.4)
  
  return Math.min(relevanceScore, 1.0)
}

function calculateProjectRelevance(candidate: any, query: string): number {
  const themeLower = candidate.theme.toLowerCase()
  const queryWords = query.split(/\s+/).filter(word => word.length > 2)
  
  let relevanceScore = 0
  
  // Theme matching
  if (themeLower.includes(query) || query.includes(themeLower)) {
    relevanceScore += 0.6
  }
  
  // Word-level matches
  for (const queryWord of queryWords) {
    if (themeLower.includes(queryWord)) {
      relevanceScore += 0.2
    }
  }
  
  // Boost by confidence and recency
  relevanceScore += candidate.confidence * 0.3
  if (candidate.patternRecency <= 7) {
    relevanceScore += 0.2
  }
  
  return Math.min(relevanceScore, 1.0)
}

function calculateTaskRelevance(task: any, query: string): number {
  const titleLower = task.title.toLowerCase()
  const descriptionLower = task.description.toLowerCase()
  const queryWords = query.split(/\s+/).filter(word => word.length > 2)
  
  let relevanceScore = 0
  
  // Title matching
  if (titleLower.includes(query) || query.includes(titleLower)) {
    relevanceScore += 0.5
  }
  
  // Description matching
  if (descriptionLower.includes(query) || query.includes(descriptionLower)) {
    relevanceScore += 0.3
  }
  
  // Word-level matches
  for (const queryWord of queryWords) {
    if (titleLower.includes(queryWord) || descriptionLower.includes(queryWord)) {
      relevanceScore += 0.2
    }
  }
  
  // Boost by priority
  if (task.priority === 'high') {
    relevanceScore += 0.2
  }
  
  return Math.min(relevanceScore, 1.0)
}

function calculateInsightRelevance(insight: any, query: string): number {
  const titleLower = insight.title.toLowerCase()
  const descriptionLower = insight.description.toLowerCase()
  const queryWords = query.split(/\s+/).filter(word => word.length > 2)
  
  let relevanceScore = 0
  
  // Title matching
  if (titleLower.includes(query) || query.includes(titleLower)) {
    relevanceScore += 0.6
  }
  
  // Description matching
  if (descriptionLower.includes(query) || query.includes(descriptionLower)) {
    relevanceScore += 0.3
  }
  
  // Domain matching
  for (const domain of insight.domains) {
    if (domain.toLowerCase().includes(query) || query.includes(domain.toLowerCase())) {
      relevanceScore += 0.2
    }
  }
  
  // Word-level matches
  for (const queryWord of queryWords) {
    if (titleLower.includes(queryWord) || descriptionLower.includes(queryWord)) {
      relevanceScore += 0.1
    }
  }
  
  // Boost by novelty and confidence
  relevanceScore += insight.novelty * 0.2
  relevanceScore += insight.confidence * 0.2
  
  return Math.min(relevanceScore, 1.0)
}

// ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────
function formatProjectTitle(theme: string): string {
  // Simple title formatting (reuse from project-skeleton)
  const titleMappings: Record<string, string> = {
    'cybernetics': 'Cybernetic Systems',
    'automation': 'Automation Framework',
    'pattern': 'Pattern Recognition',
    'feedback': 'Feedback Control',
    'trading': 'Trading Algorithm',
    'learning': 'Learning System',
    'intelligence': 'Intelligence Engine'
  }
  
  for (const [key, value] of Object.entries(titleMappings)) {
    if (theme.includes(key)) {
      return value
    }
  }
  
  return theme.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function generateProjectGoal(theme: string, signal: string): string {
  if (signal === 'promotion') {
    return `Transform the "${theme}" pattern into a fully functional system.`
  } else if (signal === 'convergence') {
    return `Integrate multiple patterns around "${theme}" into a unified solution.`
  } else {
    return `Explore and develop the "${theme}" concept into a practical implementation.`
  }
}

function determineComplexity(candidate: any): 'simple' | 'moderate' | 'complex' {
  if (candidate.relatedPatterns.length <= 2 && candidate.relatedCaptures.length <= 5) {
    return 'simple'
  } else if (candidate.relatedPatterns.length > 5 || candidate.relatedCaptures.length > 15) {
    return 'complex'
  } else {
    return 'moderate'
  }
}

function determineEffort(candidate: any, complexity: 'simple' | 'moderate' | 'complex'): 'low' | 'medium' | 'high' {
  const baseEffort: Record<string, 'low' | 'medium' | 'high'> = {
    simple: 'low',
    moderate: 'medium',
    complex: 'high'
  }
  
  if (candidate.confidence >= 0.8) {
    return baseEffort[complexity] || 'medium'
  } else if (candidate.confidence < 0.6) {
    return complexity === 'simple' ? 'medium' : 'high'
  } else {
    return baseEffort[complexity] || 'medium'
  }
}
