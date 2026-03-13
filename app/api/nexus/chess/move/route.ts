import { NextResponse } from 'next/server'
import { applyChessMove, getChessGameById } from '@/lib/chess-session'
import { triggerNexusMove } from '@/lib/chess-worker'

// ─── CHESS MOVE API ─────────────────────────────────────────────────────
// Validates and saves user move immediately
// Triggers async Nexus move generation
// Never waits for engine calculation

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { gameId, move } = body

    if (!gameId || !move) {
      return NextResponse.json({
        error: 'Missing required fields: gameId, move'
      }, { status: 400 })
    }

    // Validate move and apply it
    const updatedGame = await applyChessMove(gameId, move, 'user')
    
    // Trigger async Nexus move if game is still active and it's Nexus turn
    if (updatedGame.status === 'active' && updatedGame.nexusMovePending) {
      // Fire-and-forget - don't wait for engine response
      triggerNexusMove(gameId).catch(error => {
        console.error('[chess move] Failed to trigger Nexus move:', error)
      })
    }

    return NextResponse.json({
      success: true,
      game: updatedGame,
      message: 'Move applied successfully'
    })
  } catch (error) {
    console.error('[chess move API]', error)
    
    // Return specific error messages for common issues
    let errorMessage = 'Failed to apply move'
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message
      
      if (error.message.includes('not found')) {
        statusCode = 404
      } else if (error.message.includes('not active') || error.message.includes('Not your turn') || error.message.includes('Invalid move')) {
        statusCode = 400
      }
    }

    return NextResponse.json({
      error: errorMessage,
      message: errorMessage
    }, { status: statusCode })
  }
}

// GET returns current game state for specific game
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

    return NextResponse.json({
      success: true,
      game
    })
  } catch (error) {
    console.error('[chess move GET API]', error)
    return NextResponse.json({
      error: 'Failed to get game state',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
