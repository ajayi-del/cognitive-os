// ORGANISM COORDINATOR - Herbert Simon's decomposable system
// Each subsystem can be built/understood separately, yet coordinated

import { runNexusHeartbeat } from './nexus-engine'
import { prisma } from './prisma'

// ── BOGDANOV'S ORGANIZING ACTIVITY: The principle that unifies all parts ─────────
// Every capture is a cell. The organism exists through their coordination.
// This coordinator is the organizing activity - not another component.

export interface OrganismState {
  cellularActivity: number      // captures in last 7 days
  patternFormation: number      // active seed patterns
  crystallizationReady: number // patterns ready for projects
  actionVelocity: number        // actions completed this week
  organismHealth: 'thriving' | 'balanced' | 'drift' | 'critical'
}

export async function getOrganismState(): Promise<OrganismState> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  const [cellularActivity, patternFormation, crystallizationReady, actionVelocity] = await Promise.all([
    // Cellular activity: captures (the cells)
    prisma.note.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    
    // Pattern formation: organizing activity in progress
    prisma.seedPattern.count({ where: { status: 'watching', lastSeenAt: { gte: sevenDaysAgo } } }),
    
    // Crystallization: patterns ready to become projects
    prisma.seedPattern.count({ where: { status: 'proposed' } }),
    
    // Action velocity: organism's effectors
    prisma.actionQueueItem.count({ where: { status: 'done', updatedAt: { gte: oneWeekAgo } } })
  ])
  
  // Herbert Simon: satisficing decision for organism health
  let organismHealth: OrganismState['organismHealth'] = 'balanced'
  
  if (cellularActivity >= 10 && patternFormation >= 3 && actionVelocity >= 5) {
    organismHealth = 'thriving'
  } else if (cellularActivity < 3 || patternFormation === 0) {
    organismHealth = 'critical'
  } else if (cellularActivity < 5 || actionVelocity < 2) {
    organismHealth = 'drift'
  }
  
  return {
    cellularActivity,
    patternFormation,
    crystallizationReady,
    actionVelocity,
    organismHealth
  }
}

// ── WIENER'S FEEDBACK LOOP: Coordinated regulation────────────────────────────
export async function regulateOrganism(): Promise<{ actions: string[]; newState: OrganismState }> {
  const currentState = await getOrganismState()
  const heartbeat = await runNexusHeartbeat()
  
  // Negative feedback: if organism is drifting, stimulate cellular activity
  if (currentState.organismHealth === 'drift' || currentState.organismHealth === 'critical') {
    // This is the regulatory mechanism - not just detection, but response
    console.log(`[organism] Health: ${currentState.organismHealth} - stimulating activity`)
  }
  
  return {
    actions: heartbeat.actions,
    newState: currentState
  }
}

// ── SCHWANN'S CELL THEORY: Each cell complete, organism through coordination ───────
export async function coordinateCell(cellId: string, cellContent: string): Promise<void> {
  // Each capture (cell) is complete in itself
  // The organism only exists through their coordination
  await prisma.note.update({
    where: { id: cellId },
    data: { content: cellContent }
  })
  
  // Trigger organizing activity (the heartbeat)
  // This is how cells become organism
  fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/nexus/heartbeat`, {
    method: 'POST'
  }).catch(() => {}) // fire-and-forget
}
