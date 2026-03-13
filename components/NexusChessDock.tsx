'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Gamepad2, Circle } from 'lucide-react'

// Mock chess.js types - would be imported from actual chess.js
interface ChessPosition {
  fen: string
  turn: 'w' | 'b'
  moves: string[]
}

interface ChessGameState {
  id: string
  status: 'active' | 'finished' | 'abandoned'
  fen: string
  pgn: string
  userColor: 'white' | 'black'
  engineLevel: number
  result?: string
  nexusMovePending: boolean
  lastMoveAt: string
  moves: Array<{
    id: string
    moveNumber: number
    by: 'user' | 'nexus'
    san: string
    createdAt: string
  }>
}

// Simple chess board component (would use actual chess.js)
function MiniChessBoard({ fen, onMove, isUserTurn }: { 
  fen: string; 
  onMove?: (move: string) => void; 
  isUserTurn: boolean 
}) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  
  // Parse FEN to get board state (simplified)
  const board = parseFenToBoard(fen)
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gap: '1px',
      background: '#8b7355',
      padding: '4px',
      borderRadius: '4px',
      fontSize: '10px'
    }}>
      {board.map((piece, index) => {
        const row = Math.floor(index / 8)
        const col = index % 8
        const square = String.fromCharCode(97 + col) + (8 - row)
        const isLight = (row + col) % 2 === 0
        const isSelected = selectedSquare === square
        
        return (
          <div
            key={square}
            onClick={() => {
              if (!isUserTurn || !onMove) return
              
              if (selectedSquare === null) {
                setSelectedSquare(square)
              } else {
                // Simple move validation (would use chess.js)
                const move = `${selectedSquare}${square}`
                onMove(move)
                setSelectedSquare(null)
              }
            }}
            style={{
              aspectRatio: '1',
              background: isSelected ? '#ffeb3b' : isLight ? '#f0d9b5' : '#b58863',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isUserTurn && onMove ? 'pointer' : 'default',
              border: isSelected ? '2px solid #f57c00' : '1px solid #8b7355'
            }}
          >
            <span style={{ fontSize: '12px', color: piece.color === 'w' ? '#fff' : '#000' }}>
              {piece.symbol}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Parse FEN to simple board representation
function parseFenToBoard(fen: string): Array<{ symbol: string; color: 'w' | 'b' | null }> {
  const pieceSymbols: Record<string, { symbol: string; color: 'w' | 'b' }> = {
    'K': { symbol: '♔', color: 'w' },
    'Q': { symbol: '♕', color: 'w' },
    'R': { symbol: '♖', color: 'w' },
    'B': { symbol: '♗', color: 'w' },
    'N': { symbol: '♘', color: 'w' },
    'P': { symbol: '♙', color: 'w' },
    'k': { symbol: '♚', color: 'b' },
    'q': { symbol: '♛', color: 'b' },
    'r': { symbol: '♜', color: 'b' },
    'b': { symbol: '♝', color: 'b' },
    'n': { symbol: '♞', color: 'b' },
    'p': { symbol: '♟', color: 'b' }
  }

  const boardPosition = fen.split(' ')[0]
  const rows = boardPosition.split('/')
  const board: Array<{ symbol: string; color: 'w' | 'b' | null }> = []

  for (const row of rows) {
    let emptyCount = 0
    for (const char of row) {
      if (char >= '1' && char <= '8') {
        emptyCount += parseInt(char)
      } else {
        // Add empty squares
        for (let i = 0; i < emptyCount; i++) {
          board.push({ symbol: '', color: null })
        }
        emptyCount = 0
        
        // Add piece
        const piece = pieceSymbols[char]
        board.push(piece || { symbol: '', color: null })
      }
    }
    
    // Add remaining empty squares
    for (let i = 0; i < emptyCount; i++) {
      board.push({ symbol: '', color: null })
    }
  }

  return board
}

export function NexusChessDock() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedMove, setSelectedMove] = useState('')
  const queryClient = useQueryClient()

  // Fetch active game
  const { data: game, isLoading, error } = useQuery<ChessGameState>({
    queryKey: ['chess-active-game'],
    queryFn: async () => {
      const res = await fetch('/api/nexus/chess/active')
      if (!res.ok) throw new Error('Failed to fetch active game')
      const data = await res.json()
      return data.game
    },
    refetchInterval: 10000, // Poll every 10 seconds
    refetchIntervalInBackground: false
  })

  // Start new game mutation
  const startGameMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/nexus/chess/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userColor: 'white', engineLevel: 10 })
      })
      if (!res.ok) throw new Error('Failed to start game')
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['chess-active-game'], data.game)
    }
  })

  // Submit move mutation
  const submitMoveMutation = useMutation({
    mutationFn: async (move: string) => {
      if (!game) throw new Error('No active game')
      
      const res = await fetch('/api/nexus/chess/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: game.id, move })
      })
      if (!res.ok) throw new Error('Failed to submit move')
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['chess-active-game'], data.game)
      setSelectedMove('')
    }
  })

  // Handle move submission
  const handleMove = (move: string) => {
    submitMoveMutation.mutate(move)
  }

  // Determine current player
  const isUserTurn = game ? game.fen.split(' ')[1] === (game.userColor === 'white' ? 'w' : 'b') : false

  // Collapsed state
  if (!isExpanded) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'var(--j-surface)',
        border: '1px solid var(--j-bd2)',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '200px',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Gamepad2 size={16} color="#7060e8" />
            <span style={{ fontWeight: 600, color: 'var(--j-text)' }}>Nexus Chess</span>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--j-text2)',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            ▲
          </button>
        </div>

        {/* Status */}
        {isLoading ? (
          <div style={{ color: 'var(--j-text3)' }}>Loading...</div>
        ) : error ? (
          <div style={{ color: '#ff3850' }}>Error loading game</div>
        ) : !game ? (
          <div>
            <div style={{ color: 'var(--j-text3)', marginBottom: '8px' }}>No active game</div>
            <button
              onClick={() => startGameMutation.mutate()}
              disabled={startGameMutation.isPending}
              style={{
                background: '#7060e8',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '9px',
                width: '100%'
              }}
            >
              {startGameMutation.isPending ? 'Starting...' : 'Start Game'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--j-text2)' }}>
                {game.userColor === 'white' ? 'White' : 'Black'} (You)
              </span>
              <span style={{ color: 'var(--j-text3)' }}>
                Move {game.moves.length}
              </span>
            </div>
            <div style={{ 
              color: game.nexusMovePending ? '#f09020' : '#00d880',
              fontSize: '9px',
              fontWeight: 500
            }}>
              {game.nexusMovePending ? 'Nexus thinking...' : isUserTurn ? 'Your move' : 'Nexus move'}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Expanded state
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'var(--j-surface)',
      border: '1px solid var(--j-bd2)',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      width: '320px',
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      maxHeight: '500px',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Gamepad2 size={16} color="#7060e8" />
          <span style={{ fontWeight: 600, color: 'var(--j-text)' }}>Nexus Chess</span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--j-text2)',
            cursor: 'pointer',
            padding: '2px'
          }}
        >
          ▼
        </button>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--j-text3)', textAlign: 'center', padding: '20px' }}>
          Loading game...
        </div>
      ) : error ? (
        <div style={{ color: '#ff3850', textAlign: 'center', padding: '20px' }}>
          Error loading game
        </div>
      ) : !game ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ color: 'var(--j-text3)', marginBottom: '16px' }}>No active game</div>
          <button
            onClick={() => startGameMutation.mutate()}
            disabled={startGameMutation.isPending}
            style={{
              background: '#7060e8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            {startGameMutation.isPending ? 'Starting...' : 'Start New Game'}
          </button>
        </div>
      ) : (
        <div>
          {/* Game Info */}
          <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--j-bd)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: 'var(--j-text2)' }}>
                {game.userColor === 'white' ? 'White' : 'Black'} (You)
              </span>
              <span style={{ color: 'var(--j-text3)' }}>
                Engine Level {game.engineLevel}
              </span>
            </div>
            <div style={{ 
              color: game.nexusMovePending ? '#f09020' : '#00d880',
              fontSize: '9px',
              fontWeight: 500
            }}>
              {game.nexusMovePending ? 'Nexus thinking...' : isUserTurn ? 'Your move' : 'Nexus move'}
            </div>
          </div>

          {/* Chess Board */}
          <div style={{ marginBottom: '12px' }}>
            <MiniChessBoard 
              fen={game.fen} 
              onMove={isUserTurn ? handleMove : undefined}
              isUserTurn={isUserTurn}
            />
          </div>

          {/* Move List */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ color: 'var(--j-text3)', marginBottom: '4px', fontSize: '9px' }}>
              MOVES ({game.moves.length})
            </div>
            <div style={{ 
              maxHeight: '80px', 
              overflowY: 'auto',
              fontSize: '8px',
              lineHeight: '1.4'
            }}>
              {game.moves.slice(-10).map((move, index) => (
                <div key={move.id} style={{ 
                  color: move.by === 'user' ? '#7060e8' : '#f09020',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '2px 4px',
                  background: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'
                }}>
                  <span>{move.moveNumber}. {move.san}</span>
                  <span>{move.by === 'user' ? 'You' : 'Nexus'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Game Controls */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => startGameMutation.mutate()}
              disabled={startGameMutation.isPending}
              style={{
                flex: 1,
                background: '#3d8fff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px',
                cursor: 'pointer',
                fontSize: '9px'
              }}
            >
              New Game
            </button>
            <button
              style={{
                flex: 1,
                background: '#ff3850',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px',
                cursor: 'pointer',
                fontSize: '9px'
              }}
            >
              Resign
            </button>
          </div>

          {/* Move Input */}
          <div style={{ marginTop: '8px' }}>
            <input
              type="text"
              value={selectedMove}
              onChange={(e) => setSelectedMove(e.target.value)}
              placeholder="Enter move (e.g., e4, Nf3)"
              disabled={!isUserTurn || submitMoveMutation.isPending}
              style={{
                width: '100%',
                padding: '6px',
                border: '1px solid var(--j-bd)',
                borderRadius: '4px',
                fontSize: '9px',
                fontFamily: 'var(--font-mono)'
              }}
            />
            {selectedMove && (
              <button
                onClick={() => handleMove(selectedMove)}
                disabled={submitMoveMutation.isPending}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  background: '#7060e8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px',
                  cursor: 'pointer',
                  fontSize: '9px'
                }}
              >
                {submitMoveMutation.isPending ? 'Playing...' : 'Play Move'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
