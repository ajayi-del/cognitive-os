// ─── PROJECT SKELETON GENERATOR ───────────────────────────────────────────────
// Converts project candidates into structured project workspaces
// Read-only consumer of pattern graph - never mutates canonical data

import { ProjectCandidate } from './project-crystallization'
import { getCaptureEvents } from './canonical-events'

export interface Project {
  id: string
  title: string
  description: string
  goal: string
  originPattern: string
  relatedPatterns: string[]
  relatedCaptures: string[]
  components: ProjectComponent[]
  createdAt: Date
  status: 'skeleton' | 'active' | 'completed' | 'archived'
  complexity: 'simple' | 'moderate' | 'complex'
  estimatedEffort: 'low' | 'medium' | 'high'
  adaptationSignal?: string
}

export interface ProjectComponent {
  id: string
  title: string
  description: string
  type: 'research' | 'design' | 'prototype' | 'implementation' | 'testing'
  priority: 'high' | 'medium' | 'low'
  dependencies: string[] // Other component IDs
  estimatedHours: number
  status: 'pending' | 'in_progress' | 'completed'
}

// ─── PROJECT SKELETON GENERATION ───────────────────────────────────────────────
export async function generateProjectSkeleton(
  candidate: ProjectCandidate
): Promise<Project> {
  try {
    const projectId = `project_${candidate.theme.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}`
    
    // Generate project title and description
    const title = formatProjectTitle(candidate.theme)
    const description = generateProjectDescription(candidate)
    const goal = generateProjectGoal(candidate.theme, candidate.adaptationSignal)
    
    // Determine complexity and effort
    const complexity = determineComplexity(candidate)
    const estimatedEffort = determineEffort(candidate, complexity)
    
    // Generate project components based on pattern characteristics
    const components = generateProjectComponents(candidate, complexity)
    
    return {
      id: projectId,
      title,
      description,
      goal,
      originPattern: candidate.theme,
      relatedPatterns: candidate.relatedPatterns,
      relatedCaptures: candidate.relatedCaptures,
      components,
      createdAt: new Date(),
      status: 'skeleton',
      complexity,
      estimatedEffort,
      adaptationSignal: candidate.adaptationSignal
    }
  } catch (error) {
    console.error('[project skeleton generation]', error)
    throw new Error(`Failed to generate project skeleton for ${candidate.theme}`)
  }
}

// ─── PROJECT TITLING AND DESCRIPTION ───────────────────────────────────────────
function formatProjectTitle(theme: string): string {
  // Convert pattern theme into project title
  const titleMappings: Record<string, string> = {
    'cybernetics': 'Cybernetic Systems',
    'automation': 'Automation Framework',
    'pattern': 'Pattern Recognition',
    'feedback': 'Feedback Control',
    'trading': 'Trading Algorithm',
    'learning': 'Learning System',
    'intelligence': 'Intelligence Engine',
    'design': 'Design System',
    'architecture': 'System Architecture',
    'analysis': 'Analysis Framework'
  }
  
  // Check for exact matches first
  if (titleMappings[theme]) {
    return titleMappings[theme]
  }
  
  // Check for partial matches
  for (const [key, value] of Object.entries(titleMappings)) {
    if (theme.includes(key)) {
      return value
    }
  }
  
  // Default: capitalize and format
  return theme.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function generateProjectDescription(candidate: ProjectCandidate): string {
  const { theme, adaptationSignal, relatedPatterns, patternOccurrences } = candidate
  
  let description = `A project based on the recurring pattern "${theme}" `
  
  if (adaptationSignal === 'promotion') {
    description += `that has crystallized through ${patternOccurrences} occurrences, indicating readiness for structured development.`
  } else if (adaptationSignal === 'convergence') {
    description += `emerging from the convergence of multiple related patterns: ${relatedPatterns.slice(0, 3).join(', ')}.`
  } else {
    description += `identified through pattern analysis with ${patternOccurrences} occurrences.`
  }
  
  description += ` This project leverages your existing insights and builds upon established cognitive foundations.`
  
  return description
}

function generateProjectGoal(theme: string, signal: string): string {
  const goalTemplates: Record<string, string> = {
    'cybernetics': `Build a cybernetic control system that regulates itself through feedback loops.`,
    'automation': `Create an automated system that reduces manual intervention while maintaining oversight.`,
    'pattern': `Develop a pattern recognition system that identifies and responds to recurring signals.`,
    'feedback': `Design a feedback mechanism that continuously improves system performance through adaptation.`,
    'trading': `Construct a trading system that uses algorithmic decision-making for market operations.`,
    'learning': `Build a learning system that adapts and improves based on new information and experience.`,
    'intelligence': `Create an intelligence engine that processes information and generates actionable insights.`,
    'design': `Establish a design system that provides consistency and efficiency across all components.`,
    'architecture': `Design a system architecture that supports scalability, maintainability, and extensibility.`
  }
  
  // Check for theme matches
  for (const [key, template] of Object.entries(goalTemplates)) {
    if (theme.includes(key)) {
      return template
    }
  }
  
  // Default goal based on signal type
  if (signal === 'promotion') {
    return `Transform the "${theme}" pattern into a fully functional system that delivers consistent value.`
  } else if (signal === 'convergence') {
    return `Integrate multiple related patterns around "${theme}" into a cohesive and unified solution.`
  } else {
    return `Explore and develop the "${theme}" concept into a practical implementation.`
  }
}

// ─── COMPLEXITY AND EFFORT ESTIMATION ───────────────────────────────────────────
function determineComplexity(candidate: ProjectCandidate): 'simple' | 'moderate' | 'complex' {
  const { relatedPatterns, relatedCaptures, confidence } = candidate
  
  if (relatedPatterns.length <= 2 && relatedCaptures.length <= 5 && confidence >= 0.7) {
    return 'simple'
  } else if (relatedPatterns.length > 5 || relatedCaptures.length > 15 || confidence < 0.6) {
    return 'complex'
  } else {
    return 'moderate'
  }
}

function determineEffort(
  candidate: ProjectCandidate, 
  complexity: 'simple' | 'moderate' | 'complex'
): 'low' | 'medium' | 'high' {
  const baseEffort: Record<string, 'low' | 'medium' | 'high'> = {
    simple: 'low',
    moderate: 'medium',
    complex: 'high'
  }
  
  // Adjust based on confidence
  if (candidate.confidence >= 0.8) {
    return baseEffort[complexity] || 'medium'
  } else if (candidate.confidence < 0.6) {
    return complexity === 'simple' ? 'medium' : 'high'
  } else {
    return baseEffort[complexity] || 'medium'
  }
}

// ─── PROJECT COMPONENT GENERATION ───────────────────────────────────────────────
function generateProjectComponents(
  candidate: ProjectCandidate, 
  complexity: 'simple' | 'moderate' | 'complex'
): ProjectComponent[] {
  const { theme, relatedPatterns, adaptationSignal } = candidate
  const components: ProjectComponent[] = []
  
  // Base components for all projects
  components.push({
    id: 'research',
    title: `${theme} Research`,
    description: `Investigate existing approaches and best practices for ${theme} systems.`,
    type: 'research',
    priority: 'high',
    dependencies: [],
    estimatedHours: complexity === 'simple' ? 8 : complexity === 'moderate' ? 16 : 24,
    status: 'pending'
  })
  
  // Design component
  components.push({
    id: 'design',
    title: 'System Design',
    description: `Design the architecture and components for the ${theme} system.`,
    type: 'design',
    priority: 'high',
    dependencies: ['research'],
    estimatedHours: complexity === 'simple' ? 12 : complexity === 'moderate' ? 20 : 32,
    status: 'pending'
  })
  
  // Implementation components based on complexity
  if (complexity === 'simple') {
    components.push({
      id: 'implementation',
      title: 'Core Implementation',
      description: `Build the essential functionality for the ${theme} system.`,
      type: 'implementation',
      priority: 'high',
      dependencies: ['design'],
      estimatedHours: 20,
      status: 'pending'
    })
  } else {
    // Modular implementation for moderate/complex projects
    components.push({
      id: 'core_module',
      title: 'Core Module',
      description: `Implement the central ${theme} functionality.`,
      type: 'implementation',
      priority: 'high',
      dependencies: ['design'],
      estimatedHours: 24,
      status: 'pending'
    })
    
    if (complexity === 'complex' || relatedPatterns.length > 3) {
      components.push({
        id: 'integration_module',
        title: 'Integration Module',
        description: `Integrate ${theme} with related systems: ${relatedPatterns.slice(0, 2).join(', ')}.`,
        type: 'implementation',
        priority: 'medium',
        dependencies: ['core_module'],
        estimatedHours: 16,
        status: 'pending'
      })
    }
  }
  
  // Testing component
  components.push({
    id: 'testing',
    title: 'Testing and Validation',
    description: `Test the ${theme} system and validate its effectiveness.`,
    type: 'testing',
    priority: 'medium',
    dependencies: complexity === 'simple' ? ['implementation'] : ['core_module'],
    estimatedHours: complexity === 'simple' ? 8 : 16,
    status: 'pending'
  })
  
  // Specialized components based on adaptation signal
  if (adaptationSignal === 'convergence') {
    components.push({
      id: 'convergence_analysis',
      title: 'Convergence Analysis',
      description: `Analyze how ${theme} converges with related patterns: ${relatedPatterns.slice(0, 2).join(', ')}.`,
      type: 'research',
      priority: 'medium',
      dependencies: ['research'],
      estimatedHours: 12,
      status: 'pending'
    })
  }
  
  if (adaptationSignal === 'promotion') {
    components.push({
      id: 'optimization',
      title: 'System Optimization',
      description: `Optimize the ${theme} system based on crystallized patterns and feedback.`,
      type: 'implementation',
      priority: 'medium',
      dependencies: complexity === 'simple' ? ['testing'] : ['core_module'],
      estimatedHours: 16,
      status: 'pending'
    })
  }
  
  return components
}

// ─── PROJECT ANALYSIS UTILITIES ───────────────────────────────────────────────
export async function analyzeProjectFeasibility(project: Project): Promise<{
  feasibilityScore: number
  riskFactors: string[]
  recommendations: string[]
  estimatedTimeline: string
}> {
  try {
    const totalHours = project.components.reduce((sum, comp) => sum + comp.estimatedHours, 0)
    const highPriorityComponents = project.components.filter(c => c.priority === 'high').length
    
    let feasibilityScore = 70 // Base score
    const riskFactors: string[] = []
    const recommendations: string[] = []
    
    // Risk factor analysis
    if (project.complexity === 'complex') {
      feasibilityScore -= 20
      riskFactors.push('High complexity may extend timeline')
    }
    
    if (project.estimatedEffort === 'high') {
      feasibilityScore -= 15
      riskFactors.push('High effort requirement')
      recommendations.push('Consider breaking into smaller phases')
    }
    
    if (highPriorityComponents > 4) {
      feasibilityScore -= 10
      riskFactors.push('Many high-priority components')
      recommendations.push('Prioritize critical path components')
    }
    
    if (project.relatedCaptures.length < 5) {
      feasibilityScore -= 10
      riskFactors.push('Limited source material')
      recommendations.push('Gather more research and insights')
    }
    
    // Boost factors
    if (project.relatedPatterns.length > 3) {
      feasibilityScore += 10
      recommendations.push('Leverage pattern ecosystem for integration')
    }
    
    if (project.adaptationSignal === 'promotion') {
      feasibilityScore += 15
      recommendations.push('Strong crystallization indicates high success probability')
    }
    
    feasibilityScore = Math.max(0, Math.min(100, feasibilityScore))
    
    // Timeline estimation
    let timeline = ''
    if (totalHours < 40) {
      timeline = '1-2 weeks'
    } else if (totalHours < 80) {
      timeline = '3-4 weeks'
    } else if (totalHours < 160) {
      timeline = '1-2 months'
    } else {
      timeline = '2-3 months'
    }
    
    if (project.complexity === 'complex') {
      timeline = 'Extended ' + timeline
    }
    
    return {
      feasibilityScore,
      riskFactors,
      recommendations,
      estimatedTimeline: timeline
    }
  } catch (error) {
    console.error('[project feasibility analysis]', error)
    return {
      feasibilityScore: 50,
      riskFactors: ['Analysis failed'],
      recommendations: ['Manual review required'],
      estimatedTimeline: 'Unknown'
    }
  }
}
