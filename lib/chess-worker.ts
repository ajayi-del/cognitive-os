// ─── NEXUS CHESS BACKGROUND WORKER ─────────────────────────────────────────────
// Handles async Nexus move generation in background
// Non-blocking and fault-tolerant

import { getChessGameById, applyChessMove, abandonChessGame } from './chess-session'
import { getBestMoveWithTimeout } from './chess-engine'
import { prisma } from './prisma'

export interface ChessWorkerTask {
  gameId: string
  fen: string
  userColor: 'white' | 'black'
  engineLevel: number
  createdAt: Date
  retryCount?: number
}

export interface ChessWorkerResult {
  gameId: string
  success: boolean
  move?: string
  error?: string
  processingTime: number
}

// ─── BACKGROUND MOVE PROCESSOR ─────────────────────────────────────────────────
export class ChessWorker {
  private isProcessing: boolean = false
  private taskQueue: ChessWorkerTask[] = []
  private maxRetries: number = 3
  private processingTimeout: number = 10000 // 10 seconds

  // ─── TASK SUBMISSION ───────────────────────────────────────────────────────
  async submitMoveTask(gameId: string): Promise<void> {
    try {
      // Load current game state
      const game = await getChessGameById(gameId)
      if (!game) {
        console.error('[chess worker] Game not found:', gameId)
        return
      }

      if (game.status !== 'active') {
        console.warn('[chess worker] Game not active:', gameId, game.status)
        return
      }

      if (!game.nexusMovePending) {
        console.warn('[chess worker] No pending move for game:', gameId)
        return
      }

      const task: ChessWorkerTask = {
        gameId,
        fen: game.fen,
        userColor: game.userColor,
        engineLevel: game.engineLevel,
        createdAt: new Date(),
        retryCount: 0
      }

      this.taskQueue.push(task)
      console.log('[chess worker] Task queued for game:', gameId)
      
      // Start processing if not already running
      if (!this.isProcessing) {
        this.processQueue()
      }
    } catch (error) {
      console.error('[chess worker] Failed to submit task:', error)
    }
  }

  // ─── QUEUE PROCESSING ───────────────────────────────────────────────────────
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.taskQueue.length === 0) {
      return
    }

    this.isProcessing = true
    console.log('[chess worker] Processing queue, tasks:', this.taskQueue.length)

    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift()!
      
      try {
        const result = await this.processTask(task)
        console.log('[chess worker] Task completed:', result)
      } catch (error) {
        console.error('[chess worker] Task failed:', error)
        
        // Retry logic
        if ((task.retryCount || 0) < this.maxRetries) {
          task.retryCount = (task.retryCount || 0) + 1
          this.taskQueue.push(task)
          console.log('[chess worker] Task queued for retry:', task.gameId, 'attempt:', task.retryCount)
          
          // Add delay before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (task.retryCount || 1)))
        } else {
          console.error('[chess worker] Max retries exceeded, abandoning game:', task.gameId)
          await this.handleFailedTask(task)
        }
      }
    }

    this.isProcessing = false
    console.log('[chess worker] Queue processing completed')
  }

  // ─── INDIVIDUAL TASK PROCESSING ───────────────────────────────────────────────
  private async processTask(task: ChessWorkerTask): Promise<ChessWorkerResult> {
    const startTime = Date.now()

    try {
      // Verify game is still active and pending
      const game = await getChessGameById(task.gameId)
      if (!game || game.status !== 'active' || !game.nexusMovePending) {
        throw new Error('Game no longer requires move processing')
      }

      // Generate best move with timeout protection
      const engineConfig = {
        depth: Math.min(task.engineLevel * 2, 20), // Scale depth with engine level
        timeLimit: Math.max(2000, 10000 - (task.engineLevel * 500)) // Adjust time based on level
      }

      const moveResult = await getBestMoveWithTimeout(task.fen, this.processingTimeout, engineConfig)
      
      if (!moveResult || !moveResult.bestMove) {
        throw new Error('Engine failed to generate move')
      }

      // Convert UCI to SAN (mock implementation - would use chess.js)
      const sanMove = this.uciToSan(moveResult.bestMove, task.fen)
      
      // Apply the move
      const updatedGame = await applyChessMove(task.gameId, sanMove, 'nexus')
      
      const processingTime = Date.now() - startTime
      
      console.log('[chess worker] Nexus move applied:', {
        gameId: task.gameId,
        move: sanMove,
        uci: moveResult.bestMove,
        evaluation: moveResult.evaluation,
        processingTime
      })

      return {
        gameId: task.gameId,
        success: true,
        move: sanMove,
        processingTime
      }
    } catch (error) {
      const processingTime = Date.now() - startTime
      console.error('[chess worker] Task processing error:', error)
      
      return {
        gameId: task.gameId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime
      }
    }
  }

  // ─── FAILED TASK HANDLING ───────────────────────────────────────────────────
  private async handleFailedTask(task: ChessWorkerTask): Promise<void> {
    try {
      // Mark game as no longer pending to avoid infinite loops
      const game = await getChessGameById(task.gameId)
      if (game && game.nexusMovePending) {
        // Update game to clear pending flag
        await prisma.chessGame.update({
          where: { id: task.gameId },
          data: { nexusMovePending: false }
        })
        
        console.log('[chess worker] Cleared pending flag for failed game:', task.gameId)
      }
    } catch (error) {
      console.error('[chess worker] Failed to handle failed task:', error)
    }
  }

  // ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────
  private uciToSan(uci: string, fen: string): string {
    // Mock implementation - would use chess.js for proper conversion
    // In real implementation: const chess = new Chess(fen); const move = chess.move({ from: uci.slice(0,2), to: uci.slice(2,4) }); return move.san
    
    // Simple mock mapping for common moves
    const uciToSanMap: Record<string, string> = {
      'e2e4': 'e4',
      'd2d4': 'd4',
      'g1f3': 'Nf3',
      'b1c3': 'Nc3',
      'f1c4': 'Bc4',
      'e7e5': 'e5',
      'd7d5': 'd5',
      'g8f6': 'Nf6',
      'b8c6': 'Nc6',
      'f8c5': 'Bc5'
    }
    
    return uciToSanMap[uci] || uci // Fallback to UCI if not found
  }

  // ─── WORKER STATUS ───────────────────────────────────────────────────────
  getStatus(): {
    isProcessing: boolean
    queueLength: number
    maxRetries: number
    processingTimeout: number
  } {
    return {
      isProcessing: this.isProcessing,
      queueLength: this.taskQueue.length,
      maxRetries: this.maxRetries,
      processingTimeout: this.processingTimeout
    }
  }

  // ─── QUEUE MANAGEMENT ─────────────────────────────────────────────────────
  clearQueue(): void {
    this.taskQueue = []
    console.log('[chess worker] Queue cleared')
  }

  pauseProcessing(): void {
    this.isProcessing = false
    console.log('[chess worker] Processing paused')
  }

  resumeProcessing(): void {
    if (!this.isProcessing && this.taskQueue.length > 0) {
      this.processQueue()
    }
  }
}

// ─── GLOBAL WORKER INSTANCE ─────────────────────────────────────────────────
let globalWorker: ChessWorker | null = null

export function getChessWorker(): ChessWorker {
  if (!globalWorker) {
    globalWorker = new ChessWorker()
  }
  return globalWorker
}

export function shutdownChessWorker(): void {
  if (globalWorker) {
    globalWorker.pauseProcessing()
    globalWorker.clearQueue()
    globalWorker = null
  }
}

// ─── WORKER TRIGGER API ─────────────────────────────────────────────────────
export async function triggerNexusMove(gameId: string): Promise<void> {
  const worker = getChessWorker()
  await worker.submitMoveTask(gameId)
}

// ─── BATCH PROCESSING ─────────────────────────────────────────────────────
export async function processPendingMoves(): Promise<void> {
  try {
    // Find all games with pending Nexus moves
    const pendingGames = await prisma.chessGame.findMany({
      where: {
        status: 'active',
        nexusMovePending: true
      },
      select: {
        id: true
      }
    })

    console.log('[chess worker] Found pending games:', pendingGames.length)

    const worker = getChessWorker()
    
    // Submit each pending game for processing
    for (const game of pendingGames) {
      await worker.submitMoveTask(game.id)
    }
  } catch (error) {
    console.error('[chess worker] Failed to process pending moves:', error)
  }
}

// ─── HEALTH CHECK ─────────────────────────────────────────────────────
export async function getChessWorkerHealth(): Promise<{
  status: 'healthy' | 'processing' | 'error'
  queueLength: number
  isProcessing: boolean
  lastProcessed?: Date
}> {
  try {
    const worker = getChessWorker()
    const status = worker.getStatus()
    
    return {
      status: status.isProcessing ? 'processing' : 'healthy',
      queueLength: status.queueLength,
      isProcessing: status.isProcessing
    }
  } catch (error) {
    console.error('[chess worker] Health check failed:', error)
    return {
      status: 'error',
      queueLength: 0,
      isProcessing: false
    }
  }
}
