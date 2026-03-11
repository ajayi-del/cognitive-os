// AI Routing Suggestion API Route
// Gets AI-powered routing suggestions for captures

import { NextRequest, NextResponse } from 'next/server'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, captureHistory = [] } = body

    const response = await fetch(`${AI_SERVICE_URL}/routing-suggestion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        capture_history: captureHistory
      }),
    })

    if (!response.ok) {
      // Fallback routing logic
      const content_lower = content.toLowerCase()
      let suggested = 'idea_bucket'
      
      if (content_lower.includes('task') || content_lower.includes('todo') || content_lower.includes('need to')) {
        suggested = 'action_queue'
      } else if (content_lower.includes('project') || content_lower.includes('goal') || content_lower.includes('build')) {
        suggested = 'project'
      }

      return NextResponse.json({
        suggestion: suggested,
        confidence: 0.6,
        fallback: true
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('AI Routing API error:', error)
    return NextResponse.json(
      { error: 'Failed to get routing suggestion' },
      { status: 500 }
    )
  }
}
