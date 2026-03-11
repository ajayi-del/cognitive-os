// AI Tasks Generation API Route
// Generates actionable tasks from captures

import { NextRequest, NextResponse } from 'next/server'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

export async function GET() {
  return NextResponse.json({ 
    message: 'AI Tasks API',
    status: 'active',
    tasks: []
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    const response = await fetch(`${AI_SERVICE_URL}/generate-tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) {
      // Fallback task generation
      return NextResponse.json({
        tasks: [
          {
            title: 'Review and process capture',
            description: content.slice(0, 100),
            priority: 'medium'
          }
        ],
        confidence: 0.5,
        fallback: true
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('AI Tasks API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate tasks' },
      { status: 500 }
    )
  }
}
