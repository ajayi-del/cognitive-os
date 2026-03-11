'use client'

import { motion } from 'framer-motion'
import { 
  Flame, 
  Target, 
  Zap, 
  TrendingUp, 
  Award,
  Star,
  Trophy,
  CheckCircle2,
  Clock,
  Brain
} from 'lucide-react'

interface StreakData {
  currentStreak: number
  longestStreak: number
  todayCompleted: boolean
  weekProgress: number[] // 0 or 1 for each day
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress: number
  maxProgress: number
}

interface UserStats {
  focusMinutes: number
  capturesToday: number
  alignmentScore: number
  level: number
  xp: number
  maxXp: number
}

interface GamificationPanelProps {
  streak: StreakData
  stats: UserStats
  achievements?: Achievement[]
}

export function GamificationPanel({ streak, stats, achievements }: GamificationPanelProps) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  
  return (
    <div className="gamification-panel">
      {/* Header Stats */}
      <div className="stats-header">
        <div className="level-badge">
          <div className="level-icon">
            <Brain className="w-5 h-5" />
          </div>
          <div className="level-info">
            <span className="level-number">Level {stats.level}</span>
            <div className="xp-bar">
              <div 
                className="xp-fill" 
                style={{ width: `${(stats.xp / stats.maxXp) * 100}%` }}
              />
            </div>
            <span className="xp-text">{stats.xp} / {stats.maxXp} XP</span>
          </div>
        </div>
        
        <div className="quick-stats">
          <div className="stat-pill">
            <Zap className="w-4 h-4" />
            <span>{stats.focusMinutes}m</span>
          </div>
          <div className="stat-pill">
            <Target className="w-4 h-4" />
            <span>{stats.alignmentScore}%</span>
          </div>
        </div>
      </div>

      {/* Streak Section */}
      <div className="streak-section">
        <div className="streak-header">
          <div className="current-streak">
            <Flame className={`w-6 h-6 ${streak.currentStreak > 0 ? 'text-orange-500' : 'text-gray-500'}`} />
            <div className="streak-count">
              <span className="streak-number">{streak.currentStreak}</span>
              <span className="streak-label">day streak</span>
            </div>
          </div>
          <div className="longest-streak">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Best: {streak.longestStreak}</span>
          </div>
        </div>
        
        {/* Week Progress */}
        <div className="week-progress">
          {streak.weekProgress.map((completed, index) => (
            <div 
              key={index} 
              className={`day-pill ${completed ? 'completed' : ''} ${index === 6 && streak.todayCompleted ? 'today' : ''}`}
            >
              <span>{days[index]}</span>
              {completed && <div className="check-mark">✓</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {achievements && achievements.length > 0 && (
        <div className="achievements-section">
          <h4 className="section-title">Recent Achievements</h4>
          <div className="achievements-grid">
            {achievements.slice(0, 3).map((achievement) => (
              <motion.div
                key={achievement.id}
                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="achievement-icon">
                  {achievement.unlocked ? achievement.icon : <Star className="w-5 h-5" />}
                </div>
                <div className="achievement-info">
                  <span className="achievement-title">{achievement.title}</span>
                  <div className="achievement-progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">{achievement.progress}/{achievement.maxProgress}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Goal */}
      <div className="daily-goal">
        <div className="goal-header">
          <CheckCircle2 className="w-5 h-5" />
          <span>Daily Goal</span>
        </div>
        <div className="goal-progress">
          <div className="goal-item">
            <span>Captures</span>
            <div className="goal-bar">
              <div className="goal-fill" style={{ width: `${Math.min((stats.capturesToday / 5) * 100, 100)}%` }} />
            </div>
            <span>{stats.capturesToday}/5</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Progress Ring Component
export function ProgressRing({ 
  progress, 
  size = 60, 
  strokeWidth = 4, 
  children 
}: { 
  progress: number
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-ring-svg">
        <circle
          className="progress-ring-bg"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className="progress-ring-fill"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="progress-ring-content">
        {children}
      </div>
    </div>
  )
}

// Alignment Indicator Component
export function AlignmentIndicator({ score }: { score: number }) {
  let color = '#22c55e'
  let label = 'Aligned'
  
  if (score < 60) {
    color = '#ef4444'
    label = 'Critical'
  } else if (score < 75) {
    color = '#f59e0b'
    label = 'Drifting'
  }

  return (
    <div className="alignment-indicator">
      <ProgressRing progress={score} size={80} strokeWidth={6}>
        <div className="alignment-score" style={{ color }}>
          <span className="score-value">{score}</span>
          <span className="score-unit">%</span>
        </div>
      </ProgressRing>
      <div className="alignment-status">
        <span className="status-label" style={{ color }}>{label}</span>
        <TrendingUp className="w-4 h-4" style={{ color }} />
      </div>
    </div>
  )
}

// Motivational Message Component
export function MotivationalBanner({ 
  streak, 
  capturesToday 
}: { 
  streak: number
  capturesToday: number 
}) {
  let message = "Start your day with a capture"
  let subtext = "Every thought matters"
  
  if (streak > 0) {
    if (capturesToday >= 5) {
      message = "🔥 Outstanding work today!"
      subtext = `You're on a ${streak}-day streak. Keep the momentum!`
    } else if (capturesToday >= 3) {
      message = "💪 Great progress!"
      subtext = `Only ${5 - capturesToday} more captures to complete your daily goal`
    } else {
      message = "🎯 Back on track!"
      subtext = `${5 - capturesToday} captures remaining for today's goal`
    }
  }

  return (
    <motion.div 
      className="motivational-banner"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="banner-content">
        <span className="banner-emoji">{message.split(' ')[0]}</span>
        <div className="banner-text">
          <span className="banner-message">{message.split(' ').slice(1).join(' ')}</span>
          <span className="banner-subtext">{subtext}</span>
        </div>
      </div>
    </motion.div>
  )
}
