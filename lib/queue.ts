// NEXUS COGNITIVE OS - QUEUE MANAGEMENT
// BullMQ queues for background job processing

import { Queue } from 'bullmq'
import Redis from 'ioredis'

// Redis connection for BullMQ
export const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Required by BullMQ
  retryDelayOnFailover: 100,
})

// Background job queues
export const embeddingQueue = new Queue('embedding', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
})

export const nexusHeartbeatQueue = new Queue('nexus-heartbeat', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing queues...')
  await embeddingQueue.close()
  await nexusHeartbeatQueue.close()
  await redisConnection.quit()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Closing queues...')
  await embeddingQueue.close()
  await nexusHeartbeatQueue.close()
  await redisConnection.quit()
  process.exit(0)
})
