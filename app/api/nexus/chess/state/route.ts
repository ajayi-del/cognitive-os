import { NextResponse } from 'next/server'
import { getChessGameById } from '@/lib/chess-session'

// ─── CHESS GAME STATE API ─────────────────────────────────────────────────────
// Returns authoritative current game state
// Used for polling and state reconciliation

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get('gameId')

    if (!gameId) {
      return NextResponse.json({
        error: 'Missing gameId parameter'
      }, { status: 400 })
    }

    const game = await getChessGameById(gameId)
    
    if (!game) {
      return NextResponse.json({
        error: 'Game not found'
      }, { status: 404 })
    }

    // Return comprehensive game state
    return NextResponse.json({
      success: true,
      game,
      metadata: {
        whoseTurn: game.status === 'active' ? (game.fen.split(' ')[1] === 'w' ? 'white' : 'black') : null,
        isCheck: game.fen.includes('+'),
        isCheckmate: game.fen.includes('#'),
        isGameOver: game.status === 'finished',
        moveCount: game.moves.length,
        lastMoveAt: game.lastMoveAt,
        nexusMovePending: game.nexusMovePending
      }
    })
  } catch (error) {
    console.error('[chess state API]', error)
    return NextResponse.json({
      error: 'Failed to get game state',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
