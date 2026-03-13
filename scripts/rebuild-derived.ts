#!/usr/bin/env tsx

/**
 * NEXUS COGNITIVE OS - DERIVED DATA REBUILD SCRIPT
 * 
 * This script completely regenerates all derived interpretation layer data
 * from the canonical event layer (Note, Action, Feedback).
 * 
 * Usage: npx tsx scripts/rebuild-derived.ts
 * 
 * WARNING: This will DELETE all derived data and rebuild from scratch!
 */

import { prisma } from '../lib/prisma'

async function rebuildDerivedData() {
  console.log('🔄 NEXUS: Rebuilding derived data from canonical events...')
  
  try {
    // Step 1: Clear all derived data
    console.log('🗑️  Clearing derived tables...')
    await prisma.nexusMessage.deleteMany({})
    await prisma.seedPattern.deleteMany({})
    await prisma.project.deleteMany({})
    await prisma.task.deleteMany()
    
    // Step 2: Fetch canonical events
    console.log('📖 Reading canonical events...')
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    const actions = await prisma.action.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    console.log(`📊 Found ${notes.length} notes, ${actions.length} actions, ${feedback.length} feedback entries`)
    
    // Step 3: Rebuild SeedPatterns from notes
    console.log('🌱 Rebuilding seed patterns...')
    const patterns = rebuildSeedPatterns(notes)
    
    // Step 4: Generate initial Nexus messages
    console.log('📢 Generating initial Nexus messages...')
    const messages = rebuildNexusMessages(notes, patterns, actions, feedback)
    
    // Step 5: Create projects from strong patterns
    console.log('📦 Creating projects from patterns...')
    const projects = rebuildProjects(patterns, notes)
    
    // Step 6: Generate tasks from projects
    console.log('✅ Generating tasks...')
    const tasks = rebuildTasks(projects, actions)
    
    // Step 7: Save all rebuilt data
    console.log('💾 Saving rebuilt data...')
    
    if (patterns.length > 0) {
      await prisma.seedPattern.createMany({
        data: patterns
      })
    }
    
    if (messages.length > 0) {
      await prisma.nexusMessage.createMany({
        data: messages
      })
    }
    
    if (projects.length > 0) {
      await prisma.project.createMany({
        data: projects
      })
    }
    
    if (tasks.length > 0) {
      await prisma.task.createMany({
        data: tasks
      })
    }
    
    console.log('✅ NEXUS: Derived data rebuild complete!')
    console.log(`📈 Created ${patterns.length} patterns, ${messages.length} messages, ${projects.length} projects, ${tasks.length} tasks`)
    
  } catch (error) {
    console.error('❌ NEXUS: Rebuild failed:', error)
    process.exit(1)
  }
}

function rebuildSeedPatterns(notes: any[]): any[] {
  // Simple pattern detection based on recurring themes
  const themes = new Map<string, any[]>()
  
  notes.forEach(note => {
    const words = note.content.toLowerCase().split(/\s+/)
    words.forEach(word => {
      if (word.length > 4) { // Ignore short words
        if (!themes.has(word)) {
          themes.set(word, [])
        }
        themes.get(word)!.push(note.id)
      }
    })
  })
  
  const patterns = []
  let id = 1
  
  for (const [theme, noteIds] of themes.entries()) {
    if (noteIds.length >= 3) { // Only create pattern if theme appears 3+ times
      patterns.push({
        id: `pattern-${id++}`,
        theme,
        keywords: JSON.stringify([theme]),
        captureIds: JSON.stringify(noteIds),
        occurrences: noteIds.length,
        status: 'watching',
        confidence: Math.min(noteIds.length * 0.15, 0.9)
      })
    }
  }
  
  return patterns
}

function rebuildNexusMessages(notes: any[], patterns: any[], actions: any[], feedback: any[]): any[] {
  const messages = []
  
  // System initialization message
  messages.push({
    id: 'msg-init',
    type: 'briefing',
    priority: 5,
    title: 'Nexus System Initialized',
    content: JSON.stringify({
      summary: `Nexus cognitive system has been rebuilt from ${notes.length} canonical events.`,
      canonicalCount: { notes: notes.length, actions: actions.length, feedback: feedback.length },
      derivedCount: { patterns: patterns.length, messages: 1 }
    }),
    isRead: false,
    requiresAction: false,
    relatedIds: JSON.stringify([])
  })
  
  return messages
}

function rebuildProjects(patterns: any[], notes: any[]): any[] {
  const projects = []
  
  // Create projects from strong patterns (5+ occurrences)
  const strongPatterns = patterns.filter(p => p.occurrences >= 5)
  
  strongPatterns.forEach((pattern, index) => {
    projects.push({
      id: `project-${index + 1}`,
      title: `Project: ${pattern.theme}`,
      description: `Automatically generated project based on recurring theme: ${pattern.theme}`,
      status: 'active',
      originPattern: pattern.theme,
      captureIds: pattern.captureIds
    })
  })
  
  return projects
}

function rebuildTasks(projects: any[], actions: any[]): any[] {
  const tasks = []
  
  projects.forEach((project, index) => {
    // Generate 2-3 starter tasks per project
    for (let i = 1; i <= 3; i++) {
      tasks.push({
        id: `task-${index}-${i}`,
        projectId: project.id,
        description: `Task ${i} for ${project.title}`,
        completed: false
      })
    }
  })
  
  return tasks
}

// Run the rebuild
if (require.main === module) {
  rebuildDerivedData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
