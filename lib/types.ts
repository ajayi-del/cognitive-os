// Nexus Cognitive OS - Centralized Type Definitions
// This file contains all shared types used across the application

// ─── Canonical Event Types (Immutable) ──────────────────────────────────────
export interface Note {
  id: string
  title?: string
  content: string
  userId?: string
  atpScore?: number
  createdAt: Date
  updatedAt: Date
}

export interface Action {
  id: string
  description: string
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: Date
  completedAt?: Date
}

export interface Feedback {
  id: string
  actionId: string
  outcome: 'success' | 'failure' | 'neutral'
  notes?: string
  createdAt: Date
}

// ─── Derived Types (Rebuildable) ───────────────────────────────────────────
export interface NexusMessage {
  id: string
  type: 'briefing' | 'insight' | 'drift' | 'fix-proposal' | 'project-proposal' | 'mutation-proposal'
  priority: number // 1=low, 5=critical
  title: string
  content: string // JSON string
  isRead: boolean
  requiresAction: boolean
  actionTaken?: 'approved' | 'rejected' | 'dismissed' | null
  actionTakenAt?: Date
  relatedIds: string // JSON array
  createdAt: Date
  updatedAt: Date
}

export interface SeedPattern {
  id: string
  theme: string
  keywords: string // JSON array
  captureIds: string // JSON array
  occurrences: number
  firstSeenAt: Date
  lastSeenAt: Date
  status: 'watching' | 'proposed' | 'accepted' | 'snoozed' | 'dormant'
  proposedProjectId?: string
  nexusMessageId?: string
  confidence: number
}

export interface Project {
  id: string
  title: string
  description?: string
  status: 'active' | 'archived'
  originPattern?: string
  captureIds: string // JSON array
  createdAt: Date
  updatedAt: Date
}

export interface Task {
  id: string
  projectId: string
  description: string
  sourceCapture?: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
}

// ─── UI Component Types ───────────────────────────────────────────────────────
export type AIProvider = 'auto' | 'ollama' | 'deepseek' | 'gemini' | 'grok' | 'openai'

export type OrbState = 'idle' | 'unread' | 'alert' | 'thinking'

export type ViewMode = 'diary' | 'patterns'

// ─── System Health Types ───────────────────────────────────────────────────
export interface SystemHealth {
  cognitivePressure: number
  executionGap: number
  systemStability: number
  architecturalIntegrity: number
}

export interface BiologicalMetrics {
  coherence: number
  energyATP: number
  health: number
}

// ─── Legacy Support (to be removed) ───────────────────────────────────────
// These types are kept for backward compatibility but should be phased out
export interface CaptureItem {
  id: string
  source_type: string
  raw_content: string
  created_at: Date
  processed_status: string
  energy_level: number
  lifecycle_stage: string
  resilience_score: number
  related_captures: string[]
}

export interface ActionQueueItem {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed'
  created_at: Date
  linked_project_id?: string
  focus_sessions?: any[]
}
