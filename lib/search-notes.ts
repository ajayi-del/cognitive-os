// NEXUS COGNITIVE OS - SEMANTIC SEARCH
// Find notes semantically similar to user queries using vector embeddings

import { prisma } from '@/lib/prisma'
import { getEmbeddingsProvider, embeddingToVectorString } from '@/lib/embeddings'

export interface SearchResult {
  id: string
  content: string
  title?: string
  similarity: number
  createdAt: Date
}

export async function searchSimilarNotes(query: string, limit: number = 5): Promise<SearchResult[]> {
  try {
    // Generate embedding for the query
    const provider = getEmbeddingsProvider()
    const queryEmbedding = await provider.generate(query)
    const queryVector = embeddingToVectorString(queryEmbedding)

    // Since we're using SQLite (not PostgreSQL with pgvector),
    // we'll implement a simple similarity search using the stored embeddings
    // This is a simplified version - for production, consider migrating to PostgreSQL
    
    // Get all notes with embeddings
    const notesWithEmbeddings = await prisma.$queryRaw<Array<{
      id: string
      content: string
      title?: string
      embedding: string
      createdAt: string
    }>>`
      SELECT id, content, title, embedding, createdAt
      FROM notes
      WHERE embedding IS NOT NULL
      ORDER BY createdAt DESC
      LIMIT 100
    `

    // Calculate cosine similarity for each note
    const results: SearchResult[] = notesWithEmbeddings
      .map(note => {
        const noteEmbedding = JSON.parse(note.embedding)
        const similarity = cosineSimilarity(queryEmbedding, noteEmbedding)
        
        return {
          id: note.id,
          content: note.content,
          title: note.title,
          similarity,
          createdAt: new Date(note.createdAt)
        }
      })
      .filter(result => result.similarity > 0.3) // Filter by minimum similarity
      .sort((a, b) => b.similarity - a.similarity) // Sort by similarity (descending)
      .slice(0, limit) // Limit results

    return results
  } catch (error) {
    console.error('[searchNotes]', error)
    return []
  }
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  normA = Math.sqrt(normA)
  normB = Math.sqrt(normB)

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (normA * normB)
}

// Alternative search using keyword matching as fallback
export async function searchNotesByKeywords(query: string, limit: number = 5): Promise<SearchResult[]> {
  try {
    const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2)
    
    if (keywords.length === 0) return []

    // Search for notes containing any of the keywords
    const notes = await prisma.note.findMany({
      where: {
        OR: keywords.map(keyword => ({
          content: {
            contains: keyword
          }
        }))
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit * 2 // Get more than we need to allow filtering
    })

    // Calculate simple relevance score based on keyword matches
    const results: SearchResult[] = notes
      .map(note => {
        const content = note.content.toLowerCase()
        const title = note.title?.toLowerCase() || ''
        
        // Count keyword matches
        let score = 0
        keywords.forEach(keyword => {
          if (content.includes(keyword)) score += 1
          if (title.includes(keyword)) score += 2 // Title matches are worth more
        })
        
        return {
          id: note.id,
          content: note.content,
          title: note.title,
          similarity: score / keywords.length, // Normalize to 0-1 range
          createdAt: note.createdAt
        }
      })
      .filter(result => result.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    return results
  } catch (error) {
    console.error('[searchNotesByKeywords]', error)
    return []
  }
}

// Combined search: try semantic first, fallback to keyword
export async function searchNotes(query: string, limit: number = 5): Promise<SearchResult[]> {
  // Try semantic search first
  const semanticResults = await searchSimilarNotes(query, limit)
  
  // If semantic search returns good results, use them
  if (semanticResults.length > 0 && semanticResults[0].similarity > 0.5) {
    return semanticResults
  }
  
  // Fallback to keyword search
  console.log('[searchNotes] Falling back to keyword search')
  return searchNotesByKeywords(query, limit)
}
