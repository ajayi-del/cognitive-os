// AI Service Status API Route
// Returns BAZINGA service health and configuration

import { NextRequest, NextResponse } from 'next/server'

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

export async function GET() {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`, {
      method: 'GET',
    })

    if (!response.ok) {
      return NextResponse.json({
        status: 'unavailable',
        bazinga_available: false,
        message: 'AI service is not running. Start it with: python ai-service/main.py'
      })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('AI Status API error:', error)
    return NextResponse.json({
      status: 'unavailable',
      bazinga_available: false,
      gemini_configured: false,
      message: 'AI service is not running'
    })
  }
}
