'use client'

import { useEffect, useState } from 'react'

interface ClientDateProps {
  date: Date | string | number
  format?: 'short' | 'medium' | 'long'
}

export function ClientDate({ date, format = 'short' }: ClientDateProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <span className="text-gray-400">Loading...</span>
  }
  
  const dateObj = new Date(date)
  
  const formatOptions = {
    short: { dateStyle: 'short' } as const,
    medium: { dateStyle: 'medium' } as const,
    long: { dateStyle: 'long' } as const,
  }
  
  return <span>{dateObj.toLocaleDateString(undefined, formatOptions[format])}</span>
}
