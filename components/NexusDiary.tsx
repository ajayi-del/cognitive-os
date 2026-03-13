'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Brain, Save, X, CheckCircle } from 'lucide-react'

interface Note {
  id: string
  content: string
  createdAt: string
  updatedAt: string
}

export default function NexusDiary() {
  const [content, setContent] = useState('')
  const [showSaved, setShowSaved] = useState(false)
  const [showError, setShowError] = useState(false)

  // Query recent notes
  const { data: notes = [], refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await fetch('/api/captures')
      if (!response.ok) throw new Error('Failed to fetch notes')
      return response.json() as Promise<Note[]>
    },
    refetchInterval: 30000
  })

  // Mutation for saving notes
  const saveNote = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch('/api/captures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      if (!response.ok) throw new Error('Failed to save note')
      return response.json()
    },
    onSuccess: () => {
      setContent('')
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 3000)
      refetch()
      
      // Show acknowledgment
      setTimeout(() => {
        setShowSaved(false)
      }, 3000)
    },
    onError: () => {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    
    saveNote.mutate(content.trim())
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Nexus Diary</h1>
        </div>
        <p className="text-gray-400">Your thoughts are the umbilical cord to your intelligence.</p>
      </div>

      {/* Capture Form */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts freely. Every note is heard..."
              className="w-full h-32 p-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all resize-none"
              disabled={saveNote.isPending}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showSaved && (
                <div className="flex items-center gap-2 text-green-400 animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Your thoughts are heard.</span>
                </div>
              )}
              {showError && (
                <div className="flex items-center gap-2 text-red-400 animate-fade-in">
                  <X className="w-4 h-4" />
                  <span className="text-sm">✗ RETRY</span>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!content.trim() || saveNote.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {saveNote.isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saveNote.isPending ? 'Saving...' : 'Save Thought'}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Notes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Thoughts</h2>
        {notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Your diary is empty. Start by sharing your first thought.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white/5 backdrop-blur-lg rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()} • {new Date(note.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
