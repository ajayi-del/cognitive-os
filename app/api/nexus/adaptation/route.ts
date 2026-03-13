import { NextResponse } from 'next/server'
import { runAdaptiveReorganization, formatPatternGraphForVisualization } from '@/lib/organism-adaptation'

// ─── ADAPTIVE REORGANIZATION API ─────────────────────────────────────────────
// Allows the organism to restructure its internal pattern graph
// This endpoint runs every 6 hours to detect convergence, divergence, stagnation, promotion

export async function GET() {
  try {
    const result = await runAdaptiveReorganization()
    
    // Format for visualization
    const visualizationData = formatPatternGraphForVisualization(result.graph)
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      signals: result.signals,
      reorganizationActions: result.reorganizationActions,
      patternGraph: visualizationData,
      summary: {
        totalPatterns: result.graph.nodes.size,
        totalClusters: result.graph.clusters.size,
        signalsDetected: result.signals.length,
        adaptationActions: result.reorganizationActions.length
      }
    })
  } catch (error) {
    console.error('[adaptation API]', error)
    return NextResponse.json({
      error: 'Failed to run adaptive reorganization',
      fallback: {
        signals: [],
        reorganizationActions: [],
        patternGraph: { nodes: [], edges: [], clusters: [] }
      }
    }, { status: 500 })
  }
}

// Manual trigger for adaptation cycle
export async function POST() {
  try {
    const result = await runAdaptiveReorganization()
    
    // Generate adaptation messages for Nexus Feed
    const adaptationMessages = result.signals.map(signal => ({
      type: 'adaptation',
      priority: signal.type === 'promotion' ? 3 : 2,
      title: `Adaptive Signal: ${signal.type}`,
      content: {
        text: signal.message,
        signalType: signal.type,
        patterns: signal.patterns,
        confidence: signal.confidence,
        timestamp: signal.timestamp
      },
      requiresAction: signal.type === 'promotion',
      relatedIds: signal.patterns
    }))
    
    return NextResponse.json({
      success: true,
      adaptationCompleted: true,
      signals: result.signals,
      messages: adaptationMessages,
      reorganizationActions: result.reorganizationActions,
      architecturalRule: "Pattern graph evolves from canonical events, never modifies raw data",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[adaptation POST]', error)
    return NextResponse.json({
      error: 'Failed to trigger adaptation cycle'
    }, { status: 500 })
  }
}
