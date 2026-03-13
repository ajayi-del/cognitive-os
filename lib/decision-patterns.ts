// ─── DECISION PATTERNS ANALYSIS ENGINE ───────────────────────────────────────────
// Cross-domain decision behavior analysis
// Compares chess, trading, and system design patterns

export interface DecisionTrait {
  patience_score: number // 0-1, higher = more patient
  aggression_score: number // 0-1, higher = more aggressive
  confirmation_discipline: number // 0-1, higher = waits for confirmation
  recovery_quality: number // 0-1, higher = better recovery from setbacks
  overextension_risk: number // 0-1, higher = tends to overextend
  defensive_discipline: number // 0-1, higher = maintains defensive structure
  timing_precision: number // 0-1, higher = better timing
}

export interface DomainPatterns {
  chess: ChessDecisionPattern
  trading?: TradingDecisionPattern
  system_design?: SystemDesignPattern
}

export interface ChessDecisionPattern {
  early_commitment_tendency: number // Attacks before development complete
  defensive_patience: number // Improves pieces before tactics
  panic_after_mistake: number // Passive play after errors
  sacrificial_haste: number // Sacrifices too quickly
  tactical_risk_appetite: number // Takes complex tactical risks
  endgame_technique: number // Technical endgame quality
  time_pressure_resilience: number // Performance under time pressure
}

export interface TradingDecisionPattern {
  early_entry_tendency: number // Enters before confirmation
  revenge_trading_frequency: number // Trades after losses
  position_sizing_discipline: number // Sticks to planned size
  structure_waiting_patience: number // Waits for proper setup
  forced_trade_frequency: number // Forces trades without setup
  loss_reaction_quality: number // Behavior after losses
  exit_discipline: number // Follows planned exits
}

export interface SystemDesignPattern {
  premature_complexity: number // Adds advanced features before stability
  stabilization_priority: number // Stabilizes before scaling
  modular_overfragmentation: number // Too many small modules
  invariant_preservation: number // Maintains architectural rules
  incremental_shipping: number // Ships small vs dreams large
  crystallization_efficiency: number // Converts ideas to projects
  refactoring_frequency: number // Revisits same ideas without completion
}

export interface CrossDomainInsight {
  id: string
  pattern_type: 'consistency' | 'contradiction' | 'strength' | 'weakness'
  domains: string[]
  observed_behavior: string
  possible_interpretation: string
  suggested_correction: string
  confidence: number
  evidence: {
    chess?: string
    trading?: string
    system_design?: string
  }
  timestamp: Date
}

export interface DecisionAnalysisConfig {
  min_games_for_analysis: number
  min_trades_for_analysis: number
  min_projects_for_analysis: number
  confidence_threshold: number
}

// ─── CHESS PATTERN ANALYSIS ─────────────────────────────────────────────────────
export async function analyzeChessDecisionPatterns(
  games: any[],
  config: DecisionAnalysisConfig
): Promise<ChessDecisionPattern> {
  if (games.length < config.min_games_for_analysis) {
    return createDefaultChessPattern()
  }

  const patterns: ChessDecisionPattern = {
    early_commitment_tendency: 0,
    defensive_patience: 0,
    panic_after_mistake: 0,
    sacrificial_haste: 0,
    tactical_risk_appetite: 0,
    endgame_technique: 0,
    time_pressure_resilience: 0
  }

  // Analyze each game for decision patterns
  for (const game of games) {
    const gameAnalysis = analyzeSingleChessGame(game)
    
    // Accumulate patterns
    patterns.early_commitment_tendency += gameAnalysis.early_commitment_tendency
    patterns.defensive_patience += gameAnalysis.defensive_patience
    patterns.panic_after_mistake += gameAnalysis.panic_after_mistake
    patterns.sacrificial_haste += gameAnalysis.sacrificial_haste
    patterns.tactical_risk_appetite += gameAnalysis.tactical_risk_appetite
    patterns.endgame_technique += gameAnalysis.endgame_technique
    patterns.time_pressure_resilience += gameAnalysis.time_pressure_resilience
  }

  // Normalize scores
  const factor = 1 / games.length
  Object.keys(patterns).forEach(key => {
    (patterns as any)[key] *= factor
  })

  return patterns
}

function analyzeSingleChessGame(game: any): ChessDecisionPattern {
  // Mock analysis - would use actual chess game data
  const moves = game.moves || []
  const result = game.result
  const userColor = game.userColor

  // Early commitment: count attacks in first 10 moves
  const earlyMoves = moves.slice(0, 10)
  const aggressiveMoves = earlyMoves.filter((move: any) => 
    move.san.includes('x') || move.san.includes('+') || ['Q', 'R', 'N'].includes(move.san[0])
  ).length
  const early_commitment_tendency = Math.min(aggressiveMoves / 5, 1)

  // Defensive patience: piece development before tactics
  const developmentMoves = earlyMoves.filter((move: any) => 
    ['N', 'B'].includes(move.san[0]) && !move.san.includes('x')
  ).length
  const defensive_patience = Math.min(developmentMoves / 4, 1)

  // Panic after mistake: passive play after blunders
  const blunderMoves = moves.filter((move: any) => move.evaluation && move.evaluation < -200)
  const panic_after_mistake = blunderMoves.length > 0 ? 0.7 : 0.2

  // Sacrificial haste: early sacrifices
  const sacrifices = moves.filter((move: any) => move.san.includes('x') && move.san.includes('=')).length
  const sacrificial_haste = Math.min(sacrifices / 2, 1)

  // Tactical risk: complex combinations
  const tacticalMoves = moves.filter((move: any) => move.san.includes('O') || move.san.includes('#')).length
  const tactical_risk_appetite = Math.min(tacticalMoves / 3, 1)

  // Endgame technique: result-based approximation
  const endgame_technique = result === '1-0' && userColor === 'white' ? 0.8 : 
                           result === '0-1' && userColor === 'black' ? 0.8 : 0.4

  // Time pressure: mock calculation
  const time_pressure_resilience = 0.6 // Would use actual time data

  return {
    early_commitment_tendency,
    defensive_patience,
    panic_after_mistake,
    sacrificial_haste,
    tactical_risk_appetite,
    endgame_technique,
    time_pressure_resilience
  }
}

// ─── TRADING PATTERN ANALYSIS ───────────────────────────────────────────────────
export async function analyzeTradingDecisionPatterns(
  trades: any[],
  config: DecisionAnalysisConfig
): Promise<TradingDecisionPattern> {
  if (trades.length < config.min_trades_for_analysis) {
    return createDefaultTradingPattern()
  }

  const patterns: TradingDecisionPattern = {
    early_entry_tendency: 0,
    revenge_trading_frequency: 0,
    position_sizing_discipline: 0,
    structure_waiting_patience: 0,
    forced_trade_frequency: 0,
    loss_reaction_quality: 0,
    exit_discipline: 0
  }

  for (const trade of trades) {
    const tradeAnalysis = analyzeSingleTrade(trade)
    
    patterns.early_entry_tendency += tradeAnalysis.early_entry_tendency
    patterns.revenge_trading_frequency += tradeAnalysis.revenge_trading_frequency
    patterns.position_sizing_discipline += tradeAnalysis.position_sizing_discipline
    patterns.structure_waiting_patience += tradeAnalysis.structure_waiting_patience
    patterns.forced_trade_frequency += tradeAnalysis.forced_trade_frequency
    patterns.loss_reaction_quality += tradeAnalysis.loss_reaction_quality
    patterns.exit_discipline += tradeAnalysis.exit_discipline
  }

  // Normalize scores
  const factor = 1 / trades.length
  Object.keys(patterns).forEach(key => {
    (patterns as any)[key] *= factor
  })

  return patterns
}

function analyzeSingleTrade(trade: any): TradingDecisionPattern {
  // Mock trading analysis - would use actual trading data
  const entryType = trade.entryType || 'confirmed'
  const result = trade.result || 'neutral'
  const sizeDeviation = trade.sizeDeviation || 0
  const structureWait = trade.structureWait || false
  const forcedTrade = trade.forcedTrade || false
  const revengeTrade = trade.revengeTrade || false
  const exitDiscipline = trade.exitDiscipline || true

  const early_entry_tendency = entryType === 'early' ? 0.8 : entryType === 'confirmed' ? 0.2 : 0.5
  const revenge_trading_frequency = revengeTrade ? 0.9 : 0.1
  const position_sizing_discipline = Math.abs(sizeDeviation) < 0.1 ? 0.9 : 0.3
  const structure_waiting_patience = structureWait ? 0.8 : 0.3
  const forced_trade_frequency = forcedTrade ? 0.8 : 0.2
  const loss_reaction_quality = result === 'recovered' ? 0.8 : result === 'loss' ? 0.3 : 0.6
  const exit_discipline = exitDiscipline ? 0.8 : 0.4

  return {
    early_entry_tendency,
    revenge_trading_frequency,
    position_sizing_discipline,
    structure_waiting_patience,
    forced_trade_frequency,
    loss_reaction_quality,
    exit_discipline
  }
}

// ─── SYSTEM DESIGN PATTERN ANALYSIS ─────────────────────────────────────────────
export async function analyzeSystemDesignPatterns(
  projects: any[],
  config: DecisionAnalysisConfig
): Promise<SystemDesignPattern> {
  if (projects.length < config.min_projects_for_analysis) {
    return createDefaultSystemDesignPattern()
  }

  const patterns: SystemDesignPattern = {
    premature_complexity: 0,
    stabilization_priority: 0,
    modular_overfragmentation: 0,
    invariant_preservation: 0,
    incremental_shipping: 0,
    crystallization_efficiency: 0,
    refactoring_frequency: 0
  }

  for (const project of projects) {
    const projectAnalysis = analyzeSingleProject(project)
    
    patterns.premature_complexity += projectAnalysis.premature_complexity
    patterns.stabilization_priority += projectAnalysis.stabilization_priority
    patterns.modular_overfragmentation += projectAnalysis.modular_overfragmentation
    patterns.invariant_preservation += projectAnalysis.invariant_preservation
    patterns.incremental_shipping += projectAnalysis.incremental_shipping
    patterns.crystallization_efficiency += projectAnalysis.crystallization_efficiency
    patterns.refactoring_frequency += projectAnalysis.refactoring_frequency
  }

  // Normalize scores
  const factor = 1 / projects.length
  Object.keys(patterns).forEach(key => {
    (patterns as any)[key] *= factor
  })

  return patterns
}

function analyzeSingleProject(project: any): SystemDesignPattern {
  // Mock project analysis - would use actual project data
  const complexity = project.complexity || 'moderate'
  const approach = project.approach || 'balanced'
  const modules = project.modules || 5
  const invariants = project.invariants || []
  const shipping = project.shipping || 'incremental'
  const completed = project.completed || false
  const refactored = project.refactored || false

  const premature_complexity = complexity === 'complex' && approach === 'advanced' ? 0.8 : 0.3
  const stabilization_priority = approach === 'stable' ? 0.8 : 0.4
  const modular_overfragmentation = modules > 10 ? 0.7 : 0.2
  const invariant_preservation = invariants.length > 0 ? 0.8 : 0.3
  const incremental_shipping = shipping === 'incremental' ? 0.8 : 0.4
  const crystallization_efficiency = completed ? 0.8 : 0.3
  const refactoring_frequency = refactored ? 0.7 : 0.2

  return {
    premature_complexity,
    stabilization_priority,
    modular_overfragmentation,
    invariant_preservation,
    incremental_shipping,
    crystallization_efficiency,
    refactoring_frequency
  }
}

// ─── CROSS-DOMAIN INSIGHT GENERATION ─────────────────────────────────────────────
export async function generateCrossDomainInsights(
  domainPatterns: DomainPatterns,
  config: DecisionAnalysisConfig
): Promise<CrossDomainInsight[]> {
  const insights: CrossDomainInsight[] = []

  // Analyze early commitment pattern
  const earlyCommitmentInsight = analyzeEarlyCommitmentPattern(domainPatterns)
  if (earlyCommitmentInsight) {
    insights.push(earlyCommitmentInsight)
  }

  // Analyze recovery patterns
  const recoveryInsight = analyzeRecoveryPattern(domainPatterns)
  if (recoveryInsight) {
    insights.push(recoveryInsight)
  }

  // Analyze patience patterns
  const patienceInsight = analyzePatiencePattern(domainPatterns)
  if (patienceInsight) {
    insights.push(patienceInsight)
  }

  // Analyze defensive discipline
  const defensiveInsight = analyzeDefensivePattern(domainPatterns)
  if (defensiveInsight) {
    insights.push(defensiveInsight)
  }

  return insights.filter(insight => insight.confidence >= config.confidence_threshold)
}

function analyzeEarlyCommitmentPattern(patterns: DomainPatterns): CrossDomainInsight | null {
  const domains: string[] = []
  const evidence: any = {}

  let totalScore = 0
  let domainCount = 0

  // Chess early commitment
  if (patterns.chess.early_commitment_tendency > 0.6) {
    domains.push('chess')
    evidence.chess = `High early attack tendency (${Math.round(patterns.chess.early_commitment_tendency * 100)}%)`
    totalScore += patterns.chess.early_commitment_tendency
    domainCount++
  }

  // Trading early entry
  if (patterns.trading?.early_entry_tendency && patterns.trading.early_entry_tendency > 0.6) {
    domains.push('trading')
    evidence.trading = `High early entry tendency (${Math.round(patterns.trading.early_entry_tendency * 100)}%)`
    totalScore += patterns.trading.early_entry_tendency
    domainCount++
  }

  // System design premature complexity
  if (patterns.system_design?.premature_complexity && patterns.system_design.premature_complexity > 0.6) {
    domains.push('system_design')
    evidence.system_design = `High premature complexity (${Math.round(patterns.system_design.premature_complexity * 100)}%)`
    totalScore += patterns.system_design.premature_complexity
    domainCount++
  }

  if (domainCount >= 2) {
    const avgScore = totalScore / domainCount
    
    return {
      id: `early_commitment_${Date.now()}`,
      pattern_type: avgScore > 0.7 ? 'weakness' : 'consistency',
      domains,
      observed_behavior: `Early commitment tendency detected across ${domains.length} domains`,
      possible_interpretation: 'Action bias before confirmation and stabilization',
      suggested_correction: 'Require one stabilization step before commitment in each domain',
      confidence: avgScore,
      evidence,
      timestamp: new Date()
    }
  }

  return null
}

function analyzeRecoveryPattern(patterns: DomainPatterns): CrossDomainInsight | null {
  const domains: string[] = []
  const evidence: any = {}

  let totalScore = 0
  let domainCount = 0

  // Chess panic after mistake
  if (patterns.chess.panic_after_mistake > 0.6) {
    domains.push('chess')
    evidence.chess = `High panic after mistakes (${Math.round(patterns.chess.panic_after_mistake * 100)}%)`
    totalScore += patterns.chess.panic_after_mistake
    domainCount++
  }

  // Trading loss reaction
  if (patterns.trading?.loss_reaction_quality && patterns.trading.loss_reaction_quality < 0.4) {
    domains.push('trading')
    evidence.trading = `Poor loss reaction quality (${Math.round((1 - patterns.trading.loss_reaction_quality) * 100)}% panic)`
    totalScore += (1 - patterns.trading.loss_reaction_quality)
    domainCount++
  }

  if (domainCount >= 2) {
    const avgScore = totalScore / domainCount
    
    return {
      id: `recovery_pattern_${Date.now()}`,
      pattern_type: avgScore > 0.6 ? 'weakness' : 'strength',
      domains,
      observed_behavior: `Defensive breakdown after negative feedback`,
      possible_interpretation: 'Overly defensive response instead of neutral recalibration',
      suggested_correction: 'Practice neutral response patterns after setbacks',
      confidence: avgScore,
      evidence,
      timestamp: new Date()
    }
  }

  return null
}

function analyzePatiencePattern(patterns: DomainPatterns): CrossDomainInsight | null {
  const domains: string[] = []
  const evidence: any = {}

  let totalScore = 0
  let domainCount = 0

  // Chess defensive patience
  if (patterns.chess.defensive_patience > 0.7) {
    domains.push('chess')
    evidence.chess = `High defensive patience (${Math.round(patterns.chess.defensive_patience * 100)}%)`
    totalScore += patterns.chess.defensive_patience
    domainCount++
  }

  // Trading structure waiting
  if (patterns.trading?.structure_waiting_patience && patterns.trading.structure_waiting_patience > 0.7) {
    domains.push('trading')
    evidence.trading = `High structure waiting patience (${Math.round(patterns.trading.structure_waiting_patience * 100)}%)`
    totalScore += patterns.trading.structure_waiting_patience
    domainCount++
  }

  // System design stabilization
  if (patterns.system_design?.stabilization_priority && patterns.system_design.stabilization_priority > 0.7) {
    domains.push('system_design')
    evidence.system_design = `High stabilization priority (${Math.round(patterns.system_design.stabilization_priority * 100)}%)`
    totalScore += patterns.system_design.stabilization_priority
    domainCount++
  }

  if (domainCount >= 2) {
    const avgScore = totalScore / domainCount
    
    return {
      id: `patience_pattern_${Date.now()}`,
      pattern_type: avgScore > 0.7 ? 'strength' : 'consistency',
      domains,
      observed_behavior: `Strong patience trait across multiple domains`,
      possible_interpretation: 'Best outcomes come from letting structure mature before acting',
      suggested_correction: 'Continue this patient approach across all domains',
      confidence: avgScore,
      evidence,
      timestamp: new Date()
    }
  }

  return null
}

function analyzeDefensivePattern(patterns: DomainPatterns): CrossDomainInsight | null {
  const domains: string[] = []
  const evidence: any = {}

  let totalScore = 0
  let domainCount = 0

  // Chess endgame technique (defensive skill)
  if (patterns.chess.endgame_technique > 0.7) {
    domains.push('chess')
    evidence.chess = `Strong endgame technique (${Math.round(patterns.chess.endgame_technique * 100)}%)`
    totalScore += patterns.chess.endgame_technique
    domainCount++
  }

  // System design invariant preservation
  if (patterns.system_design?.invariant_preservation && patterns.system_design.invariant_preservation > 0.7) {
    domains.push('system_design')
    evidence.system_design = `Strong invariant preservation (${Math.round(patterns.system_design.invariant_preservation * 100)}%)`
    totalScore += patterns.system_design.invariant_preservation
    domainCount++
  }

  if (domainCount >= 2) {
    const avgScore = totalScore / domainCount
    
    return {
      id: `defensive_pattern_${Date.now()}`,
      pattern_type: avgScore > 0.7 ? 'strength' : 'weakness',
      domains,
      observed_behavior: `Strong defensive discipline across domains`,
      possible_interpretation: 'Maintains structural integrity under pressure',
      suggested_correction: avgScore > 0.7 ? 'Continue defensive discipline' : 'Strengthen defensive awareness',
      confidence: avgScore,
      evidence,
      timestamp: new Date()
    }
  }

  return null
}

// ─── DECISION TRAIT CALCULATION ─────────────────────────────────────────────────
export function calculateDecisionTraits(domainPatterns: DomainPatterns): DecisionTrait {
  const patterns = domainPatterns
  const traits: DecisionTrait = {
    patience_score: 0,
    aggression_score: 0,
    confirmation_discipline: 0,
    recovery_quality: 0,
    overextension_risk: 0,
    defensive_discipline: 0,
    timing_precision: 0
  }

  // Chess contributions
  traits.patience_score += domainPatterns.chess.defensive_patience * 0.3
  traits.aggression_score += domainPatterns.chess.early_commitment_tendency * 0.3
  traits.confirmation_discipline += (1 - domainPatterns.chess.early_commitment_tendency) * 0.3
  traits.recovery_quality += (1 - domainPatterns.chess.panic_after_mistake) * 0.3
  traits.overextension_risk += domainPatterns.chess.sacrificial_haste * 0.3
  traits.defensive_discipline += domainPatterns.chess.endgame_technique * 0.3
  traits.timing_precision += domainPatterns.chess.time_pressure_resilience * 0.3

  // Trading contributions
  if (domainPatterns.trading) {
    traits.patience_score += domainPatterns.trading.structure_waiting_patience * 0.3
    traits.aggression_score += domainPatterns.trading.early_entry_tendency * 0.3
    traits.confirmation_discipline += domainPatterns.trading.position_sizing_discipline * 0.3
    traits.recovery_quality += domainPatterns.trading.loss_reaction_quality * 0.3
    traits.overextension_risk += domainPatterns.trading.forced_trade_frequency * 0.3
    traits.defensive_discipline += domainPatterns.trading.exit_discipline * 0.3
    traits.timing_precision += (1 - domainPatterns.trading.revenge_trading_frequency) * 0.3
  }

  // System design contributions
  if (domainPatterns.system_design) {
    traits.patience_score += domainPatterns.system_design.stabilization_priority * 0.4
    traits.aggression_score += domainPatterns.system_design.premature_complexity * 0.4
    traits.confirmation_discipline += (1 - domainPatterns.system_design.modular_overfragmentation) * 0.4
    traits.recovery_quality += domainPatterns.system_design.crystallization_efficiency * 0.4
    traits.overextension_risk += domainPatterns.system_design.premature_complexity * 0.4
    traits.defensive_discipline += domainPatterns.system_design.invariant_preservation * 0.4
    traits.timing_precision += domainPatterns.system_design.incremental_shipping * 0.4
  }

  return traits
}

// ─── DEFAULT PATTERNS ───────────────────────────────────────────────────────────
function createDefaultChessPattern(): ChessDecisionPattern {
  return {
    early_commitment_tendency: 0.5,
    defensive_patience: 0.5,
    panic_after_mistake: 0.5,
    sacrificial_haste: 0.5,
    tactical_risk_appetite: 0.5,
    endgame_technique: 0.5,
    time_pressure_resilience: 0.5
  }
}

function createDefaultTradingPattern(): TradingDecisionPattern {
  return {
    early_entry_tendency: 0.5,
    revenge_trading_frequency: 0.5,
    position_sizing_discipline: 0.5,
    structure_waiting_patience: 0.5,
    forced_trade_frequency: 0.5,
    loss_reaction_quality: 0.5,
    exit_discipline: 0.5
  }
}

function createDefaultSystemDesignPattern(): SystemDesignPattern {
  return {
    premature_complexity: 0.5,
    stabilization_priority: 0.5,
    modular_overfragmentation: 0.5,
    invariant_preservation: 0.5,
    incremental_shipping: 0.5,
    crystallization_efficiency: 0.5,
    refactoring_frequency: 0.5
  }
}
