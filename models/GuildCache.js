/**
 * Mongoose schema and model for caching Discord user guild data.
 * Reduces Discord API calls by storing guild lists with TTL-based expiration.
 * @module models/GuildCache
 */

import mongoose from 'mongoose';

/**
 * Schema for caching a user's Discord guild memberships.
 * Implements MongoDB TTL index for automatic cache expiration.
 *
 * Cache Strategy:
 * - Data cached for 5 minutes in application logic
 * - MongoDB TTL index auto-deletes entries after 10 minutes
 * - Reduces Discord API rate limit consumption
 *
 * @typedef {Object} GuildCacheDocument
 * @property {string} userId - Discord user ID (indexed for fast lookups)
 * @property {Array<Object>} guilds - Array of guild objects from Discord API
 * @property {Date} cachedAt - Timestamp when cache entry was created/updated
 */
const guildCacheSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  guilds: {
    type: Array,
    required: true
  },
  cachedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

/**
 * Compound index for efficient userId + cachedAt queries.
 * Allows fast retrieval and time-based filtering.
 */
guildCacheSchema.index({ userId: 1, cachedAt: 1 });

/**
 * TTL (Time To Live) index for automatic cache cleanup.
 * MongoDB automatically deletes documents 10 minutes (600 seconds) after cachedAt timestamp.
 * This provides a safety net beyond application-level cache expiration (5 minutes).
 */
guildCacheSchema.index({ cachedAt: 1 }, { expireAfterSeconds: 600 });

/**
 * Mongoose model for guild cache entries.
 * Used by getCachedUserGuilds function to reduce Discord API calls.
 *
 * @type {mongoose.Model<GuildCacheDocument>}
 *
 * @example
 * // Check for cached guilds
 * const cached = await GuildCache.findOne({ userId: '123456789' });
 * const isExpired = Date.now() - cached.cachedAt.getTime() > 300000; // 5 min TTL
 *
 * if (cached && !isExpired) {
 *   return cached.guilds;
 * }
 *
 * @example
 * // Update or create cache entry
 * await GuildCache.findOneAndUpdate(
 *   { userId: '123456789' },
 *   { userId: '123456789', guilds: freshGuilds, cachedAt: new Date() },
 *   { upsert: true }
 * );
 */
const GuildCache = mongoose.model('GuildCache', guildCacheSchema);

export default GuildCache;
