"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    trend: 'up' | 'down' | 'neutral'
  }
  description?: string
  icon?: React.ReactNode
  className?: string
  delay?: number
}

export function MetricCard({
  title,
  value,
  change,
  description,
  icon,
  className,
  delay = 0
}: MetricCardProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />
      case 'neutral': return <Minus className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      case 'neutral': return 'text-muted-foreground'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
    >
      <Card className={cn("premium-card", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="premium-subtitle uppercase tracking-wider">
              {title}
            </CardTitle>
            {icon}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <div className="text-2xl font-bold text-foreground">
              {value}
            </div>
            
            {change && (
              <div className={cn("flex items-center space-x-1", getTrendColor(change.trend))}>
                {getTrendIcon(change.trend)}
                <span className="text-sm font-medium">
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
              </div>
            )}
          </div>
          
          {description && (
            <p className="premium-body text-muted-foreground">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
