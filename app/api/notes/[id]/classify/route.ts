import { NextRequest, NextResponse } from 'next/server'
import { fetchJSON, ApiError } from '@/lib/api'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { type } = await request.json()
    
    if (!['project', 'idea', 'action', 'archive'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid classification type' },
        { status: 400 }
      )
    }

    // TODO: Implement actual Prisma update
    // For now, simulate successful classification
    const updatedNote = {
      id: params.id,
      classified: true,
      classifiedAs: type,
      updatedAt: new Date().toISOString()
    }

    // If type is 'action', create action queue item
    if (type === 'action') {
      // TODO: Create ActionQueueItem in Prisma
      console.log('Would create action for note:', params.id)
    }

    return NextResponse.json(updatedNote)
  } catch (error) {
    console.error('Classify note error:', error)
    return NextResponse.json(
      { error: 'Failed to classify note' },
      { status: 500 }
    )
  }
}
