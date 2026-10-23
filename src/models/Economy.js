import mongoose from 'mongoose';
import { db } from '../lib/db.js';

const economySchema = new mongoose.Schema({
 userId: { type: String, required: true },
 guildId: { type: String, required: true },
 balance: { type: Number, default: 0, min: 0 },
 lastDailyCollected: Date,
 dailyStreak: { type: Number, default: 0 },
});

economySchema.index({ guildId: 1, userId: 1 }, { unique: true });
economySchema.index({ guildId: 1, balance: -1 });

export const Economy = db.economy.model('economyDailies', economySchema);

export function getWallet(guildId, userId) {
 return Economy.findOneAndUpdate(
  { guildId, userId },
  { $setOnInsert: { guildId, userId } },
  { upsert: true, returnDocument: 'after' },
 );
}
