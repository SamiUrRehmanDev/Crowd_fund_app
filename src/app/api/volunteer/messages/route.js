import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Message from '@/lib/models/Message';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    // Build query filter
    const filter = {
      recipient: session.user.id,
      isDeleted: false
    };

    if (type && type !== 'all') {
      filter.type = type;
    }

    // Get messages from database
    const messages = await Message.find(filter)
      .populate('sender', 'name email role organization')
      .populate('relatedTask', 'title type')
      .populate('relatedCampaign', 'title organization')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    // Format messages for frontend
    const formattedMessages = messages.map(message => ({
      id: message._id.toString(),
      type: message.type,
      sender: message.sender?.organization || message.sender?.name || 'Unknown',
      senderRole: message.sender?.role,
      subject: message.subject,
      preview: message.content.length > 100 
        ? message.content.substring(0, 100) + '...' 
        : message.content,
      content: message.content,
      timestamp: message.createdAt?.toISOString(),
      read: message.isRead,
      priority: message.priority,
      category: message.category,
      attachments: message.attachments || [],
      relatedTask: message.relatedTask ? {
        id: message.relatedTask._id?.toString(),
        title: message.relatedTask.title,
        type: message.relatedTask.type
      } : null,
      relatedCampaign: message.relatedCampaign ? {
        id: message.relatedCampaign._id?.toString(),
        title: message.relatedCampaign.title,
        organization: message.relatedCampaign.organization
      } : null
    }));

    // Get total count for pagination
    const totalMessages = await Message.countDocuments(filter);
    const unreadCount = await Message.countDocuments({
      ...filter,
      isRead: false
    });

    return NextResponse.json({
      messages: formattedMessages,
      pagination: {
        total: totalMessages,
        page,
        limit,
        pages: Math.ceil(totalMessages / limit),
        hasMore: page * limit < totalMessages
      },
      unreadCount
    });

  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// Send a new message
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { recipient, subject, content, type, category, relatedTask, relatedCampaign } = await request.json();

    if (!recipient || !subject || !content) {
      return NextResponse.json({ 
        error: 'Recipient, subject, and content are required' 
      }, { status: 400 });
    }

    await connectDB();

    // Verify recipient exists
    const recipientUser = await User.findById(recipient);
    if (!recipientUser) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    // Create new message
    const newMessage = await Message.create({
      subject,
      content,
      type: type || 'volunteers',
      category: category || 'general',
      sender: session.user.id,
      recipient,
      relatedTask,
      relatedCampaign,
      priority: 'medium'
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email role organization')
      .populate('recipient', 'name email role organization')
      .lean();

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      messageData: {
        id: populatedMessage._id.toString(),
        subject: populatedMessage.subject,
        timestamp: populatedMessage.createdAt
      }
    });

  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
