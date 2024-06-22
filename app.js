import { Client, GatewayIntentBits, Partials, REST, Routes } from "discord.js";
import { helpCommand } from "./src/commands/helpCommand.js";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.token);
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

const rest = new REST({ version: "10" }).setToken(process.env.token);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.clientID), {
    body: helpCommand,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
