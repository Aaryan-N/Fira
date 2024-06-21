const Discord= require("discord.js");

const { token } = require("./token.json")

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

Client.on("messageCreate", (message) => {
    const userInputText = message.content.toLowerCase();

    if (message.author.bot){ return }
    console.log("A new message was written!")

    if (!message.author.bot) {
        message.reply("Hello world! You're not a bot!")
    }
    if (userInputText === "!commands" || message.content === "!help"){
        message.reply("This bot operates on these commands!")
    }
}
)

Client.login(token);
