import mongoose from 'mongoose';

const guildSettingsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  prefix: {
    type: String,
    default: '!'
  },
  welcomeEnabled: {
    type: Boolean,
    default: false
  },
  welcomeMessage: {
    type: String,
    default: ''
  },
  filterProfanity: {
    type: Boolean,
    default: false
  },
  antiSpam: {
    type: Boolean,
    default: false
  },
  linkFilter: {
    type: Boolean,
    default: false
  },
  logDeletes: {
    type: Boolean,
    default: false
  },
  logMembers: {
    type: Boolean,
    default: false
  },
  logModeration: {
    type: Boolean,
    default: false
  },
  logChannelId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const GuildSettings = mongoose.model('GuildSettings', guildSettingsSchema);

export default GuildSettings;
