'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface MiniMapProps {
  captures: Array<{
    id: string
    content: string
    energy_level: number
    lifecycle_stage: string
  }>
  connections: Array<[string, string]>
}

export function MiniMap({ captures, connections }: MiniMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || captures.length === 0) return

    const width = 200
    const height = 200
    const radius = 90
    const centerX = width / 2
    const centerY = height / 2

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Create gradient background
    const defs = svg.append('defs')
    const gradient = defs.append('radialGradient')
      .attr('id', 'miniMapGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(139, 92, 246, 0.2)')

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(17, 24, 39, 0)')

    // Background circle
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', radius)
      .attr('fill', 'url(#miniMapGradient)')
      .attr('stroke', 'rgba(139, 92, 246, 0.3)')
      .attr('stroke-width', 1)

    // Position captures in a circle
    const angleStep = (2 * Math.PI) / Math.max(captures.length, 1)
    const positions = new Map<string, [number, number]>()

    captures.forEach((capture, i) => {
      const angle = i * angleStep - Math.PI / 2
      const distance = radius * 0.7
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      positions.set(capture.id, [x, y])

      // Draw connections first (behind nodes)
      connections.forEach(([id1, id2]) => {
        if (id1 === capture.id || id2 === capture.id) {
          const otherId = id1 === capture.id ? id2 : id1
          const otherPos = positions.get(otherId)
          if (otherPos) {
            svg.append('line')
              .attr('x1', x)
              .attr('y1', y)
              .attr('x2', otherPos[0])
              .attr('y2', otherPos[1])
              .attr('stroke', 'rgba(139, 92, 246, 0.3)')
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', '2,2')
          }
        }
      })

      // Draw node
      const isHighEnergy = capture.energy_level > 70
      const color = isHighEnergy ? '#f59e0b' : '#8b5cf6'
      const size = 4 + (capture.energy_level / 100) * 4

      // Glow effect for high energy
      if (isHighEnergy) {
        svg.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', size + 4)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 2)
          .attr('opacity', 0.5)
      }

      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', size)
        .attr('fill', color)
        .attr('class', 'mini-map-node')
    })

    // Draw center (user)
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', 6)
      .attr('fill', '#ffffff')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 2)

  }, [captures, connections])

  return (
    <div className="mini-map">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
      />
    </div>
  )
}
