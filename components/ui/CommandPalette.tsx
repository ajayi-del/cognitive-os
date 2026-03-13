'use client'

import { useState, useEffect, useRef } from 'react'
import { Command, Search, Terminal, Zap, FileText, MessageSquare, Settings, Brain } from 'lucide-react'

interface Command {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  action: () => void
  keywords?: string[]
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = [
    {
      id: 'new-note',
      name: 'New Note',
      description: 'Create a new note',
      icon: <FileText className="w-4 h-4" />,
      keywords: ['note', 'create', 'new'],
      action: () => {
        console.log('Creating new note...')
        setIsOpen(false)
      }
    },
    {
      id: 'open-chat',
      name: 'Open Chat',
      description: 'Open AI chat interface',
      icon: <MessageSquare className="w-4 h-4" />,
      keywords: ['chat', 'ai', 'talk'],
      action: () => {
        console.log('Opening chat...')
        setIsOpen(false)
      }
    },
    {
      id: 'system-status',
      name: 'System Status',
      description: 'Check system health and AI status',
      icon: <Brain className="w-4 h-4" />,
      keywords: ['status', 'health', 'system'],
      action: () => {
        console.log('Checking system status...')
        setIsOpen(false)
      }
    },
    {
      id: 'settings',
      name: 'Settings',
      description: 'Open application settings',
      icon: <Settings className="w-4 h-4" />,
      keywords: ['settings', 'config', 'preferences'],
      action: () => {
        console.log('Opening settings...')
        setIsOpen(false)
      }
    },
    {
      id: 'terminal',
      name: 'Terminal',
      description: 'Open developer terminal',
      icon: <Terminal className="w-4 h-4" />,
      keywords: ['terminal', 'dev', 'console'],
      action: () => {
        console.log('Opening terminal...')
        setIsOpen(false)
      }
    }
  ]

  const filteredCommands = commands.filter(cmd => 
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase()) ||
    cmd.keywords?.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        return
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false)
        return
      }

      // Arrow navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
        } else if (e.key === 'Enter') {
          e.preventDefault()
          filteredCommands[selectedIndex]?.action()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, search, selectedIndex, filteredCommands.length])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setSelectedIndex(0)
      setSearch('')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          {/* Command List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Terminal className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm mt-2">Try searching for a different term</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => command.action()}
                    className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors ${
                      index === selectedIndex 
                        ? 'bg-purple-600/20 text-purple-300 border-r-2 border-purple-500' 
                        : 'hover:bg-gray-800 text-gray-300 border-r-2 border-transparent'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {command.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{command.name}</div>
                      <div className="text-sm text-gray-500">{command.description}</div>
                    </div>
                    {index === selectedIndex && (
                      <div className="flex-shrink-0">
                        <Zap className="w-4 h-4 text-purple-400" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span>↑↓ Navigate</span>
                <span>↵ Execute</span>
                <span>ESC Close</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">⌘K</kbd>
                <span>to open</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
