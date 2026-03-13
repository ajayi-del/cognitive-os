import { NextResponse } from 'next/server'
import { getChessGameHistory } from '@/lib/chess-session'

// ─── CHESS GAME HISTORY API ─────────────────────────────────────────────────────
// Returns recent completed or active games for review

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const includeActive = searchParams.get('includeActive') === 'true'

    const games = await getChessGameHistory(limit)
    
    // Filter out active games unless explicitly requested
    const filteredGames = includeActive 
      ? games 
      : games.filter(game => game.status === 'finished')

    return NextResponse.json({
      success: true,
      games: filteredGames,
      count: filteredGames.length,
      message: `Retrieved ${filteredGames.length} games`
    })
  } catch (error) {
    console.error('[chess history API]', error)
    return NextResponse.json({
      error: 'Failed to get game history',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
