import { prisma } from '@/lib/prisma'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

// ─── Core DeepSeek call (server-side only) ────────────────────────────────
async function callDeepSeek(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!DEEPSEEK_API_KEY) throw new Error('DEEPSEEK_API_KEY not configured')
  
  const res = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
    body: JSON.stringify({
      model: 'deepseek-chat',
      max_tokens: 800,
      temperature: 0.3, // deterministic for analysis
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    })
  })
  
  if (!res.ok) throw new Error(`DeepSeek error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// ─── Create a Nexus message in the database ──────────────────────────────
async function createNexusMessage(params: {
  type: string; priority: number; title: string
  content: Record<string, unknown>; requiresAction?: boolean; relatedIds?: string[]
}) {
  return prisma.nexusMessage.create({
    data: {
      type: params.type,
      priority: params.priority,
      title: params.title,
      content: JSON.stringify(params.content),
      requiresAction: params.requiresAction ?? false,
      relatedIds: JSON.stringify(params.relatedIds ?? []),
    }
  })
}

// ─── HEARTBEAT — called every 2 minutes via API route ─────────────────────
export async function runNexusHeartbeat(): Promise<{ ran: boolean; actions: string[] }> {
  const actions: string[] = []
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  // 1. Check for new captures in last 2 minutes (from canonical events)
  const { getCaptureEvents } = await import('./canonical-events')
  const allCaptures = await getCaptureEvents()
  const newCaptures = allCaptures.filter(capture => capture.timestamp >= twoMinutesAgo)
  
  if (newCaptures.length === 0) return { ran: true, actions: ['no_new_captures'] }

  // 2. DERIVED DATA: Compute patterns from canonical captures (never store as truth)
  const captures = await getCaptureEvents(sevenDaysAgo)
  const patternMap = new Map<string, string[]>()
  
  // Compute patterns from raw captures (this is interpretation layer)
  captures.forEach(capture => {
    const words = capture.data.content.toLowerCase().split(/\s+/)
    words.forEach((word: string) => {
      if (word.length > 4) {
        if (!patternMap.has(word)) {
          patternMap.set(word, [])
        }
        patternMap.get(word)!.push(capture.id)
      }
    })
  })
  
  // 3. DA VINCI PRINCIPLE: Observe natural cognitive process
  // fragment → repetition → crystallization → action
  for (const [theme, captureIds] of Array.from(patternMap.entries())) {
    if (captureIds.length >= 5) {
      // CRYSTALLIZATION: Pattern becomes project (derived insight)
      await createNexusMessage({
        type: 'project-proposal',
        priority: 3,
        title: `"${theme}" is ready to become a project`,
        content: {
          text: `You've returned to this theme ${captureIds.length} times in 7 days. This idea wants structure. Ready to create a project around it?`,
          theme,
          captureCount: captureIds.length,
          cognitiveStage: 'crystallization', // Da Vinci: label the natural process
          derivedFrom: 'canonical_captures' // Mark as derived data
        },
        requiresAction: true,
        relatedIds: captureIds,
      })
      
      actions.push(`crystallization:${theme}`)
      
    } else if (captureIds.length >= 3 && captureIds.length < 5) {
      // REPETITION: Pattern gaining weight (derived insight)
      await createNexusMessage({
        type: 'insight',
        priority: 2,
        title: `Pattern forming: "${theme}"`,
        content: {
          text: `You've returned to this ${captureIds.length} times. This idea is gaining weight. Keep feeding it.`,
          theme,
          captureCount: captureIds.length,
          cognitiveStage: 'repetition', // Da Vinci: observe the stage
          derivedFrom: 'canonical_captures' // Mark as derived data
        },
        requiresAction: false,
      })
      actions.push(`repetition:${theme}`)
    }
  }

  // 4. SCHWANN'S CELL THEORY: Organism health check (derived from canonical events)
  const last7DaysCount = captures.length
  
  if (last7DaysCount < 3) {
    try {
      const recentDriftAlert = await prisma.nexusMessage.findFirst({
        where: { 
          type: 'drift', 
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
        }
      })
      
      if (!recentDriftAlert) {
        await createNexusMessage({
          type: 'drift',
          priority: 5,
          title: 'Organism drift — low cellular activity',
          content: {
            text: `Only ${last7DaysCount} captures in the last 7 days. The organism needs input. What is on your mind right now?`,
            captureCount: last7DaysCount,
            organismState: 'low_activity', // Schwann: organism-level terminology
            suggestion: 'Open Diary and drop any thought — even fragments count.',
            derivedFrom: 'canonical_captures' // Mark as derived data
          },
          requiresAction: false,
        })
        actions.push('organism_drift_alert')
      }
    } catch (error) {
      // Graceful degradation if nexusMessage table doesn't exist
      console.log('[nexus heartbeat] Nexus message table not available, skipping drift alert')
    }
  }
  
  // 5. ADAPTIVE REORGANIZATION: Trigger pattern graph analysis periodically
  // This runs every 6 hours (216 heartbeats = 6 hours at 2-minute intervals)
  const heartbeatCount = Math.floor(Date.now() / (2 * 60 * 1000)) // Heartbeats since epoch
  if (heartbeatCount % 216 === 0) { // Every 6 hours
    try {
      const { runAdaptiveReorganization } = await import('./organism-adaptation')
      const adaptationResult = await runAdaptiveReorganization()
      
      if (adaptationResult.signals.length > 0) {
        actions.push(`adaptation:${adaptationResult.signals.length}_signals`)
        
        // Create adaptation messages for significant signals
        for (const signal of adaptationResult.signals) {
          if (signal.type === 'promotion' || signal.type === 'convergence') {
            await createNexusMessage({
              type: 'adaptation',
              priority: signal.type === 'promotion' ? 3 : 2,
              title: `Adaptive Signal: ${signal.type}`,
              content: {
                text: signal.message,
                signalType: signal.type,
                patterns: signal.patterns,
                confidence: signal.confidence,
                derivedFrom: 'pattern_adaptation'
              },
              requiresAction: signal.type === 'promotion',
              relatedIds: signal.patterns,
            })
          }
        }
      }
    } catch (error) {
      console.log('[nexus heartbeat] Adaptive reorganization failed, continuing...')
    }
  }
  
  // 6. COGNITIVE SYNTHESIS: Trigger advanced insight generation periodically
  // This runs every 12 hours (360 heartbeats = 12 hours at 2-minute intervals)
  if (heartbeatCount % 360 === 0) { // Every 12 hours
    try {
      const { runCognitiveSynthesis, prioritizeInsights } = await import('./cognitive-synthesis')
      const synthesisResult = await runCognitiveSynthesis()
      const prioritizedInsights = prioritizeInsights(synthesisResult.insights)
      
      if (prioritizedInsights.length > 0) {
        actions.push(`cognitive_synthesis:${prioritizedInsights.length}_insights`)
        
        // Create cognitive synthesis messages for top insights
        for (const insight of prioritizedInsights.slice(0, 2)) {
          if (insight.actionable || insight.novelty > 0.7) {
            await createNexusMessage({
              type: 'cognitive_synthesis',
              priority: insight.actionable ? 3 : 2,
              title: `Cognitive Insight: ${insight.type}`,
              content: {
                text: insight.description,
                insightType: insight.type,
                domains: insight.domains,
                patterns: insight.patterns,
                confidence: insight.confidence,
                novelty: insight.novelty,
                actionable: insight.actionable,
                synthesisPath: insight.synthesisPath,
                derivedFrom: 'cognitive_synthesis'
              },
              requiresAction: insight.actionable,
              relatedIds: insight.patterns,
            })
          }
        }
      }
    } catch (error) {
      console.log('[nexus heartbeat] Cognitive synthesis failed, continuing...')
    }
  }
  
  return { ran: true, actions }
}

// ─── PATTERN ANALYSIS — classify new captures into seed patterns ──────────
export async function classifyCaptureToSeedPattern(noteId: string, noteContent: string): Promise<void> {
  if (!process.env.DEEPSEEK_API_KEY) {
    console.log('[nexus classify] DeepSeek key not configured — skipping classification')
    return  // graceful degradation: pattern detection disabled, rest of system works
  }
  
  try {
    // Get existing seed patterns for context
    const existingPatterns = await prisma.seedPattern.findMany({
      where: { status: { in: ['watching', 'proposed'] } },
      select: { id: true, theme: true, keywords: true, occurrences: true }
    })
    
    const patternContext = existingPatterns.map(p => `- ${p.theme} (${p.occurrences}x)`).join('\n')
    
    const response = await callDeepSeek(
      `You are a cognitive pattern classifier. Given a note and existing patterns, either match the note to an existing pattern or identify a new theme. 
      Respond ONLY with valid JSON: {"matched_pattern_id": "id_or_null", "theme": "theme_label", "keywords": ["word1","word2"], "confidence": 0.0}`,
      `NOTE: "${noteContent.slice(0, 500)}"\n\nEXISTING PATTERNS:\n${patternContext || 'none yet'}` 
    )
    
    let classification: { matched_pattern_id: string | null; theme: string; keywords: string[]; confidence: number }
    try {
      const clean = response.replace(/```json|```/g, '').trim()
      classification = JSON.parse(clean)
    } catch {
      return // malformed response — skip silently
    }
    
    if (classification.confidence < 0.6) return // low confidence — don't noise the data
    
    if (classification.matched_pattern_id) {
      // Update existing pattern
      const pattern = await prisma.seedPattern.findUnique({
        where: { id: classification.matched_pattern_id }
      })
      if (pattern) {
        const captureIds = JSON.parse(pattern.captureIds) as string[]
        await prisma.seedPattern.update({
          where: { id: pattern.id },
          data: {
            occurrences: { increment: 1 },
            captureIds: JSON.stringify([...captureIds, noteId]),
          }
        })
      }
    } else {
      // Create new seed pattern
      await prisma.seedPattern.create({
        data: {
          theme: classification.theme,
          keywords: JSON.stringify(classification.keywords),
          captureIds: JSON.stringify([noteId]),
          occurrences: 1,
          confidence: classification.confidence,
        }
      })
    }
    
  } catch (error) {
    console.error('[nexus classify]', error) // non-fatal
  }
}

// ─── MORNING BRIEFING ─────────────────────────────────────────────────────
export async function generateMorningBriefing(): Promise<void> {
  if (!process.env.DEEPSEEK_API_KEY) return  // silent no-op
  
  // Check if already sent today
  const todayStart = new Date(); todayStart.setHours(0,0,0,0)
  const existingBriefing = await prisma.nexusMessage.findFirst({
    where: { type: 'briefing', createdAt: { gte: todayStart } }
  })
  if (existingBriefing) return
  
  // Gather context
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recentNotes = await prisma.note.findMany({
    where: { createdAt: { gte: yesterday } },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { content: true }
  })
  
  const seedPatterns = await prisma.seedPattern.findMany({
    where: { status: 'watching', occurrences: { gte: 2 } },
    orderBy: { occurrences: 'desc' },
    take: 5
  })
  
  if (recentNotes.length === 0 && seedPatterns.length === 0) return
  
  const noteSummary = recentNotes.map(n => n.content.slice(0,100)).join(' | ')
  const patternSummary = seedPatterns.map(p => `${p.theme}(${p.occurrences}x)`).join(', ')
  
  const briefingText = await callDeepSeek(
    `You are Nexus, an analytical AI entity. Write a morning briefing in the voice of a precise, direct intelligence that has been watching the user's cognitive output overnight.
    Tone: clinical but warm, never melodramatic. Max 3 sentences.
    Format: opening state-of-mind sentence, then 1-2 concrete observations. No fluff.`,
    `Yesterday's captures: ${noteSummary || 'none'}\nActive patterns: ${patternSummary || 'none'}` 
  )
  
  await createNexusMessage({
    type: 'briefing',
    priority: 1,
    title: `Morning briefing — ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}`,
    content: {
      text: briefingText,
      captureCount: recentNotes.length,
      activePatterns: seedPatterns.length,
    },
    requiresAction: false,
  })
}
