'use client'

import { useState, useEffect, useRef } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  onListeningChange?: (isListening: boolean) => void
  placeholder?: string
}

export function VoiceInput({ onTranscript, onListeningChange, placeholder = "Click to speak..." }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setIsSupported(false)
      setError('Speech recognition not supported in this browser')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setInterimTranscript('')
        setError(null)
        onListeningChange?.(true)
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            finalTranscript += result[0].transcript
          } else {
            interimTranscript += result[0].transcript
          }
        }

        if (finalTranscript) {
          onTranscript(finalTranscript)
          setInterimTranscript('')
        } else {
          setInterimTranscript(interimTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        onListeningChange?.(false)
        
        // Handle specific errors
        if (event.error === 'not-allowed') {
          setError('Microphone permission denied')
          setIsSupported(false)
        } else if (event.error === 'no-speech') {
          setError('No speech detected')
        } else if (event.error === 'network') {
          setError('Network error')
        } else {
          setError(`Speech recognition error: ${event.error}`)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        onListeningChange?.(false)
      }

      recognitionRef.current = recognition
      setIsSupported(true)
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error)
      setIsSupported(false)
      setError('Failed to initialize speech recognition')
    }
  }, [onTranscript, onListeningChange])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Failed to start speech recognition:', error)
        setError('Failed to start speech recognition')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error('Failed to stop speech recognition:', error)
      }
    }
  }

  if (!isSupported) {
    return (
      <div className="flex flex-col gap-2">
        <div className="px-3 py-1 bg-red-500 text-white rounded text-sm opacity-75">
          🎤 {error || 'Voice input not supported'}
        </div>
        <div className="text-xs text-gray-500">
          Try using Chrome, Edge, or Safari with HTTPS
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button 
          onClick={isListening ? stopListening : startListening}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isListening ? '🎤 Listening...' : '🎤 Speak'}
        </button>
        
        {isListening && (
          <button 
            onClick={stopListening}
            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm font-medium"
          >
            ⏹️ Stop
          </button>
        )}
      </div>
      
      {interimTranscript && (
        <div className="text-sm text-gray-500 italic">
          Hearing: "{interimTranscript}"
        </div>
      )}
      
      {error && !isListening && (
        <div className="text-xs text-red-500">
          {error}
        </div>
      )}
      
      <div className="text-xs text-gray-400">
        {placeholder}
      </div>
    </div>
  )
}
