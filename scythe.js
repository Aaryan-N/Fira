const fs= require('node:fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
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

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.name, command);
    } else {
      console.log(
        `WARNING - The command at ${filePath} is missing a data or execute property`,
      );
    }
  }
}

client.on("ready", () => {
  console.log(
    "Client ready and logged in as " +
      client.user.username +
      " is now logged in.",
  );

  if (client.user.verified === true) {
    console.log("Scythe is a verified bot");
  } else {
    console.log("The bot is currently not verified");
  }
});

client.login(process.env.TOKEN);
