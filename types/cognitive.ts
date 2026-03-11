// Core cognitive system types

export interface User {
  id: string;
  email?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  defaultAutonomyLevel: number; // 0-3
  preferredOutputStyle: 'concise' | 'detailed' | 'strategic';
  theme: 'dark' | 'light';
  notifications: boolean;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  rawContent?: string;
  sourceType: 'text' | 'voice' | 'chat' | 'file';
  tags: string[];
  embedding?: number[];
  linkedProjectId?: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  contextScope: 'all' | 'project' | 'notes' | 'trading' | 'coding';
  referencedNoteIds: string[];
  createdAt: Date;
}

export interface IdeaBucket {
  id: string;
  userId: string;
  title: string;
  description: string;
  dominantThemes: string[];
  noteCount: number;
  confidenceScore: number;
  frequencyTrend: 'increasing' | 'stable' | 'decreasing';
  status: 'active' | 'archived' | 'promoted';
  suggestedProject: boolean;
  exampleNotes: Note[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  priority: 'high' | 'medium' | 'low';
  category: 'coding' | 'trading' | 'research' | 'personal';
  confidenceScore: number;
  linkedBucketId?: string;
  linkedNoteIds: string[];
  linkedChatIds: string[];
  blockers: string[];
  executionMode: 'manual' | 'assisted' | 'autonomous';
  createdAt: Date;
  lastTouched: Date;
}

export interface Task {
  id: string;
  userId: string;
  projectId?: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  workflowType: 'coding' | 'trading' | 'research' | 'general';
  estimatedMinutes?: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface DailyBriefing {
  id: string;
  userId: string;
  briefingDate: Date;
  topPriorities: string[];
  activeProjects: string[];
  recurringThemes: string[];
  strategicDirection: string;
  whatToIgnore: string[];
  nextActions: string[];
  createdAt: Date;
}

export interface FeedbackEvent {
  id: string;
  userId: string;
  contentType: 'note_summary' | 'bucket_grouping' | 'task_generation' | 'chat_response';
  contentId: string;
  feedbackType: 'thumbs_up' | 'thumbs_down' | 'wrong_bucket' | 'good_grouping' | 'too_generic' | 'too_long';
  feedbackValue?: string;
  createdAt: Date;
}

export interface WorkflowRun {
  id: string;
  userId: string;
  workflowType: 'cluster_notes' | 'generate_briefing' | 'create_tasks' | 'analyze_trades' | 'process_voice';
  inputData: any;
  outputData: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  autonomyLevel: number;
  createdAt: Date;
  completedAt?: Date;
}

// Workflow and AI types
export interface CognitiveInput {
  type: 'note' | 'chat' | 'voice' | 'file';
  content: string;
  tags: string[];
  context?: any;
}

export interface Workflow {
  type: string;
  steps: string[];
  autonomyLevel: number;
  requiresApproval: boolean;
}

export interface AIResponse {
  content: string;
  confidence: number;
  sources: string[];
  suggestedActions: string[];
  metadata: any;
}

// Analysis types
export interface PatternAnalysis {
  recurringThemes: string[];
  frequencyTrends: Record<string, 'increasing' | 'stable' | 'decreasing'>;
  emotionalPatterns?: string[];
  obsessionClusters: string[];
  unfinishedLoops: string[];
}

export interface SignalNoiseAnalysis {
  signal: string[];
  noise: string[];
  confidenceScore: number;
  reasoning: string;
}

export interface Comparison {
  similarities: string[];
  differences: string[];
  evolution: string[];
  insights: string[];
}

// Trading-specific types
export interface TradingNote {
  symbol: string;
  context: string;
  directionalIdea: string;
  setupType: string;
  entryLogic: string;
  invalidation: string;
  targets: string;
  risks: string;
  confidence: number;
  missingInfo: string[];
  relatedNotes: string[];
}

export interface TradeAnalysis {
  symbol: string;
  thesis: string;
  timeframe: string;
  setupType: string;
  entryConditions: string[];
  invalidationPoints: string[];
  profitTargets: string[];
  riskManagement: string;
  scenarios: Scenario[];
  confidence: number;
}

export interface Scenario {
  name: string;
  probability: number;
  outcome: string;
  triggers: string[];
}

// Coding-specific types
export interface CodingTask {
  title: string;
  description: string;
  type: 'feature' | 'bug' | 'refactor' | 'infrastructure';
  complexity: 'low' | 'medium' | 'high';
  estimatedHours: number;
  dependencies: string[];
  deliverables: string[];
}

export interface ImplementationPlan {
  phases: ImplementationPhase[];
  totalEstimatedTime: number;
  dependencies: string[];
  risks: string[];
  successCriteria: string[];
}

export interface ImplementationPhase {
  name: string;
  description: string;
  tasks: CodingTask[];
  estimatedDuration: number;
  deliverables: string[];
}

// UI Component Props
export interface DashboardStats {
  totalNotes: number;
  activeProjects: number;
  todayPriorities: number;
  unfinishedLoops: number;
  weeklyCaptureRate: number;
  aiResponseAccuracy: number;
}

export interface ChatContext {
  scope: 'all' | 'project' | 'notes' | 'trading' | 'coding';
  projectId?: string;
  noteIds?: string[];
  timeframe?: 'today' | 'week' | 'month';
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  variant: 'primary' | 'secondary' | 'destructive';
}

// API Request/Response types
export interface CreateNoteRequest {
  title: string;
  content: string;
  tags: string[];
  sourceType: 'text' | 'voice' | 'chat' | 'file';
  linkedProjectId?: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  category: 'coding' | 'trading' | 'research' | 'personal';
  priority: 'high' | 'medium' | 'low';
  linkedBucketId?: string;
}

export interface ChatRequest {
  message: string;
  contextScope: 'all' | 'project' | 'notes' | 'trading' | 'coding';
  projectId?: string;
  saveToNotes?: boolean;
  createTasks?: boolean;
}

export interface AnalysisRequest {
  type: 'patterns' | 'briefing' | 'comparison' | 'summary';
  timeframe?: 'today' | 'week' | 'month';
  noteIds?: string[];
  projectId?: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
  metadata?: any;
}
