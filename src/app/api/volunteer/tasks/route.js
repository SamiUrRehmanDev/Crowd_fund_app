import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';
import Campaign from '@/lib/models/Campaign';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const urgency = searchParams.get('urgency');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'available';
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;

    // Build query filter
    const filter = {};
    
    // Filter by status
    if (status === 'available') {
      filter.$or = [
        { assignedTo: { $exists: false } },
        { assignedTo: null },
        { assignedTo: session.user.id, status: { $in: ['assigned', 'in_progress'] } }
      ];
      filter.status = { $in: ['pending', 'assigned', 'in_progress'] };
      filter.deadline = { $gte: new Date() };
    } else if (status === 'my_tasks') {
      filter.assignedTo = session.user.id;
    }

    // Apply filters
    if (category && category !== 'all') {
      filter.type = category;
    }
    
    if (urgency && urgency !== 'all') {
      filter.priority = urgency;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Location filter (simplified - in real app, use geo queries)
    if (location) {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }

    // Get tasks from database
    const tasks = await Task.find(filter)
      .populate('campaign', 'title organization location rating')
      .populate('createdBy', 'name organization')
      .populate('assignedTo', 'name')
      .sort({ priority: -1, deadline: 1, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const totalTasks = await Task.countDocuments(filter);

    // Format tasks for frontend
    const formattedTasks = tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      organization: task.campaign?.organization || task.createdBy?.organization || 'Unknown',
      organizationRating: task.campaign?.rating || 4.5,
      location: task.location?.address || task.campaign?.location?.address || 'Remote',
      urgency: task.priority,
      category: task.type,
      estimatedHours: task.estimatedHours || 0,
      deadline: task.deadline?.toISOString().split('T')[0] || null,
      requirements: task.requirements || [],
      skillsRequired: task.skillsRequired || [],
      posted: task.createdAt?.toISOString(),
      status: task.status,
      progress: task.progress || 0,
      assignedTo: task.assignedTo ? {
        id: task.assignedTo._id?.toString() || task.assignedTo.toString(),
        name: task.assignedTo.name
      } : null,
      campaign: task.campaign ? {
        id: task.campaign._id.toString(),
        title: task.campaign.title
      } : null,
      actualHours: task.actualHours || 0,
      maxVolunteers: 1, // For now, assuming 1 volunteer per task
      applicants: 0 // This would need a separate tracking system
    }));

    return NextResponse.json({
      tasks: formattedTasks,
      pagination: {
        total: totalTasks,
        page,
        limit,
        pages: Math.ceil(totalTasks / limit),
        hasMore: page * limit < totalTasks
      }
    });
  } catch (error) {
    console.error('Tasks API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// Apply for a task
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, message } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    await connectDB();

    // Check if task exists and is available
    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.assignedTo && task.assignedTo.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Task already assigned' }, { status: 400 });
    }

    if (task.status === 'completed' || task.status === 'cancelled') {
      return NextResponse.json({ error: 'Task is no longer available' }, { status: 400 });
    }

    // Assign task to volunteer
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        assignedTo: session.user.id,
        status: 'assigned',
        actualStartDate: new Date()
      },
      { new: true }
    ).populate('campaign', 'title');

    // TODO: Create notification for admin about task assignment
    // TODO: Log this action in audit trail

    return NextResponse.json({
      success: true,
      message: 'Successfully applied for task',
      task: {
        id: updatedTask._id.toString(),
        title: updatedTask.title,
        status: updatedTask.status,
        assignedDate: updatedTask.actualStartDate?.toISOString()
      }
    });

  } catch (error) {
    console.error('Task application error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
