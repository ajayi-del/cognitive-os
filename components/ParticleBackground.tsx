'use client'

import { useEffect, useMemo, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function ParticleBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const options = useMemo(
    () => ({
      fullScreen: false,
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'grab',
          },
        },
        modes: {
          grab: {
            distance: 200,
            links: {
              opacity: 0.8,
              color: '#ffffff',
            },
            line_linked: {
              opacity: 0.8,
            },
          },
        },
      },
      particles: {
        color: {
          value: ['#ffffff', '#a78bfa', '#c4b5fd', '#e9d5ff'],
        },
        links: {
          color: '#ffffff',
          distance: 150,
          enable: true,
          opacity: 0.15,
          width: 1,
        },
        move: {
          direction: 'none' as const,
          enable: true,
          outModes: {
            default: 'bounce' as const,
          },
          random: true,
          speed: 0.8,
          straight: false,
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200,
          },
        },
        number: {
          density: {
            enable: true,
            area: 1000,
          },
          value: 80,
        },
        opacity: {
          value: { min: 0.3, max: 0.8 },
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 3 },
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.5,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    []
  )

  if (!init) {
    return null
  }

  return (
    <div className="particle-bg">
      <Particles
        id="tsparticles"
        options={options}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
