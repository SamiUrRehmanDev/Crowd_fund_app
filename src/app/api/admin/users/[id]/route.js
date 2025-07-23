import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import AuditLog from '@/lib/models/AuditLog';
import { withAuth } from '@/lib/middleware';

export const GET = withAuth(async (request, { params }) => {
  try {
    await connectDB();
    
    const { id } = params;
    
    const user = await User.findById(id)
      .select('-password -passwordResetToken -passwordResetExpires')
      .lean();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
    
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
});

export const PUT = withAuth(async (request, { params }) => {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Store original data for audit log
    const originalData = user.toObject();
    
    // Update user fields
    const allowedFields = [
      'firstName', 'lastName', 'email', 'phone', 'role', 'status',
      'adminLevel', 'permissions', 'verificationStatus', 'bio',
      'location', 'preferences'
    ];
    
    const updatedFields = [];
    
    allowedFields.forEach(field => {
      if (body.hasOwnProperty(field)) {
        if (JSON.stringify(user[field]) !== JSON.stringify(body[field])) {
          updatedFields.push(field);
        }
        user[field] = body[field];
      }
    });
    
    // Handle admin notes
    if (body.adminNote) {
      user.adminNotes.push({
        note: body.adminNote.note,
        addedBy: request.userId, // From auth middleware
        category: body.adminNote.category || 'info'
      });
      updatedFields.push('adminNotes');
    }
    
    await user.save();
    
    // Log the action
    if (updatedFields.length > 0) {
      await AuditLog.create({
        action: 'user_updated',
        entity: 'User',
        entityId: user._id,
        performedBy: request.userId,
        performedByRole: 'admin',
        description: `Updated user fields: ${updatedFields.join(', ')}`,
        changes: {
          before: originalData,
          after: user.toObject(),
          fields: updatedFields
        },
        category: 'user_management',
        severity: 'low'
      });
    }
    
    const safeUser = user.toSafeObject();
    
    return NextResponse.json({
      message: 'User updated successfully',
      user: safeUser
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (request, { params }) => {
  try {
    await connectDB();
    
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get('hard') === 'true';
    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (hardDelete) {
      // Permanent deletion
      await User.findByIdAndDelete(id);
      
      await AuditLog.create({
        action: 'user_permanently_deleted',
        entity: 'User',
        entityId: id,
        performedBy: request.userId,
        performedByRole: 'admin',
        description: `Permanently deleted user: ${user.email}`,
        category: 'user_management',
        severity: 'high'
      });
      
      return NextResponse.json({
        message: 'User permanently deleted'
      });
    } else {
      // Soft deletion
      user.deletedAt = new Date();
      user.status = 'inactive';
      await user.save();
      
      await AuditLog.create({
        action: 'user_soft_deleted',
        entity: 'User',
        entityId: user._id,
        performedBy: request.userId,
        performedByRole: 'admin',
        description: `Soft deleted user: ${user.email}`,
        category: 'user_management',
        severity: 'medium'
      });
      
      return NextResponse.json({
        message: 'User deactivated successfully'
      });
    }
    
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
});
