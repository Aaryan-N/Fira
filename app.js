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
            Discord.Partials.GuildScheduledEvent,
            Discord.Partials.ThreadMember
        ]
});

Client.on("ready", (client) => {
    console.log("The bot is ready and online with the name of " + client.user.tag)
});

Client.on("messageCreate", (message) => {
    if (message.author.bot === true) { return }

    let userInputToLowerCase = message.content.toLowerCase();

    const pcOptions = ["rock", "paper", "scissors"];

    const pcChoice = Math.floor(Math.random() * 3)

    if (userInputToLowerCase === "rock") {
        let statusMessage = "";
        if(pcOptions[pcChoice] === userInputToLowerCase) {
            statusMessage = "Its a draw!"
        }
       // message.reply("You chose: " + userInputToLowerCase)
    }
    else if (userInputToLowerCase === "scissors") {
        //message.reply("You chose: " + userInputToLowerCase)
    }
    else if (userInputToLowerCase === "paper") {
       // message.reply("You chose: " + userInputToLowerCase)
    }
    }
)

Client.login(token);
