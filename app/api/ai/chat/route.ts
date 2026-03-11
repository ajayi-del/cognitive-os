// AI Chat API Route
// Bridges Next.js frontend to BAZINGA Python service

import { NextRequest, NextResponse } from 'next/server'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, history = [], userState = {} } = body

    // Forward to BAZINGA service
    const response = await fetch(`${AI_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        user_state: userState
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('BAZINGA chat error:', error)
      
      // Fallback response if BAZINGA is unavailable
      return NextResponse.json({
        response: `I received your message: "${message}". The AI service is temporarily unavailable, but your capture has been saved.`,
        suggested_actions: [
          { label: 'Create Capture', action: 'create_capture' }
        ],
        fallback: true
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('AI Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
