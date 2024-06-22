const Discord = require("discord.js");
const fs = require("fs");
const { token } = require("./token.json");
const path = "./gamedata.json";

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

  let rawUserInput = message.content;
  let userInputToLowerCase = message.content.toLowerCase();

  const pcOptions = ["rock", "paper", "scissors"];

  const pcChoice = Math.floor(Math.random() * 3);

  if (userInputToLowerCase === "rock") {
    let statusMessage = "";
    if (pcOptions[pcChoice] === userInputToLowerCase) {
      statusMessage = "Its a draw!";
      saveGame(message.author.id, message.author.tag, "draw");
    } else if (pcOptions[pcChoice] === "scissors") {
      statusMessage = "You won!";
      saveGame(message.author.id, message.author.tag, "win");
    } else if (pcOptions[pcChoice] === "paper") {
      statusMessage = "You lost!";
      saveGame(message.author.id, message.author.tag, "lose");
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
  } else if (userInputToLowerCase === "scissors") {
    let statusMessage = "";
    if (pcOptions[pcChoice] === userInputToLowerCase) {
      statusMessage = "Its a draw!";
      saveGame(message.author.id, message.author.tag, "draw");
    } else if (pcOptions[pcChoice] === "rock") {
      statusMessage = "You lost!";
      saveGame(message.author.id, message.author.tag, "lose");
    } else if (pcOptions[pcChoice] === "paper") {
      statusMessage = "You won!";
      saveGame(message.author.id, message.author.tag, "win");
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
  } else if (userInputToLowerCase === "paper") {
    let statusMessage = "";
    if (pcOptions[pcChoice] === userInputToLowerCase) {
      statusMessage = "Its a draw!";
      saveGame(message.author.id, message.author.tag, "draw");
    } else if (pcOptions[pcChoice] === "scissors") {
      statusMessage = "You lost!";
      saveGame(message.author.id, message.author.tag, "lose");
    } else if (pcOptions[pcChoice] === "rock") {
      statusMessage = "You won!";
      saveGame(message.author.id, message.author.tag, "win");
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

function saveGame(userID, name, gameStatus) {
  let gameData = returnGameData();
  let newGame = true;

  for (let i = 0; i < gameData.length; i++) {
    if (gameData[i].userID == userID && gameData[i].rounds < 3) {
      newGame = false;

      gameData[i].rounds++;
      gameData[i][gameStatus]++;
    }
  }

  if (newGame == true) {
    let newGameObject = returnNewGameObject(userID, name);
    newGameObject.ID = gameData.length + 1;

    newGameObject.rounds++;
    newGameObject[gameStatus]++;
    if (gameData.length < 1) {
      gameData = [newGameObject];
    } else if (gameData.length > 0) {
      gameData.push(newGameObject);
    }
  }
  saveGameData(gameData);
}

function saveGameData(data) {
  fs.writeFileSync(path, JSON.stringify(data));
}

function returnGameData() {
  const encoding = "utf-8";
  return JSON.parse(fs.readFileSync(path, encoding));
}

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
