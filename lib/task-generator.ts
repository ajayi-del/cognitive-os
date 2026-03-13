// ─── TASK GENERATION ENGINE ───────────────────────────────────────────────────
// Converts captures and patterns into actionable tasks
// Read-only consumer of pattern graph - never mutates canonical data

import { getCaptureEvents } from './canonical-events'
import { Project } from './project-skeleton'
import { runAdaptiveReorganization } from './organism-adaptation'

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  type: 'research' | 'design' | 'implementation' | 'testing' | 'analysis' | 'optimization'
  priority: 'high' | 'medium' | 'low'
  sourceCapture: string
  sourcePattern: string
  estimatedHours: number
  dependencies: string[]
  status: 'pending' | 'in_progress' | 'completed' | 'blocked'
  createdAt: Date
  context: TaskContext
}

export interface TaskContext {
  relatedCaptures: string[]
  relatedPatterns: string[]
  projectGoal: string
  adaptationSignal: string
  confidenceLevel: number
}

export interface TaskGenerationConfig {
  maxTasksPerProject: number
  minConfidenceThreshold: number
  includeResearchTasks: boolean
  includeOptimizationTasks: boolean
}

// ─── TASK GENERATION FROM PROJECTS ─────────────────────────────────────────────
export async function generateTasksForProject(
  project: Project,
  config: TaskGenerationConfig = {
    maxTasksPerProject: 8,
    minConfidenceThreshold: 0.6,
    includeResearchTasks: true,
    includeOptimizationTasks: true
  }
): Promise<Task[]> {
  try {
    const tasks: Task[] = []
    const relatedCaptures = await getCaptureEvents()
    
    // Filter captures related to this project
    const projectCaptures = relatedCaptures.filter(capture => 
      project.relatedCaptures.includes(capture.id) ||
      project.relatedPatterns.some(pattern => 
        capture.data.content.toLowerCase().includes(pattern.toLowerCase())
      )
    )
    
    // Generate tasks from project components
    for (const component of project.components) {
      const componentTasks = await generateTasksFromComponent(
        component,
        project,
        projectCaptures,
        config
      )
      tasks.push(...componentTasks)
    }
    
    // Generate additional insight-based tasks
    const insightTasks = await generateInsightTasks(project, projectCaptures, config)
    tasks.push(...insightTasks)
    
    // Sort by priority and limit
    const sortedTasks = tasks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    
    return sortedTasks.slice(0, config.maxTasksPerProject)
  } catch (error) {
    console.error('[task generation]', error)
    return []
  }
}

// ─── TASK GENERATION FROM COMPONENTS ───────────────────────────────────────────
async function generateTasksFromComponent(
  component: any,
  project: Project,
  projectCaptures: any[],
  config: TaskGenerationConfig
): Promise<Task[]> {
  const tasks: Task[] = []
  
  switch (component.type) {
    case 'research':
      tasks.push(...generateResearchTasks(component, project, projectCaptures))
      break
    case 'design':
      tasks.push(...generateDesignTasks(component, project, projectCaptures))
      break
    case 'implementation':
      tasks.push(...generateImplementationTasks(component, project, projectCaptures))
      break
    case 'testing':
      tasks.push(...generateTestingTasks(component, project, projectCaptures))
      break
  }
  
  return tasks
}

// ─── RESEARCH TASK GENERATION ─────────────────────────────────────────────────
function generateResearchTasks(
  component: any,
  project: Project,
  projectCaptures: any[]
): Task[] {
  const tasks: Task[] = []
  
  // Main research task
  tasks.push({
    id: `task_${project.id}_research_main`,
    projectId: project.id,
    title: component.title,
    description: component.description,
    type: 'research',
    priority: component.priority,
    sourceCapture: project.relatedCaptures[0] || '',
    sourcePattern: project.originPattern,
    estimatedHours: component.estimatedHours,
    dependencies: component.dependencies,
    status: 'pending',
    createdAt: new Date(),
    context: {
      relatedCaptures: project.relatedCaptures.slice(0, 3),
      relatedPatterns: project.relatedPatterns,
      projectGoal: project.goal,
      adaptationSignal: 'promotion', // Default for research
      confidenceLevel: 0.8
    }
  })
  
  // Specific research sub-tasks based on captures
  const researchCaptures = projectCaptures.filter(capture =>
    capture.data.content.toLowerCase().includes('research') ||
    capture.data.content.toLowerCase().includes('study') ||
    capture.data.content.toLowerCase().includes('investigate')
  )
  
  researchCaptures.slice(0, 2).forEach((capture, index) => {
    tasks.push({
      id: `task_${project.id}_research_${index}`,
      projectId: project.id,
      title: `Research: ${extractKeyTopic(capture.data.content)}`,
      description: `Investigate ${extractKeyTopic(capture.data.content)} based on your insight: "${capture.data.content}"`,
      type: 'research',
      priority: 'medium',
      sourceCapture: capture.id,
      sourcePattern: project.originPattern,
      estimatedHours: 4,
      dependencies: [],
      status: 'pending',
      createdAt: new Date(),
      context: {
        relatedCaptures: [capture.id],
        relatedPatterns: [project.originPattern],
        projectGoal: project.goal,
        adaptationSignal: 'research',
        confidenceLevel: 0.7
      }
    })
  })
  
  return tasks
}

// ─── DESIGN TASK GENERATION ───────────────────────────────────────────────────
function generateDesignTasks(
  component: any,
  project: Project,
  projectCaptures: any[]
): Task[] {
  const tasks: Task[] = []
  
  // Main design task
  tasks.push({
    id: `task_${project.id}_design_main`,
    projectId: project.id,
    title: component.title,
    description: component.description,
    type: 'design',
    priority: component.priority,
    sourceCapture: project.relatedCaptures[0] || '',
    sourcePattern: project.originPattern,
    estimatedHours: component.estimatedHours,
    dependencies: component.dependencies,
    status: 'pending',
    createdAt: new Date(),
    context: {
      relatedCaptures: project.relatedCaptures.slice(0, 3),
      relatedPatterns: project.relatedPatterns,
      projectGoal: project.goal,
      adaptationSignal: 'design',
      confidenceLevel: 0.8
    }
  })
  
  // Architecture design task
  tasks.push({
    id: `task_${project.id}_architecture`,
    projectId: project.id,
    title: `Architecture Design for ${project.title}`,
    description: `Design the system architecture that supports the goal: ${project.goal}`,
    type: 'design',
    priority: 'high',
    sourceCapture: project.relatedCaptures[0] || '',
    sourcePattern: project.originPattern,
    estimatedHours: 8,
    dependencies: component.dependencies,
    status: 'pending',
    createdAt: new Date(),
    context: {
      relatedCaptures: project.relatedCaptures.slice(0, 2),
      relatedPatterns: project.relatedPatterns,
      projectGoal: project.goal,
      adaptationSignal: 'architecture',
      confidenceLevel: 0.75
    }
  })
  
  return tasks
}

// ─── IMPLEMENTATION TASK GENERATION ───────────────────────────────────────────
function generateImplementationTasks(
  component: any,
  project: Project,
  projectCaptures: any[]
): Task[] {
  const tasks: Task[] = []
  
  // Main implementation task
  tasks.push({
    id: `task_${project.id}_impl_${component.id}`,
    projectId: project.id,
    title: component.title,
    description: component.description,
    type: 'implementation',
    priority: component.priority,
    sourceCapture: project.relatedCaptures[0] || '',
    sourcePattern: project.originPattern,
    estimatedHours: component.estimatedHours,
    dependencies: component.dependencies,
    status: 'pending',
    createdAt: new Date(),
    context: {
      relatedCaptures: project.relatedCaptures.slice(0, 3),
      relatedPatterns: project.relatedPatterns,
      projectGoal: project.goal,
      adaptationSignal: 'implementation',
      confidenceLevel: 0.8
    }
  })
  
  // Prototype task based on captures
  const prototypeCaptures = projectCaptures.filter(capture =>
    capture.data.content.toLowerCase().includes('prototype') ||
    capture.data.content.toLowerCase().includes('demo') ||
    capture.data.content.toLowerCase().includes('example')
  )
  
  if (prototypeCaptures.length > 0) {
    tasks.push({
      id: `task_${project.id}_prototype`,
      projectId: project.id,
      title: `Build Prototype for ${project.title}`,
      description: `Create a working prototype based on your insights about prototyping`,
      type: 'implementation',
      priority: 'medium',
      sourceCapture: prototypeCaptures[0].id,
      sourcePattern: project.originPattern,
      estimatedHours: 12,
      dependencies: component.dependencies,
      status: 'pending',
      createdAt: new Date(),
      context: {
        relatedCaptures: [prototypeCaptures[0].id],
        relatedPatterns: [project.originPattern],
        projectGoal: project.goal,
        adaptationSignal: 'prototype',
        confidenceLevel: 0.7
      }
    })
  }
  
  return tasks
}

// ─── TESTING TASK GENERATION ───────────────────────────────────────────────────
function generateTestingTasks(
  component: any,
  project: Project,
  projectCaptures: any[]
): Task[] {
  const tasks: Task[] = []
  
  // Main testing task
  tasks.push({
    id: `task_${project.id}_testing_main`,
    projectId: project.id,
    title: component.title,
    description: component.description,
    type: 'testing',
    priority: component.priority,
    sourceCapture: project.relatedCaptures[0] || '',
    sourcePattern: project.originPattern,
    estimatedHours: component.estimatedHours,
    dependencies: component.dependencies,
    status: 'pending',
    createdAt: new Date(),
    context: {
      relatedCaptures: project.relatedCaptures.slice(0, 2),
      relatedPatterns: project.relatedPatterns,
      projectGoal: project.goal,
      adaptationSignal: 'testing',
      confidenceLevel: 0.75
    }
  })
  
  // Validation task
  tasks.push({
    id: `task_${project.id}_validation`,
    projectId: project.id,
    title: `Validate ${project.title} Effectiveness`,
    description: `Test and validate that the ${project.title} meets its goal: ${project.goal}`,
    type: 'testing',
    priority: 'high',
    sourceCapture: project.relatedCaptures[0] || '',
    sourcePattern: project.originPattern,
    estimatedHours: 6,
    dependencies: component.dependencies,
    status: 'pending',
    createdAt: new Date(),
    context: {
      relatedCaptures: project.relatedCaptures.slice(0, 2),
      relatedPatterns: [project.originPattern],
      projectGoal: project.goal,
      adaptationSignal: 'validation',
      confidenceLevel: 0.8
    }
  })
  
  return tasks
}

// ─── INSIGHT-BASED TASK GENERATION ─────────────────────────────────────────────
async function generateInsightTasks(
  project: Project,
  projectCaptures: any[],
  config: TaskGenerationConfig
): Promise<Task[]> {
  const tasks: Task[] = []
  
  // Generate tasks from specific capture insights
  const insightCaptures = projectCaptures.filter(capture =>
    capture.data.content.length > 50 // Substantial insights
  )
  
  insightCaptures.slice(0, 3).forEach((capture, index) => {
    const taskType = determineTaskTypeFromContent(capture.data.content)
    const priority = determinePriorityFromContent(capture.data.content)
    
    tasks.push({
      id: `task_${project.id}_insight_${index}`,
      projectId: project.id,
      title: `Implement: ${extractActionableTitle(capture.data.content)}`,
      description: `Based on your insight: "${capture.data.content.substring(0, 100)}..."`,
      type: taskType,
      priority,
      sourceCapture: capture.id,
      sourcePattern: project.originPattern,
      estimatedHours: estimateHoursFromContent(capture.data.content),
      dependencies: [],
      status: 'pending',
      createdAt: new Date(),
      context: {
        relatedCaptures: [capture.id],
        relatedPatterns: [project.originPattern],
        projectGoal: project.goal,
        adaptationSignal: 'insight',
        confidenceLevel: 0.7
      }
    })
  })
  
  return tasks
}

// ─── TASK ANALYSIS UTILITIES ───────────────────────────────────────────────────
function extractKeyTopic(content: string): string {
  const words = content.toLowerCase().split(/\s+/)
  const keywords = words.filter(word => 
    word.length > 4 && 
    !['that', 'this', 'with', 'from', 'they', 'have', 'been'].includes(word)
  )
  return keywords[0] || 'concept'
}

function extractActionableTitle(content: string): string {
  // Extract actionable phrases
  const actionablePatterns = [
    /build\s+(.+?)(?:\s|$)/i,
    /create\s+(.+?)(?:\s|$)/i,
    /design\s+(.+?)(?:\s|$)/i,
    /implement\s+(.+?)(?:\s|$)/i,
    /develop\s+(.+?)(?:\s|$)/i
  ]
  
  for (const pattern of actionablePatterns) {
    const match = content.match(pattern)
    if (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1)
    }
  }
  
  // Fallback to first meaningful phrase
  const phrases = content.split(/[.!?]/)
  return phrases[0]?.trim().substring(0, 50) || 'Task from insight'
}

function determineTaskTypeFromContent(content: string): Task['type'] {
  const lowerContent = content.toLowerCase()
  
  if (lowerContent.includes('research') || lowerContent.includes('study') || lowerContent.includes('investigate')) {
    return 'research'
  } else if (lowerContent.includes('design') || lowerContent.includes('architecture') || lowerContent.includes('plan')) {
    return 'design'
  } else if (lowerContent.includes('test') || lowerContent.includes('validate') || lowerContent.includes('verify')) {
    return 'testing'
  } else if (lowerContent.includes('optimize') || lowerContent.includes('improve') || lowerContent.includes('enhance')) {
    return 'optimization'
  } else if (lowerContent.includes('analyze') || lowerContent.includes('review') || lowerContent.includes('examine')) {
    return 'analysis'
  } else {
    return 'implementation'
  }
}

function determinePriorityFromContent(content: string): Task['priority'] {
  const lowerContent = content.toLowerCase()
  
  if (lowerContent.includes('critical') || lowerContent.includes('urgent') || lowerContent.includes('important')) {
    return 'high'
  } else if (lowerContent.includes('consider') || lowerContent.includes('maybe') || lowerContent.includes('optional')) {
    return 'low'
  } else {
    return 'medium'
  }
}

function estimateHoursFromContent(content: string): number {
  // Simple heuristic based on content length and complexity
  const wordCount = content.split(/\s+/).length
  
  if (wordCount < 20) return 2
  if (wordCount < 50) return 4
  if (wordCount < 100) return 8
  return 12
}

// ─── TASK MANAGEMENT UTILITIES ───────────────────────────────────────────────
export interface TaskMetrics {
  totalTasks: number
  tasksByType: Record<Task['type'], number>
  tasksByPriority: Record<Task['priority'], number>
  totalEstimatedHours: number
  averageConfidence: number
}

export async function getTaskMetrics(tasks: Task[]): Promise<TaskMetrics> {
  const totalTasks = tasks.length
  const tasksByType = tasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1
    return acc
  }, {} as Record<Task['type'], number>)
  
  const tasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {} as Record<Task['priority'], number>)
  
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + task.estimatedHours, 0)
  const averageConfidence = tasks.length > 0 
    ? tasks.reduce((sum, task) => sum + task.context.confidenceLevel, 0) / tasks.length 
    : 0
  
  return {
    totalTasks,
    tasksByType,
    tasksByPriority,
    totalEstimatedHours,
    averageConfidence: Math.round(averageConfidence * 100) / 100
  }
}
