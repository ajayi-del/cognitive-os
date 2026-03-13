"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Brain, 
  Home, 
  MessageSquare, 
  FileText, 
  Target, 
  Briefcase, 
  Zap, 
  Layers, 
  Target as TargetIcon, 
  Network, 
  Code, 
  Settings,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigationGroups = [
  {
    title: "Core",
    items: [
      { href: "/", label: "Dashboard", icon: Home },
      { href: "/chat", label: "Chat", icon: MessageSquare },
      { href: "/notes", label: "Notes", icon: FileText },
    ]
  },
  {
    title: "Cognition",
    items: [
      { href: "/buckets", label: "Idea Buckets", icon: Target },
      { href: "/projects", label: "Projects", icon: Briefcase },
      { href: "/actions", label: "Action Queue", icon: Zap },
    ]
  },
  {
    title: "Intelligence",
    items: [
      { href: "/phase", label: "Phase Engine", icon: Layers },
      { href: "/future", label: "Future Self", icon: TargetIcon },
      { href: "/memory", label: "Memory Library", icon: Brain },
    ]
  },
  {
    title: "Systems",
    items: [
      { href: "/cognitive-map", label: "Cognitive Map", icon: Network },
      { href: "/self-mod", label: "Self-Mod", icon: Code },
      { href: "/settings", label: "Settings", icon: Settings },
    ]
  }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <motion.aside 
      className="premium-sidebar w-64 min-h-screen p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8 px-3">
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">JARVIS Cognitive OS</h2>
          <p className="text-xs text-muted-foreground">Nexus Active</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-6">
        {navigationGroups.map((group, groupIndex) => (
          <div key={group.title}>
            <h3 className="j-label mb-3 px-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "premium-nav-item flex items-center space-x-3",
                      isActive && "premium-nav-item-active"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="w-1.5 h-1.5 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Status */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="premium-card-elevated p-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <div className="flex-1">
              <div className="text-xs font-medium text-foreground">System Active</div>
              <div className="text-xs text-muted-foreground">All engines running</div>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
