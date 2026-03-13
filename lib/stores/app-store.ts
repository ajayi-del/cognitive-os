import { create } from 'zustand'

// ═══ TYPES ════════════════════════════════════════════════════════
type AgentStatus = 'idle' | 'thinking' | 'error' | 'offline'
type ActivePage = 'dashboard' | 'capture' | 'actions' | 'patterns' | 'chat' | 'voice'

interface AppStore {
  // ─── UI STATE ───────────────────────────────────────────────────
  commandOpen: boolean
  activePage: ActivePage
  sidebarExpanded: boolean

  // ─── FOCUS SESSION ──────────────────────────────────────────────
  focusSessionActive: boolean
  focusActionId: string | null
  focusStartedAt: number | null

  // ─── AGENT STATUS (drives orb + status bar) ─────────────────────
  activeAgents: Record<string, AgentStatus>

  // ─── ACTIONS ────────────────────────────────────────────────────
  setCommandOpen: (v: boolean) => void
  setActivePage: (p: ActivePage) => void
  setSidebarExpanded: (v: boolean) => void
  startFocusSession: (actionId: string) => void
  endFocusSession: () => void
  setAgentStatus: (agent: string, status: AgentStatus) => void
}

export const useAppStore = create<AppStore>((set) => ({
  // ─── DEFAULTS ───────────────────────────────────────────────────
  commandOpen: false,
  activePage: 'dashboard',
  sidebarExpanded: true,
  focusSessionActive: false,
  focusActionId: null,
  focusStartedAt: null,
  activeAgents: {
    claude: 'idle',
    deepseek: 'offline',
    gemini: 'offline',
    ollama: 'offline',
  },

  // ─── IMPLEMENTATIONS ────────────────────────────────────────────
  setCommandOpen: (v) => set({ commandOpen: v }),
  setActivePage: (p) => set({ activePage: p }),
  setSidebarExpanded: (v) => set({ sidebarExpanded: v }),

  startFocusSession: (actionId) => set({
    focusSessionActive: true,
    focusActionId: actionId,
    focusStartedAt: Date.now(),
  }),

  endFocusSession: () => set({
    focusSessionActive: false,
    focusActionId: null,
    focusStartedAt: null,
  }),

  setAgentStatus: (agent, status) => set((s) => ({
    activeAgents: { ...s.activeAgents, [agent]: status },
  })),
}))

// ─── NOTE: actionQueue, notes, systemState DO NOT belong here ────
// Those are server state → use TanStack Query in lib/hooks/
