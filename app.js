const Discord= require("discord.js");

const Client = new Discord.Client({
        intents: [
            Discord.GatewayIntentBits.GuildMessages,
            Discord.GatewayIntentBits.GuildMembers,
            Discord.GatewayIntentBits.DirectMessages,
            Discord.GatewayIntentBits.MessageContent,
            Discord.GatewayIntentBits.Guilds
        ], partials: [
            Discord.Partials.Message,
            Discord.Partials.Channel,
            Discord.Partials.GuildMember,
            Discord.Partials.User,
            Discord.Partials.GuildScheduledEvent
        ]
});

Client.on("ready", (client) => {
    console.log("The bot is ready and online with the name of " + client.user.tag)
});

Client.login("");
