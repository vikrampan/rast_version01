import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://protubex.rast.in:27017/rast';

// Track the connection status
let isConnected = false;

// Connection options with current Mongoose options
const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

async function connectDB() {
  if (isConnected) {
    console.log('👍 Using existing database connection');
    return;
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    console.log('✅ Database connected successfully');

    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('🎯 MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.log('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('💔 MongoDB disconnected');
      isConnected = false;
    });

  } catch (error) {
    console.error('❌ Database connection error:', error);
    isConnected = false;
    throw error;
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  if (isConnected) {
    try {
      await mongoose.connection.close();
      console.log('✋ MongoDB connection closed through app termination');
      process.exit(0);
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
      process.exit(1);
    }
  }
});

export default connectDB;