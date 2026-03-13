'use client'

import dynamic from 'next/dynamic'

export const GardenView = dynamic(
  () => import('./GardenView').then(mod => mod.default),
  { ssr: false, loading: () => null }
)
