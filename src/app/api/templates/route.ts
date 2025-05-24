import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { emailTemplates, NewEmailTemplate } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

// GET all templates
export async function GET() {
  try {
    const templates = await db.select().from(emailTemplates).orderBy(desc(emailTemplates.updatedAt));
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

    const newTemplate: NewEmailTemplate = {
      name,
      subject,
      preheader: preheader || '',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.insert(emailTemplates).values(newTemplate).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
