// NOTE SYNC & PERSISTENCE SYSTEM
// Ensures all notes are saved and retrieved properly

'use client'

import { useState, useEffect } from 'react'

export interface Note {
  id: string
  content: string
  title: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  source: 'manual' | 'voice' | 'file' | 'drag_drop'
  category: 'note' | 'diary' | 'memory' | 'idea' | 'task'
  metadata?: Record<string, any>
}

export interface FileDrop {
  id: string
  name: string
  content: string
  type: string
  size: number
  droppedAt: Date
  processed: boolean
}

class NotePersistenceManager {
  private readonly STORAGE_KEYS = {
    notes: 'cognitive_os_notes',
    files: 'cognitive_os_files',
    settings: 'cognitive_os_settings'
  }

  // Save notes to localStorage
  saveNotes(notes: Note[]): void {
    try {
      const notesToSave = notes.map(note => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString()
      }))
      localStorage.setItem(this.STORAGE_KEYS.notes, JSON.stringify(notesToSave))
    } catch (error) {
      console.error('Failed to save notes:', error)
    }
  }

  // Load notes from localStorage
  loadNotes(): Note[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.notes)
      if (!saved) return []

      const parsed = JSON.parse(saved)
      return parsed.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }))
    } catch (error) {
      console.error('Failed to load notes:', error)
      return []
    }
  }

  // Save dropped files
  saveFiles(files: FileDrop[]): void {
    try {
      const filesToSave = files.map(file => ({
        ...file,
        droppedAt: file.droppedAt.toISOString()
      }))
      localStorage.setItem(this.STORAGE_KEYS.files, JSON.stringify(filesToSave))
    } catch (error) {
      console.error('Failed to save files:', error)
    }
  }

  // Load dropped files
  loadFiles(): FileDrop[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.files)
      if (!saved) return []

      const parsed = JSON.parse(saved)
      return parsed.map((file: any) => ({
        ...file,
        droppedAt: new Date(file.droppedAt)
      }))
    } catch (error) {
      console.error('Failed to load files:', error)
      return []
    }
  }

  // Add a new note
  addNote(content: string, title: string = '', category: Note['category'] = 'note', source: Note['source'] = 'manual'): Note {
    const notes = this.loadNotes()
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      title: title || this.extractTitle(content),
      tags: this.extractTags(content),
      createdAt: new Date(),
      updatedAt: new Date(),
      source,
      category
    }

    notes.push(newNote)
    this.saveNotes(notes)
    return newNote
  }

  // Update a note
  updateNote(id: string, updates: Partial<Note>): boolean {
    const notes = this.loadNotes()
    const index = notes.findIndex(note => note.id === id)
    
    if (index === -1) return false

    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: new Date()
    }

    this.saveNotes(notes)
    return true
  }

  // Delete a note
  deleteNote(id: string): boolean {
    const notes = this.loadNotes()
    const filteredNotes = notes.filter(note => note.id !== id)
    
    if (filteredNotes.length === notes.length) return false

    this.saveNotes(filteredNotes)
    return true
  }

  // Process dropped file
  processDroppedFile(file: File): FileDrop {
    const fileDrop: FileDrop = {
      id: Date.now().toString(),
      name: file.name,
      content: '', // Will be filled by file reader
      type: file.type,
      size: file.size,
      droppedAt: new Date(),
      processed: false
    }

    // Read file content
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      
      // Update file drop with content
      const files = this.loadFiles()
      const index = files.findIndex(f => f.id === fileDrop.id)
      
      if (index !== -1) {
        files[index] = {
          ...files[index],
          content,
          processed: true
        }
        this.saveFiles(files)

        // Also create a note from the file content
        this.addNote(content, file.name, 'memory', 'drag_drop')
      }
    }

    reader.readAsText(file)

    // Save initial file drop
    const files = this.loadFiles()
    files.push(fileDrop)
    this.saveFiles(files)

    return fileDrop
  }

  // Get all notes
  getAllNotes(): Note[] {
    return this.loadNotes()
  }

  // Get notes by category
  getNotesByCategory(category: Note['category']): Note[] {
    return this.loadNotes().filter(note => note.category === category)
  }

  // Search notes
  searchNotes(query: string): Note[] {
    const notes = this.loadNotes()
    const lowerQuery = query.toLowerCase()
    
    return notes.filter(note => 
      note.content.toLowerCase().includes(lowerQuery) ||
      note.title.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  // Get statistics
  getStats() {
    const notes = this.loadNotes()
    const files = this.loadFiles()
    
    return {
      totalNotes: notes.length,
      totalFiles: files.length,
      notesByCategory: notes.reduce((acc, note) => {
        acc[note.category] = (acc[note.category] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      notesBySource: notes.reduce((acc, note) => {
        acc[note.source] = (acc[note.source] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      recentNotes: notes.filter(note => 
        new Date().getTime() - note.updatedAt.getTime() < 7 * 24 * 60 * 60 * 1000
      ).length
    }
  }

  // Extract title from content
  private extractTitle(content: string): string {
    const lines = content.split('\n')
    const firstLine = lines[0]?.trim()
    
    if (firstLine && firstLine.length < 100) {
      return firstLine
    }
    
    return content.substring(0, 50) + (content.length > 50 ? '...' : '')
  }

  // Extract tags from content
  private extractTags(content: string): string[] {
    const tagRegex = /#(\w+)/g
    const matches = content.match(tagRegex)
    return matches ? matches.map(tag => tag.substring(1)) : []
  }

  // Export all data
  exportData() {
    return {
      notes: this.loadNotes(),
      files: this.loadFiles(),
      exportedAt: new Date().toISOString()
    }
  }

  // Import data
  importData(data: { notes: Note[], files: FileDrop[] }) {
    this.saveNotes(data.notes)
    this.saveFiles(data.files)
  }

  // Clear all data
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEYS.notes)
    localStorage.removeItem(this.STORAGE_KEYS.files)
  }
}

// Global persistence manager instance
export const noteManager = new NotePersistenceManager()

// React hook for using note persistence
export function useNotePersistence() {
  const [notes, setNotes] = useState<Note[]>([])
  const [files, setFiles] = useState<FileDrop[]>([])

  useEffect(() => {
    // Load initial data
    setNotes(noteManager.getAllNotes())
    setFiles(noteManager.loadFiles())
  }, [])

  const addNote = (content: string, title?: string, category?: Note['category'], source?: Note['source']) => {
    const newNote = noteManager.addNote(content, title, category, source)
    setNotes(prev => [...prev, newNote])
    return newNote
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    const success = noteManager.updateNote(id, updates)
    if (success) {
      setNotes(prev => prev.map(note => 
        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
      ))
    }
    return success
  }

  const deleteNote = (id: string) => {
    const success = noteManager.deleteNote(id)
    if (success) {
      setNotes(prev => prev.filter(note => note.id !== id))
    }
    return success
  }

  const processDroppedFile = (file: File) => {
    const fileDrop = noteManager.processDroppedFile(file)
    setFiles(prev => [...prev, fileDrop])
    return fileDrop
  }

  const searchNotes = (query: string) => {
    return noteManager.searchNotes(query)
  }

  const getStats = () => {
    return noteManager.getStats()
  }

  return {
    notes,
    files,
    addNote,
    updateNote,
    deleteNote,
    processDroppedFile,
    searchNotes,
    getStats,
    getAllNotes: noteManager.getAllNotes.bind(noteManager),
    getNotesByCategory: noteManager.getNotesByCategory.bind(noteManager)
  }
}
