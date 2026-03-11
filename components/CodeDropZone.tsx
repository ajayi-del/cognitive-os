'use client'

import { useState, useRef } from 'react'
import { Code, Download, Play, Check, AlertTriangle, FileText, Zap } from 'lucide-react'

interface CodeFile {
  id: string
  name: string
  content: string
  language: string
  timestamp: Date
  applied: boolean
}

export default function CodeDropZone() {
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [applyStatus, setApplyStatus] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const items = e.dataTransfer.items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.kind === 'string' && item.type === 'text/plain') {
        item.getAsString((text) => {
          addCodeFile(text, 'pasted-code')
        })
      } else if (item.kind === 'file') {
        const file = item.getAsFile()
        if (file && file.name.match(/\.(ts|tsx|js|jsx|css|json)$/)) {
          const reader = new FileReader()
          reader.onload = (e) => {
            const content = e.target?.result as string
            const language = file.name.split('.').pop() || 'text'
            addCodeFile(content, file.name, language)
          }
          reader.readAsText(file)
        }
      }
    }
  }

  // Handle paste from clipboard
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text')
    if (text) {
      addCodeFile(text, 'pasted-code')
    }
  }

  // Add code file
  const addCodeFile = (content: string, name: string, language: string = 'typescript') => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: name,
      content: content,
      language: language,
      timestamp: new Date(),
      applied: false
    }
    setCodeFiles(prev => [newFile, ...prev])
  }

  // Apply code changes
  const applyCode = async (file: CodeFile) => {
    setIsApplying(true)
    setApplyStatus(`Applying ${file.name}...`)
    
    try {
      // Simulate code application
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mark as applied
      setCodeFiles(prev => 
        prev.map(f => f.id === file.id ? { ...f, applied: true } : f)
      )
      
      setApplyStatus(`✅ Successfully applied ${file.name}`)
      
      // Store in localStorage for persistence
      const appliedCode = {
        ...file,
        appliedAt: new Date().toISOString()
      }
      const existing = JSON.parse(localStorage.getItem('applied-code') || '[]')
      localStorage.setItem('applied-code', JSON.stringify([...existing, appliedCode]))
      
      setTimeout(() => {
        setApplyStatus('')
        setIsApplying(false)
      }, 2000)
      
    } catch (error) {
      setApplyStatus(`❌ Error applying ${file.name}`)
      setIsApplying(false)
    }
  }

  // Clear all files
  const clearFiles = () => {
    setCodeFiles([])
    setApplyStatus('')
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 w-96 max-h-96 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-purple-500/30 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">Code Drop Zone</h3>
        </div>
        <button
          onClick={clearFiles}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Drop Zone */}
      <div
        className={`m-4 p-8 border-2 border-dashed rounded-lg transition-all ${
          isDragging 
            ? 'border-purple-400 bg-purple-500/10' 
            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        style={{ minHeight: '150px' }}
      >
        <div className="text-center">
          {isDragging ? (
            <div className="flex flex-col items-center space-y-2">
              <Zap className="w-8 h-8 text-purple-400 animate-pulse" />
              <p className="text-purple-300 font-medium">Drop code here!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <FileText className="w-8 h-8 text-gray-400" />
              <p className="text-gray-300">Drag & drop code here</p>
              <p className="text-gray-500 text-sm">Or paste from clipboard</p>
              <p className="text-gray-600 text-xs mt-2">Supports .ts, .tsx, .js, .jsx, .css, .json</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Message */}
      {applyStatus && (
        <div className="mx-4 p-2 rounded bg-gray-800 border border-gray-700">
          <p className="text-sm text-gray-300">{applyStatus}</p>
        </div>
      )}

      {/* Code Files List */}
      {codeFiles.length > 0 && (
        <div className="max-h-48 overflow-y-auto p-4 space-y-2">
          {codeFiles.map((file) => (
            <div
              key={file.id}
              className={`p-3 rounded-lg border transition-all ${
                file.applied 
                  ? 'bg-green-900/20 border-green-500/30' 
                  : 'bg-gray-800 border-gray-700 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  <span className="text-white font-medium text-sm">{file.name}</span>
                  {file.applied && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-400">
                    {file.language}
                  </span>
                  {!file.applied && (
                    <button
                      onClick={() => applyCode(file)}
                      disabled={isApplying}
                      className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                    >
                      {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Code Preview */}
              <div className="text-xs text-gray-400 font-mono bg-gray-900/50 p-2 rounded max-h-20 overflow-y-auto">
                {file.content.slice(0, 200)}
                {file.content.length > 200 && '...'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".ts,.tsx,.js,.jsx,.css,.json"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files
          if (files) {
            Array.from(files).forEach(file => {
              const reader = new FileReader()
              reader.onload = (e) => {
                const content = e.target?.result as string
                const language = file.name.split('.').pop() || 'text'
                addCodeFile(content, file.name, language)
              }
              reader.readAsText(file)
            })
          }
        }}
      />
    </div>
  )
}
