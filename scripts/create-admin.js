import connectDB from '../src/lib/mongodb.js';
import User from '../src/lib/models/User.js';
import { AuthService } from '../src/lib/auth.js';
import AuditLog from '../src/lib/models/AuditLog.js';

async function createInitialAdmin() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      return;
    }

    // Create initial admin user
    const adminData = {
      name: 'Super Admin',
      email: 'admin@crowdfunding.com',
      password: 'AdminPassword123!',
      isAdmin: true,
      adminLevel: 'super',
      permissions: [
        'user_management',
        'campaign_management',
        'task_management',
        'payment_management',
        'analytics_view',
        'content_moderation',
        'system_configuration',
        'communication_management'
      ],
      role: 'admin',
      isActive: true,
      emailVerified: true,
      profileCompleted: true
    };

    // Hash password
    adminData.password = await AuthService.hashPassword(adminData.password);

    // Create admin user
    const admin = new User(adminData);
    await admin.save();

    // Log the creation
    await AuditLog.create({
      action: 'admin_user_created',
      userId: admin._id,
      userType: 'admin',
      details: {
        email: admin.email,
        adminLevel: admin.adminLevel,
        createdBy: 'system'
      },
      ipAddress: 'localhost',
      userAgent: 'admin-setup-script'
    });

    console.log('✅ Initial admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔐 Password: AdminPassword123!');
    console.log('🚨 Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating initial admin:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
createInitialAdmin();
