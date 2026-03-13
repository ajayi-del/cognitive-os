// 🎨 Design Tokens - JARVIS OS Institutional Design System

export const tokens = {
  // Colors - Bloomberg Terminal meets Arc Browser
  colors: {
    // Backgrounds
    bg: {
      primary: '#060810',      // Near-black
      secondary: '#0c1018',    // Dark blue
      tertiary: '#161e2e',     // Slightly lighter
      surface: '#0a0a0a',     // Card backgrounds
      glass: 'rgba(17, 17, 17, 0.8)', // Glass morphism
    },
    
    // Text
    text: {
      primary: '#c8d8f0',     // Main text
      secondary: '#6880a0',   // Secondary text
      tertiary: '#3a4f70',    // Muted text
      inverse: '#060810',    // On dark backgrounds
    },
    
    // Semantic Colors
    semantic: {
      success: '#10b981',     // Green
      warning: '#f59e0b',     // Yellow
      error: '#ef4444',       // Red
      info: '#06b6d4',       // Blue
      accent: '#4090ff',     // Bright blue
    },
    
    // Border
    border: {
      primary: 'rgba(255, 255, 255, 0.1)',
      secondary: 'rgba(255, 255, 255, 0.05)',
      focus: 'rgba(64, 144, 255, 0.5)',
      interactive: 'rgba(96, 160, 255, 0.25)',
    },
    
    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #1a40cc 0%, #4090ff 100%)',
      secondary: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      glass: 'linear-gradient(135deg, rgba(17, 17, 17, 0.8) 0%, rgba(26, 26, 26, 0.8) 100%)',
    },
  },
  
  // Typography
  typography: {
    fonts: {
      sans: ['Syne', 'system-ui'],
      mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Ubuntu Mono', 'monospace'],
      display: ['Syne', 'system-ui'],
    },
    
    sizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',        // 16px
      lg: '1.125rem',      // 18px
      xl: '1.25rem',       // 20px
      '2xl': '1.5rem',     // 24px
      '3xl': '1.875rem',    // 28px
    },
    
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    
    weights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',      // 4px
    sm: '0.5rem',       // 8px
    md: '1rem',         // 16px
    lg: '1.5rem',       // 24px
    xl: '2rem',         // 32px
    '2xl': '3rem',       // 48px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',      // 4px
    md: '0.375rem',     // 6px
    lg: '0.5rem',       // 8px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',        // 16px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glow: '0 0 20px rgba(64, 144, 255, 0.3)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Z-Index
  zIndex: {
    base: '0',
    overlay: '10',
    modal: '50',
    tooltip: '100',
    max: '9999',
  },
} as const

// CSS Custom Properties for Tailwind
export const cssVars = {
  '--color-bg-primary': tokens.colors.bg.primary,
  '--color-bg-secondary': tokens.colors.bg.secondary,
  '--color-bg-tertiary': tokens.colors.bg.tertiary,
  '--color-bg-surface': tokens.colors.bg.surface,
  '--color-bg-glass': tokens.colors.bg.glass,
  
  '--color-text-primary': tokens.colors.text.primary,
  '--color-text-secondary': tokens.colors.text.secondary,
  '--color-text-tertiary': tokens.colors.text.tertiary,
  '--color-text-inverse': tokens.colors.text.inverse,
  
  '--color-success': tokens.colors.semantic.success,
  '--color-warning': tokens.colors.semantic.warning,
  '--color-error': tokens.colors.semantic.error,
  '--color-info': tokens.colors.semantic.info,
  '--color-accent': tokens.colors.semantic.accent,
  
  '--color-border-primary': tokens.colors.border.primary,
  '--color-border-secondary': tokens.colors.border.secondary,
  '--color-border-focus': tokens.colors.border.focus,
  '--color-border-interactive': tokens.colors.border.interactive,
  
  '--gradient-primary': tokens.colors.gradients.primary,
  '--gradient-secondary': tokens.colors.gradients.secondary,
  '--gradient-success': tokens.colors.gradients.success,
  '--gradient-glass': tokens.colors.gradients.glass,
  
  '--font-sans': tokens.typography.fonts.sans.join(', '),
  '--font-mono': tokens.typography.fonts.mono.join(', '),
  '--font-display': tokens.typography.fonts.display.join(', '),
  
  '--text-xs': tokens.typography.sizes.xs,
  '--text-sm': tokens.typography.sizes.sm,
  '--text-base': tokens.typography.sizes.base,
  '--text-lg': tokens.typography.sizes.lg,
  '--text-xl': tokens.typography.sizes.xl,
  '--text-2xl': tokens.typography.sizes['2xl'],
  '--text-3xl': tokens.typography.sizes['3xl'],
  
  '--space-xs': tokens.spacing.xs,
  '--space-sm': tokens.spacing.sm,
  '--space-md': tokens.spacing.md,
  '--space-lg': tokens.spacing.lg,
  '--space-xl': tokens.spacing.xl,
  '--space-2xl': tokens.spacing['2xl'],
  
  '--radius-sm': tokens.borderRadius.sm,
  '--radius-md': tokens.borderRadius.md,
  '--radius-lg': tokens.borderRadius.lg,
  '--radius-xl': tokens.borderRadius.xl,
  '--radius-2xl': tokens.borderRadius['2xl'],
  
  '--shadow-sm': tokens.shadows.sm,
  '--shadow-md': tokens.shadows.md,
  '--shadow-lg': tokens.shadows.lg,
  '--shadow-xl': tokens.shadows.xl,
  '--shadow-glow': tokens.shadows.glow,
  
  '--transition-fast': tokens.transitions.fast,
  '--transition-normal': tokens.transitions.normal,
  '--transition-slow': tokens.transitions.slow,
}
