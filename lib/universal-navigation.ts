// UNIVERSAL NAVIGATION SYSTEM
// Best practice for minimize/maximize and back navigation

import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export interface NavigationState {
  canGoBack: boolean
  canGoForward: boolean
  history: string[]
  currentIndex: number
}

export function useUniversalNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [navigationState, setNavigationState] = useState<NavigationState>({
    canGoBack: false,
    canGoForward: false,
    history: [pathname],
    currentIndex: 0
  })

  // Update navigation state when pathname changes
  useEffect(() => {
    setNavigationState(prev => {
      const newHistory = [...prev.history.slice(0, prev.currentIndex + 1), pathname]
      return {
        ...prev,
        history: newHistory,
        currentIndex: newHistory.length - 1,
        canGoBack: newHistory.length > 1,
        canGoForward: false
      }
    })
  }, [pathname])

  const goBack = () => {
    if (navigationState.canGoBack) {
      const previousIndex = navigationState.currentIndex - 1
      const previousPath = navigationState.history[previousIndex]
      router.push(previousPath)
    }
  }

  const goForward = () => {
    if (navigationState.canGoForward) {
      const nextIndex = navigationState.currentIndex + 1
      const nextPath = navigationState.history[nextIndex]
      router.push(nextPath)
    }
  }

  const navigateTo = (path: string) => {
    router.push(path)
  }

  return {
    ...navigationState,
    goBack,
    goForward,
    navigateTo
  }
}

// Universal Navigation Bar Component
export function UniversalNavigationBar() {
  const { canGoBack, canGoForward, goBack, goForward } = useUniversalNavigation()

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      height: '40px',
      background: 'rgba(8, 14, 24, 0.95)',
      borderBottom: '1px solid rgba(80, 160, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
    }}>
      {/* Back/Forward buttons */}
      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        <button
          onClick={goBack}
          disabled={!canGoBack}
          style={{
            background: canGoBack ? 'rgba(59, 130, 246, 0.2)' : 'rgba(75, 85, 99, 0.2)',
            border: '1px solid rgba(80, 160, 255, 0.2)',
            borderRadius: '6px',
            padding: '6px 10px',
            color: canGoBack ? '#fff' : '#64748b',
            fontSize: '12px',
            cursor: canGoBack ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ← Back
        </button>
        <button
          onClick={goForward}
          disabled={!canGoForward}
          style={{
            background: canGoForward ? 'rgba(59, 130, 246, 0.2)' : 'rgba(75, 85, 99, 0.2)',
            border: '1px solid rgba(80, 160, 255, 0.2)',
            borderRadius: '6px',
            padding: '6px 10px',
            color: canGoForward ? '#fff' : '#64748b',
            fontSize: '12px',
            cursor: canGoForward ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          Forward →
        </button>
      </div>

      {/* Page title */}
      <div style={{
        fontSize: '14px',
        fontWeight: 500,
        color: '#fff',
      }}>
        {pathname === '/' && 'Dashboard'}
        {pathname === '/future' && 'Future Self'}
        {pathname === '/memory' && 'Memory Library'}
        {pathname === '/cognitive-map' && 'Cognitive Map'}
        {pathname === '/settings' && 'Settings'}
        {pathname === '/buckets' && 'Idea Buckets'}
        {pathname === '/projects' && 'Projects'}
        {pathname === '/chat' && 'Chat'}
        {pathname === '/notes' && 'Notes'}
        {pathname.startsWith('/face-engine') && 'Face Engine'}
      </div>

      {/* Window controls */}
      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            padding: '6px 10px',
            color: '#fff',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          ✕ Close
        </button>
      </div>
    </div>
  )
}

// Window Management Hook
export function useWindowManagement() {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const maximize = () => {
    setIsMaximized(true)
    setIsMinimized(false)
    // You can add actual window maximization logic here
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    }
  }

  const minimize = () => {
    setIsMinimized(true)
    setIsMaximized(false)
    // You can add actual window minimization logic here
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  const restore = () => {
    setIsMaximized(false)
    setIsMinimized(false)
    // You can add actual window restore logic here
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }

  const close = () => {
    // Navigate back to previous page or home
    window.history.back()
  }

  return {
    isMaximized,
    isMinimized,
    maximize,
    minimize,
    restore,
    close
  }
}

// Window Controls Component
export function WindowControls() {
  const { isMaximized, isMinimized, maximize, minimize, restore, close } = useWindowManagement()

  return (
    <div style={{
      position: 'fixed',
      top: '50px',
      right: '20px',
      display: 'flex',
      gap: '8px',
      zIndex: 1001,
    }}>
      <button
        onClick={minimize}
        disabled={isMinimized}
        style={{
          background: isMinimized ? 'rgba(75, 85, 99, 0.3)' : 'rgba(59, 130, 246, 0.2)',
          border: '1px solid rgba(80, 160, 255, 0.2)',
          borderRadius: '6px',
          padding: '8px 12px',
          color: isMinimized ? '#64748b' : '#fff',
          fontSize: '12px',
          cursor: isMinimized ? 'not-allowed' : 'pointer',
        }}
      >
        −
      </button>
      <button
        onClick={isMaximized ? restore : maximize}
        style={{
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '6px',
          padding: '8px 12px',
          color: '#fff',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        {isMaximized ? '□' : '□'}
      </button>
      <button
        onClick={close}
        style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '6px',
          padding: '8px 12px',
          color: '#fff',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        ✕
      </button>
    </div>
  )
}
