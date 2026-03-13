'use client'

import { useState, useEffect } from 'react'
import { Brain, Zap, Layers, TrendingUp, BarChart3, Target, Play, Clock, Filter, Search } from 'lucide-react'
import { ClientDate } from '@/components/ui/ClientDate'

interface KnowledgeNode {
  id: string
  userId: string
  title: string
  description: string
  insightType: 'pattern' | 'principle' | 'framework' | 'insight'
  confidenceScore: number
  sourceClusterIds: string[]
  createdAt: Date
}

interface ReflectionInsight {
  id: string
  userId: string
  title: string
  description: string
  insightType: 'strategic' | 'tactical' | 'behavioral' | 'systemic'
  confidenceScore: number
  relatedPatternIds: string[]
  relatedNodeIds: string[]
  suggestedAction?: string
  createdAt: Date
}

interface PatternReport {
  id: string
  userId: string
  patternType: 'recurring' | 'unfinished' | 'emerging' | 'declining'
  title: string
  description: string
  confidenceScore: number
  sourceIds: string[]
  suggestedAction?: string
  createdAt: Date
}

interface CompressionStats {
  totalNotes: number
  totalBuckets: number
  compressionRatio: number
  lastCompression: Date
  knowledgeNodes: number
  insightsGenerated: number
}

export default function MemoryPage() {
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([])
  const [reflectionInsights, setReflectionInsights] = useState<ReflectionInsight[]>([])
  const [patternReports, setPatternReports] = useState<PatternReport[]>([])
  const [compressionStats, setCompressionStats] = useState<CompressionStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'nodes' | 'insights' | 'patterns' | 'stats'>('nodes')
  const [searchQuery, setSearchQuery] = useState('')
  const [insightTypeFilter, setInsightTypeFilter] = useState<string>('all')
  const [isCompressing, setIsCompressing] = useState(false)

  useEffect(() => {
    loadMemoryData()
  }, [])

  const loadMemoryData = async () => {
    setIsLoading(true)
    
    // Mock data for now
    setTimeout(() => {
      setKnowledgeNodes([
        {
          id: '1',
          userId: 'user-1',
          title: 'Systems Thinking Framework',
          description: 'A comprehensive approach to understanding complex systems through feedback loops, leverage points, and emergent behavior patterns',
          insightType: 'framework',
          confidenceScore: 0.92,
          sourceClusterIds: ['trading-systems', 'cognitive-os', 'productivity'],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          userId: 'user-1',
          title: 'Cognitive Load Management Principle',
          description: 'Optimal cognitive performance is achieved by managing attention rather than time, with focus sprints and deliberate recovery periods',
          insightType: 'principle',
          confidenceScore: 0.87,
          sourceClusterIds: ['productivity', 'focus', 'mental-health'],
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          userId: 'user-1',
          title: 'Trading Psychology Pattern',
          description: 'Consistent profitability comes from emotional detachment and systematic execution rather than prediction accuracy',
          insightType: 'pattern',
          confidenceScore: 0.78,
          sourceClusterIds: ['trading-psychology', 'risk-management', 'performance'],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: '4',
          userId: 'user-1',
          title: 'AI-Human Collaboration Insight',
          description: 'The most effective AI partnerships leverage complementary strengths: AI for pattern recognition, humans for context and judgment',
          insightType: 'insight',
          confidenceScore: 0.85,
          sourceClusterIds: ['ai-development', 'cognitive-os', 'productivity'],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ])

      setReflectionInsights([
        {
          id: '1',
          userId: 'user-1',
          title: 'Strategic Realignment Needed',
          description: 'Current cognitive OS development shows strong technical execution but lacks strategic user research. Need to validate assumptions before further development.',
          insightType: 'strategic',
          confidenceScore: 0.91,
          relatedPatternIds: ['1', '3'],
          relatedNodeIds: ['1', '4'],
          suggestedAction: 'Conduct user interviews and usability testing',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          userId: 'user-1',
          title: 'Tactical Process Improvement',
          description: 'Trading system development is bottlenecked by perfectionism. Implement MVP approach with iterative refinement.',
          insightType: 'tactical',
          confidenceScore: 0.84,
          relatedPatternIds: ['2'],
          relatedNodeIds: ['3'],
          suggestedAction: 'Define minimum viable trading system and ship in 2 weeks',
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          userId: 'user-1',
          title: 'Behavioral Pattern Recognition',
          description: 'Consistent context switching between trading and coding reduces effectiveness in both domains. Need dedicated focus blocks.',
          insightType: 'behavioral',
          confidenceScore: 0.88,
          relatedPatternIds: ['4'],
          relatedNodeIds: ['2'],
          suggestedAction: 'Implement time-blocking with domain-specific focus periods',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ])

      setPatternReports([
        {
          id: '1',
          userId: 'user-1',
          patternType: 'recurring',
          title: 'System Architecture Obsession',
          description: 'Consistent return to building systems and frameworks across different domains (trading, productivity, AI)',
          confidenceScore: 0.93,
          sourceIds: ['note-1', 'note-5', 'note-12', 'note-18'],
          suggestedAction: 'Leverage as core strength rather than分散注意力',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          userId: 'user-1',
          patternType: 'unfinished',
          title: 'Trading System Incomplete Loops',
          description: 'Multiple trading system implementations started but none completed to production stage',
          confidenceScore: 0.87,
          sourceIds: ['project-2', 'note-8', 'note-15'],
          suggestedAction: 'Commit to MVP completion before adding new features',
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          userId: 'user-1',
          patternType: 'emerging',
          title: 'AI Integration Focus',
          description: 'Increasing attention on AI-human collaboration and cognitive enhancement tools',
          confidenceScore: 0.76,
          sourceIds: ['note-20', 'note-25', 'note-30'],
          suggestedAction: 'Explore AI partnership opportunities and cognitive augmentation',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ])

      setCompressionStats({
        totalNotes: 47,
        totalBuckets: 8,
        compressionRatio: 0.23,
        lastCompression: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        knowledgeNodes: 4,
        insightsGenerated: 3
      })

      setIsLoading(false)
    }, 1000)
  }

  const handleManualCompression = async () => {
    setIsCompressing(true)
    
    // Simulate compression process
    setTimeout(() => {
      setCompressionStats(prev => prev ? {
        ...prev,
        lastCompression: new Date(),
        knowledgeNodes: prev.knowledgeNodes + 1,
        insightsGenerated: prev.insightsGenerated + 2
      } : null)
      setIsCompressing(false)
    }, 3000)
  }

  const getInsightTypeColor = (type: KnowledgeNode['insightType']) => {
    switch (type) {
      case 'framework': return 'bg-purple-500/20 text-purple-400'
      case 'principle': return 'bg-blue-500/20 text-blue-400'
      case 'pattern': return 'bg-green-500/20 text-green-400'
      case 'insight': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getReflectionTypeColor = (type: ReflectionInsight['insightType']) => {
    switch (type) {
      case 'strategic': return 'bg-red-500/20 text-red-400'
      case 'tactical': return 'bg-yellow-500/20 text-yellow-400'
      case 'behavioral': return 'bg-purple-500/20 text-purple-400'
      case 'systemic': return 'bg-blue-500/20 text-blue-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getPatternTypeColor = (type: PatternReport['patternType']) => {
    switch (type) {
      case 'recurring': return 'bg-green-500/20 text-green-400'
      case 'unfinished': return 'bg-orange-500/20 text-orange-400'
      case 'emerging': return 'bg-blue-500/20 text-blue-400'
      case 'declining': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const filteredNodes = knowledgeNodes.filter(node => 
    insightTypeFilter === 'all' || node.insightType === insightTypeFilter
  ).filter(node =>
    searchQuery === '' || 
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <Brain className="w-12 h-12 text-purple-400 animate-pulse" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">Loading Memory Library</div>
            <div className="text-purple-300">Compressing knowledge and generating insights...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Knowledge Library</h1>
                <p className="text-purple-300 text-sm">4-layer memory compression and insights</p>
              </div>
            </div>
            
            <button
              onClick={handleManualCompression}
              disabled={isCompressing}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isCompressing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Compressing...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Compress Memory</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Compression Stats */}
        {compressionStats && (
          <div className="mb-8">
            <div className="bg-gradient-to-r p-1 rounded-3xl from-purple-500 to-pink-500">
              <div className="bg-slate-900 rounded-3xl p-6">
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{compressionStats.totalNotes}</div>
                    <div className="text-purple-300 text-sm">Raw Notes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{compressionStats.totalBuckets}</div>
                    <div className="text-purple-300 text-sm">Idea Buckets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{(compressionStats.compressionRatio * 100).toFixed(0)}%</div>
                    <div className="text-purple-300 text-sm">Compression</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{compressionStats.knowledgeNodes}</div>
                    <div className="text-purple-300 text-sm">Knowledge Nodes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{compressionStats.insightsGenerated}</div>
                    <div className="text-purple-300 text-sm">Insights</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-purple-300 mb-1">Last Run</div>
                    <div className="text-white font-semibold">
                      <ClientDate date={compressionStats.lastCompression} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Memory Layer Visualization */}
        <div className="mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Layers className="w-6 h-6 mr-3 text-purple-400" />
              4-Layer Memory Architecture
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">1</div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Raw Notes</h4>
                <p className="text-gray-400 text-sm">Unprocessed thoughts and captures</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">2</div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Idea Buckets</h4>
                <p className="text-gray-400 text-sm">Clustered patterns and themes</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">3</div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Knowledge Nodes</h4>
                <p className="text-gray-400 text-sm">Compressed insights and principles</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                  <div className="text-white text-2xl font-bold">4</div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Reflection Insights</h4>
                <p className="text-gray-400 text-sm">Strategic synthesis and recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/10">
            {[
              { id: 'nodes', label: 'Knowledge Nodes', icon: <Brain className="w-4 h-4" /> },
              { id: 'insights', label: 'Reflection Insights', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'patterns', label: 'Pattern Reports', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'stats', label: 'Compression Stats', icon: <Target className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        {(activeTab === 'nodes' || activeTab === 'insights' || activeTab === 'patterns') && (
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge library..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
              />
            </div>
            
            {activeTab === 'nodes' && (
              <select
                value={insightTypeFilter}
                onChange={(e) => setInsightTypeFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-400"
              >
                <option value="all">All Types</option>
                <option value="framework">Frameworks</option>
                <option value="principle">Principles</option>
                <option value="pattern">Patterns</option>
                <option value="insight">Insights</option>
              </select>
            )}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'nodes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNodes.map((node) => (
              <div key={node.id} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-semibold text-white">{node.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getInsightTypeColor(node.insightType)}`}>
                        {node.insightType}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{node.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-gray-400 text-sm mb-1">Confidence</div>
                    <div className="text-2xl font-bold text-white">{(node.confidenceScore * 100).toFixed(0)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    Created: <ClientDate date={node.createdAt} />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full text-xs">
                      {node.sourceClusterIds.length} sources
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {reflectionInsights.map((insight) => (
              <div key={insight.id} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-semibold text-white">{insight.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getReflectionTypeColor(insight.insightType)}`}>
                        {insight.insightType}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{insight.description}</p>
                    
                    {insight.suggestedAction && (
                      <div className="bg-blue-400/10 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="w-4 h-4 text-blue-400" />
                          <span className="text-blue-400 font-semibold">Suggested Action</span>
                        </div>
                        <p className="text-gray-300 text-sm">{insight.suggestedAction}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-gray-400 text-sm mb-1">Confidence</div>
                    <div className="text-2xl font-bold text-white">{(insight.confidenceScore * 100).toFixed(0)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    Created: <ClientDate date={insight.createdAt} />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                      {insight.relatedPatternIds.length} patterns
                    </span>
                    <span className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded-full text-xs">
                      {insight.relatedNodeIds.length} nodes
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-6">
            {patternReports.map((pattern) => (
              <div key={pattern.id} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-xl font-semibold text-white">{pattern.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPatternTypeColor(pattern.patternType)}`}>
                        {pattern.patternType}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{pattern.description}</p>
                    
                    {pattern.suggestedAction && (
                      <div className="bg-green-400/10 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-semibold">Suggested Action</span>
                        </div>
                        <p className="text-gray-300 text-sm">{pattern.suggestedAction}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-gray-400 text-sm mb-1">Confidence</div>
                    <div className="text-2xl font-bold text-white">{(pattern.confidenceScore * 100).toFixed(0)}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-sm">
                    Created: <ClientDate date={pattern.createdAt} />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                      {pattern.sourceIds.length} sources
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && compressionStats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-4">Compression Efficiency</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Notes Processed</span>
                  <span className="text-white font-bold">{compressionStats.totalNotes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Knowledge Extracted</span>
                  <span className="text-white font-bold">{compressionStats.knowledgeNodes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Compression Ratio</span>
                  <span className="text-green-400 font-bold">{(compressionStats.compressionRatio * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-4">Insight Generation</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total Insights</span>
                  <span className="text-white font-bold">{compressionStats.insightsGenerated}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Last Compression</span>
                  <span className="text-white font-bold"><ClientDate date={compressionStats.lastCompression} /></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Avg Confidence</span>
                  <span className="text-yellow-400 font-bold">
                    {knowledgeNodes.length > 0 
                      ? (knowledgeNodes.reduce((sum, node) => sum + node.confidenceScore, 0) / knowledgeNodes.length * 100).toFixed(0)
                      : '0'}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
