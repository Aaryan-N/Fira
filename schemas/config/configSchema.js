import { connectDBs } from '../../core/databaseConnect.js';
import { default as mongoose } from 'mongoose';

const configSchema = mongoose.Schema({
 guildId: {
  type: String,
  required: true,
 }, ticketChannel: {
  type: String,
 }, updateChannel: {
  type: String,
 },
});

const { configDb } = connectDBs();

export const configSchemaExport = configDb.model('guildconfigs', configSchema);

