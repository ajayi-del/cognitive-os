// Master Cognitive OS Types - Based on Claude's Master Plan

export interface User {
  id: string;
  email?: string;
  name?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultAutonomyLevel: number; // 0-3
  preferredOutputStyle: 'concise' | 'detailed' | 'strategic';
  theme: 'dark' | 'light';
  notifications: boolean;
}

// Core memory unit - notes, transcripts, dumps
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  sourceType: 'text' | 'voice' | 'chat' | 'file';
  fileHash?: string;
  embedding?: number[];
  bucketId?: string;
  projectId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Chat history with scope awareness
export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  scope: 'all' | 'project' | 'notes' | 'trading' | 'coding' | 'research';
  projectId?: string;
  tokensUsed: number;
  createdAt: Date;
}

// Clustered idea groups - core pattern unit
export interface IdeaBucket {
  id: string;
  userId: string;
  title: string;
  description: string;
  signalStrength: number;
  noteCount: number;
  recurring: boolean;
  status: 'active' | 'archived' | 'promoted';
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

// Promoted buckets - operational projects
export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  priority: 'high' | 'medium' | 'low';
  domain: 'coding' | 'trading' | 'research' | 'personal';
  momentumScore: number;
  bucketId?: string;
  nextActions: string[];
  blockers: string[];
  createdAt: Date;
  lastTouched: Date;
}

// Compressed high-signal knowledge
export interface KnowledgeNode {
  id: string;
  userId: string;
  title: string;
  description: string;
  insightType: 'pattern' | 'principle' | 'framework' | 'insight';
  confidenceScore: number;
  sourceClusterIds: string[];
  embedding?: number[];
  createdAt: Date;
}

// Single-row phase tracking
export interface PhaseState {
  id: string;
  userId: string;
  currentPhase: 'exploration' | 'focus' | 'execution' | 'integration' | 'reflection';
  phaseConfidence: number;
  phaseStartDate: Date;
  dominantProjectIds: string[];
  allowedActions: string[];
  restrictedActions: string[];
  updatedAt: Date;
}

// Desired identity model
export interface FutureSelfProfile {
  id: string;
  userId: string;
  title: string;
  timeHorizon: '3months' | '6months' | '1year' | '5years';
  coreGoals: string[];
  activeDomains: string[];
  antiGoals: string[];
  identityTraits: string[];
  desiredSkills: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Unified executable actions from all engines
export interface ActionQueueItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  actionType: 'create' | 'analyze' | 'research' | 'execute' | 'review';
  sourceType: 'pattern' | 'drift' | 'reflection' | 'manual' | 'workflow';
  priority: 'high' | 'medium' | 'low';
  alignmentScore: number;
  phaseFitScore: number;
  confidenceScore: number;
  status: 'pending' | 'accepted' | 'dismissed' | 'completed';
  projectId?: string;
  bucketId?: string;
  createdAt: Date;
  scheduledFor?: Date;
  completedAt?: Date;
}

// Drift detection outputs
export interface DriftSignal {
  id: string;
  userId: string;
  driftType: 'attention' | 'priority' | 'phase' | 'goal';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  dataEvidence?: any;
  correctiveAction?: string;
  detectedAt: Date;
  resolved: boolean;
}

// Pattern Mirror outputs
export interface PatternReport {
  id: string;
  userId: string;
  patternType: 'recurring' | 'unfinished' | 'emerging' | 'declining';
  title: string;
  description: string;
  confidenceScore: number;
  sourceIds: string[];
  suggestedAction?: string;
  createdAt: Date;
}

// Reflection Engine synthesis
export interface ReflectionInsight {
  id: string;
  userId: string;
  title: string;
  description: string;
  insightType: 'strategic' | 'tactical' | 'behavioral' | 'systemic';
  confidenceScore: number;
  relatedPatternIds: string[];
  relatedNodeIds: string[];
  suggestedAction?: string;
  createdAt: Date;
}

// Workflow execution audit trail
export interface WorkflowRun {
  id: string;
  userId: string;
  workflowType: 'coding' | 'trading' | 'research' | 'summary' | 'compression';
  status: 'pending' | 'running' | 'completed' | 'failed';
  input?: any;
  output?: any;
  triggeredBy: 'manual' | 'scheduled' | 'system';
  createdAt: Date;
  completedAt?: Date;
}

// v2 Features - Cognitive Map Nodes
export interface CognitiveMapNode {
  id: string;
  userId: string;
  nodeType: 'note' | 'bucket' | 'project' | 'theme' | 'insight';
  refId?: string; // Reference to original entity
  title: string;
  score: number;
  frequency: number;
  embedding?: number[];
  metadata?: any;
  createdAt: Date;
}

// v2 Features - Cognitive Map Edges
export interface CognitiveMapEdge {
  id: string;
  userId: string;
  sourceId: string;
  targetId: string;
  edgeType: 'similarity' | 'belonging' | 'evolution' | 'causal';
  weight: number;
  explanation?: string;
  createdAt: Date;
}

// Every self-modification attempt
export interface SelfModAudit {
  id: string;
  userId: string;
  request: string;
  plan?: any;
  filesAffected: string[];
  zone: 'safe' | 'cautious' | 'dangerous';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  validationResult: 'passed' | 'failed' | 'warning';
  approved: boolean;
  rollback?: string;
  branchName?: string;
  createdAt: Date;
}

// Human feedback for AI training loop
export interface FeedbackEvent {
  id: string;
  userId: string;
  eventType: 'thumbs_up' | 'thumbs_down' | 'wrong_bucket' | 'good_grouping' | 'phase_correction';
  targetId?: string;
  targetType?: 'note' | 'bucket' | 'project' | 'pattern' | 'action';
  rating?: number; // 1-5 scale
  comment?: string;
  createdAt: Date;
}

// System State - Central composed state
export interface SystemState {
  active_projects: Project[];
  idea_buckets: IdeaBucket[];
  recurring_patterns: PatternReport[];
  compressed_knowledge: KnowledgeNode[];
  phase_state: PhaseState;
  future_self_profile: FutureSelfProfile | null;
  drift_signals: DriftSignal[];
  aligned_actions: ActionQueueItem[];
  recent_activity: RecentActivity;
  research_relevance: ResearchResult[];
  cognitive_map_nodes: CognitiveMapNode[];
  cognitive_map_edges: CognitiveMapEdge[];
}

export interface RecentActivity {
  notes: number;
  chats: number;
  workflows: number;
  last_active: string;
}

export interface ResearchResult {
  id: string;
  query: string;
  results: any[];
  relevanceScore: number;
  createdAt: Date;
}

// API Request/Response types
export interface CreateNoteRequest {
  title: string;
  content: string;
  sourceType?: 'text' | 'voice' | 'chat' | 'file';
  tags?: string[];
  bucketId?: string;
  projectId?: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  domain: 'coding' | 'trading' | 'research' | 'personal';
  priority?: 'high' | 'medium' | 'low';
  bucketId?: string;
}

export interface CreateBucketRequest {
  title: string;
  description: string;
  noteIds?: string[];
}

export interface ChatRequest {
  message: string;
  scope: 'all' | 'project' | 'notes' | 'trading' | 'coding' | 'research';
  projectId?: string;
  saveToNotes?: boolean;
  createActions?: boolean;
}

export interface ActionRequest {
  actionType: 'create' | 'analyze' | 'research' | 'execute' | 'review';
  title: string;
  description: string;
  priority?: 'high' | 'medium' | 'low';
  projectId?: string;
  bucketId?: string;
}

export interface PhaseUpdateRequest {
  currentPhase: 'exploration' | 'focus' | 'execution' | 'integration' | 'reflection';
  phaseConfidence?: number;
  allowedActions?: string[];
  restrictedActions?: string[];
}

export interface FutureSelfRequest {
  title: string;
  timeHorizon: '3months' | '6months' | '1year' | '5years';
  coreGoals: string[];
  activeDomains: string[];
  antiGoals: string[];
  identityTraits: string[];
  desiredSkills: string[];
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
  metadata?: any;
}

// Service interfaces
export interface StateComposerService {
  getLatest(): Promise<SystemState>;
  updatePhase(phase: PhaseState): Promise<void>;
  addActions(actions: ActionQueueItem[]): Promise<void>;
}

export interface EmbeddingService {
  generateEmbedding(text: string): Promise<number[]>;
  storeEmbedding(entityId: string, embedding: number[]): Promise<void>;
}

export interface ClusteringService {
  clusterNotes(userId: string): Promise<IdeaBucket[]>;
  updateNoteClusters(noteIds: string[]): Promise<void>;
}

export interface PatternMirrorService {
  detectPatterns(userId: string): Promise<PatternReport[]>;
  analyzeRecurringThemes(notes: Note[]): Promise<PatternReport[]>;
  detectUnfinishedLoops(projects: Project[]): Promise<PatternReport[]>;
}

export interface PhaseDetectionService {
  detectCurrentPhase(userId: string): Promise<PhaseState>;
  updatePhaseFromActivity(userId: string): Promise<void>;
}

export interface DriftDetectionService {
  detectDrift(userId: string): Promise<DriftSignal[]>;
  compareAttentionVsGoals(userId: string): Promise<DriftSignal[]>;
}

export interface ActionQueueService {
  evaluateForAction(input: string, response: string): Promise<ActionQueueItem | null>;
  rankActions(actions: ActionQueueItem[]): Promise<ActionQueueItem[]>;
  deduplicateActions(actions: ActionQueueItem[]): Promise<ActionQueueItem[]>;
}

export interface MemoryCompressionService {
  runDailyCompression(userId: string): Promise<KnowledgeNode[]>;
  runWeeklyCompression(userId: string): Promise<KnowledgeNode[]>;
  extractInsights(buckets: IdeaBucket[]): Promise<ReflectionInsight[]>;
}

export interface ReflectionEngine {
  generateReflections(userId: string): Promise<ReflectionInsight[]>;
  synthesizePatterns(patterns: PatternReport[]): Promise<ReflectionInsight[]>;
}

export interface CognitiveMapService {
  buildMap(userId: string): Promise<{ nodes: CognitiveMapNode[], edges: CognitiveMapEdge[] }>;
  updateMapFromEntities(userId: string): Promise<void>;
  findSimilarNodes(nodeId: string): Promise<CognitiveMapNode[]>;
}

export interface WorkflowEngine {
  routeContent(content: string, type: string): Promise<string>;
  executeWorkflow(workflowType: string, input: any): Promise<WorkflowRun>;
}

export interface SelfModEngine {
  planModification(request: string): Promise<SelfModAudit>;
  createSandbox(auditId: string): Promise<string>;
  validateModification(branchName: string): Promise<boolean>;
  approveModification(auditId: string): Promise<void>;
  rejectModification(auditId: string): Promise<void>;
}

// UI Component Props
export interface DashboardProps {
  systemState: SystemState;
  onPhaseUpdate: (phase: PhaseState) => void;
  onActionAccept: (actionId: string) => void;
  onActionDismiss: (actionId: string) => void;
}

export interface ChatProps {
  systemState: SystemState;
  onSendMessage: (message: string, scope: string) => Promise<void>;
  onFeedback: (messageId: string, feedback: FeedbackEvent) => void;
}

export interface NotesProps {
  notes: Note[];
  buckets: IdeaBucket[];
  onCreateNote: (note: CreateNoteRequest) => Promise<void>;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

export interface ProjectsProps {
  projects: Project[];
  onCreateProject: (project: CreateProjectRequest) => Promise<void>;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
}

export interface BucketsProps {
  buckets: IdeaBucket[];
  onCreateBucket: (bucket: CreateBucketRequest) => Promise<void>;
  onPromoteBucket: (bucketId: string) => Promise<void>;
  onMergeBuckets: (bucketIds: string[]) => Promise<void>;
}

export interface ActionsProps {
  actions: ActionQueueItem[];
  onAcceptAction: (actionId: string) => Promise<void>;
  onDismissAction: (actionId: string) => Promise<void>;
  onCompleteAction: (actionId: string) => Promise<void>;
  onCreateAction: (action: ActionRequest) => Promise<void>;
}

export interface PhaseProps {
  phaseState: PhaseState;
  onUpdatePhase: (phase: PhaseUpdateRequest) => Promise<void>;
  detectionSignals: any[];
}

export interface FutureSelfProps {
  profile: FutureSelfProfile | null;
  onUpdateProfile: (profile: FutureSelfRequest) => Promise<void>;
  driftSignals: DriftSignal[];
}

export interface CognitiveMapProps {
  nodes: CognitiveMapNode[];
  edges: CognitiveMapEdge[];
  onNodeClick: (nodeId: string) => void;
  onEdgeClick: (edgeId: string) => void;
  filters: MapFilters;
}

export interface MapFilters {
  timeRange?: { start: Date; end: Date };
  nodeTypes?: string[];
  projectIds?: string[];
  clusterIds?: string[];
}

export interface MemoryProps {
  knowledgeNodes: KnowledgeNode[];
  reflectionInsights: ReflectionInsight[];
  patternReports: PatternReport[];
  onCompressionTrigger: () => Promise<void>;
}

export interface SelfModProps {
  audits: SelfModAudit[];
  onRequestModification: (request: string) => Promise<void>;
  onApproveModification: (auditId: string) => Promise<void>;
  onRejectModification: (auditId: string) => Promise<void>;
  onValidateModification: (auditId: string) => Promise<void>;
}
