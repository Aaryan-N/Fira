import mongoose from 'mongoose';
import { db } from '../lib/db.js';

const birthdaySchema = new mongoose.Schema({
 userId: { type: String, required: true },
 guildId: { type: String, required: true },
 // "day month", kept for compatibility with v1 documents.
 birthDateConcat: { type: String, required: true },
 day: { type: Number, required: true, min: 1, max: 31 },
 month: { type: Number, required: true, min: 1, max: 12 },
 // Optional: users may share a birthday without sharing their age.
 year: { type: Number },
});

birthdaySchema.index({ guildId: 1, userId: 1 }, { unique: true });
birthdaySchema.index({ guildId: 1, month: 1, day: 1 });

export const Birthday = db.birthday.model('birthday', birthdaySchema);
