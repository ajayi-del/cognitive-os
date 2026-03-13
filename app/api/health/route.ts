import { NextResponse } from 'next/server'

export async function GET() {
  const checks = await Promise.allSettled([
    // Simple health check - we'll add Redis later
    Promise.resolve('ok'),
  ])

  return NextResponse.json({
    db: checks[0].status === 'fulfilled' ? 'ok' : 'error',
    redis: 'ok', // placeholder
    timestamp: new Date().toISOString(),
  })
}
