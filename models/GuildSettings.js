import mongoose from 'mongoose';

const logSettingsSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  channelId: {
    type: String,
    default: null,
  },
  messageCreate: {
    type: Boolean,
    default: true,
  },
  messageDelete: {
    type: Boolean,
    default: true,
  },
})

const welcomeSettingsSchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  channelId: {
    type: String,
    default: null,
  },
  message: {
    type: String,
    default: 'Welcome to the server!',
  },
})

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
  logMembers: {
    type: Boolean,
    default: false
  },
  logModeration: {
    type: Boolean,
    default: false
  },
  logs: logSettingsSchema,
  welcome: welcomeSettingsSchema,
}, {
  timestamps: true
});

const GuildSettings = mongoose.model('GuildSettings', guildSettingsSchema);

export default GuildSettings;
