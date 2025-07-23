// Test script to check user count in database
import connectDB from './src/lib/mongodb.js';
import User from './src/lib/models/User.js';

async function testUserCount() {
  try {
    await connectDB();
    console.log('Connected to database');
    
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    const users = await User.find({}, 'email role createdAt').limit(10);
    console.log('Sample users:', users);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testUserCount();
