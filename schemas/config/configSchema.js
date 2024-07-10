import { connectDBs } from '../../core/databaseConnect.js';
import { default as mongoose } from 'mongoose';

const configSchema = mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  }, guildCreatedAt: {
    type: Date,
    required: true,
  }, guildCreatedAtTimestamp: {
    type: Number,
    required: true,
  }, ticketChannel: {
    type: String,
    required: true,
  }, updateChannel: {
    type: String,
    required: true,
  },
});

const { configDb } = connectDBs();

export const configSchemaExport = configDb.model('guildconfigs', configSchema);

