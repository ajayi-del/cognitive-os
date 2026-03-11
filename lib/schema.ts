import { pgTable, uuid, text, timestamp, integer, decimal, boolean, jsonb, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  createdAt: timestamp('created_at').defaultNow(),
  preferences: jsonb('preferences').$type<{
    defaultAutonomyLevel: number;
    preferredOutputStyle: 'concise' | 'detailed' | 'strategic';
    theme: 'dark' | 'light';
    notifications: boolean;
  }>(),
});

// Notes table
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
  content: text('content').notNull(),
  rawContent: text('raw_content'),
  sourceType: text('source_type').default('text').$type<'text' | 'voice' | 'chat' | 'file'>(),
  tags: text('tags').array().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Chat messages table
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').$type<'user' | 'assistant'>().notNull(),
  content: text('content').notNull(),
  contextScope: text('context_scope').default('all').$type<'all' | 'project' | 'notes' | 'trading' | 'coding'>(),
  referencedNoteIds: uuid('referenced_note_ids').array().default([]),
  createdAt: timestamp('created_at').defaultNow(),
});

// Idea buckets table
export const ideaBuckets = pgTable('idea_buckets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  dominantThemes: text('dominant_themes').array().default([]),
  noteCount: integer('note_count').default(0),
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }).default('0'),
  frequencyTrend: text('frequency_trend').default('stable').$type<'increasing' | 'stable' | 'decreasing'>(),
  status: text('status').default('active').$type<'active' | 'archived' | 'promoted'>(),
  suggestedProject: boolean('suggested_project').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').default('planning').$type<'planning' | 'active' | 'paused' | 'completed'>(),
  priority: text('priority').default('medium').$type<'high' | 'medium' | 'low'>(),
  category: text('category').$type<'coding' | 'trading' | 'research' | 'personal'>(),
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }).default('0'),
  linkedBucketId: uuid('linked_bucket_id').references(() => ideaBuckets.id),
  linkedNoteIds: uuid('linked_note_ids').array().default([]),
  linkedChatIds: uuid('linked_chat_ids').array().default([]),
  blockers: text('blockers').array().default([]),
  executionMode: text('execution_mode').default('manual').$type<'manual' | 'assisted' | 'autonomous'>(),
  createdAt: timestamp('created_at').defaultNow(),
  lastTouched: timestamp('last_touched').defaultNow(),
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('pending').$type<'pending' | 'in_progress' | 'completed'>(),
  priority: text('priority').default('medium').$type<'high' | 'medium' | 'low'>(),
  workflowType: text('workflow_type').$type<'coding' | 'trading' | 'research' | 'general'>(),
  estimatedMinutes: integer('estimated_minutes'),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// Feedback events table
export const feedbackEvents = pgTable('feedback_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  contentType: text('content_type').$type<'note_summary' | 'bucket_grouping' | 'task_generation' | 'chat_response'>(),
  contentId: uuid('content_id'),
  feedbackType: text('feedback_type').$type<'thumbs_up' | 'thumbs_down' | 'wrong_bucket' | 'good_grouping' | 'too_generic' | 'too_long'>(),
  feedbackValue: text('feedback_value'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Daily briefings table
export const dailyBriefings = pgTable('daily_briefings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  briefingDate: text('briefing_date').unique(),
  topPriorities: text('top_priorities').array().default([]),
  activeProjects: text('active_projects').array().default([]),
  recurringThemes: text('recurring_themes').array().default([]),
  strategicDirection: text('strategic_direction'),
  whatToIgnore: text('what_to_ignore').array().default([]),
  nextActions: text('next_actions').array().default([]),
  createdAt: timestamp('created_at').defaultNow(),
});

// Workflow runs table
export const workflowRuns = pgTable('workflow_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  workflowType: text('workflow_type').$type<'cluster_notes' | 'generate_briefing' | 'create_tasks' | 'analyze_trades' | 'process_voice'>(),
  inputData: jsonb('input_data'),
  outputData: jsonb('output_data'),
  status: text('status').default('pending').$type<'pending' | 'running' | 'completed' | 'failed'>(),
  autonomyLevel: integer('autonomy_level').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// ==========================================
// BIOLOGICAL LAYER - Cognitive OS Core
// ==========================================

// Captures table with biological fields
export const captures = pgTable('captures', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  // Core capture data
  sourceType: text('source_type').$type<'text_note' | 'voice_note' | 'pasted_link' | 'screenshot' | 'chat_saved' | 'file_upload'>().notNull(),
  rawContent: text('raw_content').notNull(),
  
  // Processing state
  processedStatus: text('processed_status').default('unprocessed').$type<'unprocessed' | 'classified' | 'routed' | 'archived'>(),
  suggestedRoute: text('suggested_route').default('idea_bucket').$type<'idea_bucket' | 'project' | 'action_queue' | 'memory_library' | 'research_queue' | 'archived'>(),
  
  // Biological Layer: Metabolic Routing (like ATP in cells)
  energyLevel: real('energy_level').default(50), // 0-100 ATP
  lastFed: timestamp('last_fed').defaultNow(),
  
  // Biological Layer: Circadian Rhythm (lifecycle stages)
  lifecycleStage: text('lifecycle_stage').default('seed').$type<'seed' | 'sprout' | 'growth' | 'harvest' | 'decay'>(),
  stageProgress: real('stage_progress').default(0), // 0-100 progress within stage
  
  // Biological Layer: Tenacity Training (resilience)
  resilienceScore: real('resilience_score').default(10), // 0-100 battle-tested strength
  challengeCount: integer('challenge_count').default(0), // How many challenges survived
  
  // Biological Layer: Mycelial Network (cross-idea connections)
  relatedCaptureIds: uuid('related_capture_ids').array().default([]),
  connectionStrength: jsonb('connection_strength').$type<Record<string, number>>(),
  
  // Metadata
  metadata: jsonb('metadata').$type<{
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    duration?: number;
    transcript?: string;
  }>(),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Curiosity Signals table (tracks behavioral patterns)
export const curiositySignals = pgTable('curiosity_signals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  topic: text('topic').notNull(),
  frequency: integer('frequency').default(1),
  intensity: real('intensity').default(20), // 0-100
  source: text('source').$type<'click' | 'capture' | 'search' | 'focus'>().notNull(),
  
  firstEngaged: timestamp('first_engaged').defaultNow(),
  lastEngaged: timestamp('last_engaged').defaultNow(),
  
  isEmerging: boolean('is_emerging').default(false),
  suggestedProject: boolean('suggested_project').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// System Vitals table (tracks homeostatic state)
export const systemVitals = pgTable('system_vitals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  totalCaptures: integer('total_captures').default(0),
  unprocessedCaptures: integer('unprocessed_captures').default(0),
  avgEnergyLevel: real('avg_energy_level').default(50),
  
  seedCount: integer('seed_count').default(0),
  sproutCount: integer('sprout_count').default(0),
  growthCount: integer('growth_count').default(0),
  harvestCount: integer('harvest_count').default(0),
  decayCount: integer('decay_count').default(0),
  
  battleTestedCount: integer('battle_tested_count').default(0),
  
  systemStatus: text('system_status').default('homeostasis').$type<'homeostasis' | 'overload' | 'digestion_needed' | 'high_energy' | 'hibernation'>(),
  lastIntervention: text('last_intervention'),
  interventionTriggeredAt: timestamp('intervention_triggered_at'),
  
  recordedAt: timestamp('recorded_at').defaultNow(),
});

// Focus Sessions table with energy transfer tracking
export const focusSessions = pgTable('focus_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  mode: text('mode').$type<'deep_work' | 'pomodoro' | 'companion'>().notNull(),
  title: text('title').notNull(),
  
  linkedActionId: uuid('linked_action_id'),
  linkedCaptureId: uuid('linked_capture_id'),
  
  durationMinutes: integer('duration_minutes').notNull(),
  breakMinutes: integer('break_minutes').default(5),
  startedAt: timestamp('started_at'),
  endedAt: timestamp('ended_at'),
  
  status: text('status').default('idle').$type<'idle' | 'running' | 'paused' | 'break' | 'completed' | 'cancelled'>(),
  completedCycles: integer('completed_cycles').default(0),
  
  result: text('result').$type<'completed' | 'made_progress' | 'got_distracted'>(),
  notes: text('notes'),
  
  energyFedToCapture: real('energy_fed_to_capture').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// Goals table (Primary/Secondary alignment)
export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  isPrimary: boolean('is_primary').default(false),
  weight: real('weight').default(0.5),
  createdAt: timestamp('created_at').defaultNow(),
});

// Drift Signals (Alignment tracking)
export const driftSignals = pgTable('drift_signals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  
  primaryGoal: text('primary_goal'),
  recentTopics: text('recent_topics').array().default([]),
  alignmentScore: real('alignment_score').default(62),
  driftLevel: text('drift_level').default('mild_drift').$type<'aligned' | 'mild_drift' | 'moderate_drift' | 'strong_drift'>(),
  
  recordedAt: timestamp('recorded_at').defaultNow(),
});

// ==========================================
// RELATIONS (Updated with biological layer)
// ==========================================
export const usersRelations = relations(users, ({ many }) => ({
  captures: many(captures),
  notes: many(notes),
  chatMessages: many(chatMessages),
  ideaBuckets: many(ideaBuckets),
  projects: many(projects),
  tasks: many(tasks),
  goals: many(goals),
  curiositySignals: many(curiositySignals),
  systemVitals: many(systemVitals),
  focusSessions: many(focusSessions),
  driftSignals: many(driftSignals),
  feedbackEvents: many(feedbackEvents),
  dailyBriefings: many(dailyBriefings),
  workflowRuns: many(workflowRuns),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, { fields: [notes.userId], references: [users.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
}));

export const ideaBucketsRelations = relations(ideaBuckets, ({ one, many }) => ({
  user: one(users, { fields: [ideaBuckets.userId], references: [users.id] }),
  linkedProjects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  linkedBucket: one(ideaBuckets, { fields: [projects.linkedBucketId], references: [ideaBuckets.id] }),
  linkedNotes: many(notes),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
}));

export const feedbackEventsRelations = relations(feedbackEvents, ({ one }) => ({
  user: one(users, { fields: [feedbackEvents.userId], references: [users.id] }),
}));

export const dailyBriefingsRelations = relations(dailyBriefings, ({ one }) => ({
  user: one(users, { fields: [dailyBriefings.userId], references: [users.id] }),
}));

export const workflowRunsRelations = relations(workflowRuns, ({ one }) => ({
  user: one(users, { fields: [workflowRuns.userId], references: [users.id] }),
}));

// Biological Layer Relations
export const capturesRelations = relations(captures, ({ one, many }) => ({
  user: one(users, { fields: [captures.userId], references: [users.id] }),
  notes: many(notes),
  focusSessions: many(focusSessions),
}));

export const curiositySignalsRelations = relations(curiositySignals, ({ one }) => ({
  user: one(users, { fields: [curiositySignals.userId], references: [users.id] }),
}));

export const systemVitalsRelations = relations(systemVitals, ({ one }) => ({
  user: one(users, { fields: [systemVitals.userId], references: [users.id] }),
}));

export const focusSessionsRelations = relations(focusSessions, ({ one }) => ({
  user: one(users, { fields: [focusSessions.userId], references: [users.id] }),
  capture: one(captures, { fields: [focusSessions.linkedCaptureId], references: [captures.id] }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, { fields: [goals.userId], references: [users.id] }),
}));

export const driftSignalsRelations = relations(driftSignals, ({ one }) => ({
  user: one(users, { fields: [driftSignals.userId], references: [users.id] }),
}));

// Types for inserts
export type NewUser = typeof users.$inferInsert;
export type NewNote = typeof notes.$inferInsert;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type NewIdeaBucket = typeof ideaBuckets.$inferInsert;
export type NewProject = typeof projects.$inferInsert;
export type NewTask = typeof tasks.$inferInsert;
export type NewFeedbackEvent = typeof feedbackEvents.$inferInsert;
export type NewDailyBriefing = typeof dailyBriefings.$inferInsert;
export type NewWorkflowRun = typeof workflowRuns.$inferInsert;

// Biological Layer Types
export type NewCapture = typeof captures.$inferInsert;
export type NewCuriositySignal = typeof curiositySignals.$inferInsert;
export type NewSystemVitals = typeof systemVitals.$inferInsert;
export type NewFocusSession = typeof focusSessions.$inferInsert;
export type NewGoal = typeof goals.$inferInsert;
export type NewDriftSignal = typeof driftSignals.$inferInsert;
