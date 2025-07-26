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

    const volunteerId = session.user.id;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Get all verification tasks
    const allVerifications = await Task.find({ type: 'verification' })
      .populate('campaign', 'title organization location rating')
      .populate('createdBy', 'name organization')
      .populate('assignedTo', 'name')
      .sort({ priority: -1, deadline: 1, createdAt: -1 })
      .lean();

    // Format verifications for frontend
    const formattedVerifications = allVerifications.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      type: getVerificationType(task.description, task.title),
      urgency: task.priority,
      requesterName: task.createdBy?.name || 'Unknown',
      organization: task.campaign?.organization || task.createdBy?.organization || 'Unknown',
      location: task.location?.address || task.campaign?.location?.address || 'Remote',
      requestDate: task.createdAt?.toISOString(),
      estimatedHours: task.estimatedHours || 2,
      deadline: task.deadline?.toISOString(),
      requirements: task.requirements || [],
      attachments: [], // Would be populated from task documents
      status: task.status,
      progress: task.progress || 0,
      assignedTo: task.assignedTo ? {
        id: task.assignedTo._id?.toString() || task.assignedTo.toString(),
        name: task.assignedTo.name
      } : null,
      submittedAt: task.status === 'review' ? task.updatedAt?.toISOString() : null,
      findings: task.results?.findings || [],
      verificationStatus: task.results?.verificationStatus || 'pending',
      contactInfo: {
        phone: '(555) 123-4567', // This would come from campaign/user data
        email: task.createdBy?.email || 'contact@organization.com'
      },
      beneficiaryInfo: {
        name: task.campaign?.title || 'Case Request',
        situation: task.description
      }
    }));

    // Group by status for the frontend
    const groupedVerifications = {
      available: formattedVerifications.filter(v => 
        !v.assignedTo && v.status === 'pending' && 
        (!v.deadline || new Date(v.deadline) >= new Date())
      ),
      inProgress: formattedVerifications.filter(v => 
        v.assignedTo && v.assignedTo.id === volunteerId && 
        ['assigned', 'in_progress'].includes(v.status)
      ),
      completed: formattedVerifications.filter(v => 
        v.assignedTo && v.assignedTo.id === volunteerId && 
        v.status === 'completed'
      ),
      submitted: formattedVerifications.filter(v => 
        v.assignedTo && v.assignedTo.id === volunteerId && 
        v.status === 'review'
      )
    };

    return NextResponse.json({
      verifications: groupedVerifications,
      total: formattedVerifications.length
    });

  } catch (error) {
    console.error('Verifications API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// Helper function to determine verification type based on content
function getVerificationType(description, title) {
  const text = (description + ' ' + title).toLowerCase();
  
  if (text.includes('medical') || text.includes('health') || text.includes('hospital')) {
    return 'medical';
  } else if (text.includes('housing') || text.includes('home') || text.includes('shelter')) {
    return 'housing';
  } else if (text.includes('education') || text.includes('school') || text.includes('student')) {
    return 'education';
  } else if (text.includes('family') || text.includes('household') || text.includes('members')) {
    return 'family';
  }
  
  return 'family'; // default
}
