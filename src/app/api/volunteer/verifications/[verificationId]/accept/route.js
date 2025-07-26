import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { verificationId } = params;

    if (!verificationId) {
      return NextResponse.json({ error: 'Verification ID is required' }, { status: 400 });
    }

    await connectDB();

    // Check if task exists and is available
    const task = await Task.findById(verificationId);
    
    if (!task || task.type !== 'verification') {
      return NextResponse.json({ error: 'Verification task not found' }, { status: 404 });
    }

    if (task.assignedTo && task.assignedTo.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Task already assigned to another volunteer' }, { status: 400 });
    }

    if (task.status === 'completed' || task.status === 'cancelled') {
      return NextResponse.json({ error: 'Task is no longer available' }, { status: 400 });
    }

    // Assign task to volunteer
    const updatedTask = await Task.findByIdAndUpdate(
      verificationId,
      {
        assignedTo: session.user.id,
        status: 'assigned',
        actualStartDate: new Date()
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully accepted verification task',
      task: {
        id: updatedTask._id.toString(),
        title: updatedTask.title,
        status: updatedTask.status,
        assignedDate: updatedTask.actualStartDate
      }
    });

  } catch (error) {
    console.error('Verification acceptance error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
