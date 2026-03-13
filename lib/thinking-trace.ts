// ─── THINKING TRACE LAYER ─────────────────────────────────────────────────────
// Shows the data lineage behind Nexus responses
// Makes the system feel intelligent by revealing reasoning chains

import { ChatContext } from './chat-context'

export interface ThinkingTrace {
  query: string
  timestamp: Date
  captures: CaptureTrace[]
  patterns: PatternTrace[]
  signals: SignalTrace[]
  projects: ProjectTrace[]
  tasks: TaskTrace[]
  reasoning: ReasoningStep[]
  confidence: number
  lineage: string[]
}

export interface CaptureTrace {
  id: string
  content: string
  timestamp: Date
  relevance: number
  excerpt: string
}

export interface PatternTrace {
  theme: string
  occurrences: number
  stage: string
  confidence: number
  relatedCaptures: string[]
  growthRate: number
}

export interface SignalTrace {
  type: string
  patterns: string[]
  confidence: number
  message: string
  timestamp: Date
}

export interface ProjectTrace {
  id: string
  title: string
  theme: string
  status: string
  confidence: number
  taskCount: number
}

export interface TaskTrace {
  id: string
  title: string
  type: string
  priority: string
  projectId: string
  relevance: number
}

export interface ReasoningStep {
  step: number
  description: string
  evidence: string[]
  conclusion: string
  confidence: number
}

// ─── THINKING TRACE BUILDER ─────────────────────────────────────────────────────
export async function buildThinkingTrace(
  query: string,
  context: ChatContext
): Promise<ThinkingTrace> {
  try {
    const timestamp = new Date()
    
    // Build trace components
    const captures = buildCaptureTraces(context.recentCaptures)
    const patterns = buildPatternTraces(context.activePatterns)
    const signals = buildSignalTraces(context) // Would be derived from adaptation signals
    const projects = buildProjectTraces(context.projectCandidates)
    const tasks = buildTaskTraces(context.generatedTasks)
    const reasoning = buildReasoningSteps(query, context)
    const lineage = buildLineage(captures, patterns, projects)
    const confidence = calculateOverallConfidence(captures, patterns, projects)
    
    return {
      query,
      timestamp,
      captures,
      patterns,
      signals,
      projects,
      tasks,
      reasoning,
      confidence,
      lineage
    }
  } catch (error) {
    console.error('[thinking trace builder]', error)
    return createFallbackTrace(query)
  }
}

// ─── CAPTURE TRACE BUILDING ─────────────────────────────────────────────────────
function buildCaptureTraces(captureContexts: any[]): CaptureTrace[] {
  return captureContexts.slice(0, 3).map(capture => ({
    id: capture.id,
    content: capture.content,
    timestamp: capture.timestamp,
    relevance: capture.relevanceScore,
    excerpt: extractExcerpt(capture.content, 100)
  }))
}

// ─── PATTERN TRACE BUILDING ─────────────────────────────────────────────────────
function buildPatternTraces(patternContexts: any[]): PatternTrace[] {
  return patternContexts.slice(0, 3).map(pattern => ({
    theme: pattern.theme,
    occurrences: pattern.occurrences,
    stage: pattern.stage,
    confidence: pattern.confidence,
    relatedCaptures: pattern.relatedCaptures || [],
    growthRate: 0 // Would be calculated from pattern graph
  }))
}

// ─── SIGNAL TRACE BUILDING ─────────────────────────────────────────────────────
function buildSignalTraces(context: ChatContext): SignalTrace[] {
  // This would be derived from adaptation signals in the context
  // For now, return empty array as placeholder
  return []
}

// ─── PROJECT TRACE BUILDING ───────────────────────────────────────────────────
function buildProjectTraces(projectContexts: any[]): ProjectTrace[] {
  return projectContexts.slice(0, 2).map(project => ({
    id: project.id,
    title: project.title,
    theme: project.originPattern,
    status: project.status,
    confidence: project.relevanceScore,
    taskCount: project.taskCount
  }))
}

// ─── TASK TRACE BUILDING ───────────────────────────────────────────────────────
function buildTaskTraces(taskContexts: any[]): TaskTrace[] {
  return taskContexts.slice(0, 3).map(task => ({
    id: task.id,
    title: task.title,
    type: task.type,
    priority: task.priority,
    projectId: task.projectId,
    relevance: task.relevanceScore
  }))
}

// ─── REASONING STEPS BUILDING ───────────────────────────────────────────────────
function buildReasoningSteps(query: string, context: ChatContext): ReasoningStep[] {
  const steps: ReasoningStep[] = []
  let stepNumber = 1
  
  // Step 1: Query Analysis
  steps.push({
    step: stepNumber++,
    description: 'Analyzed user query for key concepts',
    evidence: [query],
    conclusion: `Identified ${query.split(/\s+/).length} key concepts in query`,
    confidence: 0.9
  })
  
  // Step 2: Capture Retrieval
  if (context.recentCaptures.length > 0) {
    steps.push({
      step: stepNumber++,
      description: 'Retrieved relevant captures from memory',
      evidence: context.recentCaptures.slice(0, 2).map(c => c.content.substring(0, 50)),
      conclusion: `Found ${context.recentCaptures.length} relevant captures`,
      confidence: 0.8
    })
  }
  
  // Step 3: Pattern Recognition
  if (context.activePatterns.length > 0) {
    steps.push({
      step: stepNumber++,
      description: 'Identified active patterns related to query',
      evidence: context.activePatterns.slice(0, 2).map(p => p.theme),
      conclusion: `Detected ${context.activePatterns.length} relevant patterns`,
      confidence: 0.7
    })
  }
  
  // Step 4: Project Context
  if (context.projectCandidates.length > 0) {
    steps.push({
      step: stepNumber++,
      description: 'Connected query to active project candidates',
      evidence: context.projectCandidates.slice(0, 2).map(p => p.title),
      conclusion: `Found ${context.projectCandidates.length} related projects`,
      confidence: 0.6
    })
  }
  
  // Step 5: Synthesis
  steps.push({
    step: stepNumber++,
    description: 'Synthesized information into coherent response',
    evidence: [
      `${context.recentCaptures.length} captures`,
      `${context.activePatterns.length} patterns`,
      `${context.projectCandidates.length} projects`
    ],
    conclusion: 'Generated response based on available evidence',
    confidence: 0.8
  })
  
  return steps
}

// ─── LINEAGE BUILDING ───────────────────────────────────────────────────────
function buildLineage(
  captures: CaptureTrace[],
  patterns: PatternTrace[],
  projects: ProjectTrace[]
): string[] {
  const lineage: string[] = []
  
  // Add capture lineage
  if (captures.length > 0) {
    lineage.push(`Based on ${captures.length} captures`)
  }
  
  // Add pattern lineage
  if (patterns.length > 0) {
    lineage.push(`Informed by ${patterns.length} patterns: ${patterns.map(p => p.theme).join(', ')}`)
  }
  
  // Add project lineage
  if (projects.length > 0) {
    lineage.push(`Connected to ${projects.length} projects: ${projects.map(p => p.title).join(', ')}`)
  }
  
  return lineage
}

// ─── CONFIDENCE CALCULATION ───────────────────────────────────────────────────
function calculateOverallConfidence(
  captures: CaptureTrace[],
  patterns: PatternTrace[],
  projects: ProjectTrace[]
): number {
  let confidence = 0.5 // Base confidence
  
  // Boost based on capture relevance
  if (captures.length > 0) {
    const avgCaptureRelevance = captures.reduce((sum, c) => sum + c.relevance, 0) / captures.length
    confidence += avgCaptureRelevance * 0.2
  }
  
  // Boost based on pattern confidence
  if (patterns.length > 0) {
    const avgPatternConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
    confidence += avgPatternConfidence * 0.2
  }
  
  // Boost based on project relevance
  if (projects.length > 0) {
    const avgProjectConfidence = projects.reduce((sum, p) => sum + p.confidence, 0) / projects.length
    confidence += avgProjectConfidence * 0.1
  }
  
  return Math.min(confidence, 1.0)
}

// ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────
function extractExcerpt(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content
  }
  
  return content.substring(0, maxLength - 3) + '...'
}

function createFallbackTrace(query: string): ThinkingTrace {
  return {
    query,
    timestamp: new Date(),
    captures: [],
    patterns: [],
    signals: [],
    projects: [],
    tasks: [],
    reasoning: [{
      step: 1,
      description: 'System initialization',
      evidence: [query],
      conclusion: 'Operating with limited context',
      confidence: 0.3
    }],
    confidence: 0.3,
    lineage: ['Limited data available']
  }
}

// ─── TRACE FORMATTING FOR DISPLAY ─────────────────────────────────────────────
export function formatThinkingTraceForDisplay(trace: ThinkingTrace): string {
  const lines: string[] = []
  
  lines.push('🧠 Thinking Trace')
  lines.push('─'.repeat(40))
  lines.push('')
  
  // Query and confidence
  lines.push(`Query: "${trace.query}"`)
  lines.push(`Confidence: ${Math.round(trace.confidence * 100)}%`)
  lines.push('')
  
  // Captures
  if (trace.captures.length > 0) {
    lines.push('📝 Source Captures:')
    trace.captures.forEach((capture, index) => {
      lines.push(`  ${index + 1}. "${capture.excerpt}" (${Math.round(capture.relevance * 100)}% relevant)`)
    })
    lines.push('')
  }
  
  // Patterns
  if (trace.patterns.length > 0) {
    lines.push('🔍 Active Patterns:')
    trace.patterns.forEach((pattern, index) => {
      lines.push(`  ${index + 1}. ${pattern.theme} (${pattern.stage}, ${pattern.occurrences} occurrences)`)
    })
    lines.push('')
  }
  
  // Projects
  if (trace.projects.length > 0) {
    lines.push('🏗️ Related Projects:')
    trace.projects.forEach((project, index) => {
      lines.push(`  ${index + 1}. ${project.title} (${project.status})`)
    })
    lines.push('')
  }
  
  // Reasoning steps
  lines.push('⚙️ Reasoning Process:')
  trace.reasoning.forEach(step => {
    lines.push(`  Step ${step.step}: ${step.description}`)
    lines.push(`    Evidence: ${step.evidence.join(', ')}`)
    lines.push(`    Conclusion: ${step.conclusion}`)
    lines.push('')
  })
  
  // Lineage
  if (trace.lineage.length > 0) {
    lines.push('🧬 Data Lineage:')
    trace.lineage.forEach(line => {
      lines.push(`  • ${line}`)
    })
  }
  
  return lines.join('\n')
}

// ─── TRACE VALIDATION ───────────────────────────────────────────────────────
export function validateThinkingTrace(trace: ThinkingTrace): {
  isValid: boolean
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []
  
  // Check for empty trace
  if (trace.captures.length === 0 && trace.patterns.length === 0) {
    issues.push('No captures or patterns found')
    recommendations.push('Increase capture frequency or check pattern detection')
  }
  
  // Check confidence levels
  if (trace.confidence < 0.3) {
    issues.push('Low confidence score')
    recommendations.push('Provide more context or refine query')
  }
  
  // Check reasoning completeness
  if (trace.reasoning.length < 3) {
    issues.push('Limited reasoning steps')
    recommendations.push('Expand reasoning process for better transparency')
  }
  
  // Check data lineage
  if (trace.lineage.length === 0) {
    issues.push('No data lineage established')
    recommendations.push('Improve traceability of sources')
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    recommendations
  }
}
