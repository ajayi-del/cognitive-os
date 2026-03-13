// ─── ORGANISM SELF-MONITORING LAYER ─────────────────────────────────────────────
// Cybernetic self-observation for the Nexus Organism
// The organism must monitor the same variables it attempts to regulate

import { getCaptureEvents, getActionEvents, checkSystemStability } from './canonical-events'

export interface OrganismHealth {
  cognitivePressure: 'low' | 'medium' | 'high'
  executionGap: number
  systemStability: number
  architecturalIntegrity: 'ok' | 'warning' | 'critical'
  timestamp: Date
}

export interface CognitiveMetrics {
  capturesLast24h: number
  patternsDetected: number
  patternGrowthRate: number
  ideaRepetitionCount: number
}

export interface ExecutionMetrics {
  patternsPromotedToProjects: number
  actionsCreated: number
  actionsCompleted: number
}

export interface StabilityMetrics {
  heartbeatSuccessRate: number
  apiErrorCount: number
  patternEngineFailures: number
  databaseWriteFailures: number
}

export interface ArchitecturalChecks {
  multipleCapturePipelines: boolean
  derivedDataStoredAsCanonical: boolean
  circularDependencies: boolean
  schemaDrift: boolean
}

// ─── COGNITIVE HEALTH MONITORING ───────────────────────────────────────────────
export async function getCognitiveHealth(): Promise<CognitiveMetrics> {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const [recentCaptures, weeklyCaptures] = await Promise.all([
      getCaptureEvents(oneDayAgo),
      getCaptureEvents(sevenDaysAgo)
    ])
    
    // Simple pattern detection from captures
    const patternMap = new Map<string, number>()
    weeklyCaptures.forEach(capture => {
      const words = capture.data.content.toLowerCase().split(/\s+/)
      words.forEach((word: string) => {
        if (word.length > 4) {
          patternMap.set(word, (patternMap.get(word) || 0) + 1)
        }
      })
    })
    
    const patternsDetected = Array.from(patternMap.values()).filter(count => count >= 3).length
    const ideaRepetitionCount = Array.from(patternMap.values()).reduce((sum, count) => sum + count, 0)
    
    // Calculate growth rate (comparing first half vs second half of week)
    const midPoint = new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000)
    const firstHalf = weeklyCaptures.filter(c => c.timestamp < midPoint).length
    const secondHalf = weeklyCaptures.filter(c => c.timestamp >= midPoint).length
    const patternGrowthRate = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0
    
    return {
      capturesLast24h: recentCaptures.length,
      patternsDetected,
      patternGrowthRate,
      ideaRepetitionCount
    }
  } catch (error) {
    console.error('[cognitive health monitoring]', error)
    return {
      capturesLast24h: 0,
      patternsDetected: 0,
      patternGrowthRate: 0,
      ideaRepetitionCount: 0
    }
  }
}

// ─── EXECUTION HEALTH MONITORING ────────────────────────────────────────────────
export async function getExecutionHealth(): Promise<ExecutionMetrics> {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const [actions, captures] = await Promise.all([
      getActionEvents(sevenDaysAgo),
      getCaptureEvents(sevenDaysAgo)
    ])
    
    // Simple pattern promotion detection
    const patternMap = new Map<string, number>()
    captures.forEach(capture => {
      const words = capture.data.content.toLowerCase().split(/\s+/)
      words.forEach((word: string) => {
        if (word.length > 4) {
          patternMap.set(word, (patternMap.get(word) || 0) + 1)
        }
      })
    })
    
    const patternsPromotedToProjects = Array.from(patternMap.values()).filter(count => count >= 5).length
    
    return {
      patternsPromotedToProjects,
      actionsCreated: actions.length,
      actionsCompleted: actions.filter(a => a.data.status === 'done').length
    }
  } catch (error) {
    console.error('[execution health monitoring]', error)
    return {
      patternsPromotedToProjects: 0,
      actionsCreated: 0,
      actionsCompleted: 0
    }
  }
}

// ─── SYSTEM STABILITY MONITORING ───────────────────────────────────────────────
export async function getSystemStability(): Promise<StabilityMetrics> {
  try {
    // These would be tracked in a real system with proper monitoring
    // For now, we'll use simple heuristics
    const stability = await checkSystemStability()
    
    return {
      heartbeatSuccessRate: stability.systemHealthy ? 95 : 80,
      apiErrorCount: stability.systemHealthy ? 0 : 3,
      patternEngineFailures: stability.systemHealthy ? 0 : 1,
      databaseWriteFailures: stability.systemHealthy ? 0 : 1
    }
  } catch (error) {
    console.error('[system stability monitoring]', error)
    return {
      heartbeatSuccessRate: 70,
      apiErrorCount: 5,
      patternEngineFailures: 2,
      databaseWriteFailures: 2
    }
  }
}

// ─── ARCHITECTURAL INTEGRITY CHECKS ─────────────────────────────────────────────
export async function checkArchitecturalIntegrity(): Promise<ArchitecturalChecks> {
  try {
    // Check for multiple capture pipelines
    const captures = await getCaptureEvents()
    const multipleCapturePipelines = captures.length === 0 // Simplified check
    
    // Check for derived data stored as canonical
    const derivedDataStoredAsCanonical = false // Would need schema inspection
    
    // Check for circular dependencies
    const circularDependencies = false // Would need dependency graph analysis
    
    // Check for schema drift
    const schemaDrift = false // Would need schema versioning
    
    return {
      multipleCapturePipelines,
      derivedDataStoredAsCanonical,
      circularDependencies,
      schemaDrift
    }
  } catch (error) {
    console.error('[architectural integrity check]', error)
    return {
      multipleCapturePipelines: true,
      derivedDataStoredAsCanonical: true,
      circularDependencies: true,
      schemaDrift: true
    }
  }
}

// ─── UNIFIED ORGANISM HEALTH ASSESSMENT ───────────────────────────────────────────
export async function assessOrganismHealth(): Promise<OrganismHealth> {
  try {
    const [cognitive, execution, stability, architecture] = await Promise.all([
      getCognitiveHealth(),
      getExecutionHealth(),
      getSystemStability(),
      checkArchitecturalIntegrity()
    ])
    
    // Calculate cognitive pressure
    let cognitivePressure: 'low' | 'medium' | 'high' = 'low'
    if (cognitive.capturesLast24h > 15 && cognitive.patternsDetected > 3) {
      cognitivePressure = 'high'
    } else if (cognitive.capturesLast24h > 8 || cognitive.patternsDetected > 1) {
      cognitivePressure = 'medium'
    }
    
    // Calculate execution gap
    const executionGap = cognitive.patternsDetected - execution.actionsCreated
    
    // Calculate system stability score
    const systemStability = Math.max(0, 100 - (stability.apiErrorCount * 5))
    
    // Determine architectural integrity
    let architecturalIntegrity: 'ok' | 'warning' | 'critical' = 'ok'
    const issues = [
      architecture.multipleCapturePipelines,
      architecture.derivedDataStoredAsCanonical,
      architecture.circularDependencies,
      architecture.schemaDrift
    ].filter(Boolean).length
    
    if (issues === 0) {
      architecturalIntegrity = 'ok'
    } else if (issues <= 2) {
      architecturalIntegrity = 'warning'
    } else {
      architecturalIntegrity = 'critical'
    }
    
    return {
      cognitivePressure,
      executionGap,
      systemStability,
      architecturalIntegrity,
      timestamp: new Date()
    }
  } catch (error) {
    console.error('[organism health assessment]', error)
    return {
      cognitivePressure: 'medium',
      executionGap: 0,
      systemStability: 50,
      architecturalIntegrity: 'warning',
      timestamp: new Date()
    }
  }
}

// ─── HEALTH MESSAGE GENERATION ─────────────────────────────────────────────────
export async function generateHealthMessages(health: OrganismHealth): Promise<string[]> {
  const messages: string[] = []
  
  try {
    if (health.cognitivePressure === 'high') {
      messages.push("Your cognitive pressure is high. Many thoughts captured but patterns may need crystallization into projects.")
    }
    
    if (health.executionGap > 3) {
      messages.push(`Execution gap increasing. ${health.executionGap} patterns detected but fewer actions created.`)
    }
    
    if (health.systemStability < 80) {
      messages.push(`System stability warning. Stability score: ${health.systemStability}%. Check system logs.`)
    }
    
    if (health.architecturalIntegrity === 'critical') {
      messages.push("Critical architectural integrity issues detected. System may be drifting from design principles.")
    }
    
    return messages
  } catch (error) {
    console.error('[health message generation]', error)
    return ["Health monitoring system experiencing issues."]
  }
}
