'use client'

import { useState, useEffect } from 'react'
import { FileText, Plus, Search, Tag, Brain, Target, Zap, Archive, Edit, Trash2 } from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  sourceType: 'text' | 'voice' | 'chat' | 'file'
  tags: string[]
  linkedProjectId?: string
  archived: boolean
  createdAt: Date
  updatedAt: Date
}

export default function NotesWorkspace() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: ''
  })

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    setIsLoading(true)
    
    // Mock data for now
    setTimeout(() => {
      setNotes([
        {
          id: '1',
          title: 'Trading System Architecture',
          content: 'Need to build modular trading engine with separate risk management, execution, and analysis modules. The system should handle multiple asset classes and timeframes.',
          sourceType: 'text',
          tags: ['trading', 'coding', 'architecture'],
          archived: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          title: 'Pattern Recognition Insights',
          content: 'Markets show repeating patterns in volatility compression before breakouts. This suggests opportunity for systematic entry strategies based on statistical edge.',
          sourceType: 'text',
          tags: ['trading', 'patterns', 'research'],
          archived: false,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
        },
        {
          id: '3',
          title: 'Cognitive Workflow Ideas',
          content: 'My current workflow is scattered across multiple tools. Need unified system for capturing thoughts, detecting patterns, and executing on insights systematically.',
          sourceType: 'text',
          tags: ['productivity', 'systems', 'personal'],
          archived: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ])
      setIsLoading(false)
    }, 1000)
  }

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      sourceType: 'text',
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setNotes(prev => [note, ...prev])
    setNewNote({ title: '', content: '', tags: '' })
    setShowCreateForm(false)
  }

  const handleArchiveNote = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, archived: true } : note
    ))
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)))
  
  const filteredNotes = notes.filter(note => {
    if (note.archived) return false
    if (searchQuery && !note.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !note.content.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (selectedTags.length > 0 && !selectedTags.some(tag => note.tags.includes(tag))) return false
    return true
  })

  const NoteCard = ({ note }: { note: Note }) => (
    <div className="cognitive-surface border border-cognitive-border rounded-lg p-6 hover:border-cognitive-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{note.title}</h3>
          <p className="cognitive-text-muted line-clamp-3">{note.content}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button className="p-2 text-cognitive-text-muted hover:text-cognitive-accent transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleArchiveNote(note.id)}
            className="p-2 text-cognitive-text-muted hover:text-cognitive-warning transition-colors"
          >
            <Archive className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleDeleteNote(note.id)}
            className="p-2 text-cognitive-text-muted hover:text-cognitive-danger transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {note.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 text-xs rounded-full bg-cognitive-accent/20 text-cognitive-accent">
              {tag}
            </span>
          ))}
        </div>
        <div className="text-xs cognitive-text-muted">
          {new Date(note.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen cognitive-bg flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 cognitive-accent animate-pulse-subtle" />
          <span className="text-white">Loading Notes Workspace...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen cognitive-bg">
      {/* Header */}
      <div className="cognitive-elevated border-b border-cognitive-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 cognitive-accent" />
              <div>
                <h1 className="text-lg font-semibold text-white">Notes Workspace</h1>
                <p className="text-xs cognitive-text-muted">Living space for your thoughts</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Note Form */}
      {showCreateForm && (
        <div className="cognitive-elevated border-b border-cognitive-border">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="cognitive-surface border border-cognitive-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Create New Note</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Note title..."
                    className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-2 text-white placeholder-cognitive-text-muted focus:outline-none focus:border-cognitive-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Content</label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Your thoughts, ideas, or brain dump..."
                    rows={6}
                    className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-3 text-white placeholder-cognitive-text-muted resize-none focus:outline-none focus:border-cognitive-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Tags</label>
                  <input
                    type="text"
                    value={newNote.tags}
                    onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="trading, coding, research (comma separated)"
                    className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-2 text-white placeholder-cognitive-text-muted focus:outline-none focus:border-cognitive-accent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 cognitive-surface border border-cognitive-border text-white rounded-lg hover:border-cognitive-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  disabled={!newNote.title.trim() || !newNote.content.trim()}
                  className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cognitive-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-cognitive-surface border border-cognitive-border rounded-lg pl-10 pr-4 py-2 text-white placeholder-cognitive-text-muted focus:outline-none focus:border-cognitive-accent"
              />
            </div>
          </div>
          
          {/* Tag Filter */}
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 cognitive-text-muted" />
            <select
              multiple
              value={selectedTags}
              onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
              className="bg-cognitive-surface border border-cognitive-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cognitive-accent"
            >
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 cognitive-accent" />
              <div>
                <div className="text-xl font-bold text-white">{filteredNotes.length}</div>
                <div className="text-xs cognitive-text-muted">Active Notes</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Tag className="w-5 h-5 cognitive-accent" />
              <div>
                <div className="text-xl font-bold text-white">{allTags.length}</div>
                <div className="text-xs cognitive-text-muted">Unique Tags</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 cognitive-accent" />
              <div>
                <div className="text-xl font-bold text-white">3</div>
                <div className="text-xs cognitive-text-muted">Idea Buckets</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 cognitive-accent" />
              <div>
                <div className="text-xl font-bold text-white">2</div>
                <div className="text-xs cognitive-text-muted">Ready for Projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <div className="cognitive-surface border border-cognitive-border rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 cognitive-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No notes found</h3>
              <p className="cognitive-text-muted mb-4">
                {searchQuery || selectedTags.length > 0 
                  ? 'Try adjusting your filters or search query'
                  : 'Start capturing your thoughts to see them here'
                }
              </p>
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors"
                >
                  Create Your First Note
                </button>
              )}
            </div>
          ) : (
            filteredNotes.map(note => <NoteCard key={note.id} note={note} />)
          )}
        </div>
      </div>
    </div>
  )
}
