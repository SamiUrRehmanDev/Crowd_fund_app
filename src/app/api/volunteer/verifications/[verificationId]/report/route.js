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
    const { status, findings, recommendations, evidence } = await request.json();

    if (!verificationId) {
      return NextResponse.json({ error: 'Verification ID is required' }, { status: 400 });
    }

    await connectDB();

    // Check if task exists and is assigned to this volunteer
    const task = await Task.findById(verificationId);
    
    if (!task || task.type !== 'verification') {
      return NextResponse.json({ error: 'Verification task not found' }, { status: 404 });
    }

    if (!task.assignedTo || task.assignedTo.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Task not assigned to you' }, { status: 403 });
    }

    if (task.status === 'completed' || task.status === 'cancelled') {
      return NextResponse.json({ error: 'Task is already completed or cancelled' }, { status: 400 });
    }

    // Update task with verification results
    const updatedTask = await Task.findByIdAndUpdate(
      verificationId,
      {
        status: 'review',
        progress: 100,
        actualCompletionDate: new Date(),
        results: {
          summary: findings || 'Verification completed',
          findings: Array.isArray(findings) ? findings : [findings],
          recommendations: Array.isArray(recommendations) ? recommendations : [recommendations],
          evidence: evidence || [],
          verificationStatus: status || 'verified'
        }
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Verification report submitted successfully',
      task: {
        id: updatedTask._id.toString(),
        title: updatedTask.title,
        status: updatedTask.status,
        submittedAt: updatedTask.actualCompletionDate
      }
    });

  } catch (error) {
    console.error('Verification report submission error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
