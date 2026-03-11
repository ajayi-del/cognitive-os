'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, Image, TrendingUp, Brain, Zap, AlertTriangle, CheckCircle, X, Camera, FileText, BarChart3, PieChart } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  type: 'image' | 'chart' | 'document'
  url: string
  analysis?: FileAnalysis
  timestamp: Date
}

interface FileAnalysis {
  summary: string
  patterns: string[]
  insights: string[]
  recommendations: string[]
  confidence: number
  tradingSignals?: TradingSignal[]
}

interface TradingSignal {
  type: 'buy' | 'sell' | 'hold'
  strength: number
  reason: string
  timeframe: string
  confidence: number
}

interface Pattern {
  name: string
  description: string
  frequency: number
  accuracy: number
  lastSeen: Date
}

export default function ImageAnalysisAI() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [learnedPatterns, setLearnedPatterns] = useState<Pattern[]>([])
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load learned patterns from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('learned-patterns')
    if (saved) {
      setLearnedPatterns(JSON.parse(saved))
    }
  }, [])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    files.forEach(file => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const content = e.target?.result as string
        const fileType = determineFileType(file.name, file.type)
        
        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(),
          name: file.name,
          type: fileType,
          url: content,
          timestamp: new Date()
        }
        
        setUploadedFiles(prev => [uploadedFile, ...prev])
        analyzeFile(uploadedFile)
      }
      
      reader.readAsDataURL(file)
    })
  }, [])

  const determineFileType = (name: string, mimeType: string): 'image' | 'chart' | 'document' => {
    if (mimeType.startsWith('image/')) return 'image'
    if (name.toLowerCase().includes('chart') || name.toLowerCase().includes('graph') || 
        name.toLowerCase().includes('plot') || name.toLowerCase().includes('trading')) return 'chart'
    return 'document'
  }

  const analyzeFile = async (file: UploadedFile) => {
    setIsAnalyzing(true)
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const analysis = generateAnalysis(file)
    
    setUploadedFiles(prev => 
      prev.map(f => f.id === file.id ? { ...f, analysis } : f)
    )
    
    // Update learned patterns
    updateLearnedPatterns(analysis.patterns)
    
    setIsAnalyzing(false)
  }

  const generateAnalysis = (file: UploadedFile): FileAnalysis => {
    const patterns = generatePatterns(file.type)
    const tradingSignals = file.type === 'chart' ? generateTradingSignals() : undefined
    
    return {
      summary: `Analyzed ${file.type}: ${file.name}. Detected ${patterns.length} patterns and ${tradingSignals?.length || 0} trading signals.`,
      patterns,
      insights: [
        'Strong upward momentum detected',
        'Volume confirmation present',
        'RSI indicates overbought condition',
        'Support level holding at key resistance'
      ],
      recommendations: [
        'Consider taking partial profits',
        'Set stop-loss below recent low',
        'Monitor for breakout confirmation',
        'Watch volume for continuation'
      ],
      confidence: 0.87,
      tradingSignals
    }
  }

  const generatePatterns = (fileType: string): string[] => {
    const basePatterns = ['Ascending Triangle', 'Double Bottom', 'Head and Shoulders', 'Cup and Handle']
    const imagePatterns = ['Color Psychology Impact', 'Visual Hierarchy', 'Composition Balance']
    const documentPatterns = ['Risk Management', 'Strategy Alignment', 'Performance Metrics']
    
    switch (fileType) {
      case 'image':
        return [...basePatterns.slice(0, 2), ...imagePatterns]
      case 'chart':
        return basePatterns
      case 'document':
        return [...basePatterns.slice(2), ...documentPatterns]
      default:
        return basePatterns.slice(0, 2)
    }
  }

  const generateTradingSignals = (): TradingSignal[] => {
    return [
      {
        type: 'buy',
        strength: 0.8,
        reason: 'Breakout above resistance with volume confirmation',
        timeframe: '4H',
        confidence: 0.92
      },
      {
        type: 'hold',
        strength: 0.6,
        reason: 'Waiting for confirmation of trend reversal',
        timeframe: '1D',
        confidence: 0.75
      },
      {
        type: 'sell',
        strength: 0.4,
        reason: 'Overbought conditions with divergence',
        timeframe: '1H',
        confidence: 0.68
      }
    ]
  }

  const updateLearnedPatterns = (newPatterns: string[]) => {
    setLearnedPatterns(prev => {
      const updated = [...prev]
      
      newPatterns.forEach(pattern => {
        const existing = updated.find(p => p.name === pattern)
        if (existing) {
          existing.frequency += 1
          existing.lastSeen = new Date()
          existing.accuracy = Math.min(0.95, existing.accuracy + 0.02)
        } else {
          updated.push({
            name: pattern,
            description: `Learned pattern: ${pattern}`,
            frequency: 1,
            accuracy: 0.75,
            lastSeen: new Date()
          })
        }
      })
      
      // Sort by frequency and accuracy
      updated.sort((a, b) => (b.frequency * b.accuracy) - (a.frequency * a.accuracy))
      
      // Save to localStorage
      localStorage.setItem('learned-patterns', JSON.stringify(updated))
      
      return updated.slice(0, 20) // Keep top 20 patterns
    })
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />
      case 'chart': return <BarChart3 className="w-4 h-4" />
      case 'document': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'buy': return 'text-green-400 bg-green-500/20 border-green-500/50'
      case 'sell': return 'text-red-400 bg-red-500/20 border-red-500/50'
      case 'hold': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50'
    }
  }

  return (
    <div className="fixed bottom-4 left-4 w-96 max-h-[600px] bg-gray-900/95 backdrop-blur-lg 
                  border border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
                          flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-display text-lg text-white">Visual AI</div>
              <div className="text-xs text-gray-400">Pattern Recognition Engine</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isAnalyzing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'
            }`} />
            <span className="text-xs text-gray-400">
              {isAnalyzing ? 'Analyzing' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-gray-400">
              {learnedPatterns.length} patterns learned
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-3 h-3 text-green-400" />
            <span className="text-gray-400">
              {uploadedFiles.length} files analyzed
            </span>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="p-4 border-b border-gray-700">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.txt,.csv"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg 
                   hover:border-purple-500 transition-colors disabled:opacity-50 
                   disabled:cursor-not-allowed group"
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-purple-400 transition-colors" />
            <div className="text-center">
              <div className="text-sm text-gray-300 group-hover:text-white transition-colors">
                Upload Images, Charts & Documents
              </div>
              <div className="text-xs text-gray-500">
                AI will analyze patterns and trading signals
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Learned Patterns */}
      {learnedPatterns.length > 0 && (
        <div className="p-4 border-b border-gray-700 max-h-32 overflow-y-auto">
          <h4 className="font-alternate ui-text mb-2">Learned Patterns</h4>
          <div className="space-y-1">
            {learnedPatterns.slice(0, 5).map((pattern, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-300">{pattern.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">
                    {pattern.frequency}x
                  </span>
                  <span className="text-green-400">
                    {Math.round(pattern.accuracy * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {uploadedFiles.length === 0 ? (
          <div className="text-center py-8">
            <Camera className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              Upload files to start pattern recognition
            </p>
          </div>
        ) : (
          uploadedFiles.map(file => (
            <div key={file.id} 
                 className="p-3 bg-gray-800 border border-gray-700 rounded-lg 
                          hover:border-purple-500/50 transition-all cursor-pointer"
                 onClick={() => setSelectedFile(file)}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.name} className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white truncate">
                      {file.name}
                    </span>
                    {file.analysis && (
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  
                  {file.analysis ? (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-300">
                        {file.analysis.summary}
                      </p>
                      
                      {file.analysis.tradingSignals && (
                        <div className="flex flex-wrap gap-1">
                          {file.analysis.tradingSignals.slice(0, 3).map((signal, index) => (
                            <div key={index} 
                                 className={`px-2 py-1 rounded text-xs border ${getSignalColor(signal.type)}`}>
                              {signal.type.toUpperCase()}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {file.analysis.patterns.length} patterns
                        </span>
                        <span className="text-purple-400">
                          {Math.round(file.analysis.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-xs text-gray-400">Analyzing...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected File Detail Modal */}
      {selectedFile && selectedFile.analysis && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg text-white">Analysis Results</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedFile.type === 'image' && (
                <img src={selectedFile.url} alt={selectedFile.name} 
                     className="w-full h-48 object-cover rounded-lg" />
              )}
              
              <div>
                <h4 className="font-alternate ui-text mb-2">Summary</h4>
                <p className="text-sm text-gray-300">
                  {selectedFile.analysis.summary}
                </p>
              </div>
              
              <div>
                <h4 className="font-alternate ui-text mb-2">Detected Patterns</h4>
                <div className="space-y-1">
                  {selectedFile.analysis.patterns.map((pattern, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-sm text-gray-300">{pattern}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedFile.analysis.tradingSignals && (
                <div>
                  <h4 className="font-alternate ui-text mb-2">Trading Signals</h4>
                  <div className="space-y-2">
                    {selectedFile.analysis.tradingSignals.map((signal, index) => (
                      <div key={index} 
                           className={`p-2 rounded border ${getSignalColor(signal.type)}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm uppercase">{signal.type}</span>
                          <span className="text-xs">
                            {Math.round(signal.confidence * 100)}% confidence
                          </span>
                        </div>
                        <p className="text-xs">{signal.reason}</p>
                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span>Strength: {Math.round(signal.strength * 100)}%</span>
                          <span>{signal.timeframe}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-alternate ui-text mb-2">Recommendations</h4>
                <div className="space-y-1">
                  {selectedFile.analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-xs text-gray-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
