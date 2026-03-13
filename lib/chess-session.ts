// ─── NEXUS CHESS SESSION MANAGER ─────────────────────────────────────────────
// Handles chess game creation, loading, and state management
// Isolated from canonical captures - separate domain

import { prisma } from './prisma'

// Import chess.js for move validation and game state
// Note: This would require installing chess.js package
// npm install chess.js @types/chess.js
declare const Chess: any // Placeholder - would be: import Chess from 'chess.js'

export interface ChessGameState {
  id: string
  status: 'active' | 'finished' | 'abandoned'
  fen: string
  pgn: string
  userColor: 'white' | 'black'
  engineLevel: number
  result?: string
  nexusMovePending: boolean
  createdAt: Date
  updatedAt: Date
  lastMoveAt: Date
  moves: ChessMoveState[]
}

export interface ChessMoveState {
  id: string
  moveNumber: number
  by: 'user' | 'nexus'
  san: string
  uci: string
  fenAfter: string
  evaluation?: number
  createdAt: Date
}

export interface CreateGameOptions {
  userColor?: 'white' | 'black'
  engineLevel?: number
}

// ─── GAME CREATION ─────────────────────────────────────────────────────────────
export async function createChessGame(options: CreateGameOptions = {}): Promise<ChessGameState> {
  try {
    // Check if there's already an active game
    const existingGame = await getActiveChessGame()
    if (existingGame) {
      return existingGame
    }

    // Initialize new game with standard starting position
    const startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    
    const game = await prisma.chessGame.create({
      data: {
        status: 'active',
        fen: startingFen,
        pgn: '',
        userColor: options.userColor || 'white',
        engineLevel: options.engineLevel || 10,
        nexusMovePending: false
      },
      include: {
        moves: {
          orderBy: { moveNumber: 'asc' }
        }
      }
    })

    return serializeGameState(game)
  } catch (error) {
    console.error('[chess session] create game error:', error)
    throw new Error('Failed to create chess game')
  }
}

// ─── ACTIVE GAME LOADING ───────────────────────────────────────────────────────
export async function getActiveChessGame(): Promise<ChessGameState | null> {
  try {
    const game = await prisma.chessGame.findFirst({
      where: {
        status: 'active'
      },
      include: {
        moves: {
          orderBy: { moveNumber: 'asc' }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return game ? serializeGameState(game) : null
  } catch (error) {
    console.error('[chess session] load active game error:', error)
    return null
  }
}

export async function getChessGameById(gameId: string): Promise<ChessGameState | null> {
  try {
    const game = await prisma.chessGame.findUnique({
      where: { id: gameId },
      include: {
        moves: {
          orderBy: { moveNumber: 'asc' }
        }
      }
    })

    return game ? serializeGameState(game) : null
  } catch (error) {
    console.error('[chess session] load game by id error:', error)
    return null
  }
}

// ─── MOVE APPLICATION ─────────────────────────────────────────────────────────────
export async function applyChessMove(
  gameId: string,
  move: string, // SAN notation (e.g., "e4", "Nf3")
  player: 'user' | 'nexus'
): Promise<ChessGameState> {
  try {
    // Load current game
    const game = await prisma.chessGame.findUnique({
      where: { id: gameId },
      include: {
        moves: {
          orderBy: { moveNumber: 'desc' },
          take: 1
        }
      }
    })

    if (!game) {
      throw new Error('Game not found')
    }

    if (game.status !== 'active') {
      throw new Error('Game is not active')
    }

    // Validate move with chess.js
    const chess = new Chess(game.fen)
    
    // Check if it's the correct player's turn
    const currentTurn = chess.turn()
    const isUserTurn = (player === 'user' && game.userColor === 'white' && currentTurn === 'w') ||
                      (player === 'user' && game.userColor === 'black' && currentTurn === 'b') ||
                      (player === 'nexus' && game.userColor === 'white' && currentTurn === 'b') ||
                      (player === 'nexus' && game.userColor === 'black' && currentTurn === 'w')

    if (!isUserTurn) {
      throw new Error('Not your turn')
    }

    // Attempt to make the move
    const moveResult = chess.move(move, { verbose: true })
    
    if (!moveResult) {
      throw new Error('Invalid move')
    }

    // Calculate move number
    const lastMove = game.moves[0]
    const moveNumber = lastMove ? lastMove.moveNumber + 1 : 1

    // Save the move
    const chessMove = await prisma.chessMove.create({
      data: {
        gameId,
        moveNumber,
        by: player,
        san: moveResult.san,
        uci: moveResult.lan, // Long Algebraic Notation
        fenAfter: chess.fen()
      }
    })

    // Update game state
    const updatedGame = await prisma.chessGame.update({
      where: { id: gameId },
      data: {
        fen: chess.fen(),
        pgn: chess.pgn(),
        lastMoveAt: new Date(),
        updatedAt: new Date(),
        nexusMovePending: player === 'user' // Nexus should respond after user move
      },
      include: {
        moves: {
          orderBy: { moveNumber: 'asc' }
        }
      }
    })

    // Check for game end
    if (chess.isGameOver()) {
      let result: string
      if (chess.isCheckmate()) {
        result = chess.turn() === 'w' ? '0-1' : '1-0'
      } else if (chess.isDraw()) {
        result = '1/2-1/2'
      } else {
        result = '*'
      }

      await prisma.chessGame.update({
        where: { id: gameId },
        data: {
          status: 'finished',
          result,
          nexusMovePending: false
        }
      })
    }

    return serializeGameState(updatedGame)
  } catch (error) {
    console.error('[chess session] apply move error:', error)
    throw error
  }
}

// ─── GAME STATE SERIALIZATION ───────────────────────────────────────────────────
function serializeGameState(game: any): ChessGameState {
  return {
    id: game.id,
    status: game.status,
    fen: game.fen,
    pgn: game.pgn,
    userColor: game.userColor,
    engineLevel: game.engineLevel,
    result: game.result,
    nexusMovePending: game.nexusMovePending,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
    lastMoveAt: game.lastMoveAt,
    moves: game.moves.map((move: any) => ({
      id: move.id,
      moveNumber: move.moveNumber,
      by: move.by,
      san: move.san,
      uci: move.uci,
      fenAfter: move.fenAfter,
      evaluation: move.evaluation,
      createdAt: move.createdAt
    }))
  }
}

// ─── GAME HISTORY ───────────────────────────────────────────────────────────────
export async function getChessGameHistory(limit: number = 10): Promise<ChessGameState[]> {
  try {
    const games = await prisma.chessGame.findMany({
      take: limit,
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        moves: {
          orderBy: { moveNumber: 'asc' }
        }
      }
    })

    return games.map(serializeGameState)
  } catch (error) {
    console.error('[chess session] game history error:', error)
    return []
  }
}

// ─── GAME MANAGEMENT ─────────────────────────────────────────────────────────────
export async function abandonChessGame(gameId: string): Promise<void> {
  try {
    await prisma.chessGame.update({
      where: { id: gameId },
      data: {
        status: 'abandoned',
        nexusMovePending: false
      }
    })
  } catch (error) {
    console.error('[chess session] abandon game error:', error)
    throw new Error('Failed to abandon game')
  }
}

export async function resignChessGame(gameId: string, player: 'user' | 'nexus'): Promise<void> {
  try {
    let result: string
    const game = await prisma.chessGame.findUnique({ where: { id: gameId } })
    
    if (!game) {
      throw new Error('Game not found')
    }

    if (player === 'user') {
      result = game.userColor === 'white' ? '0-1' : '1-0'
    } else {
      result = game.userColor === 'white' ? '1-0' : '0-1'
    }

    await prisma.chessGame.update({
      where: { id: gameId },
      data: {
        status: 'finished',
        result,
        nexusMovePending: false
      }
    })
  } catch (error) {
    console.error('[chess session] resign game error:', error)
    throw new Error('Failed to resign game')
  }
}

// ─── UTILITY FUNCTIONS ─────────────────────────────────────────────────────────────
export function getCurrentPlayer(game: ChessGameState): 'user' | 'nexus' {
  // Parse FEN to get current turn
  const turn = game.fen.split(' ')[1]
  const isWhiteTurn = turn === 'w'
  
  if (game.userColor === 'white') {
    return isWhiteTurn ? 'user' : 'nexus'
  } else {
    return isWhiteTurn ? 'nexus' : 'user'
  }
}

export function isUserTurn(game: ChessGameState): boolean {
  return getCurrentPlayer(game) === 'user'
}

export function getGameStatusDescription(game: ChessGameState): string {
  if (game.status === 'finished') {
    if (game.result === '1-0') return 'White wins'
    if (game.result === '0-1') return 'Black wins'
    if (game.result === '1/2-1/2') return 'Draw'
    return 'Game finished'
  }
  
  if (game.status === 'abandoned') {
    return 'Game abandoned'
  }
  
  if (game.nexusMovePending) {
    return 'Nexus thinking...'
  }
  
  const currentPlayer = getCurrentPlayer(game)
  return currentPlayer === 'user' ? 'Your move' : 'Nexus move'
}
