import { pgTable, uuid, text, timestamp, integer, decimal, boolean, jsonb, pgVector } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Core User entity
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  preferences: jsonb('preferences').$type<{
    defaultAutonomyLevel: number;
    preferredOutputStyle: 'concise' | 'detailed' | 'strategic';
    theme: 'dark' | 'light';
    notifications: boolean;
  }>().default({}),
});

// Core memory unit - notes, transcripts, dumps
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title'),
  content: text('content').notNull(),
  sourceType: text('source_type').default('text').$type<'text' | 'voice' | 'chat' | 'file'>(),
  fileHash: text('file_hash'),
  embedding: pgVector('embedding', { dimensions: 1536 }),
  bucketId: uuid('bucket_id').references(() => ideaBuckets.id),
  projectId: uuid('project_id').references(() => projects.id),
  tags: text('tags').array().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Chat history with scope awareness
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').$type<'user' | 'assistant'>().notNull(),
  content: text('content').notNull(),
  scope: text('scope').default('all').$type<'all' | 'project' | 'notes' | 'trading' | 'coding' | 'research'>(),
  projectId: uuid('project_id').references(() => projects.id),
  tokensUsed: integer('tokens_used').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Clustered idea groups - core pattern unit
export const ideaBuckets = pgTable('idea_buckets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  signalStrength: decimal('signal_strength', { precision: 3, scale: 2 }).default(0),
  noteCount: integer('note_count').default(0),
  recurring: boolean('recurring').default(false),
  status: text('status').default('active').$type<'active' | 'archived' | 'promoted'>(),
  embedding: pgVector('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Promoted buckets - operational projects
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('planning').$type<'planning' | 'active' | 'paused' | 'completed'>(),
  priority: text('priority').default('medium').$type<'high' | 'medium' | 'low'>(),
  domain: text('domain').$type<'coding' | 'trading' | 'research' | 'personal'>(),
  momentumScore: decimal('momentum_score', { precision: 3, scale: 2 }).default(0),
  bucketId: uuid('bucket_id').references(() => ideaBuckets.id),
  nextActions: text('next_actions').array().default([]),
  blockers: text('blockers').array().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  lastTouched: timestamp('last_touched').defaultNow(),
});

// Compressed high-signal knowledge
export const knowledgeNodes = pgTable('knowledge_nodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  insightType: text('insight_type').$type<'pattern' | 'principle' | 'framework' | 'insight'>(),
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }).default(0),
  sourceClusterIds: uuid('source_cluster_ids').array().default([]),
  embedding: pgVector('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Single-row phase tracking
export const phaseStates = pgTable('phase_states', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  currentPhase: text('current_phase').$type<'exploration' | 'focus' | 'execution' | 'integration' | 'reflection'>(),
  phaseConfidence: decimal('phase_confidence', { precision: 3, scale: 2 }).default(0),
  phaseStartDate: timestamp('phase_start_date').defaultNow(),
  dominantProjectIds: uuid('dominant_project_ids').array().default([]),
  allowedActions: text('allowed_actions').array().default([]),
  restrictedActions: text('restricted_actions').array().default([]),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Desired identity model
export const futureSelfProfiles = pgTable('future_self_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  timeHorizon: text('time_horizon').$type<'3months' | '6months' | '1year' | '5years'>(),
  coreGoals: text('core_goals').array().default([]),
  activeDomains: text('active_domains').array().default([]),
  antiGoals: text('anti_goals').array().default([]),
  identityTraits: text('identity_traits').array().default([]),
  desiredSkills: text('desired_skills').array().default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Unified executable actions from all engines
export const actionQueueItems = pgTable('action_queue_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  actionType: text('action_type').$type<'create' | 'analyze' | 'research' | 'execute' | 'review'>(),
  sourceType: text('source_type').$type<'pattern' | 'drift' | 'reflection' | 'manual' | 'workflow'>(),
  priority: text('priority').default('medium').$type<'high' | 'medium' | 'low'>(),
  alignmentScore: decimal('alignment_score', { precision: 3, scale: 2 }).default(0),
  phaseFitScore: decimal('phase_fit_score', { precision: 3, scale: 2 }).default(0),
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }).default(0),
  status: text('status').default('pending').$type<'pending' | 'accepted' | 'dismissed' | 'completed'>(),
  projectId: uuid('project_id').references(() => projects.id),
  bucketId: uuid('bucket_id').references(() => ideaBuckets.id),
  createdAt: timestamp('created_at').defaultNow(),
  scheduledFor: timestamp('scheduled_for'),
  completedAt: timestamp('completed_at'),
});

// Drift detection outputs
export const driftSignals = pgTable('drift_signals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  driftType: text('drift_type').$type<'attention' | 'priority' | 'phase' | 'goal'>(),
  severity: text('severity').$type<'low' | 'medium' | 'high' | 'critical'>(),
  description: text('description').notNull(),
  dataEvidence: jsonb('data_evidence'),
  correctiveAction: text('corrective_action'),
  detectedAt: timestamp('detected_at').defaultNow(),
  resolved: boolean('resolved').default(false),
});

// Pattern Mirror outputs
export const patternReports = pgTable('pattern_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  patternType: text('pattern_type').$type<'recurring' | 'unfinished' | 'emerging' | 'declining'>(),
  title: text('title').notNull(),
  description: text('description'),
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }).default(0),
  sourceIds: uuid('source_ids').array().default([]),
  suggestedAction: text('suggested_action'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Reflection Engine synthesis
export const reflectionInsights = pgTable('reflection_insights', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  insightType: text('insight_type').$type<'strategic' | 'tactical' | 'behavioral' | 'systemic'>(),
  confidenceScore: decimal('confidence_score', { precision: 3, scale: 2 }).default(0),
  relatedPatternIds: uuid('related_pattern_ids').array().default([]),
  relatedNodeIds: uuid('related_node_ids').array().default([]),
  suggestedAction: text('suggested_action'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Workflow execution audit trail
export const workflowRuns = pgTable('workflow_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  workflowType: text('workflow_type').$type<'coding' | 'trading' | 'research' | 'summary' | 'compression'>(),
  status: text('status').default('pending').$type<'pending' | 'running' | 'completed' | 'failed'>(),
  input: jsonb('input'),
  output: jsonb('output'),
  triggeredBy: text('triggered_by').$type<'manual' | 'scheduled' | 'system'>(),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// v2 Features - Cognitive Map Nodes
export const cognitiveMapNodes = pgTable('cognitive_map_nodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  nodeType: text('node_type').$type<'note' | 'bucket' | 'project' | 'theme' | 'insight'>(),
  refId: uuid('ref_id'), // Reference to original entity
  title: text('title').notNull(),
  score: decimal('score', { precision: 3, scale: 2 }).default(0),
  frequency: integer('frequency').default(0),
  embedding: pgVector('embedding', { dimensions: 1536 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// v2 Features - Cognitive Map Edges
export const cognitiveMapEdges = pgTable('cognitive_map_edges', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  sourceId: uuid('source_id').references(() => cognitiveMapNodes.id),
  targetId: uuid('target_id').references(() => cognitiveMapNodes.id),
  edgeType: text('edge_type').$type<'similarity' | 'belonging' | 'evolution' | 'causal'>(),
  weight: decimal('weight', { precision: 3, scale: 2 }).default(0),
  explanation: text('explanation'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Every self-modification attempt
export const selfModAudits = pgTable('self_mod_audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  request: text('request').notNull(),
  plan: jsonb('plan'),
  filesAffected: text('files_affected').array().default([]),
  zone: text('zone').$type<'safe' | 'cautious' | 'dangerous'>(),
  riskLevel: text('risk_level').$type<'low' | 'medium' | 'high' | 'critical'>(),
  validationResult: text('validation_result').$type<'passed' | 'failed' | 'warning'>(),
  approved: boolean('approved').default(false),
  rollback: text('rollback'),
  branchName: text('branch_name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Human feedback for AI training loop
export const feedbackEvents = pgTable('feedback_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  eventType: text('event_type').$type<'thumbs_up' | 'thumbs_down' | 'wrong_bucket' | 'good_grouping' | 'phase_correction'>(),
  targetId: uuid('target_id'),
  targetType: text('target_type').$type<'note' | 'bucket' | 'project' | 'pattern' | 'action'>(),
  rating: integer('rating'), // 1-5 scale
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  notes: many(notes),
  chatMessages: many(chatMessages),
  ideaBuckets: many(ideaBuckets),
  projects: many(projects),
  knowledgeNodes: many(knowledgeNodes),
  phaseStates: many(phaseStates),
  futureSelfProfiles: many(futureSelfProfiles),
  actionQueueItems: many(actionQueueItems),
  driftSignals: many(driftSignals),
  patternReports: many(patternReports),
  reflectionInsights: many(reflectionInsights),
  workflowRuns: many(workflowRuns),
  cognitiveMapNodes: many(cognitiveMapNodes),
  cognitiveMapEdges: many(cognitiveMapEdges),
  selfModAudits: many(selfModAudits),
  feedbackEvents: many(feedbackEvents),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  user: one(users, { fields: [notes.userId], references: [users.id] }),
  bucket: one(ideaBuckets, { fields: [notes.bucketId], references: [ideaBuckets.id] }),
  project: one(projects, { fields: [notes.projectId], references: [projects.id] }),
}));

export const ideaBucketsRelations = relations(ideaBuckets, ({ one, many }) => ({
  user: one(users, { fields: [ideaBuckets.userId], references: [users.id] }),
  notes: many(notes),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  bucket: one(ideaBuckets, { fields: [projects.bucketId], references: [ideaBuckets.id] }),
  notes: many(notes),
  actionQueueItems: many(actionQueueItems),
}));

export const knowledgeNodesRelations = relations(knowledgeNodes, ({ one }) => ({
  user: one(users, { fields: [knowledgeNodes.userId], references: [users.id] }),
}));

export const phaseStatesRelations = relations(phaseStates, ({ one }) => ({
  user: one(users, { fields: [phaseStates.userId], references: [users.id] }),
}));

export const futureSelfProfilesRelations = relations(futureSelfProfiles, ({ one }) => ({
  user: one(users, { fields: [futureSelfProfiles.userId], references: [users.id] }),
}));

export const actionQueueItemsRelations = relations(actionQueueItems, ({ one }) => ({
  user: one(users, { fields: [actionQueueItems.userId], references: [users.id] }),
  project: one(projects, { fields: [actionQueueItems.projectId], references: [projects.id] }),
  bucket: one(ideaBuckets, { fields: [actionQueueItems.bucketId], references: [ideaBuckets.id] }),
}));

export const driftSignalsRelations = relations(driftSignals, ({ one }) => ({
  user: one(users, { fields: [driftSignals.userId], references: [users.id] }),
}));

export const patternReportsRelations = relations(patternReports, ({ one }) => ({
  user: one(users, { fields: [patternReports.userId], references: [users.id] }),
}));

export const reflectionInsightsRelations = relations(reflectionInsights, ({ one }) => ({
  user: one(users, { fields: [reflectionInsights.userId], references: [users.id] }),
}));

export const workflowRunsRelations = relations(workflowRuns, ({ one }) => ({
  user: one(users, { fields: [workflowRuns.userId], references: [users.id] }),
}));

export const cognitiveMapNodesRelations = relations(cognitiveMapNodes, ({ one, many }) => ({
  user: one(users, { fields: [cognitiveMapNodes.userId], references: [users.id] }),
  sourceEdges: many(cognitiveMapEdges),
  targetEdges: many(cognitiveMapEdges),
}));

export const cognitiveMapEdgesRelations = relations(cognitiveMapEdges, ({ one }) => ({
  user: one(users, { fields: [cognitiveMapEdges.userId], references: [users.id] }),
  source: one(cognitiveMapNodes, { fields: [cognitiveMapEdges.sourceId], references: [cognitiveMapNodes.id] }),
  target: one(cognitiveMapNodes, { fields: [cognitiveMapEdges.targetId], references: [cognitiveMapNodes.id] }),
}));

export const selfModAuditsRelations = relations(selfModAudits, ({ one }) => ({
  user: one(users, { fields: [selfModAudits.userId], references: [users.id] }),
}));

export const feedbackEventsRelations = relations(feedbackEvents, ({ one }) => ({
  user: one(users, { fields: [feedbackEvents.userId], references: [users.id] }),
}));

// Types for inserts
export type NewUser = typeof users.$inferInsert;
export type NewNote = typeof notes.$inferInsert;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type NewIdeaBucket = typeof ideaBuckets.$inferInsert;
export type NewProject = typeof projects.$inferInsert;
export type NewKnowledgeNode = typeof knowledgeNodes.$inferInsert;
export type NewPhaseState = typeof phaseStates.$inferInsert;
export type NewFutureSelfProfile = typeof futureSelfProfiles.$inferInsert;
export type NewActionQueueItem = typeof actionQueueItems.$inferInsert;
export type NewDriftSignal = typeof driftSignals.$inferInsert;
export type NewPatternReport = typeof patternReports.$inferInsert;
export type NewReflectionInsight = typeof reflectionInsights.$inferInsert;
export type NewWorkflowRun = typeof workflowRuns.$inferInsert;
export type NewCognitiveMapNode = typeof cognitiveMapNodes.$inferInsert;
export type NewCognitiveMapEdge = typeof cognitiveMapEdges.$inferInsert;
export type NewSelfModAudit = typeof selfModAudits.$inferInsert;
export type NewFeedbackEvent = typeof feedbackEvents.$inferInsert;
