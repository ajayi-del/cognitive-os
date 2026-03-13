'use client'

import { useState } from 'react'
import { Brain, TrendingUp, Target } from 'lucide-react'

// Core Components - Essential Only
import NexusDiary from '@/components/NexusDiary'
import NexusFeed from '@/components/NexusFeed'
import { AIProviderSelector } from '@/components/AIProviderUI'
import { NexusChessDock } from '@/components/NexusChessDock'
import { DecisionPatterns } from '@/components/DecisionPatterns'
import { CognitiveInsights } from '@/components/CognitiveInsights'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { VoiceNexus } from '@/components/VoiceNexus'
import { VoiceInput } from '@/components/VoiceInput'
import { processVoiceCommand, executeVoiceCommand } from '@/lib/voice-commands'
import RealFutureSelf from '@/components/RealFutureSelf'
import type { AIProvider } from '@/lib/ai-router'

export default function HomePage() {
  // Essential State Only
  const [activeView, setActiveView] = useState('diary')
  const [selectedAIProvider, setSelectedAIProvider] = useState<AIProvider>('deepseek')
  
  // Voice State
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [lastNexusResponse, setLastNexusResponse] = useState('')
  const [isListening, setIsListening] = useState(false)

  // Voice handlers
  const handleVoiceTranscript = async (transcript: string) => {
    setVoiceTranscript(transcript)
    
    // Process voice command
    const command = processVoiceCommand(transcript)
    console.log('Voice command:', command)
    
    try {
      const result = await executeVoiceCommand(command)
      console.log('Command result:', result)
      
      // Set response for voice synthesis
      if (!result.error && (result.content || result.summary)) {
        setLastNexusResponse(result.content || result.summary || 'Command completed')
      } else if (result.error) {
        setLastNexusResponse(`Sorry, I had trouble with that command: ${result.error}`)
      }
    } catch (error) {
      console.error('Voice command error:', error)
      setLastNexusResponse('Sorry, I had trouble processing that command.')
    }
  }

  // Render component
  return (
    <ErrorBoundary>
      <div className="j-root">
        {/* Main Content Area */}
        <div className="j-main" style={{ minHeight: '100vh', overflowY: 'auto' }}>
          
          {/* Navigation */}
          <div className="j-nav">
            <div className="nav-left">
              <button 
                onClick={() => setActiveView('diary')}
                className={`nav-btn ${activeView === 'diary' ? 'active' : ''}`}
              >
                <Brain className="w-4 h-4" />
                Diary
              </button>
              <button 
                onClick={() => setActiveView('patterns')}
                className={`nav-btn ${activeView === 'patterns' ? 'active' : ''}`}
              >
                <TrendingUp className="w-4 h-4" />
                Patterns
              </button>
              <button 
                onClick={() => setActiveView('future')}
                className={`nav-btn ${activeView === 'future' ? 'active' : ''}`}
              >
                <Target className="w-4 h-4" />
                Future Self
              </button>
            </div>
            <div className="nav-right">
              <AIProviderSelector 
                selected={selectedAIProvider}
                onSelect={setSelectedAIProvider}
              />
              
              {/* Voice Controls */}
              <div className="flex gap-2 items-center">
                <VoiceInput 
                  onTranscript={handleVoiceTranscript}
                  onListeningChange={setIsListening}
                  placeholder="Speak to Nexus..."
                />
                {lastNexusResponse && (
                  <VoiceNexus text={lastNexusResponse} />
                )}
              </div>
            </div>
          </div>

          {/* View Content */}
          {activeView === 'diary' && <NexusDiary />}
          
          {activeView === 'patterns' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Decision Patterns</h2>
              <DecisionPatterns />
            </div>
          )}
          
          {activeView === 'future' && <RealFutureSelf />}
        </div>

        {/* Side Components */}
        <NexusChessDock />
        <CognitiveInsights />
        <NexusFeed />
      </div>
    </ErrorBoundary>
  )
}
