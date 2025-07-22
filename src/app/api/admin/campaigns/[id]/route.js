import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Campaign from '@/lib/models/Campaign';
import AuditLog from '@/lib/models/AuditLog';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const campaign = await Campaign.findById(id)
      .populate('createdBy', 'firstName lastName email phone location')
      .populate('beneficiary', 'firstName lastName email phone')
      .populate('volunteers.volunteer', 'firstName lastName email')
      .lean();
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ campaign });
    
  } catch (error) {
    console.error('Get campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Store original data for audit log
    const originalData = campaign.toObject();
    
    // Update campaign fields
    const allowedFields = [
      'title', 'description', 'shortDescription', 'category', 'subcategory',
      'goalAmount', 'status', 'visibility', 'featured', 'featuredUntil',
      'urgent', 'moderationStatus', 'urgency', 'timeline', 'location',
      'verificationStatus', 'tags', 'keywords'
    ];
    
    const updatedFields = [];
    
    allowedFields.forEach(field => {
      if (body.hasOwnProperty(field)) {
        if (JSON.stringify(campaign[field]) !== JSON.stringify(body[field])) {
          updatedFields.push(field);
        }
        campaign[field] = body[field];
      }
    });
    
    // Handle moderation notes
    if (body.moderationNote) {
      campaign.moderationNotes.push({
        note: body.moderationNote.note,
        moderator: request.userId, // From auth middleware
        action: body.moderationNote.action || 'note_added'
      });
      updatedFields.push('moderationNotes');
    }
    
    // Handle status changes
    if (body.status && body.status !== originalData.status) {
      if (body.status === 'approved') {
        campaign.publishedAt = new Date();
      } else if (body.status === 'completed') {
        campaign.completedAt = new Date();
      }
    }
    
    await campaign.save();
    
    // Log the action
    if (updatedFields.length > 0) {
      const action = body.status === 'approved' ? 'campaign_approved' :
                   body.status === 'rejected' ? 'campaign_rejected' :
                   body.featured ? 'campaign_featured' :
                   'campaign_updated';
      
      await AuditLog.create({
        action,
        entity: 'Campaign',
        entityId: campaign._id,
        performedBy: request.userId,
        performedByRole: 'admin',
        description: `Updated campaign fields: ${updatedFields.join(', ')}`,
        changes: {
          before: originalData,
          after: campaign.toObject(),
          fields: updatedFields
        },
        category: 'campaign_management',
        severity: body.status === 'approved' || body.status === 'rejected' ? 'medium' : 'low'
      });
    }
    
    return NextResponse.json({
      message: 'Campaign updated successfully',
      campaign
    });
    
  } catch (error) {
    console.error('Update campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';
    
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    if (hardDelete) {
      // Permanent deletion
      await Campaign.findByIdAndDelete(id);
      
      await AuditLog.create({
        action: 'campaign_permanently_deleted',
        entity: 'Campaign',
        entityId: id,
        performedBy: request.userId,
        performedByRole: 'admin',
        description: `Permanently deleted campaign: ${campaign.title}`,
        category: 'campaign_management',
        severity: 'high'
      });
      
      return NextResponse.json({
        message: 'Campaign permanently deleted'
      });
    } else {
      // Soft deletion (archive)
      campaign.deletedAt = new Date();
      campaign.status = 'cancelled';
      campaign.visibility = 'archived';
      await campaign.save();
      
      await AuditLog.create({
        action: 'campaign_archived',
        entity: 'Campaign',
        entityId: campaign._id,
        performedBy: request.userId,
        performedByRole: 'admin',
        description: `Archived campaign: ${campaign.title}`,
        category: 'campaign_management',
        severity: 'medium'
      });
      
      return NextResponse.json({
        message: 'Campaign archived successfully'
      });
    }
    
  } catch (error) {
    console.error('Delete campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}
