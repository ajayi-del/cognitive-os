// NEXUS COGNITIVE OS - EMBEDDING WORKER
// Processes notes and generates vector embeddings for semantic search

import { Worker } from 'bullmq'
import { prisma } from '@/lib/prisma'
import { getEmbeddingsProvider, embeddingToVectorString } from '@/lib/embeddings'
import { redisConnection } from '@/lib/queue'

const worker = new Worker(
  'embedding',
  async (job) => {
    const { noteId, content } = job.data
    
    console.log(`[embedding-worker] Processing note ${noteId}`)
    
    try {
      // Generate embedding for the note content
      const provider = getEmbeddingsProvider()
      const embedding = await provider.generate(content)
      
      // Store embedding as a string (PostgreSQL vector expects a string like '[0.1,0.2,...]')
      const embeddingStr = embeddingToVectorString(embedding)
      
      // Update the note with embedding
      await prisma.$executeRaw`
        UPDATE "Note"
        SET embedding = ${embeddingStr}
        WHERE id = ${noteId}
      `
      
      console.log(`[embedding-worker] Successfully processed note ${noteId}`)
      
    } catch (error) {
      console.error(`[embedding-worker] Failed for note ${noteId}:`, error)
      
      // Re-throw error to let BullMQ handle retries
      throw error
    }
  },
  { 
    connection: redisConnection,
    concurrency: 2, // Process 2 embeddings at once
  }
)

console.log('🧠 NEXUS: Embedding worker started')

// Handle worker events
worker.on('completed', (job) => {
  console.log(`[embedding-worker] Completed job ${job.id}`)
})

worker.on('failed', (job, err) => {
  console.error(`[embedding-worker] Failed job ${job?.id}:`, err)
})

worker.on('error', (err) => {
  console.error('[embedding-worker] Worker error:', err)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing embedding worker...')
  await worker.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Closing embedding worker...')
  await worker.close()
  process.exit(0)
})
