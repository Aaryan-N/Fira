const { Client, GatewayIntentBits, Partials } = require('discord.js');
const mongoose = require("mongoose");
const {commandHandler} = require("./handlers/commandHandler");
const {eventHandler} = require("./handlers/eventHandler");
const chalk = require("chalk");
require('dotenv').config()

const client = new Client({
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
});

module.exports = client;

function connectDBs() {
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
module.exports = { connectDBs }

try {
    console.log(chalk.greenBright("Connected to the cluster, all connections to the databases have been established!"));
} catch(err) {
    console.error(chalk.redBright("DB connection failed!" + err));
}

commandHandler(client);
eventHandler(client);

try {
    client.login(process.env.TOKEN)
    console.log(chalk.greenBright("Successfully logged in!"));
} catch (err) {
    console.log(chalk.redBright("Something went wrong with logging in. Here is the problem" + err));
}
