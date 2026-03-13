import { NextResponse } from 'next/server'
import { 
  analyzeChessDecisionPatterns, 
  analyzeTradingDecisionPatterns, 
  analyzeSystemDesignPatterns,
  generateCrossDomainInsights,
  calculateDecisionTraits,
  DomainPatterns
} from '@/lib/decision-patterns'
import { getChessGameHistory } from '@/lib/chess-session'

// ─── DECISION PATTERNS ANALYSIS API ───────────────────────────────────────────────
// Cross-domain decision behavior analysis
// Compares chess, trading, and system design patterns

export async function GET() {
  try {
    const config = {
      min_games_for_analysis: 5,
      min_trades_for_analysis: 10,
      min_projects_for_analysis: 3,
      confidence_threshold: 0.6
    }

    // Get chess game data
    const chessGames = await getChessGameHistory(20)
    const chessPatterns = await analyzeChessDecisionPatterns(chessGames, config)

    // Mock trading and system design data (would come from actual sources)
    const mockTrades = generateMockTradingData()
    const tradingPatterns = await analyzeTradingDecisionPatterns(mockTrades, config)

    const mockProjects = generateMockProjectData()
    const systemDesignPatterns = await analyzeSystemDesignPatterns(mockProjects, config)

    // Assemble domain patterns
    const domainPatterns: DomainPatterns = {
      chess: chessPatterns,
      trading: tradingPatterns,
      system_design: systemDesignPatterns
    }

    // Generate cross-domain insights
    const insights = await generateCrossDomainInsights(domainPatterns, config)

    // Calculate overall decision traits
    const decisionTraits = calculateDecisionTraits(domainPatterns)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      analysis: {
        domain_patterns: domainPatterns,
        decision_traits: decisionTraits,
        cross_domain_insights: insights,
        data_sources: {
          chess_games: chessGames.length,
          trading_records: mockTrades.length,
          system_projects: mockProjects.length
        },
        confidence_threshold: config.confidence_threshold
      }
    })
  } catch (error) {
    console.error('[decision patterns API]', error)
    return NextResponse.json({
      error: 'Failed to analyze decision patterns',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// ─── MOCK DATA GENERATORS ───────────────────────────────────────────────────────
// In production, these would be replaced with actual data sources

function generateMockTradingData() {
  return [
    {
      id: 'trade_1',
      entryType: 'confirmed',
      result: 'profit',
      sizeDeviation: 0.05,
      structureWait: true,
      forcedTrade: false,
      revengeTrade: false,
      exitDiscipline: true,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'trade_2',
      entryType: 'early',
      result: 'loss',
      sizeDeviation: 0.15,
      structureWait: false,
      forcedTrade: true,
      revengeTrade: true,
      exitDiscipline: false,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
    },
    {
      id: 'trade_3',
      entryType: 'confirmed',
      result: 'profit',
      sizeDeviation: 0.02,
      structureWait: true,
      forcedTrade: false,
      revengeTrade: false,
      exitDiscipline: true,
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000)
    },
    {
      id: 'trade_4',
      entryType: 'early',
      result: 'recovered',
      sizeDeviation: 0.08,
      structureWait: false,
      forcedTrade: true,
      revengeTrade: false,
      exitDiscipline: true,
      timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000)
    },
    {
      id: 'trade_5',
      entryType: 'confirmed',
      result: 'profit',
      sizeDeviation: 0.03,
      structureWait: true,
      forcedTrade: false,
      revengeTrade: false,
      exitDiscipline: true,
      timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000)
    },
    {
      id: 'trade_6',
      entryType: 'early',
      result: 'loss',
      sizeDeviation: 0.12,
      structureWait: false,
      forcedTrade: true,
      revengeTrade: true,
      exitDiscipline: false,
      timestamp: new Date(Date.now() - 144 * 60 * 60 * 1000)
    },
    {
      id: 'trade_7',
      entryType: 'confirmed',
      result: 'profit',
      sizeDeviation: 0.04,
      structureWait: true,
      forcedTrade: false,
      revengeTrade: false,
      exitDiscipline: true,
      timestamp: new Date(Date.now() - 168 * 60 * 60 * 1000)
    },
    {
      id: 'trade_8',
      entryType: 'confirmed',
      result: 'profit',
      sizeDeviation: 0.06,
      structureWait: true,
      forcedTrade: false,
      revengeTrade: false,
      exitDiscipline: true,
      timestamp: new Date(Date.now() - 192 * 60 * 60 * 1000)
    },
    {
      id: 'trade_9',
      entryType: 'early',
      result: 'loss',
      sizeDeviation: 0.18,
      structureWait: false,
      forcedTrade: true,
      revengeTrade: true,
      exitDiscipline: false,
      timestamp: new Date(Date.now() - 216 * 60 * 60 * 1000)
    },
    {
      id: 'trade_10',
      entryType: 'confirmed',
      result: 'profit',
      sizeDeviation: 0.05,
      structureWait: true,
      forcedTrade: false,
      revengeTrade: false,
      exitDiscipline: true,
      timestamp: new Date(Date.now() - 240 * 60 * 60 * 1000)
    },
    {
      id: 'trade_11',
      entryType: 'confirmed',
      result: 'profit',
      sizeDeviation: 0.03,
      structureWait: true,
      forcedTrade: false,
      revengeTrade: false,
      exitDiscipline: true,
      timestamp: new Date(Date.now() - 264 * 60 * 60 * 1000)
    },
    {
      id: 'trade_12',
      entryType: 'early',
      result: 'recovered',
      sizeDeviation: 0.09,
      structureWait: false,
      forcedTrade: true,
      revengeTrade: false,
      exitDiscipline: true,
      timestamp: new Date(Date.now() - 288 * 60 * 60 * 1000)
    }
  ]
}

function generateMockProjectData() {
  return [
    {
      id: 'project_1',
      complexity: 'simple',
      approach: 'stable',
      modules: 4,
      invariants: ['no_mutation', 'canonical_events'],
      shipping: 'incremental',
      completed: true,
      refactored: false,
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'project_2',
      complexity: 'complex',
      approach: 'advanced',
      modules: 12,
      invariants: [],
      shipping: 'big_bang',
      completed: false,
      refactored: true,
      timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'project_3',
      complexity: 'moderate',
      approach: 'balanced',
      modules: 6,
      invariants: ['canonical_events'],
      shipping: 'incremental',
      completed: true,
      refactored: false,
      timestamp: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'project_4',
      complexity: 'simple',
      approach: 'stable',
      modules: 3,
      invariants: ['no_mutation', 'canonical_events', 'rebuildable'],
      shipping: 'incremental',
      completed: true,
      refactored: false,
      timestamp: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'project_5',
      complexity: 'complex',
      approach: 'advanced',
      modules: 15,
      invariants: ['canonical_events'],
      shipping: 'big_bang',
      completed: false,
      refactored: true,
      timestamp: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000)
    }
  ]
}
