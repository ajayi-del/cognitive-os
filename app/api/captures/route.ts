import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { captures } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

// Simple user ID for now - replace with real auth later
const getUserId = () => 'default-user';

// GET /api/captures - List all captures for user
export async function GET() {
  try {
    const userId = getUserId();

    const userCaptures = await db.query.captures.findMany({
      where: eq(captures.userId, userId),
      orderBy: desc(captures.createdAt),
    });

    return NextResponse.json(userCaptures);
  } catch (error) {
    console.error('Error fetching captures:', error);
    return NextResponse.json({ error: 'Failed to fetch captures' }, { status: 500 });
  }
}

// POST /api/captures - Create new capture
export async function POST(request: Request) {
  try {
    const userId = getUserId();

    const body = await request.json();
    
    const newCapture = await db.insert(captures).values({
      userId,
      sourceType: body.sourceType || 'text_note',
      rawContent: body.rawContent,
      processedStatus: 'unprocessed',
      suggestedRoute: 'idea_bucket',
      energyLevel: 50,
      lifecycleStage: 'seed',
      resilienceScore: 10,
      lastFed: new Date(),
      relatedCaptureIds: [],
      metadata: body.metadata || {},
    }).returning();

    return NextResponse.json(newCapture[0], { status: 201 });
  } catch (error) {
    console.error('Error creating capture:', error);
    return NextResponse.json({ error: 'Failed to create capture' }, { status: 500 });
  }
}

// PATCH /api/captures/:id - Update capture (routing, energy, etc.)
export async function PATCH(request: Request) {
  try {
    const userId = getUserId();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const body = await request.json();
    
    const updated = await db.update(captures)
      .set({
        processedStatus: body.processedStatus,
        suggestedRoute: body.suggestedRoute,
        energyLevel: body.energyLevel,
        lifecycleStage: body.lifecycleStage,
        resilienceScore: body.resilienceScore,
        lastFed: body.lastFed ? new Date(body.lastFed) : undefined,
        relatedCaptureIds: body.relatedCaptureIds,
        updatedAt: new Date(),
      })
      .where(eq(captures.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Error updating capture:', error);
    return NextResponse.json({ error: 'Failed to update capture' }, { status: 500 });
  }
}

// DELETE /api/captures/:id - Delete capture
export async function DELETE(request: Request) {
  try {
    const userId = getUserId();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await db.delete(captures).where(eq(captures.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting capture:', error);
    return NextResponse.json({ error: 'Failed to delete capture' }, { status: 500 });
  }
}
