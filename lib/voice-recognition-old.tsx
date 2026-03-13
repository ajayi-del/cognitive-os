// VOICE RECOGNITION SYSTEM
// Speech-to-text integration for Nexus and all components

'use client'

import { useState, useEffect, useRef } from 'react'

export interface VoiceRecognitionState {
  isListening: boolean
  isSupported: boolean
  transcript: string
  interimTranscript: string
  error: string | null
}

export function useVoiceRecognition() {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    isSupported: false,
    transcript: '',
    interimTranscript: '',
    error: null
  })

  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setState(prev => ({ ...prev, isSupported: false, error: 'Speech recognition not supported' }))
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    // Configure recognition
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 1

    // Event handlers
    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }))
    }

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }))
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = finalTranscriptRef.current

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript

        if (result.isFinal) {
          finalTranscript += transcript + ' '
          finalTranscriptRef.current = finalTranscript
        } else {
          interimTranscript += transcript
        }
      }

      setState(prev => ({
        ...prev,
        transcript: finalTranscript,
        interimTranscript
      }))
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setState(prev => ({
        ...prev,
        isListening: false,
        error: `Speech recognition error: ${event.error}`
      }))
    }

    setState(prev => ({ ...prev, isSupported: true }))

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !state.isListening) {
      finalTranscriptRef.current = ''
      setState(prev => ({ ...prev, transcript: '', interimTranscript: '', error: null }))
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop()
    }
  }

  const resetTranscript = () => {
    finalTranscriptRef.current = ''
    setState(prev => ({ ...prev, transcript: '', interimTranscript: '', error: null }))
  }

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript
  }
}

// VOICE INPUT COMPONENT
interface VoiceInputProps {
  onTranscript: (text: string) => void
  placeholder?: string
  buttonStyle?: React.CSSProperties
  showInterim?: boolean
}

export function VoiceInput({ 
  onTranscript, 
  placeholder = "Click to speak...", 
  buttonStyle,
  showInterim = true 
}: VoiceInputProps) {
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript
  } = useVoiceRecognition()

  const handleClick = () => {
    if (isListening) {
      stopListening()
      if (transcript) {
        onTranscript(transcript.trim())
        resetTranscript()
      }
    } else {
      startListening()
    }
  }

  const displayText = isListening 
    ? (showInterim ? interimTranscript : transcript) || "Listening..."
    : transcript || placeholder

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Voice Input Button */}
      <button
        onClick={handleClick}
        disabled={!isSupported}
        style={{
          background: isListening 
            ? 'rgba(239, 68, 68, 0.2)' 
            : isSupported 
              ? 'rgba(59, 130, 246, 0.2)' 
              : 'rgba(107, 114, 128, 0.2)',
          border: isListening 
            ? '1px solid rgba(239, 68, 68, 0.3)' 
            : isSupported 
              ? '1px solid rgba(59, 130, 246, 0.3)' 
              : '1px solid rgba(107, 114, 128, 0.3)',
          borderRadius: '8px',
          padding: '12px 16px',
          color: isSupported ? '#fff' : '#64748b',
          fontSize: '14px',
          cursor: isSupported ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
          ...buttonStyle,
        }}
      >
        {/* Microphone Icon */}
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: isListening ? '#ef4444' : isSupported ? '#3b82f6' : '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: isListening ? 'pulse 1.5s infinite' : 'none',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#fff',
          }} />
        </div>
        
        {isListening ? 'Stop Recording' : 'Start Voice Input'}
        
        {/* Status indicator */}
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isListening ? '#ef4444' : '#10b981',
        }} />
      </button>

      {/* Display transcript */}
      {(transcript || interimTranscript) && (
        <div style={{
          padding: '8px 12px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#fff',
          minHeight: '40px',
        }}>
          {displayText}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div style={{
          padding: '8px 12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#ef4444',
        }}>
          {error}
        </div>
      )}

      {/* Support warning */}
      {!isSupported && (
        <div style={{
          padding: '8px 12px',
          background: 'rgba(107, 114, 128, 0.1)',
          border: '1px solid rgba(107, 114, 128, 0.2)',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#64748b',
        }}>
          Speech recognition not supported in this browser. Try Chrome or Edge.
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

// VOICE-ENABLED TEXTAREA COMPONENT
interface VoiceTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showVoiceButton?: boolean
  rows?: number
}

export function VoiceTextarea({ 
  value, 
  onChange, 
  placeholder, 
  showVoiceButton = true,
  rows = 4 
}: VoiceTextareaProps) {
  const handleVoiceTranscript = (transcript: string) => {
    onChange(value + (value ? ' ' : '') + transcript)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(80, 160, 255, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          color: '#fff',
          fontSize: '14px',
          resize: 'vertical',
          outline: 'none',
        }}
      />
      
      {showVoiceButton && (
        <VoiceInput
          onTranscript={handleVoiceTranscript}
          placeholder="Add voice input..."
          buttonStyle={{
            alignSelf: 'flex-start',
          }}
        />
      )}
    </div>
  )
}
