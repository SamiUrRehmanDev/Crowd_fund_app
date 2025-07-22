// Simplified admin creation script
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://user1:miansami11@cluster0.osoz8.mongodb.net/crowdfunding?retryWrites=true&w=majority';

// User schema (simplified)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  adminLevel: { type: String, enum: ['moderator', 'manager', 'super'], default: 'moderator' },
  permissions: [{ type: String }],
  role: { type: String, enum: ['donor', 'volunteer', 'donee', 'admin'], default: 'donor' },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected');

    // Check if admin exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 12);

    // Create admin user
    const admin = new User({
      name: 'Super Admin',
      email: 'admin@crowdfunding.com',
      password: hashedPassword,
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
      status: 'active',  // ← Added this line
      isActive: true,
      emailVerified: true,
      profileCompleted: true
    });

    await admin.save();

    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@crowdfunding.com');
    console.log('🔐 Password: AdminPassword123!');
    console.log('⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
