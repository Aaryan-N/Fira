const Discord = require("discord.js");

const { token } = require("./token.json");

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
  if (message.author.bot === true) {
    return;
  }

  function saveGameData(data) {
    const fs = require("fs");
    const path = "./gamedata.json";

    fs.writeFileSync(path, data);
  }

  let rawUserInput = message.content;
  let userInputToLowerCase = message.content.toLowerCase();
  let statusMessage = "";

  const pcOptions = ["rock", "paper", "scissors"];

  const pcChoice = Math.floor(Math.random() * 3);

  if (userInputToLowerCase === "rock") {
    if (pcOptions[pcChoice] === userInputToLowerCase) {
      statusMessage = "Its a draw!";
    } else if (pcOptions[pcChoice] === "scissors") {
      statusMessage = "You won!";
    } else if (pcOptions[pcChoice] === "paper") {
      statusMessage = "You lost!";
    } else {
      message.reply("Error in the code :(");
    }
    message.reply(
      "You chose: " +
        rawUserInput +
        " and computer selected: " +
        pcOptions[pcChoice],
    );
    message.reply(statusMessage);
    let obj = returnNewGameObject(message.author.id, message.author.tag);
    saveGameData(JSON.stringify(obj));
  } else if (userInputToLowerCase === "scissors") {
    if (pcOptions[pcChoice] === userInputToLowerCase) {
      statusMessage = "Its a draw!";
    } else if (pcOptions[pcChoice] === "rock") {
      statusMessage = "You lost!";
    } else if (pcOptions[pcChoice] === "paper") {
      statusMessage = "You won!";
    } else {
      message.reply("Error in the code :(");
    }
    message.reply(
      "You chose: " +
        rawUserInput +
        " and computer selected: " +
        pcOptions[pcChoice],
    );
    message.reply(statusMessage);
    let obj = returnNewGameObject(message.author.id, message.author.tag);
    saveGameData(JSON.stringify(obj));
  } else if (userInputToLowerCase === "paper") {
    if (pcOptions[pcChoice] === userInputToLowerCase) {
      statusMessage = "Its a draw!";
    } else if (pcOptions[pcChoice] === "scissors") {
      statusMessage = "You lost!";
    } else if (pcOptions[pcChoice] === "rock") {
      statusMessage = "You won!";
    } else {
      message.reply("Error in the code :(");
    }
    message.reply(
      "You chose: " +
        rawUserInput +
        " and computer selected: " +
        pcOptions[pcChoice],
    );
    message.reply(statusMessage);
    let obj = returnNewGameObject(message.author.id, message.author.tag);
    saveGameData(JSON.stringify(obj));
  } else {
    message.reply("Not a valid option, champ!");
    message.reply(
      "You chose: " +
        rawUserInput +
        " and computer selected: " +
        pcOptions[pcChoice],
    );
  }
});

function returnNewGameObject(userID, name) {
  return {
    ID: 0,
    userID: userID,
    name: name,
    draw: 0,
    win: 0,
    lose: 0,
    rounds: 0,
    time: new Date().toString(),
  };
}

Client.login(token);
