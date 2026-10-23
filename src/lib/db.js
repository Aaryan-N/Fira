import mongoose from 'mongoose';
import { log } from './logger.js';

// Each logical database keeps its legacy env var so existing deployments keep working.
// MONGO_URI is used for any database whose dedicated variable is not set.
const DATABASES = {
 economy: 'MONGOURLECONOMY',
 birthday: 'MONGOURLBIRTHDAY',
 users: 'MONGOURLUSERS',
 ticket: 'MONGOURLTICKET',
 config: 'MONGOURLCONFIG',
};

// Connections are created unopened so models can be defined at import time
// (e.g. by the command deploy script) without touching the network.
export const db = Object.fromEntries(
 Object.keys(DATABASES).map(key => [key, mongoose.createConnection()]),
);

export function databaseUri(key) {
 return process.env[DATABASES[key]] || process.env.MONGO_URI;
}

export async function connectDatabases() {
 await Promise.all(
  Object.entries(DATABASES).map(async ([key, envName]) => {
   const uri = databaseUri(key);
   if (!uri) throw new Error(`Missing ${envName} (or MONGO_URI) for the ${key} database`);
   await db[key].openUri(uri);
  }),
 );
 log.ok('Connected to all databases');
}

export async function closeDatabases() {
 await Promise.all(Object.values(db).map(connection => connection.close()));
}
