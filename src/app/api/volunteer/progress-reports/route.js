import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'volunteer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    const reportData = {
      taskId: formData.get('taskId'),
      description: formData.get('description'),
      progressPercentage: parseInt(formData.get('progressPercentage')),
      challenges: formData.get('challenges'),
      nextSteps: formData.get('nextSteps'),
      estimatedCompletion: formData.get('estimatedCompletion'),
      location: formData.get('location') ? JSON.parse(formData.get('location')) : null,
      volunteerId: session.user.id,
      submittedAt: new Date().toISOString(),
      attachments: []
    };

    // Process file attachments
    const attachmentKeys = Array.from(formData.keys()).filter(key => key.startsWith('attachment_'));
    for (const key of attachmentKeys) {
      const file = formData.get(key);
      if (file) {
        // In a real implementation, you would upload to cloud storage
        // For now, we'll just store file metadata
        reportData.attachments.push({
          filename: file.name,
          size: file.size,
          type: file.type,
          // In production: uploadedUrl: await uploadToCloudStorage(file)
        });
      }
    }

    // In a real implementation, save to database
    console.log('Progress report submitted:', reportData);

    // Mock successful response
    const reportId = 'report-' + Date.now();
    
    return NextResponse.json({ 
      success: true, 
      reportId,
      message: 'Progress report submitted successfully'
    });
    
  } catch (error) {
    console.error('Error submitting progress report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
