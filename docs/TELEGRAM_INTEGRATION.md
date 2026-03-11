# Telegram Integration Architecture

## Overview
This document outlines the architecture for integrating Cognitive OS with Telegram, allowing users to interact with their cognitive system via Telegram bot.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Telegram      │────▶│  Telegram Bot    │────▶│  Cognitive OS   │
│   (User Chat)   │◀────│  API (Next.js)   │◀────│  Core Engine    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌──────────────────┐
                        │  Webhook Handler │
                        │  - Commands      │
                        │  - Voice/Text    │
                        │  - Media         │
                        └──────────────────┘
```

## Implementation Roadmap

### Phase 1: Basic Bot Setup (1-2 hours)
1. Create Telegram bot via @BotFather
2. Set webhook URL to `/api/telegram/webhook`
3. Implement basic command handlers

### Phase 2: Core Features (4-6 hours)
1. Text capture → Creates capture in inbox
2. Voice messages → Transcribe → Create capture
3. Photo upload → OCR/Image analysis → Create capture
4. Commands:
   - `/capture [text]` - Quick capture
   - `/status` - View system vitals
   - `/ideas` - List idea buckets
   - `/actions` - View action queue
   - `/focus` - Start focus session
   - `/help` - Show commands

### Phase 3: AI Integration (3-4 hours)
1. Natural language chat with AI
2. Morning briefings via Telegram
3. Drift warnings and alerts
4. Curiosity signal notifications

### Phase 4: Advanced Features (4-6 hours)
1. Inline keyboard for quick actions
2. Conversation threading
3. Group chat support
4. Scheduled reminders

## API Routes

```typescript
// app/api/telegram/webhook/route.ts
POST /api/telegram/webhook
  - Receives all Telegram updates
  - Validates webhook secret
  - Routes to appropriate handler

// app/api/telegram/setup/route.ts
POST /api/telegram/setup
  - Sets webhook URL
  - Configures bot commands
  - Tests connection

// app/api/telegram/send/route.ts
POST /api/telegram/send
  - Sends message to user
  - Used by AI for notifications
```

## Data Model

```typescript
// lib/telegram.ts
interface TelegramUser {
  id: string
  telegram_id: number
  username?: string
  first_name: string
  last_name?: string
  cognitive_user_id: string
  settings: {
    notifications: boolean
    morning_briefing: boolean
    drift_alerts: boolean
  }
  created_at: Date
  last_active: Date
}

interface TelegramSession {
  id: string
  user_id: string
  chat_id: number
  state: 'idle' | 'capturing' | 'focusing' | 'chatting'
  context?: string // For conversation memory
  created_at: Date
  updated_at: Date
}
```

## Message Handlers

```typescript
// lib/telegram/handlers.ts

// Text Handler
async function handleTextMessage(
  message: TelegramMessage,
  user: TelegramUser
): Promise<void> {
  // 1. Create capture
  const capture = await createCapture({
    user_id: user.cognitive_user_id,
    content: message.text,
    source: 'telegram',
    telegram_message_id: message.message_id
  })
  
  // 2. AI analysis
  const analysis = await aiService.analyze(message.text)
  
  // 3. Reply with routing suggestion
  await telegramApi.sendMessage({
    chat_id: message.chat.id,
    text: `✅ Captured: "${message.text.slice(0, 50)}..."\n\nAI suggests: Route to ${analysis.suggested_route}`,
    reply_markup: {
      inline_keyboard: [[
        { text: '📁 Project', callback_data: `route:${capture.id}:project` },
        { text: '💡 Idea', callback_data: `route:${capture.id}:idea` },
        { text: '⚡ Action', callback_data: `route:${capture.id}:action` }
      ]]
    }
  })
}

// Voice Handler
async function handleVoiceMessage(
  message: TelegramMessage,
  user: TelegramUser
): Promise<void> {
  // 1. Download voice file
  const voiceUrl = await telegramApi.getFileUrl(message.voice.file_id)
  
  // 2. Transcribe (using Whisper API)
  const transcription = await aiService.transcribe(voiceUrl)
  
  // 3. Create capture
  const capture = await createCapture({
    user_id: user.cognitive_user_id,
    content: transcription,
    source: 'telegram_voice',
    media_url: voiceUrl
  })
  
  // 4. Reply
  await telegramApi.sendMessage({
    chat_id: message.chat.id,
    text: `🎤 Voice captured!\n\nTranscription: "${transcription.slice(0, 100)}..."`
  })
}

// Command Handlers
const commands: Record<string, CommandHandler> = {
  '/start': async (msg, user) => {
    await telegramApi.sendMessage({
      chat_id: msg.chat.id,
      text: `👋 Welcome to Cognitive OS!\n\nI'm your cognitive companion. Send me thoughts, ideas, or tasks and I'll organize them for you.\n\nUse /help to see available commands.`
    })
  },
  
  '/status': async (msg, user) => {
    const vitals = await getSystemVitals(user.cognitive_user_id)
    await telegramApi.sendMessage({
      chat_id: msg.chat.id,
      text: `📊 System Vitals:\n\n• Captures: ${vitals.captures}\n• Energy: ${vitals.avg_energy} ATP\n• Alignment: ${vitals.alignment_score}%\n• Drift: ${vitals.drift_level}`
    })
  },
  
  '/ideas': async (msg, user) => {
    const ideas = await getIdeaBuckets(user.cognitive_user_id)
    const keyboard = ideas.slice(0, 5).map(idea => ([{
      text: idea.content.slice(0, 30) + '...',
      callback_data: `view_idea:${idea.id}`
    }]))
    
    await telegramApi.sendMessage({
      chat_id: msg.chat.id,
      text: `💡 Your Idea Buckets (${ideas.length}):`,
      reply_markup: { inline_keyboard: keyboard }
    })
  }
}
```

## Webhook Security

```typescript
// lib/telegram/security.ts

function validateWebhook(request: Request): boolean {
  const secret = request.headers.get('x-telegram-bot-api-secret-token')
  return secret === process.env.TELEGRAM_WEBHOOK_SECRET
}

function verifyTelegramSignature(payload: string, signature: string): boolean {
  const secret = createHash('sha256')
    .update(process.env.TELEGRAM_BOT_TOKEN!)
    .digest()
  
  const expected = createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}
```

## Environment Variables

```bash
# .env.local
TELEGRAM_BOT_TOKEN="your-bot-token-from-botfather"
TELEGRAM_WEBHOOK_SECRET="random-secret-for-webhook-validation"
TELEGRAM_BOT_USERNAME="YourCognitiveBot"

# Optional: Webhook URL (auto-generated if not set)
TELEGRAM_WEBHOOK_URL="https://yourdomain.com/api/telegram/webhook"
```

## Setup Instructions

```bash
# 1. Install dependency
npm install node-telegram-bot-api

# 2. Set environment variables
echo "TELEGRAM_BOT_TOKEN=your_token" >> .env.local
echo "TELEGRAM_WEBHOOK_SECRET=$(openssl rand -hex 32)" >> .env.local

# 3. Setup webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://yourdomain.com/api/telegram/webhook",
    "secret_token": "your-webhook-secret"
  }'

# 4. Set bot commands
curl -X POST "https://api.telegram.org/bot<TOKEN>/setMyCommands" \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {"command": "start", "description": "Start using Cognitive OS"},
      {"command": "capture", "description": "Quick capture a thought"},
      {"command": "status", "description": "View system vitals"},
      {"command": "ideas", "description": "List idea buckets"},
      {"command": "actions", "description": "View action queue"},
      {"command": "focus", "description": "Start focus session"},
      {"command": "help", "description": "Show available commands"}
    ]
  }'
```

## Usage Flow

```
User (Telegram):
  "I need to improve my trading strategy with better risk management"

Bot:
  ✅ Captured: "I need to improve my trading strategy..."
  
  AI suggests: Route to PROJECT
  
  [📁 Project] [💡 Idea] [⚡ Action]

User:
  Clicks "📁 Project"

Bot:
  🎯 Created project: "Trading Strategy Improvement"
  
  AI has identified 3 related captures. 
  Would you like to link them?
  
  [Yes, link them] [Not now]
```

## Notification Types

1. **Morning Briefing** (8 AM daily)
   - Unprocessed captures count
   - Today's focus suggestion
   - Alignment score
   - Curiosity signals

2. **Drift Alert** (When detected)
   - "⚠️ Low capture activity detected"
   - "🎯 Suggested reconnection action"

3. **Curiosity Alert** (When pattern emerges)
   - "🔥 Strong signal: You've mentioned 'neural networks' 5 times today"
   - "💡 Create a project?"

4. **Focus Reminder** (Scheduled)
   - "⏰ Focus session starting in 5 minutes"
   - "🎯 Goal: Complete trading algorithm design"

## Database Schema

```sql
-- Add to existing schema
CREATE TABLE telegram_users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT,
  cognitive_user_id INTEGER REFERENCES users(id),
  settings JSONB DEFAULT '{"notifications": true, "morning_briefing": true}',
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW()
);

CREATE TABLE telegram_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES telegram_users(id),
  chat_id BIGINT NOT NULL,
  state TEXT DEFAULT 'idle',
  context JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE telegram_captures (
  id SERIAL PRIMARY KEY,
  telegram_message_id BIGINT NOT NULL,
  capture_id INTEGER REFERENCES captures(id),
  telegram_user_id INTEGER REFERENCES telegram_users(id),
  media_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Next Steps

1. **Immediate (Today):**
   - Create `/api/telegram/webhook` route
   - Implement basic command handlers
   - Test with local tunnel (ngrok)

2. **This Week:**
   - Voice message transcription
   - Photo OCR integration
   - Inline keyboards for routing

3. **Next Week:**
   - AI chat integration
   - Morning briefings
   - Drift alerts

---

*Document Version: 1.0*
*Created: 2024-03-11*
*Status: Architecture Complete - Ready for Implementation*
