import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const donationId = params.id;

    // In a real app, you would:
    // 1. Fetch donation from database
    // 2. Verify ownership
    // 3. Generate PDF receipt

    // Mock donation data
    const donation = {
      id: donationId,
      amount: 100,
      campaignTitle: 'Emergency Surgery for Maria Lopez',
      campaignId: 'camp_001',
      donorName: session.user.name,
      donorEmail: session.user.email,
      date: '2024-06-28',
      paymentMethod: '**** 4242',
      receiptNumber: `RCP-${donationId}`,
      organizationName: 'CrowdFunding Platform',
      organizationTaxId: '12-3456789',
      isDeductible: true,
    };

    // Generate PDF receipt content (simplified)
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Donation Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
          .receipt-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .amount { font-size: 32px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
          .details { margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin: 10px 0; }
          .footer { margin-top: 40px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CrowdFunding Platform</div>
          <h2>Donation Receipt</h2>
        </div>
        
        <div class="receipt-info">
          <div class="amount">$${donation.amount.toFixed(2)}</div>
          <div style="text-align: center; font-size: 18px; margin-bottom: 20px;">
            Thank you for your generous donation!
          </div>
          
          <div class="details">
            <div class="row">
              <span><strong>Receipt Number:</strong></span>
              <span>${donation.receiptNumber}</span>
            </div>
            <div class="row">
              <span><strong>Date:</strong></span>
              <span>${donation.date}</span>
            </div>
            <div class="row">
              <span><strong>Donor:</strong></span>
              <span>${donation.donorName}</span>
            </div>
            <div class="row">
              <span><strong>Email:</strong></span>
              <span>${donation.donorEmail}</span>
            </div>
            <div class="row">
              <span><strong>Campaign:</strong></span>
              <span>${donation.campaignTitle}</span>
            </div>
            <div class="row">
              <span><strong>Payment Method:</strong></span>
              <span>${donation.paymentMethod}</span>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Organization:</strong> ${donation.organizationName}</p>
          <p><strong>Tax ID:</strong> ${donation.organizationTaxId}</p>
          ${donation.isDeductible ? '<p><strong>Tax Deductible:</strong> This donation is tax-deductible to the extent allowed by law.</p>' : ''}
          <p>Please keep this receipt for your tax records.</p>
          <p>If you have any questions, please contact our support team.</p>
        </div>
      </body>
      </html>
    `;

    // Return HTML receipt (in a real app, you might generate PDF)
    return new NextResponse(receiptHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="donation-receipt-${donationId}.html"`,
      },
    });

  } catch (error) {
    console.error('Receipt API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
