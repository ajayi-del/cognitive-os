import { NextResponse } from 'next/server'
import { runCognitiveSynthesis, prioritizeInsights, trackCognitiveEvolution } from '@/lib/cognitive-synthesis'

// ─── COGNITIVE SYNTHESIS API ───────────────────────────────────────────────
// Advanced intelligence layer for cross-domain insight generation
// Generates novel insights by synthesizing patterns across cognitive domains

export async function GET() {
  try {
    const synthesis = await runCognitiveSynthesis()
    const prioritizedInsights = prioritizeInsights(synthesis.insights)
    const evolution = await trackCognitiveEvolution()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      synthesis: {
        domains: Array.from(synthesis.domains.entries()).map(([name, domain]) => ({
          name,
          health: domain.health,
          evolution: domain.evolution,
          patternCount: domain.patterns.length
        })),
        insights: prioritizedInsights,
        report: synthesis.synthesisReport
      },
      evolution: evolution[0], // Latest evolution point
      architecturalRule: "Cognitive synthesis builds on canonical events, never modifies raw data"
    })
  } catch (error) {
    console.error('[cognitive synthesis API]', error)
    return NextResponse.json({
      error: 'Failed to run cognitive synthesis',
      fallback: {
        domains: [],
        insights: [],
        report: {
          totalDomains: 0,
          totalInsights: 0,
          crossDomainInsights: 0,
          metaPatterns: 0,
          cognitiveGaps: 0,
          averageNovelty: 0,
          averageConfidence: 0
        }
      }
    }, { status: 500 })
  }
}

// Manual trigger for cognitive synthesis cycle
export async function POST() {
  try {
    const synthesis = await runCognitiveSynthesis()
    const prioritizedInsights = prioritizeInsights(synthesis.insights)
    
    // Generate cognitive synthesis messages for Nexus Feed
    const synthesisMessages = prioritizedInsights.slice(0, 3).map(insight => ({
      type: 'cognitive_synthesis',
      priority: insight.actionable ? 3 : 2,
      title: `Cognitive Insight: ${insight.type}`,
      content: {
        text: insight.description,
        insightType: insight.type,
        domains: insight.domains,
        patterns: insight.patterns,
        confidence: insight.confidence,
        novelty: insight.novelty,
        actionable: insight.actionable,
        synthesisPath: insight.synthesisPath,
        derivedFrom: 'cognitive_synthesis'
      },
      requiresAction: insight.actionable,
      relatedIds: insight.patterns
    }))
    
    return NextResponse.json({
      success: true,
      synthesisCompleted: true,
      insights: prioritizedInsights,
      messages: synthesisMessages,
      report: synthesis.synthesisReport,
      cognitiveMaturity: {
        level: synthesis.synthesisReport.totalInsights > 5 ? 'advanced' :
               synthesis.synthesisReport.totalInsights > 2 ? 'intermediate' : 'emerging',
        crossDomainThinking: synthesis.synthesisReport.crossDomainInsights > 0,
        metaPatternRecognition: synthesis.synthesisReport.metaPatterns > 0,
        gapAwareness: synthesis.synthesisReport.cognitiveGaps > 0
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[cognitive synthesis POST]', error)
    return NextResponse.json({
      error: 'Failed to trigger cognitive synthesis cycle'
    }, { status: 500 })
  }
}
