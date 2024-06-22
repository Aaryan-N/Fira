const Discord = require("discord.js");
const { token } = require("./token.json");
const pollFunctions = require("./pollFunctions.js");

const Client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.Guilds,
  ],
  partials: [
    Discord.Partials.Message,
    Discord.Partials.Channel,
    Discord.Partials.GuildMember,
    Discord.Partials.User,
    Discord.Partials.GuildScheduledEvent,
    Discord.Partials.ThreadMember,
  ],
});

Client.on("ready", (client) => {
  console.log(
    "The bot is ready and online with the name of " + client.user.tag,
  );
});

Client.on("messageCreate", (message) => {
  if (message.author.bot === false) {
    const inputToLowerCase = message.content.toLowerCase();

    if (inputToLowerCase == "!help" || inputToLowerCase == "!commands") {
      message.reply(
        "The !polls command displays all the polls that are currently active. \n" +
          "The !closedpolls command displays all polls that are closed.\n" +
          "The !poll <number> command displays a specific poll and the description.\n" +
          "The !vote <number> yes/no give you the ability to vote on a specific poll.\n" +
          "The !close <number> closes a poll that you ahve created .\n" +
          "The ! create <question> creates a poll that user's can vote yes or no on",
      );
    } else if ("!create") {
      let data = pollFunctions.createPoll();

      message.reply(data);
    }
  }
});

Client.login(token);
