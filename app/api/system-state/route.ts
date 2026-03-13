import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Real system state API - queries actual database with error handling
export async function GET() {
  try {
    // Use Promise.allSettled to handle missing tables gracefully
    const [
      projectsResult,
      bucketsResult,
      patternsResult,
      knowledgeResult,
      phaseResult,
      futureselfResult,
      driftResult,
      actionsResult,
      notesResult,
    ] = await Promise.allSettled([
      prisma.project.findMany({ where: { status: 'active' }, orderBy: { lastTouched: 'desc' }, take: 10 }).catch(() => []),
      prisma.ideaBucket.findMany({ orderBy: { signalStrength: 'desc' }, take: 20 }).catch(() => []),
      prisma.patternReport.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }).catch(() => []),
      prisma.knowledgeNode.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }).catch(() => []),
      prisma.phaseState.findFirst().catch(() => null),
      prisma.futureSelfProfile.findFirst().catch(() => null),
      prisma.driftSignal.findMany({ where: { severity: { in: ['high','critical'] } }, take: 5 }).catch(() => []),
      prisma.actionQueueItem.findMany({ where: { status: 'pending' }, orderBy: { priority: 'desc' }, take: 10 }).catch(() => []),
      prisma.note.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }).catch(() => []),
    ])

    // Extract values from settled promises
    const projects = projectsResult.status === 'fulfilled' ? projectsResult.value : []
    const buckets = bucketsResult.status === 'fulfilled' ? bucketsResult.value : []
    const patterns = patternsResult.status === 'fulfilled' ? patternsResult.value : []
    const knowledge = knowledgeResult.status === 'fulfilled' ? knowledgeResult.value : []
    const phase = phaseResult.status === 'fulfilled' ? phaseResult.value : null
    const futureself = futureselfResult.status === 'fulfilled' ? futureselfResult.value : null
    const drift = driftResult.status === 'fulfilled' ? driftResult.value : []
    const actions = actionsResult.status === 'fulfilled' ? actionsResult.value : []
    const notes = notesResult.status === 'fulfilled' ? notesResult.value : []

    return NextResponse.json({
      active_projects: projects,
      idea_buckets: buckets,
      recurring_patterns: patterns,
      compressed_knowledge: knowledge,
      phase_state: phase,
      future_self_profile: futureself,
      drift_signals: drift,
      aligned_actions: actions,
      recent_notes: notes,
      generated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[system-state] DB error:', error)
    return NextResponse.json({ error: 'Failed to load system state' }, { status: 500 })
  }
}
