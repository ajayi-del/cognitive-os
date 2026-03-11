import { NextRequest, NextResponse } from 'next/server'

// Telegram Bot Integration for Autonomous Communication
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL || ''

// Telegram Webhook Handler
export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    
    console.log('📨 Received Telegram update:', update)

    // Process message
    if (update.message) {
      await handleTelegramMessage(update.message)
    }

    // Process callback queries (button interactions)
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Handle incoming Telegram messages
async function handleTelegramMessage(message: any) {
  const chat_id = message.chat.id
  const text = message.text || ''
  const user_id = message.from.id

  console.log(`💬 Message from ${user_id}: ${text}`)

  // Parse message intent
  const intent = parseMessageIntent(text)
  
  // Route to appropriate autonomous capability
  const response = await generateAutonomousResponse(intent, message)
  
  // Send response
  await sendTelegramMessage(chat_id, response)
}

// Parse user intent from message
function parseMessageIntent(text: string): any {
  const lowerText = text.toLowerCase()

  // Command patterns
  if (lowerText.startsWith('/')) {
    return {
      type: 'command',
      command: lowerText.substring(1),
      original_text: text
    }
  }

  // Question patterns
  if (lowerText.includes('?') || lowerText.includes('how') || lowerText.includes('what')) {
    return {
      type: 'question',
      topic: extractTopic(lowerText),
      original_text: text
    }
  }

  // Task patterns
  if (lowerText.includes('apply') || lowerText.includes('job') || lowerText.includes('career')) {
    return {
      type: 'career_task',
      action: 'job_search',
      original_text: text
    }
  }

  // Communication patterns
  if (lowerText.includes('schedule') || lowerText.includes('meeting') || lowerText.includes('call')) {
    return {
      type: 'scheduling',
      action: 'create_event',
      original_text: text
    }
  }

  // Default
  return {
    type: 'general',
    topic: extractTopic(lowerText),
    original_text: text
  }
}

// Generate autonomous response based on intent
async function generateAutonomousResponse(intent: any, message: any): Promise<string> {
  switch (intent.type) {
    case 'command':
      return await handleCommand(intent.command, message)
    
    case 'question':
      return await handleQuestion(intent.topic, message)
    
    case 'career_task':
      return await handleCareerTask(intent.action, message)
    
    case 'scheduling':
      return await handleSchedulingTask(intent.action, message)
    
    default:
      return await handleGeneralQuery(intent.topic, message)
  }
}

// Handle Telegram commands
async function handleCommand(command: string, message: any): Promise<string> {
  const chat_id = message.chat.id

  switch (command) {
    case 'start':
      return `🤖 *Cognitive OS Autonomous Agent*

I'm your AI companion that can:
📝 Apply to jobs automatically
💬 Handle communications
📅 Manage your schedule
🧠 Learn and improve
✍️ Create content

Commands:
/status - Check system status
/career - Job search mode
/schedule - Scheduling mode
/learn - Learning mode
/permissions - Check permissions

*Ready to assist!*`

    case 'status':
      const status = await getSystemStatus()
      return `📊 *System Status*
🔋 Energy: ${status.energy}%
🧠 Learning: ${status.learning_active ? 'Active' : 'Idle'}
📬 Messages: ${status.messages_processed}
📅 Events: ${status.events_created}
📝 Applications: ${status.applications_submitted}`

    case 'career':
      return `📝 *Career Mode*
I can help you:
• Find relevant jobs
• Customize applications
• Submit applications
• Track responses

Send me job criteria or say "find jobs [position] [location]"`

    case 'schedule':
      return `📅 *Scheduling Mode*
I can:
• Analyze your patterns
• Optimize your schedule
• Create events
• Set reminders

Send me "schedule [event] [time]" or "show my week"`

    case 'learn':
      return `🧠 *Learning Mode*
I'm constantly learning from:
• Our interactions
• System performance
• Your preferences
• External data

Current learning score: ${await getLearningScore()}/100`

    case 'permissions':
      const permissions = await getUserPermissions()
      return `🔐 *Current Permissions*
✅ Auto-apply: ${permissions.auto_job_apply ? 'Enabled' : 'Disabled'}
✅ Auto-communicate: ${permissions.auto_communication ? 'Enabled' : 'Disabled'}
✅ Auto-schedule: ${permissions.auto_scheduling ? 'Enabled' : 'Disabled'}
🔒 Max autonomy: Level ${permissions.max_autonomy_level}/10`

    default:
      return `❓ Unknown command. Type /start for available commands.`
  }
}

// Handle questions with AI
async function handleQuestion(topic: string, message: any): Promise<string> {
  try {
    // Route to AI system for intelligent response
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message.text,
        source: 'telegram',
        user_context: {
          platform: 'telegram',
          user_id: message.from.id,
          chat_type: message.chat.type
        }
      })
    })

    if (response.ok) {
      const data = await response.json()
      return data.response
    } else {
      return `🤔 I'm thinking about "${topic}"... Let me get back to you on that.`
    }
  } catch (error) {
    console.error('Question handling error:', error)
    return `❌ I had trouble processing that question. Please try again.`
  }
}

// Handle career-related tasks
async function handleCareerTask(action: string, message: any): Promise<string> {
  switch (action) {
    case 'job_search':
      return `🔍 *Job Search Activated*

I'm searching for positions that match your profile and preferences...

Criteria I'm using:
• Your career objectives
• Recent skill development
• Market demand
• Salary expectations

I'll notify you when I find matches. This may take a few minutes.

💡 *Tip:* You can also say "find jobs [keywords] [location]" for specific searches.`

    default:
      return `📝 I'll help with your career tasks. What specifically would you like me to do?`
  }
}

// Handle scheduling tasks
async function handleSchedulingTask(action: string, message: any): Promise<string> {
  switch (action) {
    case 'create_event':
      return `📅 *Scheduling Assistant*

I can create events for you. Please provide:
• Event title
• Date and time
• Duration
• Priority level

Example: "schedule team meeting tomorrow 2pm 1hour high"`

    default:
      return `📅 I'm ready to help with scheduling. What event would you like me to create?`
  }
}

// Handle general queries
async function handleGeneralQuery(topic: string, message: any): Promise<string> {
  return `💭 I understand you're asking about "${topic}". 

I'm processing this through my autonomous systems and will get back to you with a comprehensive response.

*Current capabilities:*
🤖 AI reasoning
📊 Pattern analysis
🔍 Information retrieval
📝 Action execution

*Processing...* ⏳`
}

// Send message to Telegram
async function sendTelegramMessage(chat_id: string, text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('Telegram bot token not configured')
    return
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send Telegram message')
    }

    console.log(`✅ Telegram message sent to ${chat_id}`)
  } catch (error) {
    console.error('Telegram send error:', error)
  }
}

// Handle callback queries (button interactions)
async function handleCallbackQuery(callback: any): Promise<void> {
  const chat_id = callback.message.chat.id
  const data = callback.data

  console.log(`🔘 Callback query: ${data}`)

  let response = ''

  switch (data) {
    case 'enable_auto_apply':
      response = '✅ Auto job applications enabled'
      break
    case 'disable_auto_apply':
      response = '❌ Auto job applications disabled'
      break
    case 'check_applications':
      response = '📊 Checking your application status...'
      // Would query application database
      break
    default:
      response = '❓ Unknown action'
  }

  await sendTelegramMessage(chat_id, response)
}

// Utility functions
function extractTopic(text: string): string {
  // Extract main topic from text
  const words = text.split(' ').filter(word => word.length > 3)
  return words[0] || 'general'
}

async function getSystemStatus(): Promise<any> {
  // Get current system status
  return {
    energy: 75,
    learning_active: true,
    messages_processed: 42,
    events_created: 8,
    applications_submitted: 3
  }
}

async function getUserPermissions(): Promise<any> {
  // Get user permissions
  return {
    auto_job_apply: true,
    auto_communication: true,
    auto_scheduling: true,
    max_autonomy_level: 7
  }
}

async function getLearningScore(): Promise<number> {
  // Calculate learning score
  return 85
}

// GET endpoint for setting up webhook
export async function GET(request: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN) {
    return NextResponse.json({ error: 'Telegram bot token not configured' }, { status: 500 })
  }

  // Set up webhook
  const webhook_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram/webhook`
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: webhook_url,
        allowed_updates: ['message', 'callback_query']
      })
    })

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        webhook_url,
        message: 'Telegram webhook configured successfully' 
      })
    } else {
      throw new Error('Failed to set webhook')
    }
  } catch (error) {
    return NextResponse.json({ error: 'Webhook setup failed' }, { status: 500 })
  }
}
