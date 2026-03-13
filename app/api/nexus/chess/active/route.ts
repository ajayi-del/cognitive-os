import { NextResponse } from 'next/server'
import { getActiveChessGame } from '@/lib/chess-session'

// ─── ACTIVE CHESS GAME API ─────────────────────────────────────────────────────
// Returns the current active chess game if one exists
// Used by dock widget on app load

export async function GET() {
  try {
    const game = await getActiveChessGame()
    
    if (!game) {
      return NextResponse.json({
        success: true,
        game: null,
        message: 'No active game found'
      })
    }

    return NextResponse.json({
      success: true,
      game,
      message: 'Active game found'
    })
  } catch (error) {
    console.error('[chess active API]', error)
    return NextResponse.json({
      error: 'Failed to get active game',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
