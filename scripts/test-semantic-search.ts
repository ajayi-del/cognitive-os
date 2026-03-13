#!/usr/bin/env tsx

/**
 * NEXUS COGNITIVE OS - SEMANTIC SEARCH TEST
 * 
 * Test script to verify semantic search functionality
 * Usage: npx tsx scripts/test-semantic-search.ts
 */

import { prisma } from '../lib/prisma'
import { getEmbeddingsProvider } from '../lib/embeddings'
import { searchNotes } from '../lib/search-notes'

async function testSemanticSearch() {
  console.log('🧠 NEXUS: Testing semantic search functionality...\n')
  
  try {
    // Step 1: Check if we have any notes
    const notesCount = await prisma.note.count()
    console.log(`📊 Found ${notesCount} notes in database`)
    
    if (notesCount === 0) {
      console.log('⚠️  No notes found. Creating test notes...')
      
      // Create some test notes
      const testNotes = [
        {
          title: 'Trading Strategy',
          content: 'I want to develop a systematic trading strategy using machine learning to predict market movements based on technical indicators.'
        },
        {
          title: 'AI Systems Architecture',
          content: 'Building a cognitive operating system that can understand user patterns and provide intelligent assistance through semantic search.'
        },
        {
          title: 'German Learning Progress',
          content: 'Making good progress with German language learning, focusing on conversational practice and vocabulary expansion through daily exercises.'
        },
        {
          title: 'Deep Learning Project',
          content: 'Experimenting with neural networks for natural language processing and embedding generation to improve search capabilities.'
        }
      ]
      
      for (const note of testNotes) {
        await prisma.note.create({
          data: {
            title: note.title,
            content: note.content,
            userId: 'test-user'
          }
        })
        console.log(`✅ Created note: ${note.title}`)
      }
    }
    
    // Step 2: Test embedding generation
    console.log('\n🔍 Testing embedding generation...')
    const provider = getEmbeddingsProvider()
    const testText = "machine learning trading strategy"
    
    try {
      const embedding = await provider.generate(testText)
      console.log(`✅ Generated ${embedding.length}-dimensional embedding for: "${testText}"`)
    } catch (error) {
      console.error('❌ Embedding generation failed:', error)
      return
    }
    
    // Step 3: Test semantic search
    console.log('\n🔎 Testing semantic search queries...')
    
    const testQueries = [
      'trading algorithms',
      'artificial intelligence',
      'language learning',
      'neural networks',
      'market analysis'
    ]
    
    for (const query of testQueries) {
      console.log(`\n📝 Query: "${query}"`)
      
      try {
        const results = await searchNotes(query, 3)
        
        if (results.length === 0) {
          console.log('   No results found')
        } else {
          results.forEach((result, index) => {
            console.log(`   ${index + 1}. ${result.title ? `**${result.title}**` : 'Untitled'} (${Math.round(result.similarity * 100)}% similar)`)
            console.log(`      ${result.content.slice(0, 100)}...`)
          })
        }
      } catch (error) {
        console.error(`   ❌ Search failed:`, error)
      }
    }
    
    // Step 4: Test chat integration
    console.log('\n💬 Testing chat integration...')
    
    // Simulate a chat message
    const chatMessage = "Can you help me with my trading strategy?"
    console.log(`📤 User message: "${chatMessage}"`)
    
    try {
      const relevantNotes = await searchNotes(chatMessage, 2)
      
      if (relevantNotes.length > 0) {
        console.log(`📥 Found ${relevantNotes.length} relevant notes for chat context:`)
        relevantNotes.forEach((note, index) => {
          console.log(`   ${index + 1}. ${note.title || 'Untitled'} (${Math.round(note.similarity * 100)}% similar)`)
        })
      } else {
        console.log('📥 No relevant notes found for chat context')
      }
    } catch (error) {
      console.error('❌ Chat context search failed:', error)
    }
    
    console.log('\n✅ NEXUS: Semantic search test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run the test
if (require.main === module) {
  testSemanticSearch()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
