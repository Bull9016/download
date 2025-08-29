
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    const filter = role ? { role } : {};

    const users = await User.find(filter).sort({ joinedDate: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error('API GET /api/users Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
    }
    const body = await request.json();
    
    // Hash the password before saving
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }
    
    const newUser = await User.create(body);
    const { password, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error: any) {
    console.error('API POST /api/users Error:', error);
    // Handle duplicate key error for email
    if (error.code === 11000) {
      return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
