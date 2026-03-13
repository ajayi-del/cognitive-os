// ─── COGNITIVE SYNTHESIS ENGINE ───────────────────────────────────────────────
// Advanced intelligence layer for cross-domain insight generation
// Synthesizes patterns across domains to generate novel insights

import { getCaptureEvents, getActionEvents } from './canonical-events'
import { runAdaptiveReorganization } from './organism-adaptation'

export interface CognitiveInsight {
  id: string
  type: 'cross_domain' | 'meta_pattern' | 'cognitive_gap' | 'synthesis'
  title: string
  description: string
  domains: string[]
  patterns: string[]
  confidence: number
  novelty: number
  timestamp: Date
  actionable: boolean
  synthesisPath: string[]
}

export interface CognitiveDomain {
  name: string
  patterns: string[]
  concepts: string[]
  relationships: string[]
  evolution: {
    emerging: string[]
    mature: string[]
    declining: string[]
  }
  health: {
    activity: number
    growth: number
    connections: number
  }
}

export interface SynthesisConfig {
  minPatternOverlap: number
  noveltyThreshold: number
  confidenceThreshold: number
  crossDomainThreshold: number
  synthesisDepth: number
}

// ─── COGNITIVE DOMAIN ANALYSIS ───────────────────────────────────────────────
export async function analyzeCognitiveDomains(
  captures: any[]
): Promise<Map<string, CognitiveDomain>> {
  const domains = new Map<string, CognitiveDomain>()
  const conceptMap = new Map<string, Set<string>>()
  
  // Extract concepts and group by semantic similarity
  captures.forEach(capture => {
    const words = capture.data.content.toLowerCase().split(/\s+/)
    const timestamp = capture.timestamp
    
    words.forEach((word: string) => {
      if (word.length > 4) {
        // Simple semantic grouping (in real system, would use embeddings)
        let domain = 'general'
        
        if (['system', 'architecture', 'design', 'structure'].includes(word)) {
          domain = 'systems'
        } else if (['learning', 'intelligence', 'cognition', 'knowledge'].includes(word)) {
          domain = 'cognitive'
        } else if (['trading', 'market', 'strategy', 'analysis'].includes(word)) {
          domain = 'trading'
        } else if (['pattern', 'recognition', 'detection', 'classification'].includes(word)) {
          domain = 'patterns'
        } else if (['feedback', 'control', 'regulation', 'adaptation'].includes(word)) {
          domain = 'cybernetics'
        }
        
        if (!domains.has(domain)) {
          domains.set(domain, {
            name: domain,
            patterns: [],
            concepts: [],
            relationships: [],
            evolution: { emerging: [], mature: [], declining: [] },
            health: { activity: 0, growth: 0, connections: 0 }
          })
        }
        
        const domainData = domains.get(domain)!
        domainData.patterns.push(word)
        
        if (!conceptMap.has(word)) {
          conceptMap.set(word, new Set())
        }
        conceptMap.get(word)!.add(domain)
      }
    })
  })
  
  // Calculate domain health metrics
  for (const [domainName, domain] of Array.from(domains.entries())) {
    const domainPatterns = new Set(domain.patterns)
    domain.health.activity = domainPatterns.size
    domain.health.connections = Array.from(domainPatterns)
      .reduce((sum, pattern) => sum + (conceptMap.get(pattern)?.size || 0) - 1, 0)
    
    // Calculate growth (simplified - would compare time periods)
    domain.health.growth = Math.random() * 100 // Placeholder
    
    // Classify patterns by evolution stage
    domain.patterns.forEach(pattern => {
      const connections = conceptMap.get(pattern)?.size || 0
      if (connections >= 3) {
        domain.evolution.mature.push(pattern)
      } else if (connections === 2) {
        domain.evolution.emerging.push(pattern)
      } else {
        domain.evolution.declining.push(pattern)
      }
    })
  }
  
  return domains
}

// ─── CROSS-DOMAIN PATTERN SYNTHESIS ───────────────────────────────────────────
export async function synthesizeCrossDomainInsights(
  domains: Map<string, CognitiveDomain>,
  config: SynthesisConfig
): Promise<CognitiveInsight[]> {
  const insights: CognitiveInsight[] = []
  const domainList = Array.from(domains.values())
  
  // 1. Cross-Domain Pattern Detection
  for (let i = 0; i < domainList.length; i++) {
    for (let j = i + 1; j < domainList.length; j++) {
      const domain1 = domainList[i]
      const domain2 = domainList[j]
      
      const commonPatterns = domain1.patterns.filter(p => domain2.patterns.includes(p))
      
      if (commonPatterns.length >= config.minPatternOverlap) {
        insights.push({
          id: `cross_${domain1.name}_${domain2.name}`,
          type: 'cross_domain',
          title: `Cross-Domain Bridge: ${domain1.name} ↔ ${domain2.name}`,
          description: `Shared patterns: ${commonPatterns.join(', ')} suggest fundamental connection between domains`,
          domains: [domain1.name, domain2.name],
          patterns: commonPatterns,
          confidence: commonPatterns.length / Math.max(domain1.patterns.length, domain2.patterns.length),
          novelty: calculateNovelty(commonPatterns, domains),
          timestamp: new Date(),
          actionable: commonPatterns.length >= 3,
          synthesisPath: ['pattern_overlap', 'domain_bridge', 'insight_generation']
        })
      }
    }
  }
  
  // 2. Meta-Pattern Detection
  const allPatterns = new Set<string>()
  domains.forEach(domain => domain.patterns.forEach(p => allPatterns.add(p)))
  
  const patternFrequency = new Map<string, number>()
  domains.forEach(domain => {
    domain.patterns.forEach(pattern => {
      patternFrequency.set(pattern, (patternFrequency.get(pattern) || 0) + 1)
    })
  })
  
  // Find meta-patterns (patterns appearing across multiple domains)
  for (const [pattern, frequency] of Array.from(patternFrequency.entries())) {
    if (frequency >= 3) { // Appears in 3+ domains
      const involvedDomains = Array.from(domains.values())
        .filter(domain => domain.patterns.includes(pattern))
        .map(domain => domain.name)
      
      insights.push({
        id: `meta_${pattern}`,
        type: 'meta_pattern',
        title: `Meta-Pattern: ${pattern}`,
        description: `This pattern appears across ${involvedDomains.length} domains: ${involvedDomains.join(', ')}`,
        domains: involvedDomains,
        patterns: [pattern],
        confidence: frequency / domains.size,
        novelty: calculateNovelty([pattern], domains),
        timestamp: new Date(),
        actionable: frequency >= 4,
        synthesisPath: ['frequency_analysis', 'meta_pattern_identification', 'cross_domain_synthesis']
      })
    }
  }
  
  // 3. Cognitive Gap Analysis
  const domainConnections = new Map<string, Set<string>>()
  domains.forEach((domain, name) => {
    domainConnections.set(name, new Set())
  })
  
  // Build connection graph
  domains.forEach((domain1, name1) => {
    domains.forEach((domain2, name2) => {
      if (name1 !== name2) {
        const sharedPatterns = domain1.patterns.filter(p => domain2.patterns.includes(p))
        if (sharedPatterns.length > 0) {
          domainConnections.get(name1)!.add(name2)
          domainConnections.get(name2)!.add(name1)
        }
      }
    })
  })
  
  // Find isolated domains (cognitive gaps)
  for (const [domainName, connections] of Array.from(domainConnections.entries())) {
    if (connections.size === 0) {
      const domain = domains.get(domainName)!
      insights.push({
        id: `gap_${domainName}`,
        type: 'cognitive_gap',
        title: `Cognitive Gap: Isolated Domain`,
        description: `Domain "${domainName}" shows no connections to other domains. Opportunity for cross-domain exploration.`,
        domains: [domainName],
        patterns: domain.patterns.slice(0, 5), // Top 5 patterns
        confidence: 0.8,
        novelty: 0.9,
        timestamp: new Date(),
        actionable: true,
        synthesisPath: ['connectivity_analysis', 'gap_identification', 'opportunity_detection']
      })
    }
  }
  
  return insights.filter(insight => 
    insight.confidence >= config.confidenceThreshold && 
    insight.novelty >= config.noveltyThreshold
  )
}

// ─── COGNITIVE SYNTHESIS MAIN FUNCTION ─────────────────────────────────────────
export async function runCognitiveSynthesis(): Promise<{
  domains: Map<string, CognitiveDomain>
  insights: CognitiveInsight[]
  synthesisReport: {
    totalDomains: number
    totalInsights: number
    crossDomainInsights: number
    metaPatterns: number
    cognitiveGaps: number
    averageNovelty: number
    averageConfidence: number
  }
}> {
  try {
    const config: SynthesisConfig = {
      minPatternOverlap: 2,
      noveltyThreshold: 0.3,
      confidenceThreshold: 0.5,
      crossDomainThreshold: 3,
      synthesisDepth: 3
    }
    
    // Get recent captures for analysis
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const captures = await getCaptureEvents(thirtyDaysAgo)
    
    // Analyze cognitive domains
    const domains = await analyzeCognitiveDomains(captures)
    
    // Synthesize cross-domain insights
    const insights = await synthesizeCrossDomainInsights(domains, config)
    
    // Generate synthesis report
    const crossDomainInsights = insights.filter(i => i.type === 'cross_domain').length
    const metaPatterns = insights.filter(i => i.type === 'meta_pattern').length
    const cognitiveGaps = insights.filter(i => i.type === 'cognitive_gap').length
    const averageNovelty = insights.reduce((sum, i) => sum + i.novelty, 0) / insights.length || 0
    const averageConfidence = insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length || 0
    
    const synthesisReport = {
      totalDomains: domains.size,
      totalInsights: insights.length,
      crossDomainInsights,
      metaPatterns,
      cognitiveGaps,
      averageNovelty,
      averageConfidence
    }
    
    return {
      domains,
      insights,
      synthesisReport
    }
  } catch (error) {
    console.error('[cognitive synthesis]', error)
    return {
      domains: new Map(),
      insights: [],
      synthesisReport: {
        totalDomains: 0,
        totalInsights: 0,
        crossDomainInsights: 0,
        metaPatterns: 0,
        cognitiveGaps: 0,
        averageNovelty: 0,
        averageConfidence: 0
      }
    }
  }
}

// ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────
function calculateNovelty(patterns: string[], domains: Map<string, CognitiveDomain>): number {
  // Simple novelty calculation based on pattern distribution
  const totalPatterns = Array.from(domains.values()).reduce((sum, domain) => sum + domain.patterns.length, 0)
  const patternFrequency = patterns.reduce((sum, pattern) => {
    const count = Array.from(domains.values()).reduce((acc, domain) => 
      acc + (domain.patterns.includes(pattern) ? 1 : 0), 0)
    return sum + count
  }, 0)
  
  // Higher novelty for patterns that appear in fewer domains
  return 1 - (patternFrequency / (domains.size * patterns.length))
}

// ─── INSIGHT PRIORITIZATION ───────────────────────────────────────────────────
export function prioritizeInsights(insights: CognitiveInsight[]): CognitiveInsight[] {
  return insights.sort((a, b) => {
    // Priority score = confidence * novelty * (actionable ? 1.5 : 1)
    const scoreA = a.confidence * a.novelty * (a.actionable ? 1.5 : 1)
    const scoreB = b.confidence * b.novelty * (b.actionable ? 1.5 : 1)
    return scoreB - scoreA
  })
}

// ─── COGNITIVE EVOLUTION TRACKING ───────────────────────────────────────────────
export interface CognitiveEvolution {
  timestamp: Date
  domainCount: number
  insightCount: number
  averageNovelty: number
  averageConfidence: number
  topDomains: string[]
  emergingPatterns: string[]
}

export async function trackCognitiveEvolution(): Promise<CognitiveEvolution[]> {
  // This would track evolution over time
  // For now, return current state as single evolution point
  const synthesis = await runCognitiveSynthesis()
  
  const topDomains = Array.from(synthesis.domains.entries())
    .sort((a, b) => b[1].health.activity - a[1].health.activity)
    .slice(0, 3)
    .map(([name]) => name)
  
  const emergingPatterns = Array.from(synthesis.domains.values())
    .flatMap(domain => domain.evolution.emerging)
    .slice(0, 5)
  
  return [{
    timestamp: new Date(),
    domainCount: synthesis.domains.size,
    insightCount: synthesis.insights.length,
    averageNovelty: synthesis.synthesisReport.averageNovelty,
    averageConfidence: synthesis.synthesisReport.averageConfidence,
    topDomains,
    emergingPatterns
  }]
}
