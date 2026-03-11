'use client'

import { useState, useEffect } from 'react'
import { Target, Zap, TrendingUp, CheckCircle, XCircle, Clock, Filter, Plus, Brain } from 'lucide-react'

interface ActionQueueItem {
  id: string
  title: string
  description: string
  actionType: 'create' | 'analyze' | 'research' | 'execute' | 'review'
  sourceType: 'pattern' | 'drift' | 'reflection' | 'manual' | 'workflow'
  priority: 'high' | 'medium' | 'low'
  alignmentScore: number
  phaseFitScore: number
  confidenceScore: number
  status: 'pending' | 'accepted' | 'dismissed' | 'completed'
  projectId?: string
  bucketId?: string
  createdAt: Date
  scheduledFor?: Date
  completedAt?: Date
}

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionQueueItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'dismissed' | 'completed'>('pending')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'pattern' | 'drift' | 'reflection' | 'manual' | 'workflow'>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    actionType: 'create' as const,
    priority: 'medium' as const
  })

  useEffect(() => {
    loadActions()
  }, [])

  const loadActions = async () => {
    setIsLoading(true)
    
    // Mock data for now
    setTimeout(() => {
      setActions([
        {
          id: '1',
          title: 'Complete Trading System Risk Module',
          description: 'Implement the risk management component for the trading system with position sizing and stop-loss logic',
          actionType: 'execute',
          sourceType: 'pattern',
          priority: 'high',
          alignmentScore: 0.92,
          phaseFitScore: 0.87,
          confidenceScore: 0.89,
          status: 'pending',
          projectId: '2',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          title: 'Research Vector Database Options',
          description: 'Investigate pgvector vs Pinecone vs Weaviate for semantic search implementation',
          actionType: 'research',
          sourceType: 'reflection',
          priority: 'medium',
          alignmentScore: 0.85,
          phaseFitScore: 0.92,
          confidenceScore: 0.78,
          status: 'pending',
          projectId: '1',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
          id: '3',
          title: 'Review Cognitive Map Design',
          description: 'Analyze current cognitive map implementation and identify improvements for visualization',
          actionType: 'review',
          sourceType: 'workflow',
          priority: 'medium',
          alignmentScore: 0.76,
          phaseFitScore: 0.68,
          confidenceScore: 0.82,
          status: 'accepted',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
        },
        {
          id: '4',
          title: 'Drift Detected: Low Trading Focus',
          description: 'Attention has shifted away from trading goals for 5 days. Consider re-aligning focus.',
          actionType: 'analyze',
          sourceType: 'drift',
          priority: 'high',
          alignmentScore: 0.94,
          phaseFitScore: 0.91,
          confidenceScore: 0.95,
          status: 'pending',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
        },
        {
          id: '5',
          title: 'Create Daily Briefing Template',
          description: 'Design template for daily alignment briefs with sections for priorities, patterns, and next actions',
          actionType: 'create',
          sourceType: 'manual',
          priority: 'low',
          alignmentScore: 0.67,
          phaseFitScore: 0.73,
          confidenceScore: 0.71,
          status: 'completed',
          completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000)
        }
      ])
      setIsLoading(false)
    }, 1000)
  }

  const handleCreateAction = () => {
    if (!newAction.title.trim()) return

    const action: ActionQueueItem = {
      id: Date.now().toString(),
      title: newAction.title,
      description: newAction.description,
      actionType: newAction.actionType,
      sourceType: 'manual',
      priority: newAction.priority,
      alignmentScore: 0.5,
      phaseFitScore: 0.5,
      confidenceScore: 0.5,
      status: 'pending',
      createdAt: new Date()
    }

    setActions(prev => [action, ...prev])
    setNewAction({ title: '', description: '', actionType: 'create', priority: 'medium' })
    setShowCreateForm(false)
  }

  const handleAcceptAction = (actionId: string) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, status: 'accepted' as const }
        : action
    ))
  }

  const handleDismissAction = (actionId: string) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, status: 'dismissed' as const }
        : action
    ))
  }

  const handleCompleteAction = (actionId: string) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, status: 'completed' as const, completedAt: new Date() }
        : action
    ))
  }

  const filteredActions = actions.filter(action => {
    if (statusFilter !== 'all' && action.status !== statusFilter) return false
    if (sourceFilter !== 'all' && action.sourceType !== sourceFilter) return false
    return true
  })

  const getStatusColor = (status: ActionQueueItem['status']) => {
    switch (status) {
      case 'pending': return 'text-cognitive-warning'
      case 'accepted': return 'text-cognitive-accent'
      case 'dismissed': return 'text-cognitive-text-muted'
      case 'completed': return 'text-cognitive-success'
      default: return 'text-cognitive-text-muted'
    }
  }

  const getStatusIcon = (status: ActionQueueItem['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'accepted': return <CheckCircle className="w-4 h-4" />
      case 'dismissed': return <XCircle className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getActionTypeColor = (type: ActionQueueItem['actionType']) => {
    switch (type) {
      case 'create': return 'bg-cognitive-accent/20 text-cognitive-accent'
      case 'analyze': return 'bg-cognitive-success/20 text-cognitive-success'
      case 'research': return 'bg-cognitive-warning/20 text-cognitive-warning'
      case 'execute': return 'bg-cognitive-danger/20 text-cognitive-danger'
      case 'review': return 'bg-cognitive-text-muted/20 text-cognitive-text-muted'
      default: return 'bg-cognitive-text-muted/20 text-cognitive-text-muted'
    }
  }

  const getSourceTypeColor = (type: ActionQueueItem['sourceType']) => {
    switch (type) {
      case 'pattern': return 'bg-cognitive-accent/20 text-cognitive-accent'
      case 'drift': return 'bg-cognitive-danger/20 text-cognitive-danger'
      case 'reflection': return 'bg-cognitive-success/20 text-cognitive-success'
      case 'workflow': return 'bg-cognitive-warning/20 text-cognitive-warning'
      case 'manual': return 'bg-cognitive-text-muted/20 text-cognitive-text-muted'
      default: return 'bg-cognitive-text-muted/20 text-cognitive-text-muted'
    }
  }

  const getPriorityColor = (priority: ActionQueueItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-cognitive-danger/20 text-cognitive-danger'
      case 'medium': return 'bg-cognitive-warning/20 text-cognitive-warning'
      case 'low': return 'bg-cognitive-text-muted/20 text-cognitive-text-muted'
      default: return 'bg-cognitive-text-muted/20 text-cognitive-text-muted'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-cognitive-success'
    if (score >= 0.6) return 'text-cognitive-warning'
    return 'text-cognitive-text-muted'
  }

  const ActionCard = ({ action }: { action: ActionQueueItem }) => (
    <div className="cognitive-surface border border-cognitive-border rounded-lg p-6 hover:border-cognitive-accent/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{action.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(action.priority)}`}>
              {action.priority}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getActionTypeColor(action.actionType)}`}>
              {action.actionType}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getSourceTypeColor(action.sourceType)}`}>
              {action.sourceType}
            </span>
          </div>
          <p className="cognitive-text-muted mb-3">{action.description}</p>
        </div>
        
        <div className={`flex items-center space-x-1 text-sm font-medium ${getStatusColor(action.status)}`}>
          {getStatusIcon(action.status)}
          <span>{action.status}</span>
        </div>
      </div>
      
      {/* Scores */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-sm font-medium ${getScoreColor(action.alignmentScore)}`}>
            {(action.alignmentScore * 100).toFixed(0)}%
          </div>
          <div className="text-xs cognitive-text-muted">Alignment</div>
        </div>
        <div className="text-center">
          <div className={`text-sm font-medium ${getScoreColor(action.phaseFitScore)}`}>
            {(action.phaseFitScore * 100).toFixed(0)}%
          </div>
          <div className="text-xs cognitive-text-muted">Phase Fit</div>
        </div>
        <div className="text-center">
          <div className={`text-sm font-medium ${getScoreColor(action.confidenceScore)}`}>
            {(action.confidenceScore * 100).toFixed(0)}%
          </div>
          <div className="text-xs cognitive-text-muted">Confidence</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm cognitive-text-muted">
          Created: {new Date(action.createdAt).toLocaleDateString()}
          {action.completedAt && ` • Completed: ${new Date(action.completedAt).toLocaleDateString()}`}
        </div>
        
        <div className="flex items-center space-x-2">
          {action.status === 'pending' && (
            <>
              <button
                onClick={() => handleAcceptAction(action.id)}
                className="px-3 py-1 text-xs bg-cognitive-accent text-white rounded hover:bg-cognitive-accent/80 transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => handleDismissAction(action.id)}
                className="px-3 py-1 text-xs bg-cognitive-text-muted text-white rounded hover:bg-cognitive-text-muted/80 transition-colors"
              >
                Dismiss
              </button>
            </>
          )}
          {action.status === 'accepted' && (
            <button
              onClick={() => handleCompleteAction(action.id)}
              className="px-3 py-1 text-xs bg-cognitive-success text-white rounded hover:bg-cognitive-success/80 transition-colors"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen cognitive-bg flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Target className="w-8 h-8 cognitive-accent animate-pulse-subtle" />
          <span className="text-white">Loading Action Queue...</span>
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
              <Target className="w-6 h-6 cognitive-accent" />
              <div>
                <h1 className="text-lg font-semibold text-white">Action Queue</h1>
                <p className="text-xs cognitive-text-muted">Ranked executable actions</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Action</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Action Form */}
      {showCreateForm && (
        <div className="cognitive-elevated border-b border-cognitive-border">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="cognitive-surface border border-cognitive-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Create New Action</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title</label>
                  <input
                    type="text"
                    value={newAction.title}
                    onChange={(e) => setNewAction(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Action title..."
                    className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-2 text-white placeholder-cognitive-text-muted focus:outline-none focus:border-cognitive-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description</label>
                  <textarea
                    value={newAction.description}
                    onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Action description and expected outcome..."
                    rows={3}
                    className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-3 text-white placeholder-cognitive-text-muted resize-none focus:outline-none focus:border-cognitive-accent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Action Type</label>
                    <select
                      value={newAction.actionType}
                      onChange={(e) => setNewAction(prev => ({ ...prev, actionType: e.target.value as any }))}
                      className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cognitive-accent"
                    >
                      <option value="create">Create</option>
                      <option value="analyze">Analyze</option>
                      <option value="research">Research</option>
                      <option value="execute">Execute</option>
                      <option value="review">Review</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Priority</label>
                    <select
                      value={newAction.priority}
                      onChange={(e) => setNewAction(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cognitive-accent"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
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
                  onClick={handleCreateAction}
                  disabled={!newAction.title.trim()}
                  className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 cognitive-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-cognitive-surface border border-cognitive-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cognitive-accent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="dismissed">Dismissed</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="bg-cognitive-surface border border-cognitive-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cognitive-accent"
            >
              <option value="all">All Sources</option>
              <option value="pattern">Pattern</option>
              <option value="drift">Drift</option>
              <option value="reflection">Reflection</option>
              <option value="workflow">Workflow</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 cognitive-accent" />
              <div>
                <div className="text-xl font-bold text-white">{filteredActions.length}</div>
                <div className="text-xs cognitive-text-muted">Total Actions</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 cognitive-warning" />
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredActions.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-xs cognitive-text-muted">Pending</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 cognitive-accent" />
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredActions.filter(a => a.status === 'accepted').length}
                </div>
                <div className="text-xs cognitive-text-muted">Accepted</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 cognitive-success" />
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredActions.reduce((sum, a) => sum + a.alignmentScore, 0) / filteredActions.length > 0 
                    ? (filteredActions.reduce((sum, a) => sum + a.alignmentScore, 0) / filteredActions.length * 100).toFixed(0)
                    : '0'
                  }%
                </div>
                <div className="text-xs cognitive-text-muted">Avg Alignment</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions List */}
        <div className="space-y-4">
          {filteredActions.length === 0 ? (
            <div className="cognitive-surface border border-cognitive-border rounded-lg p-12 text-center">
              <Target className="w-12 h-12 cognitive-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No actions found</h3>
              <p className="cognitive-text-muted mb-4">
                {statusFilter !== 'all' || sourceFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Actions will appear here from patterns, drift detection, and manual creation'
                }
              </p>
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors"
                >
                  Create Your First Action
                </button>
              )}
            </div>
          ) : (
            filteredActions.map(action => <ActionCard key={action.id} action={action} />)
          )}
        </div>
      </div>
    </div>
  )
}
