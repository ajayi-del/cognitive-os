import { pgTable, uuid, text, timestamp, integer, decimal, boolean, jsonb, pgVector } from 'drizzle-orm/pg-core';
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
  }>().default({}),
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
  embedding: pgVector('embedding', { dimensions: 1536 }),
  linkedProjectId: uuid('linked_project_id').references(() => projects.id),
  archived: boolean('archived').default(false),
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
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }).default(0),
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
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }).default(0),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
  chatMessages: many(chatMessages),
  ideaBuckets: many(ideaBuckets),
  projects: many(projects),
  tasks: many(tasks),
  feedbackEvents: many(feedbackEvents),
  dailyBriefings: many(dailyBriefings),
  workflowRuns: many(workflowRuns),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, { fields: [notes.userId], references: [users.id] }),
  linkedProject: one(projects, { fields: [notes.linkedProjectId], references: [projects.id] }),
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
