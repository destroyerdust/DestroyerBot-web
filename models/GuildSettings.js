/**
 * Mongoose schema and model for Discord guild (server) bot settings.
 * Stores configuration for bot features including prefix, welcome messages, logging, and moderation.
 * @module models/GuildSettings
 */

import mongoose from 'mongoose';

/**
 * Subdocument schema for log settings configuration.
 * Controls which events are logged and where log messages are sent.
 *
 * @typedef {Object} LogSettings
 * @property {boolean} enabled - Whether logging is enabled for this guild
 * @property {string|null} channelId - Discord channel ID where logs are sent
 * @property {boolean} messageCreate - Log message creation events
 * @property {boolean} messageDelete - Log message deletion events
 */
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

/**
 * Subdocument schema for welcome message settings.
 * Configures automatic welcome messages for new guild members.
 *
 * @typedef {Object} WelcomeSettings
 * @property {boolean} enabled - Whether welcome messages are enabled
 * @property {string|null} channelId - Discord channel ID where welcome messages are sent
 * @property {string} message - Welcome message template (supports placeholders like {{user}})
 */
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

/**
 * Main schema for guild bot settings.
 * Stores all configuration options for a Discord guild's bot behavior.
 *
 * @typedef {Object} GuildSettingsDocument
 * @property {string} guildId - Discord guild ID (unique identifier)
 * @property {string} prefix - Command prefix for bot commands (e.g., '!', '?')
 * @property {boolean} filterProfanity - Enable profanity filtering in messages
 * @property {boolean} antiSpam - Enable anti-spam protection
 * @property {boolean} linkFilter - Filter/block links in messages
 * @property {boolean} logMembers - Log member join/leave events
 * @property {boolean} logModeration - Log moderation actions (kicks, bans, etc.)
 * @property {LogSettings} logs - Logging configuration subdocument
 * @property {WelcomeSettings} welcome - Welcome message configuration subdocument
 * @property {Date} createdAt - Document creation timestamp (auto-generated)
 * @property {Date} updatedAt - Document last update timestamp (auto-generated)
 */
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

/**
 * Mongoose model for guild settings.
 * Provides database operations for storing and retrieving guild configuration.
 *
 * @type {mongoose.Model<GuildSettingsDocument>}
 *
 * @example
 * // Create or update guild settings
 * const settings = await GuildSettings.findOneAndUpdate(
 *   { guildId: '123456789' },
 *   { prefix: '!', filterProfanity: true },
 *   { upsert: true, new: true }
 * );
 *
 * @example
 * // Retrieve guild settings
 * const settings = await GuildSettings.findOne({ guildId: '123456789' });
 * if (!settings) {
 *   // Guild has no custom settings, use defaults
 * }
 */
const GuildSettings = mongoose.model('GuildSettings', guildSettingsSchema);

export default GuildSettings;
