import { NextResponse } from 'next/server'
import { triggerNexusMove, processPendingMoves } from '@/lib/chess-worker'

// ─── NEXUS CHESS RESPONSE API ─────────────────────────────────────────────────────
// Internal route for triggering Nexus move generation
// Can be called by background workers or cron jobs

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { gameId } = body

    if (gameId) {
      // Trigger move for specific game
      await triggerNexusMove(gameId)
      
      return NextResponse.json({
        success: true,
        message: 'Nexus move triggered for game: ' + gameId
      })
    } else {
      // Process all pending moves
      await processPendingMoves()
      
      return NextResponse.json({
        success: true,
        message: 'All pending moves processed'
      })
    }
  } catch (error) {
    console.error('[chess respond API]', error)
    return NextResponse.json({
      error: 'Failed to trigger Nexus response',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET returns worker status
export async function GET() {
  try {
    const { getChessWorkerHealth } = await import('@/lib/chess-worker')
    const health = await getChessWorkerHealth()
    
    return NextResponse.json({
      success: true,
      health
    })
  } catch (error) {
    console.error('[chess respond GET API]', error)
    return NextResponse.json({
      error: 'Failed to get worker status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
