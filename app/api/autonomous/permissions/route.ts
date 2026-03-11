import { NextRequest, NextResponse } from 'next/server'

// Update Autonomous Permissions
export async function POST(request: NextRequest) {
  try {
    const permissions = await request.json()
    
    // Update permissions in environment or state
    Object.keys(permissions).forEach(key => {
      process.env[key] = permissions[key].toString()
    })
    
    console.log('🔐 Updated autonomous permissions:', permissions)
    
    return NextResponse.json({
      success: true,
      permissions,
      message: 'Permissions updated successfully'
    })
  } catch (error) {
    console.error('Update permissions error:', error)
    return NextResponse.json({ error: 'Failed to update permissions' }, { status: 500 })
  }
}

// Get current permissions
export async function GET() {
  const permissions = {
    auto_job_apply: process.env.AUTO_JOB_APPLY_ENABLED === 'true',
    auto_communication: process.env.AUTO_COMMUNICATION_ENABLED === 'true',
    auto_scheduling: process.env.AUTO_SCHEDULING_ENABLED === 'true',
    auto_financial_decisions: process.env.AUTO_FINANCIAL_DECISIONS === 'true',
    max_autonomy_level: parseInt(process.env.MAX_AUTONOMY_LEVEL || '7')
  }
  
  return NextResponse.json({
    permissions,
    require_confirmation_for: process.env.REQUIRE_CONFIRMATION_FOR?.split(',') || [],
    emergency_stop_enabled: process.env.EMERGENCY_STOP_ENABLED === 'true'
  })
}
