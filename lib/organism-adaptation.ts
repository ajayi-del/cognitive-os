// ─── ORGANISM ADAPTIVE REORGANIZATION ───────────────────────────────────────────
// Dynamic pattern graph evolution as thinking evolves
// The organism adapts its internal structure as patterns emerge, converge, diverge

import { getCaptureEvents, getActionEvents } from './canonical-events'

export interface PatternNode {
  theme: string
  occurrences: number
  coOccurrences: string[]
  stage: 'observation' | 'repetition' | 'crystallization'
  relatedPatterns: string[]
  growthRate: number
  lastSeen: Date
  firstSeen: Date
}

export interface PatternGraph {
  nodes: Map<string, PatternNode>
  edges: Map<string, Set<string>>
  clusters: Map<string, string[]>
}

export interface AdaptationSignal {
  type: 'convergence' | 'divergence' | 'stagnation' | 'promotion'
  patterns: string[]
  confidence: number
  message: string
  timestamp: Date
}

export interface AdaptationConfig {
  convergenceThreshold: number
  divergenceThreshold: number
  stagnationThreshold: number
  promotionThreshold: number
  coOccurrenceWindow: number // hours
}

// ─── PATTERN GRAPH GENERATION ───────────────────────────────────────────────
export async function generatePatternGraph(
  captures: any[],
  config: AdaptationConfig
): Promise<PatternGraph> {
  const graph: PatternGraph = {
    nodes: new Map(),
    edges: new Map(),
    clusters: new Map()
  }

  // Extract pattern occurrences from captures
  const patternOccurrences = new Map<string, Date[]>()
  
  captures.forEach(capture => {
    const words = capture.data.content.toLowerCase().split(/\s+/)
    const timestamp = capture.timestamp
    
    words.forEach((word: string) => {
      if (word.length > 4) {
        if (!patternOccurrences.has(word)) {
          patternOccurrences.set(word, [])
        }
        patternOccurrences.get(word)!.push(timestamp)
      }
    })
  })

  // Create pattern nodes
  for (const [theme, occurrences] of Array.from(patternOccurrences.entries())) {
    if (occurrences.length >= 2) { // Minimum threshold for pattern
      const firstSeen = new Date(Math.min(...occurrences.map(d => d.getTime())))
      const lastSeen = new Date(Math.max(...occurrences.map(d => d.getTime())))
      
      // Calculate growth rate (recent vs older occurrences)
      const midPoint = new Date(firstSeen.getTime() + (lastSeen.getTime() - firstSeen.getTime()) / 2)
      const recentCount = occurrences.filter(d => d >= midPoint).length
      const oldCount = occurrences.filter(d => d < midPoint).length
      const growthRate = oldCount > 0 ? (recentCount - oldCount) / oldCount : 0
      
      // Determine cognitive stage
      let stage: 'observation' | 'repetition' | 'crystallization' = 'observation'
      if (occurrences.length >= 5) stage = 'crystallization'
      else if (occurrences.length >= 3) stage = 'repetition'
      
      const node: PatternNode = {
        theme,
        occurrences: occurrences.length,
        coOccurrences: [],
        stage,
        relatedPatterns: [],
        growthRate,
        lastSeen,
        firstSeen
      }
      
      graph.nodes.set(theme, node)
      graph.edges.set(theme, new Set())
    }
  }

  // Calculate co-occurrences (patterns appearing together)
  const coOccurrenceWindow = config.coOccurrenceWindow * 60 * 60 * 1000 // Convert hours to ms
  
  for (const [theme1, node1] of Array.from(graph.nodes.entries())) {
    for (const [theme2, node2] of Array.from(graph.nodes.entries())) {
      if (theme1 !== theme2) {
        // Check if patterns co-occur within time window
        const coOccurrenceCount = captures.filter(capture => {
          const words = capture.data.content.toLowerCase().split(/\s+/)
          const hasTheme1 = words.includes(theme1)
          const hasTheme2 = words.includes(theme2)
          return hasTheme1 && hasTheme2
        }).length
        
        if (coOccurrenceCount >= 2) {
          node1.coOccurrences.push(theme2)
          node1.relatedPatterns.push(theme2)
          graph.edges.get(theme1)!.add(theme2)
          graph.edges.get(theme2)!.add(theme1)
        }
      }
    }
  }

  // Identify clusters (densely connected patterns)
  const visited = new Set<string>()
  let clusterId = 0
  
  for (const theme of Array.from(graph.nodes.keys())) {
    if (!visited.has(theme)) {
      const cluster = new Set<string>()
      const queue = [theme]
      
      while (queue.length > 0) {
        const current = queue.shift()!
        if (!visited.has(current)) {
          visited.add(current)
          cluster.add(current)
          
          // Add connected patterns
          graph.edges.get(current)!.forEach(connected => {
            if (!visited.has(connected)) {
              queue.push(connected)
            }
          })
        }
      }
      
      if (cluster.size > 1) {
        const clusterName = `cluster_${clusterId++}`
        graph.clusters.set(clusterName, Array.from(cluster))
      }
    }
  }

  return graph
}

// ─── ADAPTATION SIGNAL DETECTION ─────────────────────────────────────────────
export async function detectAdaptationSignals(
  graph: PatternGraph,
  config: AdaptationConfig
): Promise<AdaptationSignal[]> {
  const signals: AdaptationSignal[] = []

  // 1. Pattern Convergence Detection
  for (const [theme, node] of Array.from(graph.nodes.entries())) {
    if (node.coOccurrences.length >= config.convergenceThreshold) {
      // Find the most co-occurring pattern
      const topCoOccurrence = node.coOccurrences.reduce((a, b) => {
        const aNode = graph.nodes.get(a)
        const bNode = graph.nodes.get(b)
        return (aNode?.occurrences || 0) > (bNode?.occurrences || 0) ? a : b
      })
      
      signals.push({
        type: 'convergence',
        patterns: [theme, topCoOccurrence],
        confidence: node.coOccurrences.length / config.convergenceThreshold,
        message: `Patterns converging: "${theme}" and "${topCoOccurrence}" suggest emerging domain`,
        timestamp: new Date()
      })
    }
  }

  // 2. Pattern Divergence Detection
  for (const [clusterName, patterns] of Array.from(graph.clusters.entries())) {
    if (patterns.length >= config.divergenceThreshold) {
      signals.push({
        type: 'divergence',
        patterns,
        confidence: patterns.length / config.divergenceThreshold,
        message: `Pattern divergence detected: ${patterns.length} related patterns forming sub-domains`,
        timestamp: new Date()
      })
    }
  }

  // 3. Pattern Stagnation Detection
  for (const [theme, node] of Array.from(graph.nodes.entries())) {
    if (node.occurrences >= config.stagnationThreshold && node.growthRate <= 0) {
      signals.push({
        type: 'stagnation',
        patterns: [theme],
        confidence: Math.min(node.occurrences / config.stagnationThreshold, 1),
        message: `Pattern stagnation: "${theme}" repeated ${node.occurrences} times but showing no growth`,
        timestamp: new Date()
      })
    }
  }

  // 4. Pattern Promotion Detection
  for (const [theme, node] of Array.from(graph.nodes.entries())) {
    if (node.occurrences >= config.promotionThreshold && node.stage === 'crystallization') {
      signals.push({
        type: 'promotion',
        patterns: [theme],
        confidence: node.occurrences / config.promotionThreshold,
        message: `Pattern promotion: "${theme}" is ready to become a project candidate`,
        timestamp: new Date()
      })
    }
  }

  return signals
}

// ─── ADAPTIVE REORGANIZATION CYCLE ───────────────────────────────────────────
export async function runAdaptiveReorganization(): Promise<{
  graph: PatternGraph
  signals: AdaptationSignal[]
  reorganizationActions: string[]
}> {
  const config: AdaptationConfig = {
    convergenceThreshold: 3,
    divergenceThreshold: 4,
    stagnationThreshold: 6,
    promotionThreshold: 5,
    coOccurrenceWindow: 24 // 24 hours
  }

  try {
    // Get recent captures for analysis
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const captures = await getCaptureEvents(sevenDaysAgo)
    
    // Generate pattern graph
    const graph = await generatePatternGraph(captures, config)
    
    // Detect adaptation signals
    const signals = await detectAdaptationSignals(graph, config)
    
    // Generate reorganization actions
    const reorganizationActions: string[] = []
    
    signals.forEach(signal => {
      switch (signal.type) {
        case 'convergence':
          reorganizationActions.push(`Merge patterns: ${signal.patterns.join(' + ')}`)
          break
        case 'divergence':
          reorganizationActions.push(`Split cluster: ${signal.patterns.length} patterns diverging`)
          break
        case 'stagnation':
          reorganizationActions.push(`Archive stagnant pattern: ${signal.patterns[0]}`)
          break
        case 'promotion':
          reorganizationActions.push(`Promote to project: ${signal.patterns[0]}`)
          break
      }
    })
    
    return {
      graph,
      signals,
      reorganizationActions
    }
  } catch (error) {
    console.error('[adaptive reorganization]', error)
    return {
      graph: { nodes: new Map(), edges: new Map(), clusters: new Map() },
      signals: [],
      reorganizationActions: []
    }
  }
}

// ─── PATTERN VISUALIZATION DATA ───────────────────────────────────────────────
export function formatPatternGraphForVisualization(graph: PatternGraph): any {
  const nodes = Array.from(graph.nodes.entries()).map(([theme, node]) => ({
    id: theme,
    label: theme,
    size: Math.max(node.occurrences * 10, 20),
    color: node.stage === 'crystallization' ? '#7060e8' : 
           node.stage === 'repetition' ? '#f09020' : '#3d8fff',
    stage: node.stage,
    occurrences: node.occurrences,
    growthRate: node.growthRate
  }))
  
  const edges: any[] = []
  const processedEdges = new Set<string>()
  
  for (const [source, targets] of Array.from(graph.edges.entries())) {
    targets.forEach(target => {
      const edgeKey = [source, target].sort().join('-')
      if (!processedEdges.has(edgeKey)) {
        processedEdges.add(edgeKey)
        edges.push({
          source,
          target,
          weight: 1
        })
      }
    })
  }
  
  const clusters = Array.from(graph.clusters.entries()).map(([name, patterns]) => ({
    name,
    patterns,
    size: patterns.length
  }))
  
  return {
    nodes,
    edges,
    clusters
  }
}
