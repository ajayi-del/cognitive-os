// API ROUTE - DEEPSEEK & OLLAMA ONLY
// /api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { callAI, streamAIResponse, getBestProvider } from '@/lib/ai-providers-SIMPLIFIED'
import { dataStore } from '@/lib/unified-data-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, provider, stream = false } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Add context from unified data store
    const recentNotes = dataStore.getNotes().slice(-5)
    const context = recentNotes.length > 0 
      ? `\n\nRecent context from notes:\n${recentNotes.map(n => `- ${n.content}`).join('\n')}`
      : ''

    // Add context to the last user message
    const messagesWithContext = messages.map((msg, index) => {
      if (msg.role === 'user' && index === messages.length - 1) {
        return {
          ...msg,
          content: msg.content + context
        }
      }
      return msg
    })

    // Get best available provider (DeepSeek preferred)
    const bestProvider = await getBestProvider()
    const selectedProvider = provider || bestProvider

    console.log(`Using AI provider: ${selectedProvider}`)

    if (stream) {
      // Streaming response
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of streamAIResponse(
              { messages: messagesWithContext },
              selectedProvider as any
            )) {
              const data = `data: ${JSON.stringify({ content: chunk })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
          } catch (error) {
            console.error('Streaming error:', error)
            controller.error(error)
          }
        }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // Non-streaming response
      const response = await callAI(
        { messages: messagesWithContext },
        selectedProvider as any
      )

      // Save the interaction to data store
      const userMessage = messages[messages.length - 1]
      if (userMessage && userMessage.role === 'user') {
        dataStore.addNote(userMessage.content, 'ai_generated', ['chat', 'user'])
      }
      
      if (response.content) {
        dataStore.addNote(response.content, 'ai_generated', ['chat', 'ai'])
      }

      return NextResponse.json({
        content: response.content,
        provider: selectedProvider,
        model: response.model,
        usage: response.usage
      })
    }

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Chat API running',
    providers: ['deepseek', 'ollama'],
    default: 'deepseek',
    fallback: 'ollama'
  })
}
