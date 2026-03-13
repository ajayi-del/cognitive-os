import { NextResponse } from 'next/server'
import { runNexusHeartbeat, generateMorningBriefing } from '@/lib/nexus-engine'

export async function POST() {
  try {
    // Check if morning briefing is needed (between 07:55 and 08:05 UTC)
    const now = new Date()
    const hour = now.getUTCHours()
    const minute = now.getUTCMinutes()
    const isBriefingWindow = hour === 8 && minute >= 0 && minute <= 10
    
    if (isBriefingWindow) await generateMorningBriefing()
    
    const result = await runNexusHeartbeat()
    return NextResponse.json(result)
  } catch (error) {
    console.error('[nexus heartbeat]', error)
    return NextResponse.json({ error: 'Heartbeat failed' }, { status: 500 })
  }
}
