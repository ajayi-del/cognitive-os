'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, X } from 'lucide-react'

interface Message {
  id: string
  content: string
  timestamp: Date
}

export function AICompanion() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: 'Welcome! I\'m here to help you track your ideas and stay aligned with your goals.',
      timestamp: new Date(),
    },
  ])
  const [isVisible, setIsVisible] = useState(true)
  const [isThinking, setIsThinking] = useState(false)

  // Add contextual messages based on user actions
  useEffect(() => {
    const timer = setTimeout(() => {
      addMessage("How's your focus today? I'm tracking your cognitive patterns.")
    }, 30000)
    return () => clearTimeout(timer)
  }, [])

  const addMessage = (content: string) => {
    setIsThinking(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev.slice(-2),
        {
          id: Date.now().toString(),
          content,
          timestamp: new Date(),
        },
      ])
      setIsThinking(false)
    }, 1500)
  }

  const clearMessages = () => {
    setMessages([])
  }

  if (!isVisible) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="ai-avatar"
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
        }}
      >
        <Brain className="w-8 h-8 text-white" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="ai-companion"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            layout
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="ai-bubble"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm">{message.content}</p>
              <button
                onClick={clearMessages}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="flex items-center gap-3">
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-400 bg-gray-800/80 px-3 py-1 rounded-full"
          >
            Thinking...
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ai-avatar"
          onClick={() => addMessage("I'm analyzing your cognitive patterns. Keep capturing your thoughts!")}
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.button>

        <button
          onClick={() => setIsVisible(false)}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Hide
        </button>
      </div>
    </motion.div>
  )
}
