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
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setInterimTranscript('')
        onListeningChange?.(true)
      }

      recognition.onresult = (event: any) => {
        let finalTranscript = ''
        let interim = ''

        try {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interim += transcript
            }
          }

          setInterimTranscript(interim)
          
          if (finalTranscript) {
            onTranscript(finalTranscript)
          }
        } catch (error) {
          console.error('Speech recognition result error:', error)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        onListeningChange?.(false)
      }

      recognition.onend = () => {
        setIsListening(false)
        setInterimTranscript('')
        onListeningChange?.(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript, onListeningChange])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  if (!isSupported) {
    return (
      <div className="px-3 py-1 bg-gray-500 text-white rounded text-sm opacity-50">
        🎤 Voice input not supported
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
      
      {!isListening && !interimTranscript && (
        <div className="text-sm text-gray-400">
          {placeholder}
        </div>
      )}
    </div>
  )
}
