// NEXUS COGNITIVE OS - VOICE COMMANDS PROCESSOR
// Processes natural language voice commands and converts them to actions

export interface VoiceCommand {
  type: 'search' | 'query' | 'summarize' | 'create' | 'unknown'
  action: string
  parameters: Record<string, any>
  response: string
}

export function processVoiceCommand(input: string): VoiceCommand {
  const normalizedInput = input.toLowerCase().trim()

  // SEARCH COMMANDS
  if (normalizedInput.includes('search') || normalizedInput.includes('find') || normalizedInput.includes('look for')) {
    if (normalizedInput.includes('trading')) {
      return {
        type: 'search',
        action: 'search_notes',
        parameters: { query: 'trading strategy system analysis market' },
        response: 'Searching your notes for trading-related content...'
      }
    }
    
    if (normalizedInput.includes('ai') || normalizedInput.includes('development') || normalizedInput.includes('coding')) {
      return {
        type: 'search',
        action: 'search_notes',
        parameters: { query: 'AI development coding programming systems' },
        response: 'Searching your notes for AI development content...'
      }
    }
    
    if (normalizedInput.includes('german') || normalizedInput.includes('language') || normalizedInput.includes('learning')) {
      return {
        type: 'search',
        action: 'search_notes',
        parameters: { query: 'German language learning progress practice' },
        response: 'Searching your notes for German learning content...'
      }
    }

    // Generic search
    const searchQuery = normalizedInput.replace(/search|find|look for|my notes/g, '').trim()
    if (searchQuery) {
      return {
        type: 'search',
        action: 'search_notes',
        parameters: { query: searchQuery },
        response: `Searching your notes for: ${searchQuery}`
      }
    }
  }

  // QUERY COMMANDS
  if (normalizedInput.includes('what did i') || normalizedInput.includes('recent') || normalizedInput.includes('yesterday')) {
    if (normalizedInput.includes('yesterday') || normalizedInput.includes('recent')) {
      return {
        type: 'query',
        action: 'recent_notes',
        parameters: { timeframe: 'yesterday' },
        response: 'Finding your recent notes from yesterday...'
      }
    }
    
    if (normalizedInput.includes('work on')) {
      return {
        type: 'query',
        action: 'work_summary',
        parameters: {},
        response: 'Summarizing your recent work and progress...'
      }
    }
  }
  
  // FUTURE SELF COMMANDS
  if (normalizedInput.includes('future') || normalizedInput.includes('self') || normalizedInput.includes('profile') || normalizedInput.includes('goals') || normalizedInput.includes('identity')) {
    if (normalizedInput.includes('profile') || normalizedInput.includes('self')) {
      return {
        type: 'query',
        action: 'future_self_profile',
        parameters: {},
        response: 'Accessing your Future Self profile...'
      }
    }
    
    if (normalizedInput.includes('goals')) {
      return {
        type: 'query',
        action: 'future_self_goals',
        parameters: {},
        response: 'Reviewing your strategic goals...'
      }
    }
    
    if (normalizedInput.includes('identity')) {
      return {
        type: 'query',
        action: 'future_self_identity',
        parameters: {},
        response: 'Showing your identity traits...'
      }
    }
  }

  // SUMMARIZE COMMANDS
  if (normalizedInput.includes('summarize') || normalizedInput.includes('summary') || normalizedInput.includes('overview')) {
    if (normalizedInput.includes('ai') || normalizedInput.includes('development')) {
      return {
        type: 'summarize',
        action: 'summarize_topic',
        parameters: { topic: 'AI development' },
        response: 'Creating summary of your AI development progress...'
      }
    }
    
    if (normalizedInput.includes('trading')) {
      return {
        type: 'summarize',
        action: 'summarize_topic',
        parameters: { topic: 'trading' },
        response: 'Creating summary of your trading strategy development...'
      }
    }
    
    if (normalizedInput.includes('german') || normalizedInput.includes('learning')) {
      return {
        type: 'summarize',
        action: 'summarize_topic',
        parameters: { topic: 'German learning' },
        response: 'Creating summary of your German learning progress...'
      }
    }
  }

  // CREATE COMMANDS
  if (normalizedInput.includes('create') || normalizedInput.includes('add') || normalizedInput.includes('new note')) {
    const noteContent = normalizedInput.replace(/create|add|new note|note about/g, '').trim()
    if (noteContent) {
      return {
        type: 'create',
        action: 'create_note',
        parameters: { content: noteContent },
        response: `Creating note: ${noteContent}`
      }
    }
  }

  // DEFAULT: TREAT AS CHAT MESSAGE
  return {
    type: 'query',
    action: 'chat',
    parameters: { message: input },
    response: 'Processing your request...'
  }
}

export function executeVoiceCommand(command: VoiceCommand): Promise<any> {
  switch (command.action) {
    case 'search_notes':
      return searchNotesWithParameters(command.parameters.query)
    
    case 'recent_notes':
      return getRecentNotes(command.parameters.timeframe)
    
    case 'work_summary':
      return getWorkSummary()
    
    case 'summarize_topic':
      return summarizeTopic(command.parameters.topic)
    
    case 'create_note':
      return createNoteFromVoice(command.parameters.content)
    
    case 'chat':
      return sendChatMessage(command.parameters.message)
    
    // FUTURE SELF COMMANDS
    case 'future_self_profile':
      return getFutureSelfProfile()
    
    case 'future_self_goals':
      return getFutureSelfGoals()
    
    case 'future_self_identity':
      return getFutureSelfIdentity()
    
    default:
      return Promise.resolve({ error: 'Unknown command' } as any)
  }
}

async function searchNotesWithParameters(query: string): Promise<any> {
  try {
    const response = await fetch('http://localhost:3000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, limit: 5 })
    })
    if (!response.ok) {
      throw new Error('Search request failed')
    }
    return response.json()
  } catch (error) {
    console.error('searchNotesWithParameters error:', error)
    return { error: error.message }
  }
}

async function getRecentNotes(timeframe: string): Promise<any> {
  try {
    const response = await fetch('http://localhost:3000/api/captures')
    if (!response.ok) {
      throw new Error('Failed to fetch notes')
    }
    const notes = await response.json()
    
    // Filter by timeframe (simplified)
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const recentNotes = notes.filter((note: any) => 
      new Date(note.createdAt) > yesterday
    )
    
    return { notes: recentNotes }
  } catch (error) {
    console.error('getRecentNotes error:', error)
    return { notes: [], error: error.message }
  }
}

async function getWorkSummary(): Promise<any> {
  try {
    // This would integrate with your existing work tracking
    return { summary: 'Your recent work includes AI development and trading research.' }
  } catch (error) {
    console.error('getWorkSummary error:', error)
    return { error: error.message }
  }
}

async function summarizeTopic(topic: string): Promise<any> {
  try {
    // This would use semantic search to find and summarize topic
    return { summary: `Summary of your ${topic} progress...` }
  } catch (error) {
    console.error('summarizeTopic error:', error)
    return { error: error.message }
  }
}

async function createNoteFromVoice(content: string): Promise<any> {
  try {
    const response = await fetch('http://localhost:3000/api/captures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    if (!response.ok) {
      throw new Error('Failed to create note')
    }
    return response.json()
  } catch (error) {
    console.error('createNoteFromVoice error:', error)
    return { error: error.message }
  }
}

async function sendChatMessage(message: string): Promise<any> {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }]
      })
    })
    if (!response.ok) {
      throw new Error('Chat request failed')
    }
    return response.json()
  } catch (error) {
    console.error('sendChatMessage error:', error)
    return { error: error.message }
  }
}

// FUTURE SELF COMMAND EXECUTION FUNCTIONS
async function getFutureSelfProfile(): Promise<any> {
  try {
    const response = await fetch('http://localhost:3000/api/future-self')
    if (!response.ok) {
      throw new Error('Failed to fetch Future Self profile')
    }
    return response.json()
  } catch (error) {
    console.error('getFutureSelfProfile error:', error)
    return { error: error.message }
  }
}

async function getFutureSelfGoals(): Promise<any> {
  try {
    const response = await fetch('http://localhost:3000/api/future-self/goals')
    if (!response.ok) {
      throw new Error('Failed to fetch Future Self goals')
    }
    return response.json()
  } catch (error) {
    console.error('getFutureSelfGoals error:', error)
    return { error: error.message }
  }
}

async function getFutureSelfIdentity(): Promise<any> {
  try {
    const response = await fetch('http://localhost:3000/api/future-self/identity')
    if (!response.ok) {
      throw new Error('Failed to fetch Future Self identity')
    }
    return response.json()
  } catch (error) {
    console.error('getFutureSelfIdentity error:', error)
    return { error: error.message }
  }
}
