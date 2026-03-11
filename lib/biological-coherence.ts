// Biological Coherence System - Cognitive OS
// Ensures the entire system works as a coherent organism
// Cells → Tissues → Organs → System

import type { AIProvider, TaskType } from './ai-router'
import { cleanArchitecture, SystemState } from './clean-architecture'

// Biological System Architecture
interface BiologicalCell {
  id: string
  type: 'neuron' | 'muscle' | 'immune' | 'metabolic'
  energy: number
  state: 'active' | 'resting' | 'stressed'
  connections: string[]
}

interface BiologicalTissue {
  id: string
  type: 'neural' | 'muscular' | 'circulatory' | 'digestive'
  cells: BiologicalCell[]
  function: string
  energyFlow: number
}

interface BiologicalOrgan {
  id: string
  type: 'brain' | 'heart' | 'lungs' | 'liver' | 'nervous_system'
  tissues: BiologicalTissue[]
  primaryFunction: string
  health: number
}

interface OrganismState {
  organs: BiologicalOrgan[]
  energyATP: number
  homeostasis: number
  coherence: number
  lastSync: Date
}

// Cognitive System Mapping to Biology
export class BiologicalMapper {
  /**
   * Map cognitive components to biological equivalents
   */
  static mapCognitiveToBiology(state: SystemState): OrganismState {
    const organs: BiologicalOrgan[] = []
    
    // Brain Organ - AI Processing & Decision Making
    organs.push(this.createBrainOrgan(state))
    
    // Heart Organ - Energy Flow & Focus Engine
    organs.push(this.createHeartOrgan(state))
    
    // Lungs Organ - Information Flow & Capture System
    organs.push(this.createLungsOrgan(state))
    
    // Liver Organ - Metabolism & Task Processing
    organs.push(this.createLiverOrgan(state))
    
    // Nervous System Organ - Communication & Routing
    organs.push(this.createNervousSystemOrgan(state))
    
    // Calculate organism health
    const energyATP = state.metrics.energyATP
    const homeostasis = this.calculateHomeostasis(state)
    const coherence = this.calculateCoherence(organs)
    
    return {
      organs,
      energyATP,
      homeostasis,
      coherence,
      lastSync: new Date()
    }
  }
  
  private static createBrainOrgan(state: SystemState): BiologicalOrgan {
    const neuralTissue: BiologicalTissue = {
      id: 'neural-tissue',
      type: 'neural',
      cells: this.createNeuralCells(state),
      function: 'AI processing & pattern recognition',
      energyFlow: state.metrics.curiositySignals * 2
    }
    
    return {
      id: 'brain',
      type: 'brain',
      tissues: [neuralTissue],
      primaryFunction: 'Cognitive processing & decision making',
      health: this.calculateBrainHealth(state)
    }
  }
  
  private static createHeartOrgan(state: SystemState): BiologicalOrgan {
    const muscularTissue: BiologicalTissue = {
      id: 'cardiac-tissue',
      type: 'muscular',
      cells: this.createMuscleCells(state),
      function: 'Energy circulation & focus maintenance',
      energyFlow: state.focus.momentum * 1.5
    }
    
    return {
      id: 'heart',
      type: 'heart',
      tissues: [muscularTissue],
      primaryFunction: 'Energy distribution & focus rhythm',
      health: this.calculateHeartHealth(state)
    }
  }
  
  private static createLungsOrgan(state: SystemState): BiologicalOrgan {
    const circulatoryTissue: BiologicalTissue = {
      id: 'respiratory-tissue',
      type: 'circulatory',
      cells: this.createCirculatoryCells(state),
      function: 'Information oxygenation & capture processing',
      energyFlow: state.captures.length * 3
    }
    
    return {
      id: 'lungs',
      type: 'lungs',
      tissues: [circulatoryTissue],
      primaryFunction: 'Information flow & capture processing',
      health: this.calculateLungsHealth(state)
    }
  }
  
  private static createLiverOrgan(state: SystemState): BiologicalOrgan {
    const metabolicTissue: BiologicalTissue = {
      id: 'metabolic-tissue',
      type: 'digestive',
      cells: this.createMetabolicCells(state),
      function: 'Task metabolism & energy conversion',
      energyFlow: state.metrics.activeProjects * 4
    }
    
    return {
      id: 'liver',
      type: 'liver',
      tissues: [metabolicTissue],
      primaryFunction: 'Task processing & energy conversion',
      health: this.calculateLiverHealth(state)
    }
  }
  
  private static createNervousSystemOrgan(state: SystemState): BiologicalOrgan {
    const neuralTissue: BiologicalTissue = {
      id: 'nervous-tissue',
      type: 'neural',
      cells: this.createNeuralCells(state),
      function: 'System communication & routing',
      energyFlow: state.metrics.totalCaptures * 1.2
    }
    
    return {
      id: 'nervous_system',
      type: 'nervous_system',
      tissues: [neuralTissue],
      primaryFunction: 'Communication & intelligent routing',
      health: this.calculateNervousHealth(state)
    }
  }
  
  private static createNeuralCells(state: SystemState): BiologicalCell[] {
    return state.captures.slice(0, 10).map((capture: any, index: number) => ({
      id: `neuron-${index}`,
      type: 'neuron' as const,
      energy: capture.energy || 50,
      state: capture.processed ? 'active' : 'resting',
      connections: [`neuron-${index - 1}`, `neuron-${index + 1}`].filter(Boolean)
    }))
  }
  
  private static createMuscleCells(state: SystemState): BiologicalCell[] {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `muscle-${i}`,
      type: 'muscle' as const,
      energy: state.focus.momentum / 5,
      state: state.focus.momentum > 50 ? 'active' : 'resting',
      connections: [`muscle-${(i + 1) % 5}`]
    }))
  }
  
  private static createCirculatoryCells(state: SystemState): BiologicalCell[] {
    return Array.from({ length: 8 }, (_, i) => ({
      id: `circulatory-${i}`,
      type: 'immune' as const,
      energy: 75,
      state: 'active',
      connections: [`circulatory-${(i + 1) % 8}`]
    }))
  }
  
  private static createMetabolicCells(state: SystemState): BiologicalCell[] {
    return state.goals.map((goal: any, index: number) => ({
      id: `metabolic-${index}`,
      type: 'metabolic' as const,
      energy: goal.progress || 60,
      state: goal.isPrimary ? 'active' : 'resting',
      connections: [`metabolic-${(index + 1) % state.goals.length}`]
    }))
  }
  
  private static calculateBrainHealth(state: SystemState): number {
    const alignment = state.goals.find((g: any) => g.isPrimary) ? 80 : 60
    const captureHealth = Math.min(state.captures.length * 2, 100)
    return (alignment + captureHealth) / 2
  }
  
  private static calculateHeartHealth(state: SystemState): number {
    return Math.min(state.focus.momentum * 1.2, 100)
  }
  
  private static calculateLungsHealth(state: SystemState): number {
    return Math.min(state.captures.length * 5, 100)
  }
  
  private static calculateLiverHealth(state: SystemState): number {
    return Math.min(state.metrics.activeProjects * 20, 100)
  }
  
  private static calculateNervousHealth(state: SystemState): number {
    return Math.min(state.metrics.totalCaptures * 3, 100)
  }
  
  private static calculateHomeostasis(state: SystemState): number {
    const factors = [
      state.metrics.energyATP,
      state.focus.momentum,
      state.goals.filter((g: any) => g.isPrimary).length * 50,
      Math.min(state.captures.length * 2, 100)
    ]
    return factors.reduce((sum, f) => sum + f, 0) / factors.length
  }
  
  private static calculateCoherence(organs: BiologicalOrgan[]): number {
    const healthScores = organs.map(o => o.health)
    const avgHealth = healthScores.reduce((sum, h) => sum + h, 0) / healthScores.length
    const variance = healthScores.reduce((sum, h) => sum + Math.pow(h - avgHealth, 2), 0) / healthScores.length
    return Math.max(0, 100 - variance) // Lower variance = higher coherence
  }
}

// Biological Orchestrator - Ensures System Coherence
export class BiologicalOrchestrator {
  private organismState: OrganismState | null = null
  private lastUpdate: Date = new Date()
  
  /**
   * Synchronize cognitive system with biological model
   */
  async synchronize(state: SystemState): Promise<OrganismState> {
    this.organismState = BiologicalMapper.mapCognitiveToBiology(state)
    this.lastUpdate = new Date()
    
    // Perform coherence checks and adjustments
    await this.performCoherenceCheck()
    
    return this.organismState
  }
  
  /**
   * Process request through biological lens
   */
  async processBiologically(
    userQuery: string,
    provider: AIProvider,
    taskType: TaskType,
    cognitiveState: SystemState
  ): Promise<{
    response: string
    biologicalContext: OrganismState
    recommendations: string[]
  }> {
    // Synchronize with biological model
    const biologicalContext = await this.synchronize(cognitiveState)
    
    // Process through clean architecture
    const cleanResult = await cleanArchitecture.processRequest(
      userQuery,
      provider,
      taskType,
      cognitiveState
    )
    
    // Generate biological recommendations
    const recommendations = this.generateBiologicalRecommendations(
      biologicalContext,
      taskType,
      cleanResult.metadata
    )
    
    // Apply biological adjustments to state
    await this.applyBiologicalAdjustments(cleanResult.stateUpdates || {})
    
    return {
      response: cleanResult.response,
      biologicalContext,
      recommendations
    }
  }
  
  private async performCoherenceCheck(): Promise<void> {
    if (!this.organismState) return
    
    const { organs, coherence, homeostasis } = this.organismState
    
    // Check for organ imbalances
    const unhealthyOrgans = organs.filter(organ => organ.health < 50)
    if (unhealthyOrgans.length > 0) {
      console.warn(`⚠️ Biological coherence warning: ${unhealthyOrgans.map(o => o.type).join(', ')} need attention`)
    }
    
    // Check system coherence
    if (coherence < 70) {
      console.warn(`⚠️ System coherence low: ${coherence.toFixed(1)}%`)
    }
    
    // Check homeostasis
    if (homeostasis < 60) {
      console.warn(`⚠️ Homeostasis disrupted: ${homeostasis.toFixed(1)}%`)
    }
  }
  
  private generateBiologicalRecommendations(
    context: OrganismState,
    taskType: TaskType,
    metadata: any
  ): string[] {
    const recommendations: string[] = []
    
    // Brain health recommendations
    const brain = context.organs.find(o => o.type === 'brain')
    if (brain && brain.health < 70) {
      recommendations.push('🧠 Brain needs rest: Consider a cognitive break or meditation')
    }
    
    // Heart health recommendations
    const heart = context.organs.find(o => o.type === 'heart')
    if (heart && heart.health < 60) {
      recommendations.push('❤️ Heart rhythm low: Start a focus session to boost energy flow')
    }
    
    // Lungs health recommendations
    const lungs = context.organs.find(o => o.type === 'lungs')
    if (lungs && lungs.health < 50) {
      recommendations.push('🫁 Lungs need oxygenation: Process pending captures')
    }
    
    // Task-specific recommendations
    if (taskType === 'coding' || taskType === 'debugging') {
      recommendations.push('💻 Neural load high: Stay hydrated and take regular breaks')
    }
    
    if (taskType === 'planning' || taskType === 'architecture') {
      recommendations.push('🏗️ Strategic mode: Ensure adequate energy reserves')
    }
    
    // Coherence recommendations
    if (context.coherence < 80) {
      recommendations.push('🔄 System coherence low: Reconnect with primary goal')
    }
    
    return recommendations
  }
  
  private async applyBiologicalAdjustments(stateUpdates: Partial<SystemState>): Promise<void> {
    // Apply state updates while maintaining biological coherence
    if (stateUpdates.metrics) {
      // Ensure energy doesn't exceed biological limits
      stateUpdates.metrics.energyATP = Math.min(stateUpdates.metrics.energyATP, 100)
      stateUpdates.metrics.energyATP = Math.max(stateUpdates.metrics.energyATP, 0)
    }
    
    // Update organism state
    if (this.organismState) {
      this.organismState.lastSync = new Date()
    }
  }
  
  /**
   * Get current biological health report
   */
  getHealthReport(): {
    overall: number
    organs: Array<{type: string, health: number, status: string}>
    coherence: number
    recommendations: string[]
  } | null {
    if (!this.organismState) return null
    
    const overall = this.organismState.organs.reduce((sum, organ) => sum + organ.health, 0) / this.organismState.organs.length
    
    return {
      overall,
      organs: this.organismState.organs.map(organ => ({
        type: organ.type,
        health: organ.health,
        status: organ.health > 80 ? 'Excellent' : organ.health > 60 ? 'Good' : organ.health > 40 ? 'Fair' : 'Poor'
      })),
      coherence: this.organismState.coherence,
      recommendations: this.generateBiologicalRecommendations(this.organismState, 'general', {})
    }
  }
}

// Singleton instance
export const biologicalOrchestrator = new BiologicalOrchestrator()
