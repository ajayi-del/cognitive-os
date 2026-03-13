import { AIService, AI_PROVIDERS } from '@/lib/ai-providers'

export async function GET() {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000) // last 48 hours

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Use DeepSeek for Morning Briefing
  const provider = 'deepseek'
  const apiKey = process.env.DEEPSEEK_API_KEY

  if (!apiKey) {
    return new Response('DeepSeek API key not configured', { status: 500 })
  }

  try {
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

    const response = await aiService.chat({
      messages: [
        {
          role: 'user',
          content: `You are generating a morning briefing. Be specific, direct, and actionable. No fluff. Max 200 words. Format as: Greeting → Phase summary (1 sentence) → Top 3 priorities (numbered) → One pattern insight → One drift alert if any.`
        },
        {
          role: 'user',
          content: `Generate a morning briefing for ${greeting}. Current phase: building (85% confidence). Recent notes: Systematic Trading improvements, UI component fixes, Pattern detection algorithms. Top pending actions: Fix broken buttons, Add streaming AI, Build morning briefing. Active drift: mild_drift detected.`
        }
      ],
      max_tokens: 400,
      temperature: 0.7,
    })

    const briefing = response.content || `🌅 ${greeting} — BUILDING PHASE\n\nYour system is ready for today's work.`

    return new Response(briefing, {
      headers: { 'Content-Type': 'text/plain' }
    })
  } catch (error) {
    console.error(`${provider} Morning Briefing error:`, error)
    
    // Fallback to static briefing if API fails
    const staticBriefing = `🌅 ${greeting} — BUILDING PHASE\n\nYour system is in BUILDING phase. Focus on execution.\n\nTOP 3 PRIORITIES:\n1. Complete UI foundation fixes\n2. Implement real data pipeline\n3. Build morning briefing feature`
    
    return new Response(staticBriefing, {
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
