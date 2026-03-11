import { NextRequest, NextResponse } from 'next/server'

// Toggle Autonomous Agent
export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json()
    
    // Update environment or state
    process.env.AUTONOMOUS_AGENT_ENABLED = enabled.toString()
    
    console.log(`🤖 Autonomous agent ${enabled ? 'enabled' : 'disabled'}`)
    
    return NextResponse.json({
      success: true,
      enabled,
      message: `Autonomous agent ${enabled ? 'enabled' : 'disabled'}`
    })
  } catch (error) {
    console.error('Toggle autonomous error:', error)
    return NextResponse.json({ error: 'Failed to toggle autonomous mode' }, { status: 500 })
  }
}

// Get autonomous status
export async function GET() {
  const enabled = process.env.AUTONOMOUS_AGENT_ENABLED === 'true'
  
  return NextResponse.json({
    enabled,
    autonomy_level: process.env.MAX_AUTONOMY_LEVEL,
    learning_enabled: process.env.AUTO_LEARNING_ENABLED === 'true',
    execution_enabled: process.env.AUTO_EXECUTION_ENABLED === 'true'
  })
}
