import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/nexus/messages — fetch Nexus Feed messages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const messages = await prisma.nexusMessage.findMany({
      where: unreadOnly ? { isRead: false } : {},
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
    })
    
    const unreadCount = await prisma.nexusMessage.count({
      where: { isRead: false }
    })
    
    return NextResponse.json({ messages, unreadCount })
  } catch (error) {
    console.error('[nexus messages GET]', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// PATCH /api/nexus/messages?id=xxx — mark read or take action
export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    
    const body = await request.json()
    
    const updated = await prisma.nexusMessage.update({
      where: { id },
      data: {
        ...(body.isRead !== undefined && { isRead: body.isRead }),
        ...(body.actionTaken && {
          actionTaken: body.actionTaken,
          actionTakenAt: new Date()
        }),
      }
    })
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('[nexus messages PATCH]', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

// POST /api/nexus/messages — create a message (called by nexus-engine only)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const message = await prisma.nexusMessage.create({
      data: {
        type: body.type,
        priority: body.priority ?? 1,
        title: body.title,
        content: typeof body.content === 'string'
          ? body.content
          : JSON.stringify(body.content),
        requiresAction: body.requiresAction ?? false,
        relatedIds: JSON.stringify(body.relatedIds ?? []),
      }
    })
    
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('[nexus messages POST]', error)
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}
