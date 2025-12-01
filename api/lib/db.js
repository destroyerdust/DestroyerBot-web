/**
 * Database connection utilities optimized for Vercel serverless environments.
 * Implements connection caching to prevent connection exhaustion in serverless functions.
 * @module api/lib/db
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables for serverless functions
dotenv.config({ path: '.env.local' });

/**
 * Global connection cache for serverless environment.
 * Prevents creating new connections on every function invocation.
 * @type {mongoose.Connection|null}
 * @private
 */
let cachedConnection = null;

/**
 * Establishes and caches a MongoDB connection optimized for serverless environments.
 * Returns existing connection if available and still connected, otherwise creates a new one.
 *
 * Connection pooling is configured for serverless with:
 * - maxPoolSize: 10 connections
 * - serverSelectionTimeoutMS: 5000ms
 * - socketTimeoutMS: 45000ms
 * - bufferCommands: false (fail fast instead of buffering)
 *
 * @async
 * @returns {Promise<mongoose.Connection>} The cached or newly created MongoDB connection
 * @throws {Error} If connection fails due to invalid URI or network issues
 *
 * @example
 * // In a serverless function
 * await connectToDatabase();
 * const settings = await GuildSettings.findOne({ guildId });
 */
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
    });

    cachedConnection = connection;
    console.log('✅ Connected to MongoDB');

    return connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Retrieves the currently cached database connection.
 * Does not attempt to establish a new connection if none exists.
 *
 * @returns {mongoose.Connection|null} The cached connection, or null if not connected
 *
 * @example
 * const connection = getDatabaseConnection();
 * if (connection) {
 *   console.log('Database is connected');
 * }
 */
export function getDatabaseConnection() {
  return cachedConnection;
}

/**
 * Higher-order function that ensures database connection before executing an operation.
 * Useful for wrapping database operations to guarantee connectivity.
 *
 * @async
 * @param {Function} operation - Async function to execute after ensuring database connection
 * @returns {Promise<*>} The result of the operation function
 * @throws {Error} If connection fails or operation throws an error
 *
 * @example
 * const settings = await withDatabase(async () => {
 *   return await GuildSettings.findOne({ guildId: '123' });
 * });
 */
export async function withDatabase(operation) {
  await connectToDatabase();
  return operation();
}
