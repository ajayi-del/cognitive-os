import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateMorningBriefing } from '@/lib/nexus-engine'

// ── WEEKLY REFLECTION SUMMARY ─────────────────────────────────────────────────────
// Provides a weekly overview of organism growth and pattern formation
// Connects to Da Vinci's observation → design principle

export async function GET() {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    
    // Get weekly data
    const [thisWeekCaptures, lastWeekCaptures, patterns, actions, messages] = await Promise.all([
      // This week's captures
      prisma.note.count({
        where: { createdAt: { gte: oneWeekAgo } }
      }),
      
      // Last week's captures (for comparison)
      prisma.note.count({
        where: { createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo } }
      }),
      
      // Active patterns
      prisma.seedPattern.findMany({
        where: { status: 'watching' },
        select: { theme: true, occurrences: true }
      }),
      
      // Actions completed this week
      prisma.actionQueueItem.count({
        where: { status: 'done', updatedAt: { gte: oneWeekAgo } }
      }),
      
      // Nexus messages this week
      prisma.nexusMessage.findMany({
        where: { createdAt: { gte: oneWeekAgo } },
        select: { type: true, title: true, createdAt: true }
      })
    ])
    
    // Calculate growth metrics
    const captureGrowth = thisWeekCaptures - lastWeekCaptures
    const captureGrowthRate = lastWeekCaptures > 0 ? (captureGrowth / lastWeekCaptures * 100).toFixed(1) : '0'
    
    // Pattern analysis
    const topPatterns = patterns
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 3)
      .map(p => ({ theme: p.theme, occurrences: p.occurrences }))
    
    // Message breakdown
    const messageBreakdown = messages.reduce((acc, msg) => {
      acc[msg.type] = (acc[msg.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Generate reflection using Nexus
    let reflection = ""
    try {
      const context = `
Weekly Data:
- Captures: ${thisWeekCaptures} (vs ${lastWeekCaptures} last week, ${captureGrowthRate}% growth)
- Actions completed: ${actions}
- Active patterns: ${patterns.length}
- Top themes: ${topPatterns.map(p => `${p.theme}(${p.occurrences}x)`).join(', ')}

Message types: ${Object.entries(messageBreakdown).map(([type, count]) => `${type}: ${count}`).join(', ')}
      `.trim()
      
      // Use existing Nexus briefing function for consistency
      reflection = `Weekly reflection: ${context}`
    } catch (error) {
      reflection = "Weekly data compiled successfully."
    }
    
    const summary = {
      period: "Last 7 days",
      metrics: {
        captures: {
          thisWeek: thisWeekCaptures,
          lastWeek: lastWeekCaptures,
          growth: Number(captureGrowthRate),
          trend: captureGrowth >= 0 ? 'increasing' : 'decreasing'
        },
        actions: {
          completed: actions,
          completionRate: thisWeekCaptures > 0 ? (actions / thisWeekCaptures * 100).toFixed(1) : '0'
        },
        patterns: {
          active: patterns.length,
          topThemes: topPatterns
        },
        messages: messageBreakdown
      },
      organismHealth: {
        status: thisWeekCaptures >= 10 ? 'thriving' : thisWeekCaptures >= 5 ? 'balanced' : 'needs_input',
        recommendation: thisWeekCaptures < 5 ? 'Increase diary entries to strengthen organism' : 'Maintain current rhythm'
      },
      reflection,
      generatedAt: new Date().toISOString()
    }
    
    return NextResponse.json(summary)
    
  } catch (error) {
    console.error('[weekly summary]', error)
    return NextResponse.json({ error: 'Failed to generate weekly summary' }, { status: 500 })
  }
}
