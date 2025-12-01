/**
 * Mongoose schema and model for caching Discord guild channel data.
 * Reduces Discord API calls by storing channel lists with TTL-based expiration.
 * @module models/ChannelCache
 */

import mongoose from 'mongoose';

/**
 * Schema for caching a guild's Discord channel list.
 * Implements MongoDB TTL index for automatic cache expiration.
 *
 * Cache Strategy:
 * - Data cached for 5 minutes in application logic
 * - MongoDB TTL index auto-deletes entries after 10 minutes
 * - Falls back to stale cache if Discord API rate limited
 * - Only text channels (type 0) are stored
 *
 * @typedef {Object} ChannelCacheDocument
 * @property {string} guildId - Discord guild ID (indexed, unique)
 * @property {Array<Object>} channels - Array of text channel objects {id, name, position}
 * @property {Date} cachedAt - Timestamp when cache entry was created/updated
 */
const channelCacheSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  channels: {
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
 * TTL (Time To Live) index for automatic cache cleanup.
 * MongoDB automatically deletes documents 10 minutes (600 seconds) after cachedAt timestamp.
 * This provides a safety net beyond application-level cache expiration (5 minutes).
 *
 * The longer TTL allows serving stale data if Discord API is rate limiting,
 * providing better user experience during high-traffic periods.
 */
channelCacheSchema.index({ cachedAt: 1 }, { expireAfterSeconds: 600 });

/**
 * Mongoose model for channel cache entries.
 * Used by getCachedGuildChannels function to reduce Discord API calls.
 *
 * @type {mongoose.Model<ChannelCacheDocument>}
 *
 * @example
 * // Check for cached channels
 * const cached = await ChannelCache.findOne({ guildId: '123456789' });
 * const isExpired = Date.now() - cached.cachedAt.getTime() > 300000; // 5 min TTL
 *
 * if (cached && !isExpired) {
 *   return cached.channels;
 * }
 *
 * @example
 * // Update or create cache entry
 * await ChannelCache.findOneAndUpdate(
 *   { guildId: '123456789' },
 *   {
 *     guildId: '123456789',
 *     channels: [
 *       { id: '111', name: 'general', position: 0 },
 *       { id: '222', name: 'announcements', position: 1 }
 *     ],
 *     cachedAt: new Date()
 *   },
 *   { upsert: true }
 * );
 *
 * @example
 * // Fallback to stale cache when rate limited
 * if (discordApiRateLimited && cached) {
 *   console.log('Using stale cache due to rate limit');
 *   return cached.channels;
 * }
 */
const ChannelCache = mongoose.model('ChannelCache', channelCacheSchema);

export default ChannelCache;
