import mongoose from 'mongoose';
import { db } from '../lib/db.js';

const guildConfigSchema = new mongoose.Schema({
 guildId: { type: String, required: true, unique: true },
 ticketChannel: { type: String, default: '' },
 ticketStaffRole: { type: String, default: '' },
 birthdayChannel: { type: String, default: '' },
 // UTC date string (YYYY-MM-DD) of the last day birthdays were announced in this guild.
 lastBirthdayAnnouncement: { type: String, default: '' },
 updateChannel: { type: String, default: '' },
});

// Model name kept from v1 so existing documents remain in the same collection.
export const GuildConfig = db.config.model('guildconfigs', guildConfigSchema);

export function getGuildConfig(guildId) {
 return GuildConfig.findOneAndUpdate(
  { guildId },
  { $setOnInsert: { guildId } },
  { upsert: true, returnDocument: 'after' },
 );
}
