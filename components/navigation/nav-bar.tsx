'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, Home, MessageSquare, FileText, Target, Briefcase, Zap, Layers, Target as TargetIcon, Network, Code, Settings, Menu, X } from 'lucide-react'

const navigationItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/buckets', label: 'Buckets', icon: Target },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/actions', label: 'Actions', icon: Zap },
  { href: '/phase', label: 'Phase', icon: Layers },
  { href: '/future', label: 'Future Self', icon: TargetIcon },
  { href: '/memory', label: 'Memory', icon: Brain },
  { href: '/cognitive-map', label: 'Cognitive Map', icon: Network },
  { href: '/self-mod', label: 'Self-Mod', icon: Code },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const getNavItemClass = (href: string) => {
    const isActive = pathname === href
    return `
      relative px-4 py-3 rounded-xl transition-all duration-300
      ${isActive 
        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
        : 'text-gray-400 hover:text-white hover:bg-white/10'
      }
      group
    `
  }

  const getIconClass = (href: string) => {
    const isActive = pathname === href
    return `
      w-5 h-5 transition-all duration-300
      ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}
    `
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-black/70 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Cognitive OS</h2>
              <p className="text-xs text-gray-400">Navigation</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavItemClass(item.href)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className={getIconClass(item.href)} />
                  <span className="font-medium">{item.label}</span>
                </div>
                
                {/* Active indicator */}
                {pathname === item.href && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-xl">
          <div className="bg-slate-900/95 backdrop-blur-xl border-r border-white/10 h-full w-80 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Cognitive OS</h2>
                <p className="text-xs text-gray-400">Navigation</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={getNavItemClass(item.href)}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className={getIconClass(item.href)} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  
                  {/* Active indicator */}
                  {pathname === item.href && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
