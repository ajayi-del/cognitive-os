'use client'

import { useState, useEffect } from 'react'
import { Brain, Target, Zap, TrendingUp, ArrowUp, Archive, Plus, Filter, Search } from 'lucide-react'
import { ClientDate } from '@/components/ui/ClientDate'

interface IdeaBucket {
  id: string
  title: string
  description: string
  signalStrength: number
  noteCount: number
  recurring: boolean
  status: 'active' | 'archived' | 'promoted'
  createdAt: Date
  updatedAt: Date
  dominantThemes?: string[]
  suggestedProject?: boolean
}

export default function IdeaBucketsPage() {
  const [buckets, setBuckets] = useState<IdeaBucket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived' | 'promoted'>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newBucket, setNewBucket] = useState({
    title: '',
    description: ''
  })

  useEffect(() => {
    loadBuckets()
  }, [])

  const loadBuckets = async () => {
    setIsLoading(true)
    
    // Mock data for now
    setTimeout(() => {
      setBuckets([
        {
          id: '1',
          title: 'Trading System Architecture',
          description: 'Comprehensive trading engine design with modular components for risk management, execution, and analysis',
          signalStrength: 0.87,
          noteCount: 8,
          recurring: true,
          status: 'active',
          dominantThemes: ['risk management', 'automation', 'market analysis'],
          suggestedProject: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          title: 'Cognitive Workflow Optimization',
          description: 'Personal productivity system design for better thought organization and execution',
          signalStrength: 0.92,
          noteCount: 12,
          recurring: true,
          status: 'active',
          dominantThemes: ['productivity', 'systems thinking', 'AI integration'],
          suggestedProject: true,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          title: 'Market Pattern Recognition',
          description: 'Technical analysis patterns and statistical edges in market behavior',
          signalStrength: 0.73,
          noteCount: 5,
          recurring: false,
          status: 'active',
          dominantThemes: ['technical analysis', 'statistics', 'market psychology'],
          suggestedProject: false,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: '4',
          title: 'Learning German Methods',
          description: 'Language acquisition strategies and practice routines for German fluency',
          signalStrength: 0.45,
          noteCount: 3,
          recurring: false,
          status: 'active',
          dominantThemes: ['language learning', 'practice methods', 'immersion'],
          suggestedProject: false,
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      ])
      setIsLoading(false)
    }, 1000)
  }

  const handleCreateBucket = () => {
    if (!newBucket.title.trim()) return

    const bucket: IdeaBucket = {
      id: Date.now().toString(),
      title: newBucket.title,
      description: newBucket.description,
      signalStrength: 0,
      noteCount: 0,
      recurring: false,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setBuckets(prev => [bucket, ...prev])
    setNewBucket({ title: '', description: '' })
    setShowCreateForm(false)
  }

  const handlePromoteToProject = (bucketId: string) => {
    setBuckets(prev => prev.map(bucket => 
      bucket.id === bucketId 
        ? { ...bucket, status: 'promoted' as const }
        : bucket
    ))
  }

  const handleArchiveBucket = (bucketId: string) => {
    setBuckets(prev => prev.map(bucket => 
      bucket.id === bucketId 
        ? { ...bucket, status: 'archived' as const }
        : bucket
    ))
  }

  const filteredBuckets = buckets.filter(bucket => {
    if (statusFilter !== 'all' && bucket.status !== statusFilter) return false
    if (searchQuery && !bucket.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !bucket.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getSignalColor = (strength: number) => {
    if (strength >= 0.8) return 'text-cognitive-success'
    if (strength >= 0.6) return 'text-cognitive-warning'
    return 'text-cognitive-text-muted'
  }

  const getSignalLabel = (strength: number) => {
    if (strength >= 0.8) return 'High Signal'
    if (strength >= 0.6) return 'Medium Signal'
    return 'Low Signal'
  }

  const BucketCard = ({ bucket }: { bucket: IdeaBucket }) => (
    <div className="cognitive-surface border border-cognitive-border rounded-lg p-6 hover:border-cognitive-accent/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{bucket.title}</h3>
            {bucket.recurring && (
              <span className="px-2 py-1 text-xs rounded-full bg-cognitive-accent/20 text-cognitive-accent">
                Recurring
              </span>
            )}
            {bucket.suggestedProject && (
              <span className="px-2 py-1 text-xs rounded-full bg-cognitive-success/20 text-cognitive-success">
                Project Ready
              </span>
            )}
          </div>
          <p className="cognitive-text-muted mb-3">{bucket.description}</p>
          
          {bucket.dominantThemes && bucket.dominantThemes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {bucket.dominantThemes.map((theme, index) => (
                <span key={index} className="px-2 py-1 text-xs rounded bg-cognitive-elevated text-cognitive-text">
                  {theme}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={`text-sm font-medium ${getSignalColor(bucket.signalStrength)}`}>
            {getSignalLabel(bucket.signalStrength)}
          </div>
          <div className="text-xs cognitive-text-muted">
            {(bucket.signalStrength * 100).toFixed(0)}% confidence
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm cognitive-text-muted">
          <div className="flex items-center space-x-1">
            <Brain className="w-4 h-4" />
            <span>{bucket.noteCount} notes</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>{bucket.status}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {bucket.status === 'active' && bucket.suggestedProject && (
            <button
              onClick={() => handlePromoteToProject(bucket.id)}
              className="px-3 py-1 text-xs bg-cognitive-success text-white rounded hover:bg-cognitive-success/80 transition-colors flex items-center space-x-1"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Promote</span>
            </button>
          )}
          <button
            onClick={() => handleArchiveBucket(bucket.id)}
            className="p-2 text-cognitive-text-muted hover:text-cognitive-warning transition-colors"
          >
            <Archive className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen cognitive-bg flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 cognitive-accent animate-pulse-subtle" />
          <span className="text-white">Loading Idea Buckets...</span>
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
              <Brain className="w-6 h-6 cognitive-accent" />
              <div>
                <h1 className="text-lg font-semibold text-white">Idea Buckets</h1>
                <p className="text-xs cognitive-text-muted">Clustered thought patterns</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Bucket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Bucket Form */}
      {showCreateForm && (
        <div className="cognitive-elevated border-b border-cognitive-border">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="cognitive-surface border border-cognitive-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Create New Idea Bucket</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title</label>
                  <input
                    type="text"
                    value={newBucket.title}
                    onChange={(e) => setNewBucket(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Bucket title..."
                    className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-2 text-white placeholder-cognitive-text-muted focus:outline-none focus:border-cognitive-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description</label>
                  <textarea
                    value={newBucket.description}
                    onChange={(e) => setNewBucket(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this idea cluster..."
                    rows={3}
                    className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-3 text-white placeholder-cognitive-text-muted resize-none focus:outline-none focus:border-cognitive-accent"
                  />
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
                  onClick={handleCreateBucket}
                  disabled={!newBucket.title.trim()}
                  className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Bucket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cognitive-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search buckets..."
                className="w-full bg-cognitive-surface border border-cognitive-border rounded-lg pl-10 pr-4 py-2 text-white placeholder-cognitive-text-muted focus:outline-none focus:border-cognitive-accent"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 cognitive-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-cognitive-surface border border-cognitive-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cognitive-accent"
            >
              <option value="all">All Buckets</option>
              <option value="active">Active</option>
              <option value="promoted">Promoted</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 cognitive-accent" />
              <div>
                <div className="text-xl font-bold text-white">{filteredBuckets.length}</div>
                <div className="text-xs cognitive-text-muted">Total Buckets</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 cognitive-success" />
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredBuckets.filter(b => b.signalStrength >= 0.8).length}
                </div>
                <div className="text-xs cognitive-text-muted">High Signal</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 cognitive-warning" />
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredBuckets.filter(b => b.suggestedProject).length}
                </div>
                <div className="text-xs cognitive-text-muted">Project Ready</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 cognitive-accent" />
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredBuckets.reduce((sum, b) => sum + b.noteCount, 0)}
                </div>
                <div className="text-xs cognitive-text-muted">Total Notes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Buckets Grid */}
        <div className="space-y-4">
          {filteredBuckets.length === 0 ? (
            <div className="cognitive-surface border border-cognitive-border rounded-lg p-12 text-center">
              <Brain className="w-12 h-12 cognitive-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No idea buckets found</h3>
              <p className="cognitive-text-muted mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Start capturing thoughts to see idea buckets form automatically'
                }
              </p>
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors"
                >
                  Create Your First Bucket
                </button>
              )}
            </div>
          ) : (
            filteredBuckets.map(bucket => <BucketCard key={bucket.id} bucket={bucket} />)
          )}
        </div>
      </div>
    </div>
  )
}
