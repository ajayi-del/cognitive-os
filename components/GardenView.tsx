'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface IdeaNodeProps {
  position: [number, number, number]
  energy: number
  lifecycle: 'seed' | 'sprout' | 'growth' | 'harvest' | 'decay'
  content: string
}

function IdeaNode({ position, energy, lifecycle, content }: IdeaNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const color = useMemo(() => {
    switch (lifecycle) {
      case 'seed': return '#4ade80'
      case 'sprout': return '#60a5fa'
      case 'growth': return '#f59e0b'
      case 'harvest': return '#f87171'
      case 'decay': return '#6b7280'
      default: return '#8b5cf6'
    }
  }, [lifecycle])

  const size = useMemo(() => {
    const base = 0.5
    const energyMultiplier = energy / 100
    return base + energyMultiplier * 0.5
  }, [energy])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      // Pulsing effect based on energy
      const pulse = 1 + Math.sin(state.clock.elapsedTime * (energy / 50)) * 0.1
      meshRef.current.scale.setScalar(size * pulse)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={energy / 200}
        roughness={0.3}
        metalness={0.7}
      />
    </mesh>
  )
}

function ConnectionLine({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  }, [start, end])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#8b5cf6" opacity={0.3} transparent />
    </line>
  )
}

function FloatingParticles() {
  const points = useMemo(() => {
    const p = []
    for (let i = 0; i < 100; i++) {
      p.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      )
    }
    return new Float32Array(p)
  }, [])

  const ref = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

interface GardenViewProps {
  captures: Array<{
    id: string
    content: string
    energy_level: number
    lifecycle_stage: string
  }>
}

export function GardenView({ captures }: GardenViewProps) {
  const nodes = useMemo(() => {
    return captures.map((capture, index) => ({
      id: capture.id,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      energy: capture.energy_level,
      lifecycle: capture.lifecycle_stage as IdeaNodeProps['lifecycle'],
      content: capture.content,
    }))
  }, [captures])

  return (
    <div className="garden-canvas">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={0.5} />

        <FloatingParticles />

        {nodes.map((node, i) => (
          <IdeaNode
            key={node.id}
            position={node.position}
            energy={node.energy}
            lifecycle={node.lifecycle}
            content={node.content}
          />
        ))}

        {/* Connect nearby nodes */}
        {nodes.map((node1, i) =>
          nodes.slice(i + 1).map((node2, j) => {
            const distance = Math.sqrt(
              Math.pow(node1.position[0] - node2.position[0], 2) +
              Math.pow(node1.position[1] - node2.position[1], 2) +
              Math.pow(node1.position[2] - node2.position[2], 2)
            )
            if (distance < 4) {
              return (
                <ConnectionLine
                  key={`${node1.id}-${node2.id}`}
                  start={node1.position}
                  end={node2.position}
                />
              )
            }
            return null
          })
        )}
      </Canvas>
    </div>
  )
}
