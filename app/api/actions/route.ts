import { NextResponse } from 'next/server'
import { z } from 'zod'
import { writeActionEvent } from '@/lib/canonical-events'

const actionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  status: z.enum(['pending', 'active', 'done']).default('pending'),
  sourceNoteId: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = actionSchema.parse(body)
    
    // Use canonical event writer - ONLY EVENTS MAY BE WRITTEN TO DATABASE
    const actionId = await writeActionEvent(validated.title, {
      priority: validated.priority === 'high' ? 3 : validated.priority === 'medium' ? 2 : 1,
      status: validated.status
    })

    // ── FEEDBACK LOOP: Action creation triggers pattern re-evaluation ─────────────
    // This closes Wiener's feedback loop: effectors inform control mechanism
    // Note: sourceNoteId tracking removed for canonical architecture

    return NextResponse.json({ id: actionId, success: true })
  } catch (error) {
    console.error('[actions] POST error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create action' }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Use canonical event reader
    const { getActionEvents } = await import('@/lib/canonical-events')
    const actions = await getActionEvents()
    
    // Transform back to expected format for compatibility
    const actionItems = actions.map(action => ({
      id: action.id,
      title: action.data.title,
      priority: action.data.priority,
      status: action.data.status,
      createdAt: action.timestamp,
      updatedAt: action.metadata?.updatedAt || action.timestamp
    }))
    
    return NextResponse.json(actionItems)
  } catch (error) {
    console.error('[actions] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 })
  }
}
