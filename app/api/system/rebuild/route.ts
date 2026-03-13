import { NextResponse } from 'next/server'
import { rebuildDerivedData, checkSystemStability } from '@/lib/canonical-events'

// ─── SYSTEM REBUILD API ─────────────────────────────────────────────────────
// Allows complete regeneration of derived data from canonical events
// This is the guardrail that prevents system collapse

export async function POST() {
  try {
    console.log('[system rebuild] Starting derived data regeneration...')
    
    const result = await rebuildDerivedData()
    
    if (result.success) {
      console.log(`[system rebuild] Complete: ${result.patternsRebuilt} patterns, ${result.insightsRebuilt} insights`)
      return NextResponse.json({
        success: true,
        message: 'Derived data rebuilt successfully',
        patternsRebuilt: result.patternsRebuilt,
        insightsRebuilt: result.insightsRebuilt,
        timestamp: new Date().toISOString()
      })
    } else {
      throw new Error('Rebuild failed')
    }
  } catch (error) {
    console.error('[system rebuild]', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to rebuild derived data'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const stability = await checkSystemStability()
    
    return NextResponse.json({
      systemHealth: stability,
      message: stability.systemHealthy 
        ? 'System is stable - derived data can be rebuilt from canonical events'
        : 'System instability detected - canonical data may be corrupted',
      architecturalRule: 'Only events may be written to the database. Interpretations must be recomputed.',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[system stability check]', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check system stability'
    }, { status: 500 })
  }
}
