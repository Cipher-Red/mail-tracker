import { NextRequest, NextResponse } from 'next/server';
import { templateStorage } from '@/lib/storage-service';

// GET all templates
export async function GET() {
  try {
    // Get templates from localStorage and sort by updatedAt
    const templates = templateStorage.getAll();
    
    // Sort by updatedAt in descending order (newest first)
    templates.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });
    
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST a new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, preheader, content } = body;

    if (!name || !subject || !content) {
      return NextResponse.json(
        { error: 'Name, subject, and content are required' },
        { status: 400 }
      );
    }

    // Add new template to localStorage
    const newTemplate = templateStorage.add({
      name,
      subject,
      preheader: preheader || '',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
