// UNIVERSAL BACK BUTTON COMPONENT
// Add to all pages for consistent navigation

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeft, Home, Menu } from 'lucide-react'
import { useState } from 'react'

interface UniversalBackButtonProps {
  showHome?: boolean
  showMenu?: boolean
  customBackPath?: string
}

export function UniversalBackButton({ 
  showHome = true, 
  showMenuProp = false, 
  customBackPath 
}: UniversalBackButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [showMenu, setShowMenuState] = useState(false)

  const handleBack = () => {
    if (customBackPath) {
      router.push(customBackPath)
    } else if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const handleHome = () => {
    router.push('/')
  }

  const handleMenu = () => {
    setShowMenuState(prev => !prev)
  }

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      left: '20px',
      zIndex: 1000,
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    }}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          background: 'rgba(8, 14, 24, 0.95)',
          border: '1px solid rgba(80, 160, 255, 0.2)',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(8, 14, 24, 0.95)'
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Home Button */}
      {showHome && pathname !== '/' && (
        <button
          onClick={handleHome}
          style={{
            background: 'rgba(8, 14, 24, 0.95)',
            border: '1px solid rgba(80, 160, 255, 0.2)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#fff',
          }}
        >
          Home
        </button>
      )}
      
      {/* Menu Button */}
      {showMenuProp && (
        <button
          onClick={handleMenu}
          style={{
            background: 'rgba(8, 14, 24, 0.95)',
            border: '1px solid rgba(80, 160, 255, 0.2)',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#fff',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(8, 14, 24, 0.95)'
          }}
        >
          <Menu size={16} />
          Menu
        </button>
      )}

      {/* Dropdown Menu */}
      {showMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          marginTop: '8px',
          background: 'rgba(8, 14, 24, 0.95)',
          border: '1px solid rgba(80, 160, 255, 0.2)',
          borderRadius: '8px',
          padding: '8px 0',
          minWidth: '200px',
          backdropFilter: 'blur(10px)',
          zIndex: 1001,
        }}>
          {[
            { path: '/future', label: 'Future Self' },
            { path: '/memory', label: 'Memory Library' },
            { path: '/cognitive-map', label: 'Cognitive Map' },
            { path: '/settings', label: 'Settings' },
            { path: '/buckets', label: 'Idea Buckets' },
            { path: '/projects', label: 'Projects' },
            { path: '/chat', label: 'Chat' },
            { path: '/notes', label: 'Notes' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                width: '100%',
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                color: pathname === item.path ? '#3b82f6' : '#fff',
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// HOOK FOR AUTOMATIC BACK BUTTON
export function useUniversalBack() {
  const router = useRouter()
  const pathname = usePathname()

  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const canGoBack = window.history.length > 1 || pathname !== '/'

  return { goBack, canGoBack }
}
