import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { ClusterClient, getInfo } from 'discord-hybrid-sharding';
import { commandHandler } from './handlers/commandHandler.js';
import { eventHandler } from './handlers/eventHandler.js';
import chalk from 'chalk';
import 'dotenv/config';

export const client = new Client({
 intents: [
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.Guilds,
 ],
 partials: [
  Partials.Message,
  Partials.Channel,
  Partials.GuildMember,
  Partials.User,
  Partials.GuildScheduledEvent,
  Partials.ThreadMember,
 ],
 shards: getInfo().SHARD_LIST,
 shardCount: getInfo().TOTAL_SHARDS,
});

client.cooldowns = new Collection();
client.cluster = new ClusterClient(client);

commandHandler(client).then(() => console.log(chalk.greenBright('Command handler is ready!')));
eventHandler(client).then(() => console.log(chalk.greenBright('Event handler is ready!')));

try {
 client.login(process.env.TOKEN).then(() => {
  console.log(chalk.greenBright('Successfully logged in!'));
 });
} catch (err) {
 console.log(chalk.redBright('Something went wrong with logging in. Here is the problem' + err));
}

try {
 await console.log(chalk.blueBright('Shard List: ' + getInfo().SHARD_LIST));
 await console.log(chalk.blueBright('Total Shards: ' + getInfo().TOTAL_SHARDS));
 await console.log(chalk.blueBright('Cluster Count: ' + getInfo().CLUSTER_COUNT));
 await console.log(chalk.blueBright('Cluster List: ' + getInfo().CLUSTER));
} catch (err) {
 console.log(chalk.redBright('Something went wrong with sharding. Here is the problem' + err));
}
