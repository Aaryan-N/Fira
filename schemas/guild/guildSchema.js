import { connectDBs } from '../../core/databaseConnect.js';
import mongoose from 'mongoose';

const guildSchema = mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  }, guildName: {
    type: String,
    required: true,
  }, guildCreatedAt: {
    type: Date,
  }, guildCreatedAtTimestamp: {
    type: Number,
  }, guildClientJoinedAt: {
    type: Date,
  }, guildJoinedCurrently: {
    type: Boolean,
    required: true,
  },
});

const { usersDb } = connectDBs();

export const guildSchemaExport = usersDb.model('guilds', guildSchema);

