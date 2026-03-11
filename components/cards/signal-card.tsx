"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface SignalCardProps {
  title: string
  description?: string
  signalStrength: 'high' | 'medium' | 'low'
  confidence: number
  metadata?: {
    noteCount?: number
    lastUpdated?: string
    tags?: string[]
  }
  actions?: React.ReactNode
  className?: string
  delay?: number
}

export function SignalCard({
  title,
  description,
  signalStrength,
  confidence,
  metadata,
  actions,
  className,
  delay = 0
}: SignalCardProps) {
  const getSignalColor = (strength: typeof signalStrength) => {
    switch (strength) {
      case 'high': return 'signal-high'
      case 'medium': return 'signal-medium'
      case 'low': return 'signal-low'
      default: return 'signal-low'
    }
  }

  const getSignalVariant = (strength: typeof signalStrength) => {
    switch (strength) {
      case 'high': return 'success' as const
      case 'medium': return 'warning' as const
      case 'low': return 'default' as const
      default: return 'default' as const
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
    >
      <Card className={cn(
        "premium-card-hover border-l-4",
        getSignalColor(signalStrength),
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg leading-tight">{title}</CardTitle>
              {description && (
                <p className="premium-body mt-1 text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            
            <div className="flex flex-col items-end space-y-2 ml-4">
              <Badge variant={getSignalVariant(signalStrength)} className="capitalize">
                {signalStrength} Signal
              </Badge>
              
              <div className="text-right">
                <div className="premium-meta">Confidence</div>
                <div className="text-sm font-semibold text-foreground">
                  {Math.round(confidence * 100)}%
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Confidence Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Signal Strength</span>
              <span className="font-medium">{Math.round(confidence * 100)}%</span>
            </div>
            <Progress 
              value={confidence * 100} 
              className="h-2"
            />
          </div>
          
          {/* Metadata */}
          {metadata && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                {metadata.noteCount && (
                  <span>{metadata.noteCount} notes</span>
                )}
                {metadata.lastUpdated && (
                  <span>Updated {metadata.lastUpdated}</span>
                )}
              </div>
              
              {metadata.tags && metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {metadata.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {metadata.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{metadata.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Actions */}
          {actions && (
            <div className="flex items-center space-x-2 pt-2">
              {actions}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
