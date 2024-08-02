import { connectDBs } from '../../core/databaseConnect.js';
import { default as mongoose } from 'mongoose';

const configSchema = mongoose.Schema({
 guildId: {
  type: String,
  required: true,
 }, ticketChannel: {
  type: String,
  default: '',
 }, updateChannel: {
  type: String,
  default: '',
 },
});

const { configDb } = connectDBs();

export const configSchemaExport = configDb.model('guildconfigs', configSchema);

