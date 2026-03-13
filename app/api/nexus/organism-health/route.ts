import { NextResponse } from 'next/server'
import { assessOrganismHealth, generateHealthMessages } from '@/lib/organism-monitor'

// ─── ORGANISM HEALTH API ─────────────────────────────────────────────────────
// Returns the current health state of the Nexus Organism
// This endpoint allows the organism to observe its own cognitive state

export async function GET() {
  try {
    const health = await assessOrganismHealth()
    const messages = await generateHealthMessages(health)
    
    return NextResponse.json({
      ...health,
      messages,
      architecturalRule: "Events are canonical. Interpretations are derived.",
      timestamp: health.timestamp.toISOString()
    })
  } catch (error) {
    console.error('[organism health]', error)
    return NextResponse.json({
      error: 'Failed to assess organism health',
      fallback: {
        cognitivePressure: 'medium',
        executionGap: 0,
        systemStability: 50,
        architecturalIntegrity: 'warning'
      }
    }, { status: 500 })
  }
}

// POST endpoint for manual health checks
export async function POST() {
  try {
    const health = await assessOrganismHealth()
    
    // If there are critical issues, create feedback events
    if (health.architecturalIntegrity === 'critical' || health.systemStability < 70) {
      // This would create a feedback event in a real implementation
      console.warn('[organism health] Critical issues detected:', health)
    }
    
    return NextResponse.json({
      success: true,
      health,
      message: 'Health assessment completed'
    })
  } catch (error) {
    console.error('[organism health POST]', error)
    return NextResponse.json({
      error: 'Failed to run health assessment'
    }, { status: 500 })
  }
}
