import { connectDBs } from '../../core/databaseConnect.js';
import mongoose from 'mongoose';

const birthdaySchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  birthDateConcat: {
    type: String,
    required: true,
  }, day: {
    type: Number,
    required: true,
  }, month: {
    type: Number,
    required: true,
  }, year: {
    type: Number,
    required: true,
  },
});

const { birthdayDb } = connectDBs();

export const birthdaySchemaExport = birthdayDb.model('birthday', birthdaySchema);

