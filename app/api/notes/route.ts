import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { calculateATPScore } from '@/lib/biological-coherence'

const noteSchema = z.object({
  content: z.string().min(1).max(10000),
  source_type: z.enum(['text_note', 'voice_note', 'pasted_link', 'screenshot', 'chat_saved', 'file_upload']),
  energy_level: z.number().min(0).max(100).default(50),
  lifecycle_stage: z.enum(['seed', 'sprout', 'growth', 'harvest', 'decay']).default('seed'),
  resilience_score: z.number().min(0).max(100).default(50),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = noteSchema.parse(body)
    
    // Calculate ATP score based on content
    const atpScore = calculateATPScore(validated.content)
    
    const note = await prisma.note.create({
      data: {
        title: validated.content.slice(0, 100) + (validated.content.length > 100 ? '...' : ''),
        content: validated.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        atpScore: atpScore, // Add ATP score to database
      }
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error('[notes] POST error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    
    return NextResponse.json(notes)
  } catch (error) {
    console.error('[notes] GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}
