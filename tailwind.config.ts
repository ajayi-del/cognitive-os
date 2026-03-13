import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Colors
      colors: {
        background: {
          DEFAULT: '#060810',
          secondary: '#0c1018',
          tertiary: '#161e2e',
          surface: '#0a0a0a',
          glass: 'rgba(17, 17, 17, 0.8)',
        },
        text: {
          DEFAULT: '#c8d8f0',
          secondary: '#6880a0',
          tertiary: '#3a4f70',
          inverse: '#060810',
          muted: '#3a4f70',
        },
        primary: {
          DEFAULT: '#4090ff',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#10b981',
          foreground: '#ffffff',
        },
        warning: {
          DEFAULT: '#f59e0b',
          foreground: '#ffffff',
        },
        error: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        info: {
          DEFAULT: '#06b6d4',
          foreground: '#ffffff',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          focus: 'rgba(64, 144, 255, 0.5)',
        },
      },
      
      // Typography
      fontFamily: {
        sans: ['Syne', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'Ubuntu Mono', 'monospace'],
        display: ['Syne', 'system-ui'],
      },
      
      // Animation
      keyframes: {
        'neural-pulse': {
          '0%, 100%': {
            opacity: '0.3',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.05)',
          },
        },
        'biological-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(64, 144, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(64, 144, 255, 0.5)',
          },
        },
      },
      animation: {
        'neural-pulse': 'neural-pulse 2s ease-in-out infinite',
        'biological-glow': 'biological-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
