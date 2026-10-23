import mongoose from 'mongoose';
import { db } from '../lib/db.js';

const guildSchema = new mongoose.Schema({
 guildId: { type: String, required: true, unique: true },
 guildName: { type: String, required: true },
 guildCreatedAt: Date,
 guildCreatedAtTimestamp: Number,
 guildClientJoinedAt: Date,
 guildJoinedCurrently: { type: Boolean, required: true },
});

export const Guild = db.users.model('guilds', guildSchema);
