// ─── NEXUS CHESS ENGINE WRAPPER ─────────────────────────────────────────────────
// Safe Stockfish wrapper for chess move generation
// Isolated from UI and database details

export interface ChessEngineConfig {
  depth?: number
  skillLevel?: number
  timeLimit?: number // milliseconds
}

export interface EngineMove {
  bestMove: string // UCI notation (e.g., "e2e4")
  ponder?: string // Suggested next move
  evaluation?: number // In centipawns
  mate?: number // Mate in N moves
}

export interface EngineAnalysis {
  moves: EngineMove[]
  depth: number
  timeMs: number
  nodes: number
}

// ─── STOCKFISH ENGINE WRAPPER ─────────────────────────────────────────────────────
export class ChessEngine {
  private stockfish: any = null
  private isReady: boolean = false
  private config: ChessEngineConfig

  constructor(config: ChessEngineConfig = {}) {
    this.config = {
      depth: config.depth || 15,
      skillLevel: config.skillLevel || 10,
      timeLimit: config.timeLimit || 1000
    }
  }

  // ─── ENGINE INITIALIZATION ───────────────────────────────────────────────────
  async initialize(): Promise<boolean> {
    try {
      // In a real implementation, this would load Stockfish
      // For now, we'll create a mock implementation
      // The actual implementation would use: import Stockfish from 'stockfish'
      
      console.log('[chess engine] Initializing Stockfish...')
      
      // Mock initialization - replace with actual Stockfish loading
      this.stockfish = this.createMockStockfish()
      this.isReady = true
      
      // Configure engine
      await this.sendCommand('setoption name Skill Level value ' + this.config.skillLevel)
      await this.sendCommand('setoption name Threads value 1')
      
      console.log('[chess engine] Stockfish ready')
      return true
    } catch (error) {
      console.error('[chess engine] Initialization failed:', error)
      this.isReady = false
      return false
    }
  }

  // ─── MOVE GENERATION ───────────────────────────────────────────────────────
  async getBestMove(fen: string): Promise<EngineMove | null> {
    if (!this.isReady || !this.stockfish) {
      console.warn('[chess engine] Engine not ready')
      return null
    }

    try {
      // Set position
      await this.sendCommand(`position fen ${fen}`)
      
      // Start analysis
      const goCommand = this.config.timeLimit 
        ? `go movetime ${this.config.timeLimit}`
        : `go depth ${this.config.depth}`
      
      await this.sendCommand(goCommand)
      
      // Parse response (mock implementation)
      const bestMove = await this.parseBestMove()
      
      return bestMove
    } catch (error) {
      console.error('[chess engine] Move generation failed:', error)
      return null
    }
  }

  // ─── POSITION ANALYSIS ─────────────────────────────────────────────────────
  async analyzePosition(fen: string, depth: number = 10): Promise<EngineAnalysis | null> {
    if (!this.isReady || !this.stockfish) {
      console.warn('[chess engine] Engine not ready')
      return null
    }

    try {
      // Set position
      await this.sendCommand(`position fen ${fen}`)
      
      // Start analysis
      await this.sendCommand(`go depth ${depth}`)
      
      // Parse analysis (mock implementation)
      const analysis = await this.parseAnalysis()
      
      return analysis
    } catch (error) {
      console.error('[chess engine] Analysis failed:', error)
      return null
    }
  }

  // ─── ENGINE CONTROL ───────────────────────────────────────────────────────
  async stop(): Promise<void> {
    if (this.stockfish) {
      await this.sendCommand('stop')
    }
  }

  async quit(): Promise<void> {
    if (this.stockfish) {
      await this.sendCommand('quit')
      this.stockfish = null
      this.isReady = false
    }
  }

  // ─── CONFIGURATION ───────────────────────────────────────────────────────
  updateConfig(config: Partial<ChessEngineConfig>): void {
    this.config = { ...this.config, ...config }
    
    if (this.isReady) {
      if (config.skillLevel !== undefined) {
        this.sendCommand(`setoption name Skill Level value ${config.skillLevel}`)
      }
    }
  }

  // ─── PRIVATE METHODS ───────────────────────────────────────────────────────
  private async sendCommand(command: string): Promise<string> {
    if (!this.stockfish) {
      throw new Error('Engine not initialized')
    }

    // Mock implementation - replace with actual Stockfish communication
    console.log(`[chess engine] > ${command}`)
    
    // Simulate async response
    await new Promise(resolve => setTimeout(resolve, 10))
    
    const response = this.mockEngineResponse(command)
    console.log(`[chess engine] < ${response}`)
    
    return response
  }

  private async parseBestMove(): Promise<EngineMove | null> {
    // Mock implementation - replace with actual UCI parsing
    const mockMoves = ['e2e4', 'd2d4', 'g1f3', 'c2c4', 'b1c3']
    const randomMove = mockMoves[Math.floor(Math.random() * mockMoves.length)]
    
    return {
      bestMove: randomMove,
      ponder: Math.random() > 0.5 ? mockMoves[Math.floor(Math.random() * mockMoves.length)] : undefined,
      evaluation: Math.floor(Math.random() * 200 - 100), // -100 to +100 centipawns
      mate: undefined
    }
  }

  private async parseAnalysis(): Promise<EngineAnalysis | null> {
    // Mock implementation - replace with actual analysis parsing
    const mockMoves = ['e2e4', 'd2d4', 'g1f3', 'c2c4', 'b1c3'].map(move => ({
      bestMove: move,
      evaluation: Math.floor(Math.random() * 200 - 100)
    }))
    
    return {
      moves: mockMoves,
      depth: this.config.depth || 15,
      timeMs: this.config.timeLimit || 1000,
      nodes: Math.floor(Math.random() * 1000000)
    }
  }

  private createMockStockfish(): any {
    // Mock Stockfish object - replace with actual Stockfish
    return {
      postMessage: (command: string) => {
        console.log(`[mock stockfish] Received: ${command}`)
      },
      terminate: () => {
        console.log('[mock stockfish] Terminated')
      }
    }
  }

  private mockEngineResponse(command: string): string {
    // Mock UCI responses
    if (command.startsWith('position')) {
      return 'position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    }
    
    if (command.startsWith('go')) {
      return 'bestmove e2e4 ponder e7e5'
    }
    
    if (command.startsWith('setoption')) {
      return 'info string Option set'
    }
    
    if (command === 'uci') {
      return 'id name StockfishMock\nid author Nexus\nuciok'
    }
    
    if (command === 'isready') {
      return 'readyok'
    }
    
    if (command === 'quit') {
      return 'Bye'
    }
    
    return 'info depth 15 seldepth 3 multipv 1 score cp 24 nodes 123456 nps 100000 tbhits 0 time 1000 pv e2e4'
  }
}

// ─── ENGINE FACTORY ───────────────────────────────────────────────────────
let globalEngine: ChessEngine | null = null

export async function getChessEngine(config?: ChessEngineConfig): Promise<ChessEngine> {
  if (!globalEngine) {
    globalEngine = new ChessEngine(config)
    const ready = await globalEngine.initialize()
    if (!ready) {
      throw new Error('Failed to initialize chess engine')
    }
  }
  
  if (config) {
    globalEngine.updateConfig(config)
  }
  
  return globalEngine
}

export async function shutdownChessEngine(): Promise<void> {
  if (globalEngine) {
    await globalEngine.quit()
    globalEngine = null
  }
}

// ─── QUICK MOVE API ───────────────────────────────────────────────────────
export async function getQuickBestMove(
  fen: string, 
  config?: ChessEngineConfig
): Promise<string | null> {
  try {
    const engine = await getChessEngine(config)
    const move = await engine.getBestMove(fen)
    return move?.bestMove || null
  } catch (error) {
    console.error('[chess engine] Quick move failed:', error)
    return null
  }
}

export async function getQuickEvaluation(
  fen: string,
  config?: ChessEngineConfig
): Promise<number | null> {
  try {
    const engine = await getChessEngine(config)
    const move = await engine.getBestMove(fen)
    return move?.evaluation || null
  } catch (error) {
    console.error('[chess engine] Quick evaluation failed:', error)
    return null
  }
}

// ─── TIMEOUT PROTECTION ─────────────────────────────────────────────────────
export async function getBestMoveWithTimeout(
  fen: string,
  timeoutMs: number = 5000,
  config?: ChessEngineConfig
): Promise<EngineMove | null> {
  try {
    const engine = await getChessEngine(config)
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('[chess engine] Move calculation timed out')
        resolve(null)
      }, timeoutMs)

      engine.getBestMove(fen)
        .then(result => {
          clearTimeout(timeout)
          resolve(result)
        })
        .catch(error => {
          clearTimeout(timeout)
          console.error('[chess engine] Move calculation failed:', error)
          resolve(null)
        })
    })
  } catch (error) {
    console.error('[chess engine] Timeout wrapper failed:', error)
    return null
  }
}
