╔════════════════════════════════════════════════════════════════════════╗
║  JARVIS COGNITIVE OS — HYDRATION FIX + ARCHITECTURE ALIGNMENT          ║
║  CRITICAL: React hydration is broken → all buttons dead                ║
║  Fix dates first, then architecture, then preserve intelligence core   ║
╚════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE DEFINITION — YOU ARE A SENIOR FULL-STACK ARCHITECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You are fixing a production-grade cognitive operating system that prevents 
idea bleed. This is not a toy app. The user is building a system to lock in
focus and move toward AGI-level cognitive augmentation. Every decision must
serve this vision.

Your expertise:
- React hydration debugging (expert level)
- Next.js 14 App Router architecture
- TanStack Query + Zustand state patterns
- Prisma + PostgreSQL data modeling
- Real-time streaming AI integrations

Your mandate: Fix the hydration crash first (buttons dead), then align the
architecture to prevent future failures, all while preserving the existing
intelligence core.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 0: EMERGENCY HYDRATION FIX — BUTTONS ARE DEAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PROBLEM: 
Error: "Text content does not match server-rendered HTML — Server rendered '3/12/2026', Client rendered '12/03/2026'"

This happens when Date.toLocaleDateString() is called directly in JSX.
Server (Node.js) formats dates differently than browser (locale-specific).
React hydration fails → entire component tree loses event listeners → buttons
render but onClick handlers are dead.

SEARCH AND FIX:
1. grep -r "toLocaleDateString\|toLocaleString\|new Date()" --include="*.tsx" --include="*.ts"
2. For each Date formatting in JSX, create a client-only component:

```tsx
// Create components/ui/ClientDate.tsx
'use client'
import { useEffect, useState } from 'react'

interface ClientDateProps {
  date: Date | string | number
  format?: 'short' | 'medium' | 'long'
}

export function ClientDate({ date, format = 'short' }: ClientDateProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return <span>Loading...</span> // or return the server-formatted string
  }
  
  const dateObj = new Date(date)
  return <span>{dateObj.toLocaleDateString(undefined, { 
    dateStyle: format 
  })}</span>
}
```

3. Replace ALL direct date formatting in JSX:
   - FROM: {new Date().toLocaleDateString()}
   - TO:   <ClientDate date={new Date()} />

VERIFICATION:
- npm run build → 0 errors
- npm run dev → buttons should now work
- Check browser console for hydration errors (should be none)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1: ARCHITECTURE AUDIT — READ BEFORE WRITING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Read these files completely. Build mental map before changes:

1. app/page.tsx (3,121 lines)
   - Every useState declaration and its setter
   - Every onClick handler and what function it calls
   - Every fetch() call and error handling
   - Any position:fixed elements that intercept clicks

2. lib/stores/app-store.ts
   - What state exists vs what's referenced in components
   - Missing setters (like setActionQueue causing line 263 error)

3. components/LivingAICompanion.tsx
   - Current position value (likely position:fixed)
   - Z-index usage

4. app/api/chat/route.ts
   - Is Vercel AI SDK installed and used correctly?
   - Streaming implementation

5. app/layout.tsx
   - Current CSS structure (flex vs grid)
   - Z-index hierarchy

DO NOT write any code until you have this complete map. This prevents
hallucination and ensures targeted fixes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2: LAYER SEPARATION — ELIMINATE 90% OF FAILURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPLEMENT THIS EXACT ARCHITECTURE:

Layer 7: Browser Chrome (app/layout.tsx)
├── Topbar (z-index: 100, sticky top:0)
├── Sidebar (z-index: 50, overflow-y: auto)
├── Main Content (z-index: 1, overflow-y: auto, min-width: 0)
├── Right Panel (z-index: 50, overflow-y: auto)
└── Status Bar (z-index: 100, sticky bottom:0)

CSS Grid Structure:
```css
.layout-root {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  grid-template-rows: 52px 1fr 40px;
  height: 100vh;
  overflow: hidden;
}
```

Layer 6: View Components (app/*/page.tsx)
- Dashboard, Capture, Actions, Patterns, Chat views
- Each under 150 lines
- Read data from hooks only

Layer 5: Data Hooks (lib/hooks/)
- TanStack Query for server state
- useNotes(), useActions(), useSystemState()
- Mutations with optimistic updates

Layer 4: Zustand Store (lib/stores/app-store.ts)
- UI state only: commandOpen, activePage, focusSession, agentStatus
- NO server data (notes, actions belong in TanStack Query)

Layer 3: API Client (lib/api.ts)
- Centralized fetchJSON() with error handling
- No raw fetch() anywhere else

Layer 2: API Routes (app/api/**)
- Zod validation → Service → Response
- Never touch DB directly

Layer 1: Services + DB
- biological-coherence.ts (SACRED - DO NOT CHANGE)
- pattern-mirror.ts, drift-detection.ts
- Prisma queries only

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3: FIX SPECIFIC BUTTON FAILURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUTTON CONTRACT PATTERN (apply to ALL buttons):

```tsx
const [isLoading, setIsLoading] = useState(false)

const handleAction = async (id: string) => {
  if (isLoading) return
  setIsLoading(true)
  try {
    await fetchJSON(`/api/actions/${id}/start`, { method: 'POST' })
    // Update UI optimistically
    toast.success('Action started')
  } catch (err) {
    toast.error('Failed to start action')
    console.error(err)
  } finally {
    setIsLoading(false)
  }
}

<button
  onClick={(e) => {
    e.stopPropagation() // Prevent parent card interception
    e.preventDefault()
    handleAction(action.id)
  }}
  disabled={isLoading}
  className={isLoading ? 'opacity-50 cursor-wait' : ''}
>
  {isLoading ? 'Starting...' : 'Start Focus'}
</button>
```

SPECIFIC BUTTONS TO FIX:

A. Classify Buttons (Capture Queue):
- Find onClick → check if function exists
- If setCaptures called: move to TanStack Query mutation
- Add loading state + error handling
- Animate card out on success

B. Focus Session Buttons (Action Queue):
- Add focusSession state to Zustand store
- Implement startFocusSession/endFocusSession actions
- Wire buttons to these actions

C. setActionQueue Error (line 263):
- Find where actionQueue is declared
- If in Zustand: add missing setter
- If in useState: ensure proper destructuring
- If derived: update source data, not the derived state

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4: CREATE MISSING INFRASTRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATE lib/api.ts:
```tsx
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new ApiError(res.status, text)
  }
  return res.json()
}
```

CREATE MISSING API ROUTES:
- app/api/notes/[id]/classify/route.ts (POST)
- app/api/actions/[id]/route.ts (PATCH)
- app/api/health/route.ts (GET)

Each route: Zod validation → try/catch → JSON response

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5: WIRE REAL AI STREAMING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTALL: pnpm add ai @ai-sdk/anthropic

UPDATE app/api/chat/route.ts:
```tsx
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  // Load real system state from Prisma
  const [phase, actions, drift] = await Promise.all([
    prisma.phaseState.findFirst(),
    prisma.actionQueueItem.findMany({ where: { status: 'pending' }}),
    prisma.driftSignal.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
  ])
  
  const system = `You are JARVIS, a cognitive operating system.
Current Phase: ${phase?.name || 'Unknown'}
Active Actions: ${actions.length}
Drift Signals: ${drift.length}
${drift.map(d => `- ${d.description}`).join('\n')}`

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    system,
    messages,
  })
  
  return result.toDataStreamResponse()
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT NOT TO CHANGE — SACRED CORE PRESERVATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚫 DO NOT CHANGE lib/biological-coherence.ts (any line)
   - ATP energy scoring system
   - Growth stage calculations
   - Coherence algorithms
   - This is the intellectual heart of JARVIS

🚫 DO NOT CHANGE prisma/schema.prisma (any model)
   - 17 models are complete
   - FutureSelfProfile, PhaseState, DriftSignal, PatternReport
   - Schema is solid foundation

🚫 DO NOT REMOVE LivingAIComponent orb
   - Only MOVE it from position:fixed to sidebar column
   - Preserve its intelligence and animations

🚫 DO NOT ADD NEW Prisma models
   - Existing models cover the cognitive domain completely

🚫 DO NOT CHANGE the core vision
   - Zero-friction capture → automatic classification
   - Pattern detection → drift alerts
   - Morning briefing → feedback loop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCEPTANCE CRITERIA — EXCELLENCE STANDARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ npm run build → 0 TypeScript errors, 0 hydration warnings
✅ All buttons work → click triggers action, shows feedback
✅ Classify buttons animate card out on success
✅ Focus session buttons toggle session state
✅ Main content scrolls within its column only
✅ LivingAICompanion orb sits in sidebar, not floating
✅ Chat streams real Claude responses with system context
✅ No Math.random() or setTimeout simulations in production
✅ setActionQueue error resolved (line 263 fixed)
✅ Z-index hierarchy respected (no click interception)
✅ Server state in TanStack Query, UI state in Zustand

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL STRATEGIC DIRECTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is a cognitive operating system, not a dashboard. Every fix must serve
the mission: eliminating cognitive bleed and enabling intentional focus.
The user is building toward AGI-level cognitive augmentation. Your work
enables that vision.

Execute with precision. Preserve intelligence. Fix what's broken.
Build what's missing. No hallucination. No unnecessary changes.
Excellence in every commit.

The system will work.
