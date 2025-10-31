import mongoose from 'mongoose';

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

// Create a compound index for efficient queries
guildCacheSchema.index({ userId: 1, cachedAt: 1 });

// TTL index to automatically delete old cache entries after 10 minutes
guildCacheSchema.index({ cachedAt: 1 }, { expireAfterSeconds: 600 });

const GuildCache = mongoose.model('GuildCache', guildCacheSchema);

export default GuildCache;
