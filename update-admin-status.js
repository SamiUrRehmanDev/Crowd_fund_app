// Update existing admin user status
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://user1:miansami11@cluster0.osoz8.mongodb.net/crowdfunding?retryWrites=true&w=majority';

// User schema (simplified)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  adminLevel: String,
  permissions: [String],
  role: String,
  status: String,
  isActive: Boolean,
  emailVerified: Boolean,
  profileCompleted: Boolean
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function updateAdminStatus() {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Database connected');

    // Find the admin user
    const admin = await User.findOne({ email: 'admin@crowdfunding.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('Current admin status:', admin.status);
    console.log('Current admin isActive:', admin.isActive);
    console.log('Current admin role:', admin.role);
    console.log('Current admin isAdmin:', admin.isAdmin);

    // Update the admin user
    await User.updateOne(
      { email: 'admin@crowdfunding.com' },
      { 
        status: 'active',
        isActive: true,
        role: 'admin',
        isAdmin: true
      }
    );

    console.log('✅ Admin user status updated successfully!');
    console.log('📧 Email: admin@crowdfunding.com');
    console.log('🔐 Password: AdminPassword123!');
    console.log('✅ Status: active');

  } catch (error) {
    console.error('❌ Error updating admin:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

updateAdminStatus();
