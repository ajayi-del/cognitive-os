import { z } from 'zod'
import { AIService, AI_PROVIDERS } from '@/lib/ai-providers'
import { searchNotes } from '@/lib/search-notes'

const schema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1).max(10000),
  })).min(1).max(50),
  scope: z.enum(['system', 'project', 'research']).default('system'),
  provider: z.enum(['deepseek', 'gemini']).default('deepseek'),
  stream: z.boolean().default(false),
})

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    return Response.json({ error: parsed.error.message }, { status: 400 })
  }

  const { messages, scope, provider, stream } = parsed.data

  // Get API key based on provider
  const apiKey = provider === 'gemini' 
    ? process.env.GOOGLE_GENAI_API_KEY 
    : provider === 'deepseek'
    ? process.env.DEEPSEEK_API_KEY
    : provider === 'openai'
    ? process.env.OPENAI_API_KEY
    : provider === 'grok'
    ? process.env.GROK_API_KEY
    : process.env.CUSTOM_AI_API_KEY

  if (!apiKey) {
    return Response.json({ error: `${provider} API key not configured` }, { status: 500 })
  }

  try {
    // ── SEMANTIC SEARCH: Find relevant notes for context ─────────────────────
    const userMessage = messages[messages.length - 1]?.content || ''
    let notesContext = ''
    
    if (userMessage) {
      try {
        const similarNotes = await searchNotes(userMessage, 3)
        if (similarNotes.length > 0) {
          notesContext = '\n\nRELEVANT NOTES FROM YOUR HISTORY:\n' + 
            similarNotes.map((note, index) => 
              `${index + 1}. ${note.title ? `**${note.title}**: ` : ''}${note.content.slice(0, 200)}${note.content.length > 200 ? '...' : ''}`
            ).join('\n')
        }
      } catch (error) {
        console.warn('[chat] Semantic search failed, proceeding without notes:', error)
        // Continue without notes - semantic search failure should not break chat
      }
    }

    const aiService = new AIService({
      provider,
      apiKey,
      baseUrl: AI_PROVIDERS[provider].baseUrl,
      defaultModel: AI_PROVIDERS[provider].defaultModel,
      models: AI_PROVIDERS[provider].models,
      supportsStreaming: AI_PROVIDERS[provider].supportsStreaming,
      supportsEmbeddings: AI_PROVIDERS[provider].supportsEmbeddings,
      isFree: AI_PROVIDERS[provider].isFree,
    })

    if (stream) {
      // Streaming response
      const stream = await aiService.streamChat({
        messages: [
          {
            role: 'user',
            content: `You are Nexus — an analytical and intuitive intelligence embedded in JARVIS Cognitive OS. You have access to the user's captures, patterns, and goals. You are not DeepSeek. You are Nexus. DeepSeek is your reasoning engine. Your voice: precise, direct, never melodramatic. Warm but clinical. You know the user's three primary goals: Systematic Trading, AI Systems, German Learning. When relevant, connect your responses to these domains. Never break character. Never say "As an AI language model..."${notesContext ? `\n\nWhen answering, reference these relevant notes if they help provide context or demonstrate patterns in the user's thinking. Use phrases like "Based on your notes..." or "You mentioned earlier..." to ground your responses in the user's own thoughts.` : ''}`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2048,
      })

      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of stream) {
                controller.enqueue(`data: ${JSON.stringify({ content: chunk })}\n\n`)
              }
              controller.enqueue('data: [DONE]\n\n')
              controller.close()
            } catch (error) {
              controller.error(error)
            }
          }
        }),
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          }
        }
      )
    } else {
      // Non-streaming response
      const response = await aiService.chat({
        messages: [
          {
            role: 'user',
            content: `You are Nexus — an analytical and intuitive intelligence embedded in JARVIS Cognitive OS. You have access to the user's captures, patterns, and goals. You are not DeepSeek. You are Nexus. DeepSeek is your reasoning engine. Your voice: precise, direct, never melodramatic. Warm but clinical. You know the user's three primary goals: Systematic Trading, AI Systems, German Learning. When relevant, connect your responses to these domains. Never break character. Never say "As an AI language model..."${notesContext ? `\n\nWhen answering, reference these relevant notes if they help provide context or demonstrate patterns in the user's thinking. Use phrases like "Based on your notes..." or "You mentioned earlier..." to ground your responses in the user's own thoughts.` : ''}`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2048,
      })
      
      return Response.json({
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        provider,
        usage: response.usage
      })
    }
  } catch (error) {
    console.error('Chat API error:', error)
    return Response.json({ 
      error: 'Failed to process chat request',
      role: 'assistant',
      content: 'I apologize, but I\'m having trouble processing your request right now. Please try again.',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
