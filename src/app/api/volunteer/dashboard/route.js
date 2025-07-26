import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Task from '@/lib/models/Task';
import Campaign from '@/lib/models/Campaign';
import Notification from '@/lib/models/Notification';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const volunteerId = session.user.id;

    // Get volunteer user data
    const volunteer = await User.findById(volunteerId).lean();
    if (!volunteer) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    // Calculate stats from database
    const completedTasks = await Task.find({
      assignedTo: volunteerId,
      status: 'completed'
    }).lean();

    const totalHours = completedTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
    
    // Calculate average rating from completed tasks
    const ratedTasks = completedTasks.filter(task => task.adminReview?.rating);
    const averageRating = ratedTasks.length > 0 
      ? ratedTasks.reduce((sum, task) => sum + task.adminReview.rating, 0) / ratedTasks.length 
      : 0;

    // Get unique campaigns the volunteer has helped with (lives impacted)
    const uniqueCampaigns = [...new Set(completedTasks.map(task => task.campaign.toString()))];

    const stats = {
      tasksCompleted: completedTasks.length,
      hoursVolunteered: Math.round(totalHours),
      rating: Math.round(averageRating * 10) / 10,
      livesImpacted: uniqueCampaigns.length
    };

    // Get available tasks (not assigned or assigned to this volunteer, not completed)
    const availableTasks = await Task.find({
      $or: [
        { assignedTo: { $exists: false } },
        { assignedTo: null },
        { assignedTo: volunteerId, status: { $in: ['assigned', 'in_progress'] } }
      ],
      status: { $in: ['pending', 'assigned', 'in_progress'] },
      deadline: { $gte: new Date() }
    })
    .populate('campaign', 'title organization location')
    .populate('createdBy', 'name organization')
    .sort({ priority: -1, deadline: 1 })
    .limit(10)
    .lean();

    // Format available tasks
    const formattedAvailableTasks = availableTasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      organization: task.campaign?.organization || task.createdBy?.organization || 'Unknown',
      location: task.location?.address || task.campaign?.location?.address || 'Remote',
      urgency: task.priority,
      type: task.type,
      estimatedHours: task.estimatedHours || 0,
      deadline: task.deadline?.toISOString().split('T')[0] || null,
      requirements: task.requirements || [],
      status: task.status
    }));

    // Get pending verifications - both assigned and available
    const pendingVerifications = await Task.find({
      $or: [
        { 
          assignedTo: volunteerId,
          type: 'verification',
          status: { $in: ['assigned', 'in_progress'] }
        },
        {
          type: 'verification',
          $or: [
            { assignedTo: { $exists: false } },
            { assignedTo: null }
          ],
          status: 'pending',
          deadline: { $gte: new Date() }
        }
      ]
    })
    .populate('campaign', 'title organization')
    .populate('createdBy', 'name')
    .sort({ deadline: 1, priority: -1 })
    .limit(5)
    .lean();

    const formattedVerifications = pendingVerifications.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      requester: task.createdBy?.name || 'Unknown',
      organization: task.campaign?.organization || 'Unknown',
      location: task.location?.address || 'Not specified',
      urgency: task.priority,
      assignedDate: task.actualStartDate?.toISOString().split('T')[0] || 
                   task.createdAt?.toISOString().split('T')[0],
      deadline: task.deadline?.toISOString().split('T')[0] || null,
      type: task.type,
      status: task.status,
      estimatedHours: task.estimatedHours || 0,
      requirements: task.requirements || [],
      isAssigned: !!task.assignedTo,
      assignedTo: task.assignedTo ? task.assignedTo.toString() : null
    }));

    // Get recent activity for this volunteer
    const recentTasks = await Task.find({
      assignedTo: volunteerId
    })
    .populate('campaign', 'title')
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();

    const recentActivity = recentTasks.map(task => ({
      id: task._id.toString(),
      type: task.status === 'completed' ? 'task_completed' : 'task_updated',
      title: `${task.status === 'completed' ? 'Completed' : 'Updated'}: ${task.title}`,
      timestamp: task.updatedAt?.toISOString(),
      details: task.results?.summary || task.description,
      status: task.status,
      location: task.location?.address
    }));

    // Get recent notifications
    const notifications = await Notification.find({
      recipient: volunteerId,
      recipientRole: 'volunteer',
      isRead: false
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

    const formattedNotifications = notifications.map(notif => ({
      id: notif._id.toString(),
      type: notif.type,
      title: notif.title,
      message: notif.message,
      isRead: notif.isRead,
      createdAt: notif.createdAt?.toISOString(),
      actionUrl: notif.actionUrl
    }));

    // Calculate achievements based on stats
    const achievements = [
      {
        id: 'first_task',
        title: 'First Task',
        description: 'Complete your first task',
        icon: 'star',
        earned: stats.tasksCompleted >= 1
      },
      {
        id: 'task_veteran',
        title: 'Task Veteran',
        description: 'Complete 10 tasks',
        icon: 'shield',
        earned: stats.tasksCompleted >= 10
      },
      {
        id: 'verification_expert',
        title: 'Verification Expert',
        description: 'Complete 25+ verifications',
        icon: 'shield',
        earned: completedTasks.filter(t => t.type === 'verification').length >= 25
      },
      {
        id: 'community_champion',
        title: 'Community Champion',
        description: 'Help 15+ campaigns',
        icon: 'heart',
        earned: stats.livesImpacted >= 15
      },
      {
        id: 'time_contributor',
        title: 'Time Contributor',
        description: 'Volunteer 100+ hours',
        icon: 'clock',
        earned: stats.hoursVolunteered >= 100
      },
      {
        id: 'excellence_award',
        title: 'Excellence Award',
        description: 'Maintain 4.5+ rating',
        icon: 'trophy',
        earned: stats.rating >= 4.5 && ratedTasks.length >= 5
      }
    ];

    const dashboardData = {
      stats,
      availableTasks: formattedAvailableTasks,
      pendingVerifications: formattedVerifications,
      recentTasks: recentActivity,
      recentActivity,
      notifications: formattedNotifications,
      achievements: achievements.filter(a => a.earned),
      volunteerProfile: {
        name: volunteer.name,
        email: volunteer.email,
        status: volunteer.status,
        location: volunteer.location,
        joinDate: volunteer.createdAt
      }
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
