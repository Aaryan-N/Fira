import { Client, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

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
