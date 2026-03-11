'use client'

import { useState } from 'react'
import { Brain, Code, Globe, Sparkles, Cpu, Bot, ChevronDown } from 'lucide-react'
import type { AIProvider, TaskType } from '@/lib/ai-router'

interface ProviderOption {
  value: AIProvider
  label: string
  icon: React.ReactNode
  description: string
  color: string
}

const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    value: 'auto',
    label: 'Auto Route',
    icon: <Bot className="w-4 h-4" />,
    description: 'AI selects best provider',
    color: 'text-purple-400'
  },
  {
    value: 'ollama',
    label: 'Ollama',
    icon: <Cpu className="w-4 h-4" />,
    description: 'Local, free, default',
    color: 'text-green-400'
  },
  {
    value: 'deepseek',
    label: 'DeepSeek',
    icon: <Code className="w-4 h-4" />,
    description: 'Coding & debugging',
    color: 'text-blue-400'
  },
  {
    value: 'gemini',
    label: 'Gemini',
    icon: <Brain className="w-4 h-4" />,
    description: 'Long context & memory',
    color: 'text-amber-400'
  },
  {
    value: 'grok',
    label: 'Grok',
    icon: <Globe className="w-4 h-4" />,
    description: 'External research',
    color: 'text-red-400'
  },
  {
    value: 'openai',
    label: 'OpenAI',
    icon: <Sparkles className="w-4 h-4" />,
    description: 'Strategic planning',
    color: 'text-cyan-400'
  }
]

interface AIProviderSelectorProps {
  selected: AIProvider
  onSelect: (provider: AIProvider) => void
  availableProviders?: AIProvider[]
  disabled?: boolean
}

export function AIProviderSelector({ 
  selected, 
  onSelect, 
  availableProviders = ['auto', 'ollama', 'gemini'],
  disabled = false
}: AIProviderSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = PROVIDER_OPTIONS.find(p => p.value === selected) || PROVIDER_OPTIONS[0]
  
  const availableOptions = PROVIDER_OPTIONS.filter(p => 
    availableProviders.includes(p.value) || p.value === 'auto'
  )

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-800' 
            : 'bg-gray-800 hover:bg-gray-700 cursor-pointer'
        }`}
      >
        <span className={selectedOption.color}>{selectedOption.icon}</span>
        <span className="text-gray-200">{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
            {availableOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors ${
                  selected === option.value ? 'bg-gray-800/50' : ''
                }`}
              >
                <span className={option.color}>{option.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-200">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// AI Response Metadata Component
interface AIMetadataProps {
  provider: AIProvider
  model: string
  reason: string
  taskType?: TaskType
  confidence?: number
  biological?: {
    coherence: number
    energyATP: number
    health: number
  }
}

export function AIMetadata({ 
  provider, 
  model, 
  reason, 
  taskType,
  confidence,
  biological
}: AIMetadataProps) {
  const getProviderColor = (p: AIProvider) => {
    const colors: Record<string, string> = {
      ollama: 'text-green-400',
      deepseek: 'text-blue-400',
      gemini: 'text-amber-400',
      grok: 'text-red-400',
      openai: 'text-cyan-400'
    }
    return colors[p] || 'text-gray-400'
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-800">
      <div className="flex items-center gap-1.5">
        <span className="text-gray-600">Provider:</span>
        <span className={`font-medium ${getProviderColor(provider)}`}>
          {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className="text-gray-600">Model:</span>
        <span className="font-medium text-gray-400">{model}</span>
      </div>
      
      {taskType && (
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600">Task:</span>
          <span className="font-medium text-gray-400">{taskType}</span>
        </div>
      )}
      
      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-gray-600">Reason:</span>
        <span className="font-medium text-gray-400 italic">{reason}</span>
      </div>
      
      {confidence !== undefined && (
        <div className="flex items-center gap-1.5">
          <span className="text-gray-600">Confidence:</span>
          <span className={`font-medium ${confidence > 0.8 ? 'text-green-400' : confidence > 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
            {Math.round(confidence * 100)}%
          </span>
        </div>
      )}
      
      {/* Biological Health Display */}
      {biological && (
        <div className="flex items-center gap-3 border-t border-gray-700 pt-2 mt-2 w-full">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">🧬 Coherence:</span>
            <span className={`font-medium ${biological.coherence > 80 ? 'text-green-400' : biological.coherence > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              {Math.round(biological.coherence)}%
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">⚡ Energy:</span>
            <span className={`font-medium ${biological.energyATP > 70 ? 'text-green-400' : biological.energyATP > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {Math.round(biological.energyATP)} ATP
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-gray-600">❤️ Health:</span>
            <span className={`font-medium ${biological.health > 80 ? 'text-green-400' : biological.health > 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              {Math.round(biological.health)}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Compact AI Status Indicator
interface AIStatusIndicatorProps {
  provider: AIProvider
  isLoading?: boolean
}

export function AIStatusIndicator({ provider, isLoading }: AIStatusIndicatorProps) {
  const getProviderIcon = (p: AIProvider) => {
    switch (p) {
      case 'ollama': return <Cpu className="w-3 h-3" />
      case 'deepseek': return <Code className="w-3 h-3" />
      case 'gemini': return <Brain className="w-3 h-3" />
      case 'grok': return <Globe className="w-3 h-3" />
      case 'openai': return <Sparkles className="w-3 h-3" />
      default: return <Bot className="w-3 h-3" />
    }
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      {getProviderIcon(provider)}
      <span className="capitalize">{provider}</span>
      {isLoading && (
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
          <span className="text-blue-400">thinking...</span>
        </span>
      )}
    </div>
  )
}
