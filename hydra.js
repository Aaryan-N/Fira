const { Client, GatewayIntentBits, Partials } = require('discord.js');
const mongoose = require("mongoose");
const {commandHandler} = require("./handlers/commandHandler");
const {eventHandler} = require("./handlers/eventHandler");
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

function connectDBs() {
    try {
        const economyDb = mongoose.createConnection(process.env.mongoURlEconomy, {})
        const birthdayDb = mongoose.createConnection(process.env.mongoURlBirthday, {})
        return { economyDb, birthdayDb }
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}
module.exports = { connectDBs }

try {
    console.log("Connected to the cluster, all connections to the databases have been established!");
} catch(err) {
    console.error(err);
}

commandHandler(client);
eventHandler(client);

try {
    client.login(process.env.TOKEN)
    console.log("Successfully logged in!")
} catch (err) {
    console.log("Something went wrong with logging in. how have you messed up logging in?")
}
