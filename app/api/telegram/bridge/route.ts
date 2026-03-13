import { NextResponse } from 'next/server'
import { regulateOrganism, getOrganismState } from '@/lib/organism-coordinator'
import { prisma } from '@/lib/prisma'

// ── TELEGRAM BRIDGE: External communication for the living organism ─────────────
// Allows the organism to communicate beyond its internal boundaries
// Extends the feedback loop to external channels

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

async function sendTelegramMessage(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return
  
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })
  } catch (error) {
    console.error('[telegram bridge]', error)
  }
}

export async function POST(request: Request) {
  try {
    // Get organism state
    const state = await getOrganismState()
    
    // Format organism status for external communication
    const statusMessage = `
🧬 <b>NEXUS ORGANISM STATUS</b>
━━━━━━━━━━━━━━━━━━━━━━
🔬 Cellular Activity: ${state.cellularActivity} captures/7d
🎯 Pattern Formation: ${state.patternFormation} active patterns
💎 Crystallization: ${state.crystallizationReady} ready for projects
⚡ Action Velocity: ${state.actionVelocity} actions/week
🏥 Organism Health: <b>${state.organismHealth.toUpperCase()}</b>

${state.organismHealth === 'critical' ? '🚨 ORGANISM REQUIRES IMMEDIATE INPUT' : ''}
${state.organismHealth === 'drift' ? '⚠️ Low activity detected - consider capture' : ''}
${state.organismHealth === 'thriving' ? '✨ Organism is thriving - continue momentum' : ''}
${state.organismHealth === 'balanced' ? '⚖️ Organism is balanced - maintain rhythm' : ''}
    `.trim()
    
    await sendTelegramMessage(statusMessage)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Organism status sent to Telegram',
      state 
    })
    
  } catch (error) {
    console.error('[telegram bridge]', error)
    return NextResponse.json({ error: 'Failed to send organism status' }, { status: 500 })
  }
}

// Manual trigger for organism regulation
export async function PATCH() {
  try {
    const result = await regulateOrganism()
    
    const regulationMessage = `
🔄 <b>NEXUS REGULATION CYCLE</b>
━━━━━━━━━━━━━━━━━━━━━━
Actions taken: ${result.actions.join(', ')}
New health state: ${result.newState.organismHealth}
    `.trim()
    
    await sendTelegramMessage(regulationMessage)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Regulation cycle completed',
      result 
    })
    
  } catch (error) {
    console.error('[telegram regulation]', error)
    return NextResponse.json({ error: 'Failed to regulate organism' }, { status: 500 })
  }
}
