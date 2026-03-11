'use client'

import { useState, useEffect } from 'react'
import { Code, GitBranch, Shield, AlertTriangle, CheckCircle, XCircle, Zap, Clock, Play, Pause, Terminal } from 'lucide-react'

interface SelfModAudit {
  id: string
  userId: string
  request: string
  plan?: any
  filesAffected: string[]
  zone: 'safe' | 'cautious' | 'dangerous'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  validationResult: 'passed' | 'failed' | 'warning'
  approved: boolean
  rollback?: string
  branchName?: string
  createdAt: Date
}

interface ModRequest {
  id: string
  title: string
  description: string
  targetFiles: string[]
  proposedChanges: string[]
  riskAssessment: 'low' | 'medium' | 'high' | 'critical'
  estimatedImpact: 'low' | 'medium' | 'high'
  status: 'draft' | 'analyzing' | 'sandboxing' | 'validating' | 'pending_approval' | 'approved' | 'rejected' | 'deployed'
  createdAt: Date
  completedAt?: Date
}

export default function SelfModPage() {
  const [audits, setAudits] = useState<SelfModAudit[]>([])
  const [pendingRequests, setPendingRequests] = useState<ModRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewRequest, setShowNewRequest] = useState(false)
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    targetFiles: '',
    proposedChanges: ''
  })

  useEffect(() => {
    loadSelfModData()
  }, [])

  const loadSelfModData = async () => {
    setIsLoading(true)
    
    // Mock data for now
    setTimeout(() => {
      setAudits([
        {
          id: '1',
          userId: 'user-1',
          request: 'Add real-time collaboration features to cognitive OS',
          plan: {
            backend: ['Add WebSocket support', 'Implement user presence', 'Add real-time editing'],
            frontend: ['Create collaboration UI', 'Add user avatars', 'Implement conflict resolution'],
            database: ['Add presence tables', 'Update schema for collaboration']
          },
          filesAffected: [
            'app/api/realtime/route.ts',
            'components/collaboration/editor.tsx',
            'lib/realtime.ts',
            'lib/schema.ts'
          ],
          zone: 'cautious',
          riskLevel: 'medium',
          validationResult: 'passed',
          approved: true,
          branchName: 'feature/realtime-collaboration',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          userId: 'user-1',
          request: 'Refactor database schema for performance optimization',
          plan: {
            backend: ['Optimize queries', 'Add indexing', 'Implement caching'],
            database: ['Restructure tables', 'Add materialized views', 'Update constraints']
          },
          filesAffected: [
            'lib/schema.ts',
            'lib/db.ts',
            'services/optimization.ts'
          ],
          zone: 'safe',
          riskLevel: 'low',
          validationResult: 'passed',
          approved: true,
          branchName: 'feature/db-optimization',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          userId: 'user-1',
          request: 'Implement autonomous workflow execution',
          plan: {
            backend: ['Add workflow engine', 'Implement safety checks', 'Add rollback mechanisms'],
            ai: ['Integrate advanced AI models', 'Add autonomous decision making'],
            frontend: ['Create workflow designer', 'Add monitoring dashboard']
          },
          filesAffected: [
            'services/workflow-engine.ts',
            'services/autonomous-executor.ts',
            'app/workflows/page.tsx',
            'lib/ai-integration.ts'
          ],
          zone: 'dangerous',
          riskLevel: 'critical',
          validationResult: 'failed',
          approved: false,
          rollback: 'Reverted due to safety concerns - autonomous execution not ready',
          branchName: 'feature/autonomous-workflows',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ])

      setPendingRequests([
        {
          id: '4',
          title: 'Add voice note transcription with speaker identification',
          description: 'Implement real-time voice transcription with multiple speaker support and automatic speaker labeling',
          targetFiles: [
            'app/api/voice/transcribe.ts',
            'components/voice/record.tsx',
            'services/speech-to-text.ts'
          ],
          proposedChanges: [
            'Integrate Whisper API',
            'Add speaker diarization',
            'Implement voice biometrics',
            'Create speaker profile management'
          ],
          riskAssessment: 'medium',
          estimatedImpact: 'medium',
          status: 'analyzing',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
        },
        {
          id: '5',
          title: 'Implement advanced pattern recognition with ML',
          description: 'Add machine learning models for better pattern detection and prediction',
          targetFiles: [
            'services/pattern-recognition.ts',
            'services/ml-models.ts',
            'lib/prediction-engine.ts'
          ],
          proposedChanges: [
            'Integrate TensorFlow.js',
            'Train custom models',
            'Add prediction algorithms',
            'Implement model versioning'
          ],
          riskAssessment: 'high',
          estimatedImpact: 'high',
          status: 'sandboxing',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
        }
      ])

      setIsLoading(false)
    }, 1000)
  }

  const handleSubmitRequest = () => {
    if (!newRequest.title.trim() || !newRequest.description.trim()) return

    const request: ModRequest = {
      id: Date.now().toString(),
      title: newRequest.title,
      description: newRequest.description,
      targetFiles: newRequest.targetFiles.split('\n').filter(f => f.trim()),
      proposedChanges: newRequest.proposedChanges.split('\n').filter(c => c.trim()),
      riskAssessment: 'medium',
      estimatedImpact: 'medium',
      status: 'draft',
      createdAt: new Date()
    }

    setPendingRequests(prev => [request, ...prev])
    setNewRequest({ title: '', description: '', targetFiles: '', proposedChanges: '' })
    setShowNewRequest(false)
  }

  const getZoneColor = (zone: SelfModAudit['zone']) => {
    switch (zone) {
      case 'safe': return 'text-green-400'
      case 'cautious': return 'text-yellow-400'
      case 'dangerous': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskColor = (risk: SelfModAudit['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status: ModRequest['status']) => {
    switch (status) {
      case 'draft': return 'text-gray-400'
      case 'analyzing': return 'text-blue-400'
      case 'sandboxing': return 'text-yellow-400'
      case 'validating': return 'text-orange-400'
      case 'pending_approval': return 'text-purple-400'
      case 'approved': return 'text-green-400'
      case 'rejected': return 'text-red-400'
      case 'deployed': return 'text-emerald-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: ModRequest['status']) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />
      case 'analyzing': return <Terminal className="w-4 h-4" />
      case 'sandboxing': return <GitBranch className="w-4 h-4" />
      case 'validating': return <Shield className="w-4 h-4" />
      case 'pending_approval': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'deployed': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <Code className="w-12 h-12 text-red-400 animate-pulse" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">Loading Self-Modification Engine</div>
            <div className="text-red-300">Analyzing modification history...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                <Code className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Self-Modification Engine</h1>
                <p className="text-red-300 text-sm">Safe code modification with audit trail</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowNewRequest(!showNewRequest)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
            >
              New Modification Request
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* New Request Form */}
        {showNewRequest && (
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">Submit Modification Request</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-red-300 mb-2">Request Title</label>
                  <input
                    type="text"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief description of the modification..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-red-300/50 focus:outline-none focus:border-red-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-red-300 mb-2">Description</label>
                  <textarea
                    value={newRequest.description}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description of what you want to modify and why..."
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-red-300/50 resize-none focus:outline-none focus:border-red-400"
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-red-300 mb-2">Target Files</label>
                    <textarea
                      value={newRequest.targetFiles}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, targetFiles: e.target.value }))}
                      placeholder="One file path per line..."
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-red-300/50 resize-none focus:outline-none focus:border-red-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-red-300 mb-2">Proposed Changes</label>
                    <textarea
                      value={newRequest.proposedChanges}
                      onChange={(e) => setNewRequest(prev => ({ ...prev, proposedChanges: e.target.value }))}
                      placeholder="One change per line..."
                      rows={4}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-red-300/50 resize-none focus:outline-none focus:border-red-400"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowNewRequest(false)}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={!newRequest.title.trim() || !newRequest.description.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Requests */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Terminal className="w-6 h-6 mr-3 text-yellow-400" />
            Pending Requests
          </h3>
          
          <div className="space-y-6">
            {pendingRequests.map((request) => (
              <div key={request.id} className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-semibold text-white">{request.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{request.description}</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-red-300 mb-2">Target Files</h5>
                        <div className="space-y-1">
                          {request.targetFiles.map((file, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Code className="w-3 h-3 text-red-400" />
                              <span className="text-gray-400 text-sm font-mono">{file}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-red-300 mb-2">Risk Assessment</h5>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(request.riskAssessment)}`}>
                            {request.riskAssessment.toUpperCase()}
                          </span>
                          <span className="text-gray-400 text-sm">
                            Impact: {request.estimatedImpact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(request.status)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    Created: {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                  
                  {request.status === 'pending_approval' && (
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit History */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-green-400" />
            Modification Audit Trail
          </h3>
          
          <div className="space-y-6">
            {audits.map((audit) => (
              <div key={audit.id} className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-semibold text-white">{audit.request}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getZoneColor(audit.zone)}`}>
                        {audit.zone}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(audit.riskLevel)}`}>
                        {audit.riskLevel}
                      </span>
                    </div>
                    
                    {audit.branchName && (
                      <div className="flex items-center space-x-2 mb-3">
                        <GitBranch className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-mono">{audit.branchName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {audit.approved ? (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 text-sm">Approved</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 text-sm">Rejected</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {audit.plan && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-red-300 mb-2">Execution Plan</h5>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {Object.entries(audit.plan).map(([category, items]) => (
                        <div key={category}>
                          <h6 className="text-xs font-semibold text-white capitalize mb-2">{category}</h6>
                          <div className="space-y-1">
                            {(items as string[]).map((item, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <Zap className="w-3 h-3 text-yellow-400" />
                                <span className="text-gray-400 text-xs">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {audit.filesAffected && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-red-300 mb-2">Files Affected</h5>
                    <div className="flex flex-wrap gap-2">
                      {audit.filesAffected.map((file, index) => (
                        <span key={index} className="px-2 py-1 bg-red-400/20 text-red-400 rounded text-xs font-mono">
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {audit.rollback && (
                  <div className="bg-red-400/10 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-semibold">Rollback Reason</span>
                    </div>
                    <p className="text-gray-300 text-sm">{audit.rollback}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    {new Date(audit.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      audit.validationResult === 'passed' ? 'bg-green-400/20 text-green-400' :
                      audit.validationResult === 'failed' ? 'bg-red-400/20 text-red-400' :
                      'bg-yellow-400/20 text-yellow-400'
                    }`}>
                      {audit.validationResult}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
