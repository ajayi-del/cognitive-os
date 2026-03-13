'use client'

import dynamic from 'next/dynamic'

export const LivingAICompanion = dynamic(
  () => import('./LivingAICompanion').then(mod => mod.default),
  { ssr: false, loading: () => null }
)
