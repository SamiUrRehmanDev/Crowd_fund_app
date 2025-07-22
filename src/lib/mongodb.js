import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/crowdfunding';

async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('✅ Already connected to MongoDB');
      return mongoose;
    }

    const connection = await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');
    console.log('🔗 Database:', connection.connection.name);
    
    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB;
