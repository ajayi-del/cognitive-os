// UNIFIED DATA SOURCE - SINGLE SOURCE OF TRUTH
// All data pulls from notes or AI, no messy system controls

export interface DataSource {
  type: 'notes' | 'ai' | 'user_input'
  id: string
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface UnifiedNote {
  id: string
  content: string
  createdAt: Date
  updatedAt: Date
  tags: string[]
  source: 'manual' | 'ai_generated' | 'voice' | 'file'
  processed: boolean
  category: 'idea' | 'task' | 'memory' | 'project' | 'insight'
}

export interface UnifiedProject {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'archived'
  createdAt: Date
  updatedAt: Date
  notes: string[] // Note IDs
  tasks: string[] // Task IDs
  progress: number
}

export interface UnifiedTask {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
  projectId?: string
  noteId?: string
}

// Single data store - replaces all messy system controls
class UnifiedDataStore {
  private notes: Map<string, UnifiedNote> = new Map()
  private projects: Map<string, UnifiedProject> = new Map()
  private tasks: Map<string, UnifiedTask> = new Map()
  private listeners: Set<() => void> = new Set()

  // Subscribe to changes
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Notify listeners
  private notify() {
    this.listeners.forEach(listener => listener())
  }

  // Notes management
  addNote(content: string, source: UnifiedNote['source'] = 'manual', tags: string[] = []): string {
    const id = Date.now().toString()
    const note: UnifiedNote = {
      id,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags,
      source,
      processed: false,
      category: this.categorizeContent(content)
    }
    
    this.notes.set(id, note)
    this.notify()
    return id
  }

  updateNote(id: string, updates: Partial<UnifiedNote>): boolean {
    const note = this.notes.get(id)
    if (!note) return false
    
    this.notes.set(id, { ...note, ...updates, updatedAt: new Date() })
    this.notify()
    return true
  }

  deleteNote(id: string): boolean {
    const result = this.notes.delete(id)
    if (result) this.notify()
    return result
  }

  getNotes(category?: UnifiedNote['category']): UnifiedNote[] {
    const notes = Array.from(this.notes.values())
    return category ? notes.filter(n => n.category === category) : notes
  }

  getNote(id: string): UnifiedNote | undefined {
    return this.notes.get(id)
  }

  // Projects management
  addProject(name: string, description: string): string {
    const id = Date.now().toString()
    const project: UnifiedProject = {
      id,
      name,
      description,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      notes: [],
      tasks: [],
      progress: 0
    }
    
    this.projects.set(id, project)
    this.notify()
    return id
  }

  updateProject(id: string, updates: Partial<UnifiedProject>): boolean {
    const project = this.projects.get(id)
    if (!project) return false
    
    this.projects.set(id, { ...project, ...updates, updatedAt: new Date() })
    this.notify()
    return true
  }

  getProjects(): UnifiedProject[] {
    return Array.from(this.projects.values())
  }

  getProject(id: string): UnifiedProject | undefined {
    return this.projects.get(id)
  }

  // Tasks management
  addTask(title: string, description: string, priority: UnifiedTask['priority'] = 'medium'): string {
    const id = Date.now().toString()
    const task: UnifiedTask = {
      id,
      title,
      description,
      status: 'pending',
      priority,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    this.tasks.set(id, task)
    this.notify()
    return id
  }

  updateTask(id: string, updates: Partial<UnifiedTask>): boolean {
    const task = this.tasks.get(id)
    if (!task) return false
    
    this.tasks.set(id, { ...task, ...updates, updatedAt: new Date() })
    this.notify()
    return true
  }

  getTasks(projectId?: string): UnifiedTask[] {
    const tasks = Array.from(this.tasks.values())
    return projectId ? tasks.filter(t => t.projectId === projectId) : tasks
  }

  getTask(id: string): UnifiedTask | undefined {
    return this.tasks.get(id)
  }

  // AI-powered categorization
  private categorizeContent(content: string): UnifiedNote['category'] {
    const lower = content.toLowerCase()
    
    // Simple rule-based categorization
    if (lower.includes('task') || lower.includes('todo') || lower.includes('need to')) {
      return 'task'
    } else if (lower.includes('project') || lower.includes('build') || lower.includes('develop')) {
      return 'project'
    } else if (lower.includes('remember') || lower.includes('memory') || lower.includes('recall')) {
      return 'memory'
    } else if (lower.includes('idea') || lower.includes('think') || lower.includes('maybe')) {
      return 'idea'
    } else {
      return 'insight'
    }
  }

  // Search functionality
  search(query: string): { notes: UnifiedNote[], projects: UnifiedProject[], tasks: UnifiedTask[] } {
    const lowerQuery = query.toLowerCase()
    
    const notes = this.getNotes().filter(note => 
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    
    const projects = this.getProjects().filter(project =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.description.toLowerCase().includes(lowerQuery)
    )
    
    const tasks = this.getTasks().filter(task =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery)
    )
    
    return { notes, projects, tasks }
  }

  // Get statistics
  getStats() {
    return {
      totalNotes: this.notes.size,
      totalProjects: this.projects.size,
      totalTasks: this.tasks.size,
      activeProjects: this.getProjects().filter(p => p.status === 'active').length,
      pendingTasks: this.getTasks().filter(t => t.status === 'pending').length,
      completedTasks: this.getTasks().filter(t => t.status === 'completed').length
    }
  }
}

// Global instance - single source of truth
export const dataStore = new UnifiedDataStore()

// React hook for using the data store
export function useUnifiedDataStore() {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)
  
  React.useEffect(() => {
    const unsubscribe = dataStore.subscribe(() => forceUpdate())
    return unsubscribe
  }, [])
  
  return {
    // Notes
    addNote: dataStore.addNote.bind(dataStore),
    updateNote: dataStore.updateNote.bind(dataStore),
    deleteNote: dataStore.deleteNote.bind(dataStore),
    getNotes: dataStore.getNotes.bind(dataStore),
    getNote: dataStore.getNote.bind(dataStore),
    
    // Projects
    addProject: dataStore.addProject.bind(dataStore),
    updateProject: dataStore.updateProject.bind(dataStore),
    getProjects: dataStore.getProjects.bind(dataStore),
    getProject: dataStore.getProject.bind(dataStore),
    
    // Tasks
    addTask: dataStore.addTask.bind(dataStore),
    updateTask: dataStore.updateTask.bind(dataStore),
    getTasks: dataStore.getTasks.bind(dataStore),
    getTask: dataStore.getTask.bind(dataStore),
    
    // Utilities
    search: dataStore.search.bind(dataStore),
    getStats: dataStore.getStats.bind(dataStore)
  }
}

// Import React for the hook
import React from 'react'
