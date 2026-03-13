import { NextResponse } from 'next/server'
import { createChessGame, getActiveChessGame } from '@/lib/chess-session'

// ─── START CHESS GAME API ─────────────────────────────────────────────────────
// Creates a new chess game or returns existing active game
// Non-blocking - never waits for engine calculations

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { userColor = 'white', engineLevel = 10 } = body

    // Check if there's already an active game
    const existingGame = await getActiveChessGame()
    if (existingGame) {
      return NextResponse.json({
        success: true,
        game: existingGame,
        message: 'Using existing active game'
      })
    }

    // Create new game
    const game = await createChessGame({ 
      userColor: userColor as 'white' | 'black',
      engineLevel 
    })

    return NextResponse.json({
      success: true,
      game,
      message: 'New chess game created'
    })
  } catch (error) {
    console.error('[chess start API]', error)
    return NextResponse.json({
      error: 'Failed to start chess game',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET returns current active game
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
    console.error('[chess start GET API]', error)
    return NextResponse.json({
      error: 'Failed to get active game',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
