// AI Drift Analysis API Route
// Analyzes user drift from primary goal

import { NextRequest, NextResponse } from 'next/server'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { recentCaptures, primaryGoal, alignmentScore } = body

    const response = await fetch(`${AI_SERVICE_URL}/analyze-drift`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recent_captures: recentCaptures,
        primary_goal: primaryGoal,
        alignment_score: alignmentScore
      }),
    })

    if (!response.ok) {
      // Fallback drift analysis
      const risk = alignmentScore > 70 ? 'low' : alignmentScore > 50 ? 'medium' : 'high'
      return NextResponse.json({
        drift_risk: risk,
        reason: `Alignment score is ${alignmentScore}%`,
        suggestion: risk === 'high' ? 'Reconnect with your primary goal' : 'Continue monitoring',
        confidence: alignmentScore / 100,
        fallback: true
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('AI Drift API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze drift' },
      { status: 500 }
    )
  }
}
