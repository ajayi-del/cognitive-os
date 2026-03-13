// ─── PROJECT CRYSTALLIZATION LAYER ───────────────────────────────────────────
// Detects when patterns evolve into project candidates
// Read-only consumer of pattern graph - never mutates canonical data

import { getCaptureEvents } from './canonical-events'
import { runAdaptiveReorganization } from './organism-adaptation'

export interface ProjectCandidate {
  id: string
  theme: string
  patternOccurrences: number
  patternRecency: number // days since last occurrence
  adaptationSignal: 'convergence' | 'promotion' | 'stagnation' | 'divergence'
  confidence: number
  relatedPatterns: string[]
  relatedCaptures: string[]
  createdAt: Date
  recommendation: 'elevate_to_project' | 'monitor_further' | 'archive_pattern'
}

export interface CrystallizationConfig {
  minOccurrences: number
  maxRecencyDays: number
  convergenceWeight: number
  promotionWeight: number
  confidenceThreshold: number
}

// ─── PROJECT CANDIDATE DETECTION ─────────────────────────────────────────────
export async function detectProjectCandidates(
  config: CrystallizationConfig = {
    minOccurrences: 4,
    maxRecencyDays: 14,
    convergenceWeight: 0.8,
    promotionWeight: 1.0,
    confidenceThreshold: 0.7
  }
): Promise<ProjectCandidate[]> {
  try {
    // Get recent captures and pattern graph
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const captures = await getCaptureEvents(thirtyDaysAgo)
    const adaptationResult = await runAdaptiveReorganization()
    
    const candidates: ProjectCandidate[] = []
    const now = new Date()
    
    // Analyze adaptation signals for project potential
    for (const signal of adaptationResult.signals) {
      if (signal.type === 'convergence' || signal.type === 'promotion') {
        for (const pattern of signal.patterns) {
          // Find all captures containing this pattern
          const patternCaptures = captures.filter(capture => 
            capture.data.content.toLowerCase().includes(pattern.toLowerCase())
          )
          
          // Calculate pattern metrics
          const patternOccurrences = patternCaptures.length
          const lastOccurrence = new Date(Math.max(...patternCaptures.map(c => c.timestamp.getTime())))
          const patternRecency = (now.getTime() - lastOccurrence.getTime()) / (24 * 60 * 60 * 1000)
          
          // Check crystallization criteria
          if (patternOccurrences >= config.minOccurrences && 
              patternRecency <= config.maxRecencyDays) {
            
            // Calculate confidence based on signal type and metrics
            let confidence = 0.5 // Base confidence
            
            if (signal.type === 'promotion') {
              confidence += config.promotionWeight * 0.3
            } else if (signal.type === 'convergence') {
              confidence += config.convergenceWeight * 0.2
            }
            
            // Boost confidence based on occurrence frequency
            confidence += Math.min((patternOccurrences - config.minOccurrences) * 0.1, 0.3)
            
            // Boost confidence based on recency (more recent = higher confidence)
            confidence += Math.max(0, (1 - patternRecency / config.maxRecencyDays) * 0.2)
            
            confidence = Math.min(confidence, 1.0)
            
            // Determine recommendation
            let recommendation: 'elevate_to_project' | 'monitor_further' | 'archive_pattern'
            if (confidence >= config.confidenceThreshold && signal.type === 'promotion') {
              recommendation = 'elevate_to_project'
            } else if (confidence >= config.confidenceThreshold * 0.8) {
              recommendation = 'monitor_further'
            } else {
              recommendation = 'archive_pattern'
            }
            
            // Find related patterns (from adaptation graph)
            const patternNode = adaptationResult.graph.nodes.get(pattern)
            const relatedPatterns = patternNode?.relatedPatterns || []
            
            candidates.push({
              id: `candidate_${pattern}_${Date.now()}`,
              theme: pattern,
              patternOccurrences,
              patternRecency: Math.round(patternRecency),
              adaptationSignal: signal.type,
              confidence: Math.round(confidence * 100) / 100,
              relatedPatterns,
              relatedCaptures: patternCaptures.map(c => c.id),
              createdAt: new Date(),
              recommendation
            })
          }
        }
      }
    }
    
    // Remove duplicates and sort by confidence
    const uniqueCandidates = candidates.filter((candidate, index, self) =>
      index === self.findIndex(c => c.theme === candidate.theme)
    )
    
    return uniqueCandidates.sort((a, b) => b.confidence - a.confidence)
  } catch (error) {
    console.error('[project crystallization]', error)
    return []
  }
}

// ─── PROJECT CANDIDATE ANALYSIS ───────────────────────────────────────────────
export async function analyzeProjectCandidate(
  candidate: ProjectCandidate
): Promise<{
  viability: 'high' | 'medium' | 'low'
  complexity: 'simple' | 'moderate' | 'complex'
  estimatedEffort: 'low' | 'medium' | 'high'
  riskFactors: string[]
  successFactors: string[]
}> {
  try {
    const riskFactors: string[] = []
    const successFactors: string[] = []
    
    // Analyze pattern characteristics
    if (candidate.patternRecency > 10) {
      riskFactors.push('Pattern is losing momentum')
    } else {
      successFactors.push('Active recent engagement')
    }
    
    if (candidate.adaptationSignal === 'promotion') {
      successFactors.push('Strong pattern crystallization')
    } else if (candidate.adaptationSignal === 'convergence') {
      successFactors.push('Cross-domain convergence detected')
      riskFactors.push('Multiple domains may increase complexity')
    }
    
    if (candidate.relatedPatterns.length > 5) {
      riskFactors.push('High complexity - many related patterns')
    } else if (candidate.relatedPatterns.length > 2) {
      successFactors.push('Good pattern support network')
    } else {
      riskFactors.push('Limited pattern ecosystem')
    }
    
    if (candidate.relatedCaptures.length > 10) {
      successFactors.push('Rich capture history')
    } else {
      riskFactors.push('Limited source material')
    }
    
    // Determine viability
    let viability: 'high' | 'medium' | 'low' = 'medium'
    if (candidate.confidence >= 0.8 && riskFactors.length <= 1) {
      viability = 'high'
    } else if (candidate.confidence >= 0.6 && riskFactors.length <= 2) {
      viability = 'medium'
    } else {
      viability = 'low'
    }
    
    // Determine complexity
    let complexity: 'simple' | 'moderate' | 'complex' = 'moderate'
    if (candidate.relatedPatterns.length <= 2 && candidate.relatedCaptures.length <= 5) {
      complexity = 'simple'
    } else if (candidate.relatedPatterns.length > 5 || candidate.relatedCaptures.length > 15) {
      complexity = 'complex'
    }
    
    // Determine estimated effort
    let estimatedEffort: 'low' | 'medium' | 'high' = 'medium'
    if (complexity === 'simple' && candidate.confidence >= 0.7) {
      estimatedEffort = 'low'
    } else if (complexity === 'complex' || candidate.confidence < 0.6) {
      estimatedEffort = 'high'
    }
    
    return {
      viability,
      complexity,
      estimatedEffort,
      riskFactors,
      successFactors
    }
  } catch (error) {
    console.error('[project candidate analysis]', error)
    return {
      viability: 'low',
      complexity: 'complex',
      estimatedEffort: 'high',
      riskFactors: ['Analysis failed'],
      successFactors: []
    }
  }
}

// ─── CRYSTALLIZATION MONITORING ───────────────────────────────────────────────
export interface CrystallizationMetrics {
  totalCandidates: number
  highViabilityCandidates: number
  averageConfidence: number
  topThemes: string[]
  signalDistribution: {
    convergence: number
    promotion: number
    stagnation: number
    divergence: number
  }
}

export async function getCrystallizationMetrics(): Promise<CrystallizationMetrics> {
  try {
    const candidates = await detectProjectCandidates()
    
    const highViabilityCandidates = candidates.filter(c => c.confidence >= 0.7).length
    const averageConfidence = candidates.length > 0 
      ? candidates.reduce((sum, c) => sum + c.confidence, 0) / candidates.length 
      : 0
    
    const topThemes = candidates
      .slice(0, 5)
      .map(c => c.theme)
    
    const signalDistribution = candidates.reduce((acc, candidate) => {
      acc[candidate.adaptationSignal]++
      return acc
    }, { convergence: 0, promotion: 0, stagnation: 0, divergence: 0 })
    
    return {
      totalCandidates: candidates.length,
      highViabilityCandidates,
      averageConfidence: Math.round(averageConfidence * 100) / 100,
      topThemes,
      signalDistribution
    }
  } catch (error) {
    console.error('[crystallization metrics]', error)
    return {
      totalCandidates: 0,
      highViabilityCandidates: 0,
      averageConfidence: 0,
      topThemes: [],
      signalDistribution: { convergence: 0, promotion: 0, stagnation: 0, divergence: 0 }
    }
  }
}
