'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Target, Zap, TrendingUp, Plus, Filter, Search, Play, Pause, CheckCircle, Clock } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  status: 'planning' | 'active' | 'paused' | 'completed'
  priority: 'high' | 'medium' | 'low'
  domain: 'coding' | 'trading' | 'research' | 'personal'
  momentumScore: number
  nextActions: string[]
  blockers: string[]
  createdAt: Date
  lastTouched: Date
  bucketId?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'planning' | 'active' | 'paused' | 'completed'>('all')
  const [domainFilter, setDomainFilter] = useState<'all' | 'coding' | 'trading' | 'research' | 'personal'>('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    domain: 'personal' as const,
    priority: 'medium' as const
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    setIsLoading(true)
    
    // Mock data for now
    setTimeout(() => {
      setProjects([
        {
          id: '1',
          title: 'Cognitive OS Development',
          description: 'Build comprehensive personal AI operating system for thought organization and execution',
          status: 'active',
          priority: 'high',
          domain: 'coding',
          momentumScore: 0.92,
          nextActions: [
            'Complete database schema implementation',
            'Build pattern detection service',
            'Create cognitive map visualization'
          ],
          blockers: [
            'Need to finalize vector embedding strategy',
            'UI design for complex interactions'
          ],
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lastTouched: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          title: 'Trading System Architecture',
          description: 'Design and implement modular trading engine with risk management',
          status: 'planning',
          priority: 'high',
          domain: 'trading',
          momentumScore: 0.87,
          nextActions: [
            'Define entry/exit criteria',
            'Design risk management module',
            'Backtest core strategies'
          ],
          blockers: [
            'Market data integration complexity',
            'Regulatory compliance requirements'
          ],
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          lastTouched: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          title: 'Personal Knowledge Management',
          description: 'Optimize personal learning and knowledge retention systems',
          status: 'paused',
          priority: 'medium',
          domain: 'personal',
          momentumScore: 0.45,
          nextActions: [
            'Review current note-taking workflow',
            'Implement spaced repetition system'
          ],
          blockers: [
            'Time allocation conflicts',
            'Tool integration challenges'
          ],
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          lastTouched: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ])
      setIsLoading(false)
    }, 1000)
  }

  const handleCreateProject = () => {
    if (!newProject.title.trim()) return

    const project: Project = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      status: 'planning',
      priority: newProject.priority,
      domain: newProject.domain,
      momentumScore: 0,
      nextActions: [],
      blockers: [],
      createdAt: new Date(),
      lastTouched: new Date()
    }

    setProjects(prev => [project, ...prev])
    setNewProject({ title: '', description: '', domain: 'personal', priority: 'medium' })
    setShowCreateForm(false)
  }

  const handleUpdateStatus = (projectId: string, status: Project['status']) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, status, lastTouched: new Date() }
        : project
    ))
  }

  const filteredProjects = projects.filter(project => {
    if (statusFilter !== 'all' && project.status !== statusFilter) return false
    if (domainFilter !== 'all' && project.domain !== domainFilter) return false
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'text-cognitive-success'
      case 'planning': return 'text-cognitive-warning'
      case 'paused': return 'text-cognitive-text-muted'
      case 'completed': return 'text-cognitive-accent'
      default: return 'text-cognitive-text-muted'
    }
  }

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4" />
      case 'planning': return <Clock className="w-4 h-4" />
      case 'paused': return <Pause className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high': return 'bg-cognitive-danger/20 text-cognitive-danger'
      case 'medium': return 'bg-cognitive-warning/20 text-cognitive-warning'
      case 'low': return 'bg-cognitive-text-muted/20 text-cognitive-text-muted'
      default: return 'bg-cognitive-text-muted/20 text-cognitive-text-muted'
    }
  }

  const getDomainColor = (domain: Project['domain']) => {
    switch (domain) {
      case 'coding': return 'bg-cognitive-accent/20 text-cognitive-accent'
      case 'trading': return 'bg-cognitive-success/20 text-cognitive-success'
      case 'research': return 'bg-cognitive-warning/20 text-cognitive-warning'
      case 'personal': return 'bg-cognitive-text-muted/20 text-cognitive-text-muted'
      default: return 'bg-cognitive-text-muted/20 text-cognitive-text-muted'
    }
  }

  const ProjectCard = ({ project }: { project: Project }) => (
    <div className="cognitive-surface border border-cognitive-border rounded-lg p-6 hover:border-cognitive-accent/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${getDomainColor(project.domain)}`}>
              {project.domain}
            </span>
          </div>
          <p className="cognitive-text-muted mb-3">{project.description}</p>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={`flex items-center space-x-1 text-sm font-medium ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            <span>{project.status}</span>
          </div>
          <div className="text-xs cognitive-text-muted">
            {(project.momentumScore * 100).toFixed(0)}% momentum
          </div>
        </div>
      </div>
      
      {/* Next Actions */}
      {project.nextActions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Next Actions</h4>
          <div className="space-y-1">
            {project.nextActions.slice(0, 3).map((action, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm cognitive-text-muted">
                <Target className="w-3 h-3" />
                <span>{action}</span>
              </div>
            ))}
            {project.nextActions.length > 3 && (
              <div className="text-xs cognitive-text-muted">
                +{project.nextActions.length - 3} more actions
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Blockers */}
      {project.blockers.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-cognitive-warning mb-2">Blockers</h4>
          <div className="space-y-1">
            {project.blockers.slice(0, 2).map((blocker, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm cognitive-text-muted">
                <Zap className="w-3 h-3" />
                <span>{blocker}</span>
              </div>
            ))}
            {project.blockers.length > 2 && (
              <div className="text-xs cognitive-text-muted">
                +{project.blockers.length - 2} more blockers
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm cognitive-text-muted">
          <div className="flex items-center space-x-1">
            <Briefcase className="w-4 h-4" />
            <span>{project.domain}</span>
          </div>
          <div>
            Last touched: {new Date(project.lastTouched).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {project.status === 'planning' && (
            <button
              onClick={() => handleUpdateStatus(project.id, 'active')}
              className="px-3 py-1 text-xs bg-cognitive-success text-white rounded hover:bg-cognitive-success/80 transition-colors"
            >
              Start
            </button>
          )}
          {project.status === 'active' && (
            <button
              onClick={() => handleUpdateStatus(project.id, 'paused')}
              className="px-3 py-1 text-xs bg-cognitive-warning text-white rounded hover:bg-cognitive-warning/80 transition-colors"
            >
              Pause
            </button>
          )}
          {project.status === 'paused' && (
            <button
              onClick={() => handleUpdateStatus(project.id, 'active')}
              className="px-3 py-1 text-xs bg-cognitive-success text-white rounded hover:bg-cognitive-success/80 transition-colors"
            >
              Resume
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
          <Briefcase className="w-8 h-8 cognitive-accent animate-pulse-subtle" />
          <span className="text-white">Loading Projects...</span>
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
              <Briefcase className="w-6 h-6 cognitive-accent" />
              <div>
                <h1 className="text-lg font-semibold text-white">Projects</h1>
                <p className="text-xs cognitive-text-muted">Operational project management</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="cognitive-elevated border-b border-cognitive-border">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="cognitive-surface border border-cognitive-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Create New Project</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title</label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Project title..."
                    className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-2 text-white placeholder-cognitive-text-muted focus:outline-none focus:border-cognitive-accent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Project description and goals..."
                    rows={3}
                    className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-4 py-3 text-white placeholder-cognitive-text-muted resize-none focus:outline-none focus:border-cognitive-accent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Domain</label>
                    <select
                      value={newProject.domain}
                      onChange={(e) => setNewProject(prev => ({ ...prev, domain: e.target.value as any }))}
                      className="w-full bg-cognitive-bg border border-cognitive-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cognitive-accent"
                    >
                      <option value="coding">Coding</option>
                      <option value="trading">Trading</option>
                      <option value="research">Research</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Priority</label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject(prev => ({ ...prev, priority: e.target.value as any }))}
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
                  onClick={handleCreateProject}
                  disabled={!newProject.title.trim()}
                  className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Project
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
                placeholder="Search projects..."
                className="w-full bg-cognitive-surface border border-cognitive-border rounded-lg pl-10 pr-4 py-2 text-white placeholder-cognitive-text-muted focus:outline-none focus:border-cognitive-accent"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 cognitive-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-cognitive-surface border border-cognitive-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cognitive-accent"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value as any)}
              className="bg-cognitive-surface border border-cognitive-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cognitive-accent"
            >
              <option value="all">All Domains</option>
              <option value="coding">Coding</option>
              <option value="trading">Trading</option>
              <option value="research">Research</option>
              <option value="personal">Personal</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Briefcase className="w-5 h-5 cognitive-accent" />
              <div>
                <div className="text-xl font-bold text-white">{filteredProjects.length}</div>
                <div className="text-xs cognitive-text-muted">Total Projects</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Play className="w-5 h-5 cognitive-success" />
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredProjects.filter(p => p.status === 'active').length}
                </div>
                <div className="text-xs cognitive-text-muted">Active</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 cognitive-warning" />
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredProjects.reduce((sum, p) => sum + p.momentumScore, 0) / filteredProjects.length > 0 
                    ? (filteredProjects.reduce((sum, p) => sum + p.momentumScore, 0) / filteredProjects.length * 100).toFixed(0)
                    : '0'
                  }%
                </div>
                <div className="text-xs cognitive-text-muted">Avg Momentum</div>
              </div>
            </div>
          </div>
          
          <div className="cognitive-surface border border-cognitive-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-5 h-5 cognitive-danger" />
              <div>
                <div className="text-xl font-bold text-white">
                  {filteredProjects.reduce((sum, p) => sum + p.blockers.length, 0)}
                </div>
                <div className="text-xs cognitive-text-muted">Total Blockers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="cognitive-surface border border-cognitive-border rounded-lg p-12 text-center">
              <Briefcase className="w-12 h-12 cognitive-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No projects found</h3>
              <p className="cognitive-text-muted mb-4">
                {searchQuery || statusFilter !== 'all' || domainFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Create your first project to get started'
                }
              </p>
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-cognitive-accent text-white rounded-lg hover:bg-cognitive-accent/80 transition-colors"
                >
                  Create Your First Project
                </button>
              )}
            </div>
          ) : (
            filteredProjects.map(project => <ProjectCard key={project.id} project={project} />)
          )}
        </div>
      </div>
    </div>
  )
}
