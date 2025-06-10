import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { archives } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET all archives
export async function GET() {
  try {
    const allArchives = await db.select().from(archives);
    return NextResponse.json(allArchives);
  } catch (error) {
    console.error('Error fetching archives:', error);
    return NextResponse.json(
      { error: 'Failed to fetch archives' },
      { status: 500 }
    );
  }
}

// POST a new archive
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, fileName, uploadDate, fileSize, contentType, supabasePath, metadata } = body;

    if (!id || !fileName) {
      return NextResponse.json(
        { error: 'ID and fileName are required' },
        { status: 400 }
      );
    }

    // Insert archive record
    const result = await db.insert(archives)
      .values({
        id,
        fileName,
        uploadDate: new Date(uploadDate),
        fileSize,
        contentType,
        supabasePath,
        metadata: metadata || {}
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating archive record:', error);
    return NextResponse.json(
      { error: 'Failed to create archive record' },
      { status: 500 }
    );
  }
}

// DELETE an archive
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Archive ID is required' },
        { status: 400 }
      );
    }

    // Delete the archive record
    const deletedArchive = await db.delete(archives)
      .where(eq(archives.id, id))
      .returning();

    if (!deletedArchive.length) {
      return NextResponse.json(
        { error: 'Archive not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedArchive: deletedArchive[0] });
  } catch (error) {
    console.error('Error deleting archive:', error);
    return NextResponse.json(
      { error: 'Failed to delete archive' },
      { status: 500 }
    );
  }
}
