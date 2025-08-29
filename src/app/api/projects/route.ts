import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 500 });
    }
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('API GET /api/projects Error:', error);
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

    // The createdBy field should be passed from the frontend, containing the logged-in user's ID.
    if (!body.createdBy) {
        return NextResponse.json({ message: 'Project creator ID is required.' }, { status: 400 });
    }
    
    const newProject = await Project.create(body);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('API POST /api/projects Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
