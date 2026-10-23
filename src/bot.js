import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import { requireEnv } from './config.js';
import { closeDatabases, connectDatabases } from './lib/db.js';
import { loadCommands, loadComponents, loadEvents } from './lib/loader.js';
import { log } from './lib/logger.js';

requireEnv('TOKEN');

const info = getInfo();

// Slash commands, components and modals need no privileged intents.
const client = new Client({
 intents: [GatewayIntentBits.Guilds],
 partials: [Partials.Channel],
 shards: info.SHARD_LIST,
 shardCount: info.TOTAL_SHARDS,
});

client.cluster = new ClusterClient(client);
client.cooldowns = new Collection();
client.commands = await loadCommands();
client.components = await loadComponents();

for (const event of await loadEvents()) {
 const listener = (...args) =>
  Promise.resolve(event.execute(...args)).catch(error =>
   log.error(`Unhandled error in ${event.name} handler:`, error),
  );
 client[event.once ? 'once' : 'on'](event.name, listener);
}

log.info(
 `Loaded ${client.commands.size} commands and ${client.components.size} component handlers ` +
  `for shards [${info.SHARD_LIST}] of ${info.TOTAL_SHARDS}`,
);

process.on('unhandledRejection', error => log.error('Unhandled promise rejection:', error));

async function shutdown(signal) {
 log.warn(`Received ${signal}, shutting down`);
 await client.destroy().catch(() => {});
 await closeDatabases().catch(() => {});
 process.exit(0);
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

await connectDatabases();
await client.login(process.env.TOKEN);
