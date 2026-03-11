'use client'

import { useState, useEffect, useRef } from 'react'
import { Brain, Network, Zap, Target, Filter, Search, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface CognitiveMapNode {
  id: string
  userId: string
  nodeType: 'note' | 'bucket' | 'project' | 'theme' | 'insight'
  refId?: string
  title: string
  score: number
  frequency: number
  embedding?: number[]
  metadata?: any
  createdAt: Date
}

interface CognitiveMapEdge {
  id: string
  userId: string
  sourceId: string
  targetId: string
  edgeType: 'similarity' | 'belonging' | 'evolution' | 'causal'
  weight: number
  explanation?: string
  createdAt: Date
}

interface MapFilters {
  timeRange?: { start: Date; end: Date }
  nodeTypes?: string[]
  projectIds?: string[]
  clusterIds?: string[]
  minScore?: number
  edgeTypes?: string[]
}

export default function CognitiveMapPage() {
  const [nodes, setNodes] = useState<CognitiveMapNode[]>([])
  const [edges, setEdges] = useState<CognitiveMapEdge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<CognitiveMapNode | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<CognitiveMapEdge | null>(null)
  const [filters, setFilters] = useState<MapFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    loadCognitiveMap()
  }, [])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (nodes.length > 0) {
        // Update node scores and frequencies
        setNodes(prev => prev.map(node => ({
          ...node,
          score: Math.max(0.1, Math.min(1, node.score + (Math.random() - 0.5) * 0.1)),
          frequency: Math.max(1, node.frequency + Math.floor(Math.random() * 3))
        })))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [nodes.length])

  const loadCognitiveMap = async () => {
    setIsLoading(true)
    
    // Mock data for now
    setTimeout(() => {
      const mockNodes: CognitiveMapNode[] = [
        {
          id: '1',
          userId: 'user-1',
          nodeType: 'project',
          refId: 'project-1',
          title: 'Cognitive OS Development',
          score: 0.92,
          frequency: 47,
          metadata: { status: 'active', priority: 'high' },
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          userId: 'user-1',
          nodeType: 'bucket',
          refId: 'bucket-1',
          title: 'Trading System Architecture',
          score: 0.87,
          frequency: 23,
          metadata: { signalStrength: 0.87, recurring: true },
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          userId: 'user-1',
          nodeType: 'insight',
          refId: 'insight-1',
          title: 'Systems Thinking Framework',
          score: 0.95,
          frequency: 15,
          metadata: { confidenceScore: 0.92, sourceClusters: ['trading', 'cognitive-os'] },
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: '4',
          userId: 'user-1',
          nodeType: 'theme',
          refId: 'theme-1',
          title: 'AI-Human Collaboration',
          score: 0.78,
          frequency: 31,
          metadata: { emerging: true, trend: 'increasing' },
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        },
        {
          id: '5',
          userId: 'user-1',
          nodeType: 'note',
          refId: 'note-1',
          title: 'Pattern Recognition Insights',
          score: 0.65,
          frequency: 8,
          metadata: { tags: ['trading', 'patterns', 'research'] },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '6',
          userId: 'user-1',
          nodeType: 'project',
          refId: 'project-2',
          title: 'Trading System Implementation',
          score: 0.73,
          frequency: 19,
          metadata: { status: 'planning', domain: 'trading' },
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: '7',
          userId: 'user-1',
          nodeType: 'bucket',
          refId: 'bucket-2',
          title: 'Productivity Optimization',
          score: 0.81,
          frequency: 27,
          metadata: { signalStrength: 0.81, promoted: false },
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
        },
        {
          id: '8',
          userId: 'user-1',
          nodeType: 'insight',
          refId: 'insight-2',
          title: 'Cognitive Load Management',
          score: 0.88,
          frequency: 12,
          metadata: { confidenceScore: 0.87, principle: true },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]

      const mockEdges: CognitiveMapEdge[] = [
        {
          id: '1',
          userId: 'user-1',
          sourceId: '1',
          targetId: '3',
          edgeType: 'belonging',
          weight: 0.85,
          explanation: 'Cognitive OS project contains systems thinking insights',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          userId: 'user-1',
          sourceId: '2',
          targetId: '6',
          edgeType: 'evolution',
          weight: 0.92,
          explanation: 'Trading system bucket evolved into active project',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          userId: 'user-1',
          sourceId: '1',
          targetId: '4',
          edgeType: 'similarity',
          weight: 0.78,
          explanation: 'Cognitive OS shares AI collaboration themes',
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
        },
        {
          id: '4',
          userId: 'user-1',
          sourceId: '3',
          targetId: '8',
          edgeType: 'causal',
          weight: 0.71,
          explanation: 'Systems thinking led to cognitive load insights',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: '5',
          userId: 'user-1',
          sourceId: '7',
          targetId: '8',
          edgeType: 'belonging',
          weight: 0.83,
          explanation: 'Productivity bucket contains cognitive load insights',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: '6',
          userId: 'user-1',
          sourceId: '5',
          targetId: '2',
          edgeType: 'belonging',
          weight: 0.67,
          explanation: 'Pattern recognition notes belong to trading bucket',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
      ]

      setNodes(mockNodes)
      setEdges(mockEdges)
      setIsLoading(false)
    }, 1000)
  }

  const getNodeColor = (nodeType: CognitiveMapNode['nodeType']) => {
    switch (nodeType) {
      case 'project': return '#8b5cf6' // purple
      case 'bucket': return '#3b82f6' // blue
      case 'insight': return '#10b981' // green
      case 'theme': return '#f59e0b' // orange
      case 'note': return '#6b7280' // gray
      default: return '#6b7280'
    }
  }

  const getEdgeColor = (edgeType: CognitiveMapEdge['edgeType']) => {
    switch (edgeType) {
      case 'similarity': return '#3b82f6' // blue
      case 'belonging': return '#10b981' // green
      case 'evolution': return '#8b5cf6' // purple
      case 'causal': return '#f59e0b' // orange
      default: return '#6b7280'
    }
  }

  const getNodeSize = (frequency: number) => {
    return Math.max(20, Math.min(60, frequency * 2))
  }

  const getEdgeWidth = (weight: number) => {
    return Math.max(1, Math.min(8, weight * 10))
  }

  const handleNodeClick = (node: CognitiveMapNode) => {
    setSelectedNode(node)
    setSelectedEdge(null)
  }

  const handleEdgeClick = (edge: CognitiveMapEdge) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3))
  }

  const handleReset = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Calculate node positions using force-directed layout
  const nodePositions = nodes.map((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2
    const radius = 200 + (node.score * 100)
    return {
      node,
      x: 400 + Math.cos(angle) * radius + offset.x,
      y: 300 + Math.sin(angle) * radius + offset.y
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <Network className="w-12 h-12 text-indigo-400 animate-pulse" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">Building Cognitive Map</div>
            <div className="text-indigo-300">Analyzing connections and relationships...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <Network className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Cognitive Map</h1>
                <p className="text-indigo-300 text-sm">Interactive visualization of thought networks</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes..."
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-indigo-400" />
              Filters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-indigo-300 mb-2">Node Types</label>
                <div className="space-y-2">
                  {['project', 'bucket', 'insight', 'theme', 'note'].map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.nodeTypes?.includes(type) || false}
                        onChange={(e) => {
                          setFilters(prev => ({
                            ...prev,
                            nodeTypes: e.target.checked
                              ? [...(prev.nodeTypes || []), type]
                              : (prev.nodeTypes || []).filter(t => t !== type)
                          }))
                        }}
                        className="rounded border-white/20 bg-white/10 text-indigo-400 focus:ring-indigo-400"
                      />
                      <span className="text-gray-300 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-indigo-300 mb-2">Min Score</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.minScore || 0}
                  onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <div className="text-gray-400 text-sm">{(filters.minScore || 0).toFixed(1)}</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legend</h3>
            <div className="space-y-2">
              {['project', 'bucket', 'insight', 'theme', 'note'].map(type => (
                <div key={type} className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getNodeColor(type as any) }}
                  />
                  <span className="text-gray-300 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Map Visualization */}
          <div className="flex-1 relative">
            <svg
              ref={svgRef}
              className="w-full h-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <g transform={`scale(${zoom})`}>
                {/* Edges */}
                {edges.map(edge => {
                  const sourcePos = nodePositions.find(p => p.node.id === edge.sourceId)
                  const targetPos = nodePositions.find(p => p.node.id === edge.targetId)
                  
                  if (!sourcePos || !targetPos) return null
                  
                  return (
                    <g key={edge.id}>
                      <line
                        x1={sourcePos.x}
                        y1={sourcePos.y}
                        x2={targetPos.x}
                        y2={targetPos.y}
                        stroke={getEdgeColor(edge.edgeType)}
                        strokeWidth={getEdgeWidth(edge.weight)}
                        strokeOpacity={0.6}
                        className="cursor-pointer hover:stroke-opacity-100"
                        onClick={() => handleEdgeClick(edge)}
                      />
                      <line
                        x1={sourcePos.x}
                        y1={sourcePos.y}
                        x2={targetPos.x}
                        y2={targetPos.y}
                        stroke="white"
                        strokeWidth={getEdgeWidth(edge.weight)}
                        strokeOpacity={0}
                        className="cursor-pointer hover:stroke-opacity-30"
                        onClick={() => handleEdgeClick(edge)}
                      />
                    </g>
                  )
                })}
                
                {/* Nodes */}
                {nodePositions.map(({ node, x, y }) => (
                  <g key={node.id}>
                    <circle
                      cx={x}
                      cy={y}
                      r={getNodeSize(node.frequency)}
                      fill={getNodeColor(node.nodeType)}
                      fillOpacity={0.8}
                      stroke="white"
                      strokeWidth={selectedNode?.id === node.id ? 3 : 1}
                      strokeOpacity={selectedNode?.id === node.id ? 1 : 0.5}
                      className="cursor-pointer hover:fill-opacity-100"
                      onClick={() => handleNodeClick(node)}
                    />
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      pointerEvents="none"
                    >
                      {node.title.length > 15 ? node.title.substring(0, 15) + '...' : node.title}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>

          {/* Details Panel */}
          <div className="w-80 bg-black/20 backdrop-blur-xl border-l border-white/10 p-6">
            {(selectedNode || selectedEdge) ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
                
                {selectedNode && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Type</div>
                      <div className="text-white capitalize">{selectedNode.nodeType}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Title</div>
                      <div className="text-white">{selectedNode.title}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Score</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${selectedNode.score * 100}%` }}
                          />
                        </div>
                        <span className="text-white">{(selectedNode.score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Frequency</div>
                      <div className="text-white">{selectedNode.frequency} mentions</div>
                    </div>
                    
                    {selectedNode.metadata && (
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Metadata</div>
                        <div className="bg-white/10 rounded-lg p-3">
                          <pre className="text-gray-300 text-xs overflow-auto">
                            {JSON.stringify(selectedNode.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Created</div>
                      <div className="text-white">{new Date(selectedNode.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
                
                {selectedEdge && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Edge Type</div>
                      <div className="text-white capitalize">{selectedEdge.edgeType}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Weight</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${selectedEdge.weight * 100}%` }}
                          />
                        </div>
                        <span className="text-white">{(selectedEdge.weight * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    
                    {selectedEdge.explanation && (
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Explanation</div>
                        <div className="text-white">{selectedEdge.explanation}</div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Created</div>
                      <div className="text-white">{new Date(selectedEdge.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a node or edge to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
