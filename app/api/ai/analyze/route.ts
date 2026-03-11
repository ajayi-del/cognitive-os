// AI Analyze Capture API Route
// Analyzes captures using BAZINGA

import { NextRequest, NextResponse } from 'next/server'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, userContext = {} } = body

    const response = await fetch(`${AI_SERVICE_URL}/analyze-capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        user_context: userContext
      }),
    })

    if (!response.ok) {
      // Fallback analysis
      return NextResponse.json({
        summary: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
        sentiment: 'neutral',
        suggested_route: 'idea_bucket',
        keywords: [],
        confidence: 0.5,
        fallback: true
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('AI Analyze API error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze capture' },
      { status: 500 }
    )
  }
}
