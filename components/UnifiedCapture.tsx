'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, StopCircle, Play, Trash2, Upload, X, Image as ImageIcon, FileText } from 'lucide-react'

export interface VoiceRecording {
  id: string
  blob: Blob
  url: string
  duration: number
  timestamp: Date
  transcript?: string
}

export interface UploadedFile {
  id: string
  file: File
  type: 'image' | 'voice' | 'file'
  previewUrl?: string
  timestamp: Date
}

interface UnifiedCaptureProps {
  onCapture: (content: string, type: 'text' | 'voice' | 'image' | 'file', metadata?: any) => void
}

export function UnifiedCapture({ onCapture }: UnifiedCaptureProps) {
  // Renamed to Diary but keeping component name for compatibility
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'image'>('text')
  const [textInput, setTextInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [recordings, setRecordings] = useState<VoiceRecording[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [lastSyncedContent, setLastSyncedContent] = useState('')
  const [showSyncIndicator, setShowSyncIndicator] = useState(false)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [isSaving, setIsSaving] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 2-minute auto-sync for text input
  useEffect(() => {
    const interval = setInterval(async () => {
      // Only sync if content has changed and is non-empty
      if (textInput.trim() && textInput !== lastSyncedContent) {
        try {
          await fetch('/api/captures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: textInput })
          })
          setLastSyncedContent(textInput)
          // Show subtle sync indicator
          setShowSyncIndicator(true)
          setTimeout(() => setShowSyncIndicator(false), 2000)
        } catch { /* silent fail */ }
      }
    }, 2 * 60 * 1000) // 2 minutes
    
    return () => clearInterval(interval)
  }, [textInput, lastSyncedContent])

  // Voice Recording Functions
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        const recording: VoiceRecording = {
          id: Date.now().toString(),
          blob,
          url,
          duration: recordingDuration,
          timestamp: new Date()
        }
        
        setRecordings(prev => [recording, ...prev])
        setRecordingDuration(0)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
        
        // Trigger capture
        onCapture(`Voice recording (${Math.round(recording.duration)}s)`, 'voice', { 
          recordingId: recording.id,
          duration: recording.duration,
          blob: recording.blob
        })
      }
      
      mediaRecorder.start(100)
      setIsRecording(true)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please ensure you have granted permission.')
    }
  }, [onCapture, recordingDuration])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const deleteRecording = useCallback((id: string) => {
    setRecordings(prev => {
      const recording = prev.find(r => r.id === id)
      if (recording) {
        URL.revokeObjectURL(recording.url)
      }
      return prev.filter(r => r.id !== id)
    })
  }, [])

  // File Upload Functions
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return
    
    Array.from(files).forEach(file => {
      const type = file.type.startsWith('image/') ? 'image' : 
                   file.type.startsWith('audio/') ? 'voice' : 'file'
      
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        type,
        previewUrl: type === 'image' ? URL.createObjectURL(file) : undefined,
        timestamp: new Date()
      }
      
      setUploadedFiles(prev => [uploadedFile, ...prev])
      
      onCapture(
        type === 'image' ? `Image: ${file.name}` : `File: ${file.name}`,
        type,
        { 
          fileId: uploadedFile.id,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          file: file
        }
      )
    })
  }, [onCapture])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const deleteFile = useCallback((id: string) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl)
      }
      return prev.filter(f => f.id !== id)
    })
  }, [])

  // Text submission - hardened with error handling
  const submitText = useCallback(async () => {
    if (!textInput.trim() || isSaving) return
    
    setIsSaving(true)
    setSaveState('saving')
    
    try {
      const res = await fetch('/api/captures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: textInput })
      })
      
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)
      
      setTextInput('')
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
      
      // Call the original onCapture if provided
      onCapture(textInput, 'text')
      
    } catch (err) {
      setSaveState('error')
      console.error('[capture save]', err)
      // DO NOT clear text on error - user can retry
    } finally {
      setIsSaving(false)
    }
  }, [textInput, onCapture, isSaving])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="unified-capture">
      {/* Tab Switcher */}
      <div className="capture-tabs">
        <button 
          className={activeTab === 'text' ? 'active' : ''}
          onClick={() => setActiveTab('text')}
        >
          <FileText className="w-4 h-4" />
          Text
        </button>
        <button 
          className={activeTab === 'voice' ? 'active' : ''}
          onClick={() => setActiveTab('voice')}
        >
          <Mic className="w-4 h-4" />
          Voice
        </button>
        <button 
          className={activeTab === 'image' ? 'active' : ''}
          onClick={() => setActiveTab('image')}
        >
          <ImageIcon className="w-4 h-4" />
          Image/File
        </button>
      </div>

      {/* Text Capture */}
      {activeTab === 'text' && (
        <motion.div 
          className="capture-panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ position: 'relative' }}>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Drop your thought here... This feeds Nexus directly."
              className="capture-textarea"
              rows={4}
            />
            {/* Auto-sync indicator */}
            {showSyncIndicator && (
              <div style={{
                position: 'absolute', top: '8px', right: '8px',
                fontSize: '10px', color: '#00d880', fontFamily: 'monospace',
                background: 'rgba(0,216,128,0.1)', padding: '2px 6px', borderRadius: '3px'
              }}>
                ● synced
              </div>
            )}
            
            {/* Save state indicators */}
            {saveState === 'saved' && (
              <div style={{
                position: 'absolute', bottom: '8px', right: '8px',
                fontSize: '9px', fontFamily: 'monospace',
                color: '#00d880', letterSpacing: '1px'
              }}>
                ✓ SAVED
              </div>
            )}
            {saveState === 'error' && (
              <div style={{
                position: 'absolute', bottom: '8px', right: '8px',
                fontSize: '9px', fontFamily: 'monospace',
                color: '#ff3850', letterSpacing: '1px', cursor: 'pointer'
              }} onClick={submitText}>
                ✗ RETRY
              </div>
            )}
            {saveState === 'saving' && (
              <div style={{
                position: 'absolute', bottom: '8px', right: '8px',
                fontSize: '9px', fontFamily: 'monospace',
                color: '#f09020', letterSpacing: '1px'
              }}>
                ● SAVING
              </div>
            )}
          </div>
          <div className="capture-actions">
            <span className="hint">Press Enter to save to Diary</span>
            <button 
              className="capture-submit"
              onClick={submitText}
              disabled={!textInput.trim()}
            >
              <Upload className="w-4 h-4" />
              Save to Diary
            </button>
          </div>
        </motion.div>
      )}

      {/* Voice Capture */}
      {activeTab === 'voice' && (
        <motion.div 
          className="capture-panel voice-panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {!isRecording ? (
            <button 
              className="voice-record-btn"
              onClick={startRecording}
            >
              <Mic className="w-8 h-8" />
              <span>Tap to Record</span>
            </button>
          ) : (
            <div className="voice-recording">
              <div className="recording-indicator">
                <div className="pulse-ring" />
                <StopCircle className="w-8 h-8" />
              </div>
              <span className="recording-time">{formatDuration(recordingDuration)}</span>
              <button 
                className="stop-btn"
                onClick={stopRecording}
              >
                Stop Recording
              </button>
            </div>
          )}

          {/* Recordings List */}
          {recordings.length > 0 && (
            <div className="recordings-list">
              <h4>Recent Recordings</h4>
              {recordings.map(recording => (
                <div key={recording.id} className="recording-item">
                  <audio src={recording.url} controls className="audio-player" />
                  <span className="duration">{formatDuration(recording.duration)}</span>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteRecording(recording.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Image/File Capture */}
      {activeTab === 'image' && (
        <motion.div 
          className="capture-panel"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div 
            className={`drop-zone ${isDragging ? 'dragging' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8" />
            <p>Drop images or files here</p>
            <span>or click to browse</span>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt,.mp3,.wav,.webm"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              {uploadedFiles.map(file => (
                <div key={file.id} className="file-item">
                  {file.type === 'image' && file.previewUrl ? (
                    <img src={file.previewUrl} alt={file.file.name} />
                  ) : (
                    <div className="file-icon">
                      {file.type === 'voice' ? <Mic className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                    </div>
                  )}
                  <span className="file-name">{file.file.name}</span>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
