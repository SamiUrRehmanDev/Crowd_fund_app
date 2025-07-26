import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Task from '@/lib/models/Task';
import Campaign from '@/lib/models/Campaign';
import Notification from '@/lib/models/Notification';
import Message from '@/lib/models/Message';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const volunteerId = session.user.id;

    // Create some sample notifications for testing
    const sampleNotifications = [
      {
        type: 'task_match',
        title: 'New Task Match Available',
        message: 'A new verification task matching your skills has been posted in your area.',
        recipient: volunteerId,
        recipientRole: 'volunteer',
        metadata: {
          urgency: 'high',
          taskType: 'verification'
        },
        actionUrl: '/volunteer/tasks',
        isRead: false
      },
      {
        type: 'system',
        title: 'Welcome to Volunteer Portal',
        message: 'Thank you for joining as a volunteer. Please complete your profile to get started.',
        recipient: volunteerId,
        recipientRole: 'volunteer',
        metadata: {
          urgency: 'medium'
        },
        actionUrl: '/volunteer/profile',
        isRead: false
      },
      {
        type: 'task_update',
        title: 'Profile Update Reminder',
        message: 'Please update your availability schedule to receive better task matches.',
        recipient: volunteerId,
        recipientRole: 'volunteer',
        metadata: {
          urgency: 'low'
        },
        actionUrl: '/volunteer/availability',
        isRead: true
      }
    ];

    // Clear existing notifications for this volunteer
    await Notification.deleteMany({ 
      recipient: volunteerId, 
      recipientRole: 'volunteer' 
    });

    // Insert sample notifications
    await Notification.insertMany(sampleNotifications);

    // Create a sample campaign if none exists
    let sampleCampaign = await Campaign.findOne({ title: 'Community Support Initiative' });
    if (!sampleCampaign) {
      sampleCampaign = await Campaign.create({
        title: 'Community Support Initiative',
        description: 'Providing essential services to families in need',
        organization: 'Community Care Center',
        category: 'community_support',
        targetAmount: 50000,
        raisedAmount: 25000,
        status: 'active',
        location: {
          address: '123 Main St',
          city: 'City Center',
          state: 'State',
          country: 'Country'
        },
        createdBy: volunteerId
      });
    }

    // Create some sample tasks if none exist
    const existingTasks = await Task.countDocuments({ campaign: sampleCampaign._id });
    if (existingTasks === 0) {
      const sampleTasks = [
        {
          title: 'Family Situation Verification',
          description: 'Verify the current living conditions and needs of a family requesting emergency assistance for housing support.',
          type: 'verification',
          priority: 'high',
          campaign: sampleCampaign._id,
          createdBy: volunteerId,
          requirements: ['Valid ID', 'Transportation', 'Interview skills'],
          estimatedHours: 3,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          location: {
            address: '456 Oak St',
            city: 'Residential Area',
            state: 'State'
          },
          status: 'pending'
        },
        {
          title: 'Medical Equipment Verification',
          description: 'Verify the medical equipment needs for a family with a disabled child requiring specialized care.',
          type: 'verification',
          priority: 'urgent',
          campaign: sampleCampaign._id,
          createdBy: volunteerId,
          requirements: ['Medical background preferred', 'Valid ID', 'Compassion'],
          estimatedHours: 2,
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          location: {
            address: '789 Medical Center Dr',
            city: 'Health District',
            state: 'State'
          },
          status: 'pending'
        },
        {
          title: 'Housing Safety Assessment',
          description: 'Assess housing conditions and safety requirements for a family with young children.',
          type: 'verification',
          priority: 'medium',
          campaign: sampleCampaign._id,
          createdBy: volunteerId,
          requirements: ['Safety inspection knowledge', 'Transportation', 'Background check'],
          estimatedHours: 4,
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          location: {
            address: '321 Family Ave',
            city: 'Residential Zone',
            state: 'State'
          },
          status: 'pending'
        },
        {
          title: 'Document Review and Verification',
          description: 'Review submitted documents for completeness and authenticity.',
          type: 'documentation',
          priority: 'medium',
          campaign: sampleCampaign._id,
          createdBy: volunteerId,
          requirements: ['Attention to detail', 'Document analysis experience'],
          estimatedHours: 2,
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          status: 'pending'
        },
        {
          title: 'Follow-up Home Visit',
          description: 'Conduct a follow-up visit to assess the impact of provided assistance.',
          type: 'follow_up',
          priority: 'low',
          campaign: sampleCampaign._id,
          createdBy: volunteerId,
          requirements: ['Transportation', 'Communication skills'],
          estimatedHours: 2,
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          location: {
            address: '789 Pine St',
            city: 'Suburban Area',
            state: 'State'
          },
          status: 'pending'
        }
      ];

      await Task.insertMany(sampleTasks);
    }

    // Create sample messages if none exist
    const existingMessages = await Message.countDocuments({ recipient: volunteerId });
    if (existingMessages === 0) {
      // Create an admin user if doesn't exist for sending system messages
      let adminUser = await User.findOne({ role: 'admin' });
      if (!adminUser) {
        adminUser = await User.create({
          name: 'System Administrator',
          email: 'admin@crowdfunding.com',
          role: 'admin',
          organization: 'CrowdFunding Platform',
          status: 'active'
        });
      }

      const sampleMessages = [
        {
          subject: 'Welcome to the Volunteer Portal',
          content: 'Dear Volunteer,\n\nWelcome to our volunteer program! We\'re excited to have you join our community of dedicated volunteers making a difference.\n\nHere are some quick tips to get started:\n\n• Complete your profile with your skills and availability\n• Browse available verification tasks in your area\n• Join our volunteer community chat for tips and support\n• Review our safety guidelines before starting any tasks\n\nIf you have any questions, don\'t hesitate to reach out to our support team.\n\nThank you for your service!\n\nBest regards,\nVolunteer Coordination Team',
          type: 'system',
          category: 'general',
          sender: adminUser._id,
          recipient: volunteerId,
          priority: 'medium',
          isRead: false
        },
        {
          subject: 'New Verification Guidelines Available',
          content: 'Hello Volunteers,\n\nWe have updated our verification guidelines to improve the quality and consistency of our assessments:\n\n• Enhanced safety protocols for housing assessments\n• New documentation requirements with photo examples\n• Updated training materials in the resource center\n• Revised urgency level definitions\n\nPlease review these updates in your volunteer portal under the "Resources" section. All active volunteers should familiarize themselves with these changes before taking on new tasks.\n\nThank you for maintaining our high standards!\n\nVolunteer Coordination Team',
          type: 'system',
          category: 'system_notification',
          sender: adminUser._id,
          recipient: volunteerId,
          priority: 'high',
          isRead: false
        },
        {
          subject: 'Thank You for Your Recent Verification',
          content: 'Dear Volunteer,\n\nWe wanted to personally thank you for completing the family housing verification task last week. Your thorough assessment and detailed report helped us approve emergency assistance for a family in need.\n\nYour dedication to accuracy and compassion in these assessments makes a real difference in people\'s lives. The family has now received the support they needed thanks to your efforts.\n\nWe truly appreciate volunteers like you who go above and beyond.\n\nWith gratitude,\nCommunity Support Team',
          type: 'organizations',
          category: 'feedback',
          sender: adminUser._id,
          recipient: volunteerId,
          priority: 'medium',
          isRead: true,
          readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Read 2 days ago
        }
      ];

      await Message.insertMany(sampleMessages);
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully',
      data: {
        notificationsCreated: sampleNotifications.length,
        campaignCreated: !existingTasks,
        tasksCreated: existingTasks === 0 ? 4 : 0,
        messagesCreated: existingMessages === 0 ? 3 : 0
      }
    });

  } catch (error) {
    console.error('Sample data creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
