import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

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
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('API GET /api/projects/[id] Error:', error);
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
        const updatedProject = await Project.findByIdAndUpdate(id, body, { new: true });
        if (!updatedProject) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error('API PUT /api/projects/[id] Error:', error);
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
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('API DELETE /api/projects/[id] Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
