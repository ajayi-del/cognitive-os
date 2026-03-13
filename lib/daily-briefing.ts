// ─── DAILY NEXUS BRIEFING ───────────────────────────────────────────────────────
// Generates a daily intelligence summary for the Nexus Organism
// Read-only consumer of pattern graph - never mutates canonical data

import { getCaptureEvents, getActionEvents } from './canonical-events'
import { runAdaptiveReorganization } from './organism-adaptation'
import { runCognitiveSynthesis } from './cognitive-synthesis'
import { detectProjectCandidates } from './project-crystallization'

export interface DailyBriefing {
  date: string
  period: '24h' | '7d' | '30d'
  summary: {
    captures: number
    patterns: number
    insights: number
    projects: number
    tasks: number
  }
  highlights: {
    topPattern: string
    emergingTheme: string
    projectCandidate: string
    cognitiveInsight: string
  }
  recommendations: {
    focus: string
    exploration: string
    action: string
  }
  organismHealth: {
    activity: 'high' | 'medium' | 'low'
    growth: 'accelerating' | 'stable' | 'declining'
    coherence: 'strong' | 'moderate' | 'fragmented'
  }
  generatedAt: Date
}

export interface BriefingConfig {
  includeInsights: boolean
  includeProjects: boolean
  includeTasks: boolean
  timeHorizon: '24h' | '7d' | '30d'
}

// ─── MAIN BRIEFING GENERATOR ─────────────────────────────────────────────────────
export async function generateDailyBriefing(
  config: BriefingConfig = {
    includeInsights: true,
    includeProjects: true,
    includeTasks: true,
    timeHorizon: '24h'
  }
): Promise<DailyBriefing> {
  try {
    const now = new Date()
    const timeRanges = {
      '24h': new Date(Date.now() - 24 * 60 * 60 * 1000),
      '7d': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
    
    const timeRange = timeRanges[config.timeHorizon]
    
    // Gather all necessary data
    const [captures, actions, adaptationResult, synthesisResult, projectCandidates] = await Promise.all([
      getCaptureEvents(timeRange),
      getActionEvents(timeRange),
      runAdaptiveReorganization(),
      config.includeInsights ? runCognitiveSynthesis() : Promise.resolve({ insights: [] }),
      config.includeProjects ? detectProjectCandidates() : Promise.resolve([])
    ])
    
    // Calculate summary metrics
    const summary = calculateSummary(captures, actions, adaptationResult, synthesisResult, projectCandidates, config)
    
    // Identify highlights
    const highlights = identifyHighlights(captures, adaptationResult, synthesisResult, projectCandidates, config)
    
    // Generate recommendations
    const recommendations = generateRecommendations(captures, adaptationResult, projectCandidates, config)
    
    // Assess organism health
    const organismHealth = assessOrganismHealth(captures, adaptationResult, synthesisResult)
    
    return {
      date: now.toISOString().split('T')[0],
      period: config.timeHorizon,
      summary,
      highlights,
      recommendations,
      organismHealth,
      generatedAt: now
    }
  } catch (error) {
    console.error('[daily briefing generation]', error)
    return createFallbackBriefing(config.timeHorizon)
  }
}

// ─── SUMMARY CALCULATION ─────────────────────────────────────────────────────
function calculateSummary(
  captures: any[],
  actions: any[],
  adaptationResult: any,
  synthesisResult: any,
  projectCandidates: any[],
  config: BriefingConfig
) {
  return {
    captures: captures.length,
    patterns: adaptationResult.graph.nodes.size,
    insights: config.includeInsights ? synthesisResult.insights.length : 0,
    projects: config.includeProjects ? projectCandidates.length : 0,
    tasks: config.includeTasks ? actions.length : 0
  }
}

// ─── HIGHLIGHTS IDENTIFICATION ─────────────────────────────────────────────────
function identifyHighlights(
  captures: any[],
  adaptationResult: any,
  synthesisResult: any,
  projectCandidates: any[],
  config: BriefingConfig
) {
  // Find top pattern (most occurrences)
  const patternEntries = Object.entries(adaptationResult.graph.nodes || {}) as [string, any][]
  const topPattern = patternEntries
    .sort((a, b) => (b[1]?.occurrences || 0) - (a[1]?.occurrences || 0))[0]
  
  // Find emerging theme (highest growth rate)
  const emergingTheme = patternEntries
    .sort((a, b) => ((b[1]?.growthRate || 0) - (a[1]?.growthRate || 0)))[0]
  
  // Find top project candidate
  const topProjectCandidate = projectCandidates
    .sort((a, b) => b.confidence - a.confidence)[0]
  
  // Find top cognitive insight
  const topCognitiveInsight = config.includeInsights && synthesisResult.insights.length > 0
    ? synthesisResult.insights.sort((a: any, b: any) => b.confidence - a.confidence)[0]
    : null
  
  return {
    topPattern: topPattern ? topPattern[0] : 'None identified',
    emergingTheme: emergingTheme ? emergingTheme[0] : 'None identified',
    projectCandidate: topProjectCandidate ? topProjectCandidate.theme : 'None identified',
    cognitiveInsight: topCognitiveInsight ? topCognitiveInsight.title : 'None identified'
  }
}

// ─── RECOMMENDATIONS GENERATION ───────────────────────────────────────────────
function generateRecommendations(
  captures: any[],
  adaptationResult: any,
  projectCandidates: any[],
  config: BriefingConfig
) {
  const recommendations = {
    focus: 'Continue current patterns',
    exploration: 'Explore related domains',
    action: 'Maintain current activity level'
  }
  
  // Focus recommendation based on top pattern
  const patternEntries = Object.entries(adaptationResult.graph.nodes || {}) as [string, any][]
  const topPattern = patternEntries
    .sort((a, b) => (b[1]?.occurrences || 0) - (a[1]?.occurrences || 0))[0]
  
  if (topPattern && topPattern[1].occurrences >= 3) {
    recommendations.focus = `Deepen work on "${topPattern[0]}" - showing strong pattern formation`
  } else if (captures.length < 3) {
    recommendations.focus = 'Increase capture frequency - low activity detected'
  }
  
  // Exploration recommendation based on adaptation signals
  const convergenceSignals = adaptationResult.signals.filter((s: any) => s.type === 'convergence')
  if (convergenceSignals.length > 0) {
    recommendations.exploration = `Explore convergence between: ${convergenceSignals[0].patterns.join(' and ')}`
  }
  
  // Action recommendation based on project candidates
  if (config.includeProjects && projectCandidates.length > 0) {
    const topCandidate = projectCandidates.sort((a, b) => b.confidence - a.confidence)[0]
    if (topCandidate.confidence >= 0.7) {
      recommendations.action = `Consider elevating "${topCandidate.theme}" to active project`
    }
  }
  
  return recommendations
}

// ─── ORGANISM HEALTH ASSESSMENT ───────────────────────────────────────────────
function assessOrganismHealth(
  captures: any[],
  adaptationResult: any,
  synthesisResult: any
) {
  // Activity assessment
  let activity: 'high' | 'medium' | 'low' = 'medium'
  if (captures.length >= 10) {
    activity = 'high'
  } else if (captures.length < 3) {
    activity = 'low'
  }
  
  // Growth assessment
  let growth: 'accelerating' | 'stable' | 'declining' = 'stable'
  const patternNodes = Object.values(adaptationResult.graph.nodes || {}) as any[]
  const patternGrowthRates = patternNodes
    .map((node: any) => node?.growthRate || 0)
  
  const avgGrowthRate = patternGrowthRates.length > 0 
    ? patternGrowthRates.reduce((sum, rate) => sum + rate, 0) / patternGrowthRates.length 
    : 0
  
  if (avgGrowthRate > 0.1) {
    growth = 'accelerating'
  } else if (avgGrowthRate < -0.1) {
    growth = 'declining'
  }
  
  // Coherence assessment
  let coherence: 'strong' | 'moderate' | 'fragmented' = 'moderate'
  const clusterCount = adaptationResult.graph.clusters.size
  const patternCount = adaptationResult.graph.nodes.size
  
  if (patternCount > 0 && clusterCount / patternCount > 0.3) {
    coherence = 'strong'
  } else if (patternCount > 0 && clusterCount / patternCount < 0.1) {
    coherence = 'fragmented'
  }
  
  return {
    activity,
    growth,
    coherence
  }
}

// ─── FALLBACK BRIEFING ───────────────────────────────────────────────────────
function createFallbackBriefing(timeHorizon: '24h' | '7d' | '30d'): DailyBriefing {
  return {
    date: new Date().toISOString().split('T')[0],
    period: timeHorizon,
    summary: {
      captures: 0,
      patterns: 0,
      insights: 0,
      projects: 0,
      tasks: 0
    },
    highlights: {
      topPattern: 'System initializing',
      emergingTheme: 'Awaiting data',
      projectCandidate: 'None identified',
      cognitiveInsight: 'System warming up'
    },
    recommendations: {
      focus: 'Start capturing thoughts in Diary',
      exploration: 'Begin building pattern history',
      action: 'Establish regular capture routine'
    },
    organismHealth: {
      activity: 'low',
      growth: 'stable',
      coherence: 'fragmented'
    },
    generatedAt: new Date()
  }
}

// ─── BRIEFING FORMATTING UTILITIES ─────────────────────────────────────────────
export function formatBriefingForDisplay(briefing: DailyBriefing): string {
  const lines: string[] = []
  
  lines.push(`🧠 Nexus Daily Briefing - ${briefing.date}`)
  lines.push(`Period: ${briefing.period.toUpperCase()}`)
  lines.push('')
  
  // Summary
  lines.push('📊 Summary')
  lines.push(`• Captures: ${briefing.summary.captures}`)
  lines.push(`• Patterns: ${briefing.summary.patterns}`)
  lines.push(`• Insights: ${briefing.summary.insights}`)
  lines.push(`• Projects: ${briefing.summary.projects}`)
  lines.push(`• Tasks: ${briefing.summary.tasks}`)
  lines.push('')
  
  // Highlights
  lines.push('🌟 Highlights')
  lines.push(`• Top Pattern: ${briefing.highlights.topPattern}`)
  lines.push(`• Emerging Theme: ${briefing.highlights.emergingTheme}`)
  lines.push(`• Project Candidate: ${briefing.highlights.projectCandidate}`)
  lines.push(`• Cognitive Insight: ${briefing.highlights.cognitiveInsight}`)
  lines.push('')
  
  // Recommendations
  lines.push('💡 Recommendations')
  lines.push(`• Focus: ${briefing.recommendations.focus}`)
  lines.push(`• Exploration: ${briefing.recommendations.exploration}`)
  lines.push(`• Action: ${briefing.recommendations.action}`)
  lines.push('')
  
  // Organism Health
  lines.push('🏥 Organism Health')
  lines.push(`• Activity: ${briefing.organismHealth.activity}`)
  lines.push(`• Growth: ${briefing.organismHealth.growth}`)
  lines.push(`• Coherence: ${briefing.organismHealth.coherence}`)
  
  return lines.join('\n')
}

export function formatBriefingForNexusFeed(briefing: DailyBriefing): any {
  return {
    type: 'daily_briefing',
    priority: 2,
    title: `Daily Briefing - ${briefing.date}`,
    content: {
      text: formatBriefingForDisplay(briefing),
      summary: briefing.summary,
      highlights: briefing.highlights,
      recommendations: briefing.recommendations,
      organismHealth: briefing.organismHealth,
      period: briefing.period,
      derivedFrom: 'daily_briefing'
    },
    requiresAction: briefing.recommendations.action !== 'Maintain current activity level',
    relatedIds: [],
    createdAt: briefing.generatedAt
  }
}

// ─── SCHEDULING UTILITIES ─────────────────────────────────────────────────────
export interface BriefingSchedule {
  enabled: boolean
  frequency: 'daily' | 'weekly'
  time: string // HH:MM format
  timezone: string
}

export function getNextBriefingTime(schedule: BriefingSchedule): Date {
  if (!schedule.enabled) {
    return new Date(0) // Return epoch if disabled
  }
  
  const now = new Date()
  const [hours, minutes] = schedule.time.split(':').map(Number)
  
  const nextBriefing = new Date()
  nextBriefing.setHours(hours, minutes, 0, 0)
  
  // If the time has passed today, schedule for tomorrow
  if (nextBriefing <= now) {
    nextBriefing.setDate(nextBriefing.getDate() + 1)
  }
  
  return nextBriefing
}

export function shouldGenerateBriefing(schedule: BriefingSchedule): boolean {
  if (!schedule.enabled) {
    return false
  }
  
  const now = new Date()
  const [hours, minutes] = schedule.time.split(':').map(Number)
  
  const scheduledTime = new Date()
  scheduledTime.setHours(hours, minutes, 0, 0)
  
  // Check if we're within 1 hour of the scheduled time
  const oneHour = 60 * 60 * 1000
  return Math.abs(now.getTime() - scheduledTime.getTime()) < oneHour
}
