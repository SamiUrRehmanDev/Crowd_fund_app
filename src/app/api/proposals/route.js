import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb.js';

export async function POST(request) {
  try {
    // Simple auth check - in a real app, this would use proper authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const targetAmount = parseFloat(formData.get('targetAmount'));
    const urgency = formData.get('urgency');
    const beneficiaryName = formData.get('beneficiaryName');
    const beneficiaryAge = formData.get('beneficiaryAge');
    const beneficiaryRelation = formData.get('beneficiaryRelation');
    const location = formData.get('location');
    const contactPhone = formData.get('contactPhone');
    const medicalFacility = formData.get('medicalFacility');
    const medicalCondition = formData.get('medicalCondition');
    const useOfFunds = formData.get('useOfFunds');
    const additionalInfo = formData.get('additionalInfo');
    
    // Handle file uploads
    const files = formData.getAll('documents');
    const uploadedFiles = [];

    for (const file of files) {
      if (file.size > 0) {
        // In a real app, you would upload to cloud storage (AWS S3, Cloudinary, etc.)
        // For now, we'll just store file information
        uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url: `/uploads/proposals/${Date.now()}-${file.name}` // Mock URL
        });
      }
    }

    // Validate required fields
    if (!title || !description || !category || !targetAmount || !urgency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create proposal record
    const proposal = {
      id: `prop_${Date.now()}`,
      proposerId: 'user_' + Date.now(), // Mock user ID
      proposerEmail: 'user@example.com', // Mock email
      proposerName: 'Mock User', // Mock name
      title,
      description,
      category,
      targetAmount,
      urgency,
      beneficiaryName,
      beneficiaryAge: beneficiaryAge ? parseInt(beneficiaryAge) : null,
      beneficiaryRelation,
      location,
      contactPhone,
      medicalFacility,
      medicalCondition,
      useOfFunds,
      additionalInfo,
      documents: uploadedFiles,
      status: 'pending_review',
      submittedAt: new Date(),
      reviewedAt: null,
      approvedAt: null,
      reviewComments: null,
    };

    // In a real app, this would save to a Proposal model in the database
    // await Proposal.create(proposal);

    return NextResponse.json({
      success: true,
      proposal: {
        id: proposal.id,
        status: proposal.status,
        submittedAt: proposal.submittedAt,
      },
      message: 'Proposal submitted successfully. It will be reviewed within 24-48 hours.'
    }, { status: 201 });

  } catch (error) {
    console.error('Proposal submission API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Simple auth check - in a real app, this would use proper authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Mock proposal history - In a real app, this would query a Proposal model
    const proposals = [
      {
        id: 'prop_1234567890',
        title: 'Medical Treatment for Cancer Patient',
        category: 'Medical',
        targetAmount: 30000,
        urgency: 'Critical',
        status: 'approved',
        submittedAt: '2024-06-15',
        reviewedAt: '2024-06-17',
        approvedAt: '2024-06-17',
        campaignId: 'camp_007', // Created campaign ID after approval
        reviewComments: 'All documentation verified. Case approved for campaign creation.',
      },
      {
        id: 'prop_0987654321',
        title: 'Educational Support for Orphans',
        category: 'Education',
        targetAmount: 15000,
        urgency: 'Medium',
        status: 'pending_review',
        submittedAt: '2024-06-25',
        reviewedAt: null,
        approvedAt: null,
        campaignId: null,
        reviewComments: null,
      },
      {
        id: 'prop_1122334455',
        title: 'Community Garden Project',
        category: 'Community',
        targetAmount: 8000,
        urgency: 'Low',
        status: 'needs_revision',
        submittedAt: '2024-06-10',
        reviewedAt: '2024-06-12',
        approvedAt: null,
        campaignId: null,
        reviewComments: 'Please provide more detailed budget breakdown and community impact assessment.',
      }
    ];

    return NextResponse.json({ proposals }, { status: 200 });

  } catch (error) {
    console.error('Proposals API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
