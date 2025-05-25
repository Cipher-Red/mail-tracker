import { NextRequest, NextResponse } from 'next/server';
import { Customer } from '@/db/schema';
import { customerStorage } from '@/lib/storage-service';

// GET all customers
export async function GET() {
  try {
    // Get customers from localStorage
    const allCustomers = customerStorage.getAll();
    
    // Sort by addedAt in descending order (newest first)
    allCustomers.sort((a, b) => {
      const dateA = new Date(a.addedAt).getTime();
      const dateB = new Date(b.addedAt).getTime();
      return dateB - dateA;
    });
    
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

    // Add new customer to localStorage
    const newCustomer = customerStorage.add({
      name,
      email,
      company: company || null,
      phone: phone || null,
      address: address || null,
      tags: tags || [],
      addedAt: new Date(),
      lastContact: body.lastContact ? new Date(body.lastContact) : null,
      notes: notes || null,
    });
    
    return NextResponse.json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
