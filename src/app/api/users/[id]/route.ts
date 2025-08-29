import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, context: { params: Params }) {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
    }
    const { id } = context.params;
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('API GET /api/users/[id] Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Params }) {
    try {
        const conn = await dbConnect();
        if (!conn) {
            return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
        }
        const { id } = context.params;
        const body = await request.json();
        const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('API PUT /api/users/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: Params }) {
    try {
        const conn = await dbConnect();
        if (!conn) {
            return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
        }
        const { id } = context.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('API DELETE /api/users/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
