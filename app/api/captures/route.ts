import { NextResponse } from 'next/server'
import { writeCaptureEvent } from '@/lib/canonical-events'
import { coordinateCell } from '@/lib/organism-coordinator'
import { prisma } from '@/lib/prisma'
import { embeddingQueue } from '@/lib/queue'

// Placeholder until auth is implemented
const getUserId = () => 'default-user'

// GET /api/captures
export async function GET() {
  try {
    // Use canonical event reader
    const { getCaptureEvents } = await import('@/lib/canonical-events')
    const captures = await getCaptureEvents()
    
    // Transform back to expected format for compatibility
    const notes = captures.map(capture => ({
      id: capture.id,
      content: capture.data.content,
      title: capture.data.title,
      createdAt: capture.timestamp,
      updatedAt: capture.metadata?.updatedAt || capture.timestamp,
      userId: capture.metadata?.userId,
      atpScore: capture.data.atpScore
    }))
    
    return NextResponse.json(notes)
  } catch (error) {
    console.error('[captures GET]', error)
    return NextResponse.json({ error: 'Failed to fetch captures' }, { status: 500 })
  }
}

// POST /api/captures
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Use canonical event writer - ONLY EVENTS MAY BE WRITTEN TO DATABASE
    const captureId = await writeCaptureEvent(
      body.content || body.rawContent || '',
      {
        title: body.title,
        userId: getUserId(),
        atpScore: body.atpScore
      }
    )
    
    // ── BOGDANOV'S ORGANIZING ACTIVITY: Cell becomes organism ─────────────────────
    // Each capture is a complete cell, coordinated into organism
    coordinateCell(captureId, body.content || body.rawContent || '')
      .catch(() => {}) // fire-and-forget - capture save is primary
    
    // ── SEMANTIC SEARCH: Queue embedding generation ─────────────────────────────
    // Fire-and-forget embedding job for semantic search
    try {
      const content = body.content || body.rawContent || ''
      await embeddingQueue.add('generate-embedding', {
        noteId: captureId,
        content: content,
      }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      }).catch(() => {}) // swallow queue errors
    } catch { /* intentionally empty - embedding failure should not break capture */ }
    
    // Fire-and-forget — must NEVER affect capture save
    try {
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/nexus/heartbeat`, {
        method: 'POST'
      }).catch(() => {}) // swallow all errors
    } catch { /* intentionally empty */ }
    
    return NextResponse.json({ id: captureId, success: true }, { status: 201 })
  } catch (error) {
    console.error('[captures POST]', error)
    return NextResponse.json({ error: 'Failed to create capture' }, { status: 500 })
  }
}

// PATCH /api/captures?id=xxx
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const body = await request.json()

    // Build update data from only provided fields
    const data: Record<string, unknown> = {}
    if (body.title !== undefined) data.title = body.title
    if (body.content !== undefined) data.content = body.content
    if (body.atpScore !== undefined) data.atpScore = body.atpScore

    const updated = await prisma.note.update({
      where: { id },
      data,
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('[captures PATCH]', error)
    return NextResponse.json({ error: 'Failed to update capture' }, { status: 500 })
  }
}

// DELETE /api/captures?id=xxx
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await prisma.note.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[captures DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete capture' }, { status: 500 })
  }
}
