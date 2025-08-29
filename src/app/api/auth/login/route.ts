
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
    }

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }
    
    if (!user.password) {
      // This case might happen if a user was created without a password (e.g. social login)
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    // Return user data without the password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error('API POST /api/auth/login Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
