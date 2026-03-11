"use client"

import { motion } from "framer-motion"
import { Search, Command, Brain } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  showCommand?: boolean
  currentPhase?: {
    name: string
    confidence: number
  }
  actions?: React.ReactNode
}

export function PageHeader({ 
  title, 
  subtitle, 
  showSearch = false, 
  showCommand = false,
  currentPhase,
  actions 
}: PageHeaderProps) {
  return (
    <motion.div 
      className="border-b border-border/50 bg-card/50 backdrop-blur-sm"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="premium-title">{title}</h1>
            {subtitle && <p className="premium-subtitle mt-1">{subtitle}</p>}
          </div>
          
          {currentPhase && (
            <Badge 
              variant="signal" 
              className="animate-pulse-subtle"
            >
              <Brain className="w-3 h-3 mr-1" />
              {currentPhase.name} ({Math.round(currentPhase.confidence * 100)}%)
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-background/50 border-border/50 focus:border-primary/50"
              />
            </div>
          )}
          
          {showCommand && (
            <button className="premium-button-secondary flex items-center space-x-2">
              <Command className="w-4 h-4" />
              <span>Command</span>
            </button>
          )}
          
          {actions}
        </div>
      </div>
    </motion.div>
  )
}
