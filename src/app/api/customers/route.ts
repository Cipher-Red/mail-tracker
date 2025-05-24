import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { customers, NewCustomer } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

// GET all customers
export async function GET() {
  try {
    const allCustomers = await db.select().from(customers).orderBy(desc(customers.addedAt));
    return NextResponse.json(allCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, address, tags, notes } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const newCustomer: NewCustomer = {
      name,
      email,
      company: company || null,
      phone: phone || null,
      address: address || null,
      tags: tags || [],
      addedAt: new Date(),
      lastContact: body.lastContact ? new Date(body.lastContact) : null,
      notes: notes || null,
    };

    const result = await db.insert(customers).values(newCustomer).returning();
    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
