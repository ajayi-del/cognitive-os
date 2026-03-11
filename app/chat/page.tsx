'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Send, Brain, Target, Zap, CheckCircle, XCircle } from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  contextScope: string
  referencedNoteIds: string[]
  createdAt: Date
}

interface ChatContext {
  scope: 'all' | 'project' | 'notes' | 'trading' | 'coding'
  projectId?: string
  noteIds?: string[]
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [contextScope, setContextScope] = useState<ChatContext['scope']>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackStates, setFeedbackStates] = useState<Record<string, 'up' | 'down' | null>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize with welcome message
    setMessages([{
      id: '1',
      role: 'assistant',
      content: `🧠 Welcome to Cognitive OS Chat!

I'm your personal thinking assistant with access to your notes, projects, and patterns. I can help you:

• **Pattern Recognition** - Detect recurring themes in your thinking
• **Project Clarity** - Convert scattered ideas into structured projects  
• **Strategic Direction** - Provide daily briefings and priority ranking
• **Execution Support** - Generate actionable tasks and next steps
• **Knowledge Synthesis** - Connect ideas across different domains

Try asking me:
• "What patterns have I been thinking about lately?"
• "Help me organize my trading system ideas"
• "What should I focus on this week?"
• "Convert this idea into a project"

I remember everything we discuss and learn from your feedback over time.`,
      contextScope: 'all',
      referencedNoteIds: [],
      createdAt: new Date()
    }])
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      contextScope,
      referencedNoteIds: [],
      createdAt: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input, contextScope)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        contextScope,
        referencedNoteIds: [],
        createdAt: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string, scope: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('pattern') || input.includes('recurring')) {
      return `🔍 **Pattern Analysis**

Based on your recent thinking patterns, I've identified several recurring themes:

**High-Frequency Patterns:**
• Trading system architecture (8 mentions this month)
• Cognitive workflow optimization (6 mentions)  
• Market pattern recognition (5 mentions)

**Emerging Patterns:**
• Personal productivity systems (growing frequency)
• AI-human collaboration models (new but consistent)

**Strategic Insight:**
Your trading system ideas have evolved from scattered concepts to a coherent architecture. This suggests it's ready to become a concrete project rather than remaining as idea fragments.

**Recommendation:**
Consider dedicating focused time to the trading system - it has the most momentum and clearest execution path.`
    }

    if (input.includes('trading') || input.includes('market')) {
      return `📊 **Trading Analysis**

I've analyzed your recent trading-related thoughts and found consistent patterns:

**Core Thesis Evolution:**
Your thinking has moved from discretionary ideas to systematic approaches. I see 3 related concepts that could be unified:

1. **Volatility-Based Entry System** - Pattern recognition in compression phases
2. **Risk Management Framework** - Position sizing and invalidation logic  
3. **Multi-Timeframe Analysis** - Connecting short-term setups to longer-term trends

**Structured Next Steps:**
• Define entry criteria with specific volatility thresholds
• Document invalidation scenarios for each setup type
• Create backtesting framework for validation

**Missing Elements:**
• Specific asset classes to focus on
• Time commitment allocation
• Success metrics definition

Would you like me to help you create a project structure for this trading system?`
    }

    if (input.includes('project') || input.includes('organize')) {
      return `🎯 **Project Organization**

I can help you structure your scattered ideas into actionable projects. Based on your recent notes, I see these project candidates:

**Ready for Projects:**
1. **Cognitive OS Development** - Clear requirements, existing momentum
2. **Trading System Architecture** - Detailed thinking, systematic approach
3. **Personal Knowledge Management** - Recurring themes, clear value

**Still as Idea Buckets:**
• German learning methods
• Career path optimization
• Research workflow systems

**Project Conversion Criteria:**
• Appears consistently over time ✓
• Has actionable components ✓  
• Clear success metrics ✓
• Resource requirements defined ⚠️

**Next Actions:**
1. Choose which project to prioritize this month
2. Define success criteria for each
3. Estimate resource requirements
4. Create implementation timeline

Which project resonates most with your current focus?`
    }

    if (input.includes('focus') || input.includes('priority') || input.includes('week')) {
      return `🎯 **Strategic Focus Analysis**

Based on your recent thinking patterns and current project states:

**This Week's Strategic Direction:**
"Complete the trading system architecture specification while maintaining daily cognitive capture."

**Top 3 Priorities:**
1. **Trading System Design** - Highest momentum, clear execution path
2. **Cognitive OS Chat Enhancement** - Improves all other work
3. **Pattern Documentation** - Supports systematic thinking

**What to Ignore:**
• New project ideas (capture but don't act)
• German learning (lower urgency)
• Career planning (not time-sensitive)

**Execution Strategy:**
• Morning: Deep work on trading system (2-3 hours)
• Afternoon: Cognitive system improvements (1-2 hours)  
• Evening: Pattern capture and reflection (30 minutes)

**Success Metrics:**
• Trading system spec completed
• 3+ high-quality notes captured daily
• One pattern insight documented

This balances focused execution with continuous cognitive improvement.`
    }

    // Default response
    return `🧠 **Cognitive Analysis**

I understand you're thinking about: "${userInput}"

**Context Analysis:**
• Current scope: ${scope}
• Related patterns in your recent notes
• Connection to your active projects

**Key Insights:**
This touches on themes you've explored before. I see connections to your systems thinking approach and desire for structured execution.

**Strategic Questions:**
• Is this a new direction or evolution of existing thinking?
• What would make this actionable rather than just conceptual?
• How does this align with your current priorities?

**Next Steps:**
Would you like me to:
• Help organize this into a project structure?
• Connect this to related ideas you've had?
• Generate specific action items?
• Analyze patterns in this type of thinking?

I'm learning from your feedback to better align with your cognitive style and priorities.`
  }

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setFeedbackStates(prev => ({ ...prev, [messageId]: feedback }))
    
    // In real implementation, this would send feedback to the system
    console.log(`Feedback ${feedback} for message ${messageId}`)
  }

  const handleSaveToNotes = (content: string) => {
    // In real implementation, this would save to notes
    console.log('Saving to notes:', content)
  }

  const handleCreateTask = (content: string) => {
    // In real implementation, this would create a task
    console.log('Creating task from:', content)
  }

  return (
    <div className="min-h-screen cognitive-bg">
      {/* Header */}
      <div className="cognitive-elevated border-b border-cognitive-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 cognitive-accent" />
              <div>
                <h1 className="text-lg font-semibold text-white">Chat Interface</h1>
                <p className="text-xs cognitive-text-muted">Context-aware AI assistant</p>
              </div>
            </div>
            
            {/* Context Scope Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm cognitive-text-muted">Scope:</span>
              <select 
                value={contextScope}
                onChange={(e) => setContextScope(e.target.value as ChatContext['scope'])}
                className="bg-cognitive-surface border border-cognitive-border rounded px-3 py-1 text-sm text-white"
              >
                <option value="all">All Memory</option>
                <option value="notes">Notes Only</option>
                <option value="project">Selected Project</option>
                <option value="trading">Trading</option>
                <option value="coding">Coding</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="cognitive-surface border border-cognitive-border rounded-lg">
          <div className="h-[600px] overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cognitive-accent flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-2xl ${
                  message.role === 'user' 
                    ? 'bg-cognitive-accent/20 border border-cognitive-accent/50' 
                    : 'cognitive-surface border border-cognitive-border'
                } rounded-lg p-4`}>
                  <div className="text-white whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Message Actions */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-cognitive-border">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSaveToNotes(message.content)}
                          className="text-xs cognitive-text-muted hover:text-cognitive-accent transition-colors"
                        >
                          Save to Notes
                        </button>
                        <button
                          onClick={() => handleCreateTask(message.content)}
                          className="text-xs cognitive-text-muted hover:text-cognitive-accent transition-colors"
                        >
                          Create Task
                        </button>
                      </div>
                      
                      {/* Feedback */}
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleFeedback(message.id, 'up')}
                          className={`p-1 rounded transition-colors ${
                            feedbackStates[message.id] === 'up'
                              ? 'text-cognitive-success'
                              : 'text-cognitive-text-muted hover:text-cognitive-success'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, 'down')}
                          className={`p-1 rounded transition-colors ${
                            feedbackStates[message.id] === 'down'
                              ? 'text-cognitive-danger'
                              : 'text-cognitive-text-muted hover:text-cognitive-danger'
                          }`}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cognitive-text-muted flex items-center justify-center">
                    <span className="text-sm font-medium text-white">You</span>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cognitive-accent flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cognitive-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-cognitive-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-cognitive-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="mt-6 cognitive-surface border border-cognitive-border rounded-lg p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder="Ask me anything about your notes, projects, patterns, or strategic direction..."
                className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-3 text-white placeholder-cognitive-text-muted resize-none focus:outline-none focus:border-cognitive-accent transition-colors"
                rows={3}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 flex items-center space-x-2 text-sm">
            <span className="cognitive-text-muted">Quick prompts:</span>
            <button
              onClick={() => setInput("What patterns have I been thinking about lately?")}
              className="cognitive-accent hover:underline"
            >
              Pattern Analysis
            </button>
            <button
              onClick={() => setInput("Help me organize my trading system ideas")}
              className="cognitive-accent hover:underline"
            >
              Trading Ideas
            </button>
            <button
              onClick={() => setInput("What should I focus on this week?")}
              className="cognitive-accent hover:underline"
            >
              Weekly Focus
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
