import mongoose from 'mongoose';

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

// TTL index to automatically delete old cache entries after 10 minutes
channelCacheSchema.index({ cachedAt: 1 }, { expireAfterSeconds: 600 });

const ChannelCache = mongoose.model('ChannelCache', channelCacheSchema);

export default ChannelCache;
