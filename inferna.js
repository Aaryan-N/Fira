import {Client, GatewayIntentBits, Partials} from 'discord.js';
import {ClusterClient, getInfo} from 'discord-hybrid-sharding';
import mongoose from 'mongoose';
import {commandHandler} from "./handlers/commandHandler.js";
import {eventHandler} from "./handlers/eventHandler.js";
import chalk from "chalk";
import 'dotenv/config'

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
  ], shards: getInfo().SHARD_LIST,
    shardCount: getInfo().TOTAL_SHARDS,
});


export function connectDBs() {
    try {
        const economyDb = mongoose.createConnection(process.env.MONGOURLECONOMY, {})
        const birthdayDb = mongoose.createConnection(process.env.MONGOURLBIRTHDAY, {})
        const usersDb = mongoose.createConnection(process.env.MONGOURLUSERS, {})
        const ticketingDb = mongoose.createConnection(process.env.MONGOURLTICKET, {})
        const configDb = mongoose.createConnection(process.env.MONGOURLCONFIG, {})
        return { economyDb, birthdayDb, usersDb, ticketingDb, configDb }
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

try {
    console.log(chalk.greenBright("Connected to the cluster, all connections to the databases have been established!"));
} catch(err) {
    console.error(chalk.redBright("DB connection failed!" + err));
}

commandHandler(client);
eventHandler(client);

client.cluster = new ClusterClient(client);

try {
    client.login(process.env.TOKEN)
    console.log(chalk.greenBright("Successfully logged in!"));
} catch (err) {
    console.log(chalk.redBright("Something went wrong with logging in. Here is the problem" + err));
}

try {
    await console.log(chalk.blueBright("Shard List: " + getInfo().SHARD_LIST))
    await console.log(chalk.blueBright("Total Shards: " + getInfo().TOTAL_SHARDS))
    await console.log(chalk.blueBright("Cluster Count: " + getInfo().CLUSTER_COUNT))
    await console.log(chalk.blueBright("Cluster List: " + getInfo().CLUSTER))
} catch (err){
    console.log(chalk.redBright("Something went wrong with sharding. Here is the problem" + err));
}
