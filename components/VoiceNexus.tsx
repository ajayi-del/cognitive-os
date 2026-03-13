'use client'

import { useState, useEffect } from 'react'

interface VoiceNexusProps {
  text: string
  autoSpeak?: boolean
}

export function VoiceNexus({ text, autoSpeak = false }: VoiceNexusProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if speech synthesis is supported
    setIsSupported('speechSynthesis' in window)
  }, [])

  useEffect(() => {
    // Auto-speak if enabled and text changes
    if (autoSpeak && text && isSupported && !isSpeaking) {
      speak()
    }
  }, [text, autoSpeak, isSupported])

  const speak = () => {
    if (!isSupported || !text) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Configure Nexus voice characteristics
    utterance.rate = 0.9      // Slightly slower for clarity
    utterance.pitch = 0.8     // Deeper, more authoritative
    utterance.volume = 0.8    // Comfortable volume
    
    // Try to use a more natural voice if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Alex') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Karen') ||
      voice.name.includes('Google')
    )
    
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  if (!isSupported) {
    return (
      <div className="px-3 py-1 bg-gray-500 text-white rounded text-sm opacity-50">
        🔇 Voice not supported
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={speak}
        disabled={isSpeaking || !text}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          isSpeaking 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50'
        }`}
      >
        {isSpeaking ? '🔊 Speaking...' : '🔊 Speak'}
      </button>
      
      {isSpeaking && (
        <button 
          onClick={stop}
          className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium"
        >
          ⏹️ Stop
        </button>
      )}
    </div>
  )
}
