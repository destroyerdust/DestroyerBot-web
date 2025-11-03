import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables for serverless functions
dotenv.config({ path: '.env.local' });

// Global connection cache for serverless environment
let cachedConnection = null;

export async function connectToDatabase() {
  // Return cached connection if available and still connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    // Connect to MongoDB
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      // Serverless-friendly options
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
    });

    cachedConnection = connection;
    console.log('✅ Connected to MongoDB');

    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

export function getDatabaseConnection() {
  return cachedConnection;
}

// Helper to ensure database is connected before operations
export async function withDatabase(operation) {
  await connectToDatabase();
  return operation();
}
