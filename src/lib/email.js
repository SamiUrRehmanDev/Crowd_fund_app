import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
};

// Email templates
const emailTemplates = {
  passwordReset: (firstName, resetUrl) => ({
    subject: 'Reset Your CrowdFund Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">CrowdFund</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Password Reset Request</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName},</h2>
            
            <p style="margin-bottom: 20px;">
              We received a request to reset your password for your CrowdFund account. 
              If you made this request, click the button below to reset your password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Reset My Password
              </a>
            </div>
            
            <p style="margin-bottom: 20px;">
              This link will expire in 1 hour for security reasons.
            </p>
            
            <p style="margin-bottom: 20px;">
              If you didn't request a password reset, you can safely ignore this email. 
              Your password will remain unchanged.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all;">${resetUrl}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent by CrowdFund. If you have any questions, please contact our support team.</p>
              <p>&copy; ${new Date().getFullYear()} CrowdFund. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${firstName},

      We received a request to reset your password for your CrowdFund account.

      To reset your password, click the following link:
      ${resetUrl}

      This link will expire in 1 hour for security reasons.

      If you didn't request a password reset, you can safely ignore this email.

      Best regards,
      The CrowdFund Team
    `,
  }),

  emailVerification: (firstName, verificationUrl) => ({
    subject: 'Verify Your CrowdFund Email Address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to CrowdFund!</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Please verify your email address</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName},</h2>
            
            <p style="margin-bottom: 20px;">
              Thank you for joining CrowdFund! To complete your account setup and start making a difference, 
              please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Verify My Email
              </a>
            </div>
            
            <p style="margin-bottom: 20px;">
              Once verified, you'll be able to:
            </p>
            
            <ul style="margin-bottom: 20px; padding-left: 20px;">
              <li>Browse and support campaigns</li>
              <li>Create your own fundraising campaigns</li>
              <li>Track your donation impact</li>
              <li>Connect with our community</li>
            </ul>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all;">${verificationUrl}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent by CrowdFund. If you have any questions, please contact our support team.</p>
              <p>&copy; ${new Date().getFullYear()} CrowdFund. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${firstName},

      Thank you for joining CrowdFund! To complete your account setup, please verify your email address by clicking the following link:

      ${verificationUrl}

      Once verified, you'll be able to browse campaigns, make donations, and create your own fundraising campaigns.

      Welcome to our community!

      Best regards,
      The CrowdFund Team
    `,
  }),

  campaignNotification: (firstName, campaignTitle, campaignUrl) => ({
    subject: `New Campaign: ${campaignTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Campaign Alert</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">CrowdFund</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">New Campaign Alert</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${firstName},</h2>
            
            <p style="margin-bottom: 20px;">
              A new campaign has been created that might interest you:
            </p>
            
            <h3 style="color: #667eea; margin-bottom: 15px;">${campaignTitle}</h3>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${campaignUrl}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                View Campaign
              </a>
            </div>
            
            <p style="margin-bottom: 20px;">
              Every donation, no matter the size, makes a difference. Thank you for being part of our community.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 12px;">
              <p>This email was sent by CrowdFund. If you no longer wish to receive campaign notifications, you can update your preferences in your account settings.</p>
              <p>&copy; ${new Date().getFullYear()} CrowdFund. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${firstName},

      A new campaign has been created: ${campaignTitle}

      View the campaign: ${campaignUrl}

      Every donation makes a difference. Thank you for being part of our community.

      Best regards,
      The CrowdFund Team
    `,
  }),
};

// Email sending functions
export async function sendPasswordResetEmail(email, firstName, resetUrl) {
  const transporter = createTransporter();
  const template = emailTemplates.passwordReset(firstName, resetUrl);

  await transporter.sendMail({
    from: `"CrowdFund" <${process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}

export async function sendEmailVerification(email, firstName, verificationUrl) {
  const transporter = createTransporter();
  const template = emailTemplates.emailVerification(firstName, verificationUrl);

  await transporter.sendMail({
    from: `"CrowdFund" <${process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}

export async function sendCampaignNotification(email, firstName, campaignTitle, campaignUrl) {
  const transporter = createTransporter();
  const template = emailTemplates.campaignNotification(firstName, campaignTitle, campaignUrl);

  await transporter.sendMail({
    from: `"CrowdFund" <${process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
}

export async function sendBulkEmails(emails) {
  const transporter = createTransporter();
  
  const promises = emails.map(email =>
    transporter.sendMail({
      from: `"CrowdFund" <${process.env.EMAIL_SERVER_USER}>`,
      ...email,
    })
  );

  await Promise.all(promises);
}
