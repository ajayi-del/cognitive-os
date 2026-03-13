// APPLE-OPTIMIZED VOICE RECOGNITION
// Best practices for Apple devices (iOS, macOS, Safari)

'use client'

import { useState, useEffect, useRef } from 'react'

export interface AppleVoiceState {
  isListening: boolean
  isSupported: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  platform: 'ios' | 'macos' | 'other'
  voiceName: string
}

export function useAppleVoiceRecognition() {
  const [state, setState] = useState<AppleVoiceState>({
    isListening: false,
    isSupported: false,
    transcript: '',
    interimTranscript: '',
    error: null,
    platform: 'other',
    voiceName: ''
  })

  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    // Detect Apple platform
    const isApple = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    const isIOS = /iPhone|iPad|iPod/.test(navigator.platform)
    const isMacOS = /Mac/.test(navigator.platform)
    
    const platform = isIOS ? 'ios' : isMacOS ? 'macos' : 'other'

    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setState(prev => ({ 
        ...prev, 
        isSupported: false, 
        platform,
        error: 'Speech recognition not supported on this device' 
      }))
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    // Apple-specific configuration
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    
    // Apple device optimization
    if (platform === 'ios') {
      recognition.lang = 'en-US'
      recognition.serviceURI = 'https://www.google.com/speech-api/v2/recognize'
    } else if (platform === 'macos') {
      recognition.lang = 'en-US'
    } else {
      recognition.lang = 'en-US'
    }

    // Event handlers
    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }))
      console.log(`Voice recognition started on ${platform}`)
    }

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }))
      console.log(`Voice recognition ended on ${platform}`)
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
      console.error(`Speech recognition error on ${platform}:`, event.error)
      
      let errorMessage = `Speech recognition error: ${event.error}`
      
      // Apple-specific error handling
      if (platform === 'ios') {
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please speak clearly and try again.'
            break
          case 'audio-capture':
            errorMessage = 'Microphone access denied. Please allow microphone access in Settings.'
            break
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please enable microphone access.'
            break
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.'
            break
        }
      } else if (platform === 'macos') {
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try speaking more clearly.'
            break
          case 'audio-capture':
            errorMessage = 'Cannot access microphone. Check System Preferences > Security & Privacy > Microphone.'
            break
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Grant access in System Preferences.'
            break
        }
      }

      setState(prev => ({
        ...prev,
        isListening: false,
        error: errorMessage
      }))
    }

    // Get available voices for TTS
    if ('speechSynthesis' in window) {
      const voices = speechSynthesis.getVoices()
      const appleVoices = voices.filter(voice => 
        voice.name.includes('Samantha') || 
        voice.name.includes('Karen') ||
        voice.name.includes('Alex') ||
        voice.name.includes('Victoria') ||
        voice.lang.startsWith('en')
      )
      
      const preferredVoice = appleVoices[0] || voices[0]
      
      setState(prev => ({
        ...prev,
        isSupported: true,
        platform,
        voiceName: preferredVoice?.name || 'Default'
      }))
    } else {
      setState(prev => ({
        ...prev,
        isSupported: true,
        platform
      }))
    }

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
      
      // Apple-specific start
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Failed to start recognition:', error)
        setState(prev => ({
          ...prev,
          error: 'Failed to start voice recognition. Please try again.'
        }))
      }
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

// APPLE-OPTIMIZED VOICE INPUT COMPONENT
interface AppleVoiceInputProps {
  onTranscript: (text: string) => void
  placeholder?: string
  platform?: 'ios' | 'macos' | 'other'
}

export function AppleVoiceInput({ 
  onTranscript, 
  placeholder = "Tap to speak...",
  platform = 'other' 
}: AppleVoiceInputProps) {
  const {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    error,
    voiceName,
    startListening,
    stopListening,
    resetTranscript
  } = useAppleVoiceRecognition()

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
    ? interimTranscript || transcript || "Listening..."
    : transcript || placeholder

  // Apple-specific styling
  const getAppleStyle = () => {
    if (platform === 'ios') {
      return {
        background: isListening 
          ? 'linear-gradient(135deg, #ff3b30, #ff2d55)' 
          : 'linear-gradient(135deg, #007aff, #5856d6)',
        border: 'none',
        borderRadius: '24px',
        padding: '16px 24px',
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: isListening 
          ? '0 8px 32px rgba(255, 59, 48, 0.3)' 
          : '0 4px 16px rgba(0, 122, 255, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isListening ? 'scale(1.05)' : 'scale(1)',
      }
    } else if (platform === 'macos') {
      return {
        background: isListening 
          ? 'linear-gradient(135deg, #ff3b30, #ff2d55)' 
          : 'linear-gradient(135deg, #007aff, #5856d6)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '12px 20px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        backdropFilter: 'blur(20px)',
        boxShadow: isListening 
          ? '0 8px 32px rgba(255, 59, 48, 0.3)' 
          : '0 4px 16px rgba(0, 122, 255, 0.2)',
        transition: 'all 0.2s ease',
      }
    } else {
      return {
        background: isListening 
          ? 'rgba(239, 68, 68, 0.2)' 
          : 'rgba(59, 130, 246, 0.2)',
        border: isListening 
          ? '1px solid rgba(239, 68, 68, 0.3)' 
          : '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '8px',
        padding: '12px 16px',
        color: '#fff',
        fontSize: '14px',
        cursor: 'pointer',
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Voice Input Button */}
      <button
        onClick={handleClick}
        disabled={!isSupported}
        style={getAppleStyle()}
      >
        {/* Apple-style microphone icon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: platform === 'ios' ? '20px' : '16px',
            height: platform === 'ios' ? '20px' : '16px',
            borderRadius: '50%',
            background: isListening ? '#fff' : 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isListening ? 'applePulse 1.5s infinite' : 'none',
          }}>
            <div style={{
              width: platform === 'ios' ? '8px' : '6px',
              height: platform === 'ios' ? '8px' : '6px',
              borderRadius: '50%',
              background: isListening ? '#ff3b30' : '#007aff',
            }} />
          </div>
          
          {isListening ? 'Stop Recording' : 'Start Voice Input'}
        </div>
      </button>

      {/* Display transcript */}
      {(transcript || interimTranscript) && (
        <div style={{
          padding: '12px 16px',
          background: platform === 'ios' 
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(59, 130, 246, 0.1)',
          border: platform === 'ios'
            ? '1px solid rgba(255, 255, 255, 0.2)'
            : '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: platform === 'ios' ? '12px' : '8px',
          fontSize: '14px',
          color: '#fff',
          minHeight: '44px', // Apple touch target size
          backdropFilter: platform === 'macos' ? 'blur(20px)' : 'none',
        }}>
          {displayText}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(255, 59, 48, 0.1)',
          border: '1px solid rgba(255, 59, 48, 0.2)',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#ff3b30',
        }}>
          {error}
        </div>
      )}

      {/* Platform info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          padding: '8px 12px',
          background: 'rgba(120, 120, 128, 0.1)',
          border: '1px solid rgba(120, 120, 128, 0.2)',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#8e8e93',
        }}>
          Platform: {platform} • Voice: {voiceName} • {isSupported ? 'Supported' : 'Not Supported'}
        </div>
      )}

      <style jsx>{`
        @keyframes applePulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.6; 
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  )
}
