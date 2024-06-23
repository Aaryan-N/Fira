const { SlashCommandBuilder } = require("discord.js");
const { rando } = require("@nastyox/rando.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play a game of rock, paper and scissors with the bot!")
    .addStringOption((option) =>
      option
        .setName("userchoice")
        .setRequired(true)
        .setDescription("Play a game of rock, paper, scissors!")
        .addChoices(
          { name: "Rock", value: "rock" },
          { name: "Paper", value: "paper" },
          { name: "Scissors", value: "scissors" },
        ),
    ),

  async execute(interaction) {
    const userInput = interaction.options.getString("userchoice");

    const pcOptions = ["rock", "paper", "scissors"];
    let statusMessage = "";
    const pcChoice = rando(0, 2);

    try {
      if (userInput === "rock") {
        if (pcOptions[pcChoice] === userInput) {
          statusMessage = "Its a draw!";
        } else if (pcOptions[pcChoice] === "scissors") {
          statusMessage = "You won!";
        } else if (pcOptions[pcChoice] === "paper") {
          statusMessage = "You lost!";
        }
      } else if (userInput === "scissors") {
        if (pcOptions[pcChoice] === userInput) {
          statusMessage = "Its a draw!";
        } else if (pcOptions[pcChoice] === "rock") {
          statusMessage = "You lost!";
        } else if (pcOptions[pcChoice] === "paper") {
          statusMessage = "You won!";
        }
      } else if (userInput === "paper") {
        if (pcOptions[pcChoice] === userInput) {
          statusMessage = "Its a draw!";
        } else if (pcOptions[pcChoice] === "scissors") {
          statusMessage = "You lost!";
        } else if (pcOptions[pcChoice] === "rock") {
          statusMessage = "You won!";
        }
      }
    } catch (err) {
      console.log(
        "Woah there has been an error with the rps command. Here it is: " + err,
      );
      await interaction.reply(
        "We are sorry, something has gone terribly wrong. The developer has been notified!",
      );
    }
    const finalBufferResponseToUser =
      "The computer selected " +
      pcOptions[pcChoice] +
      " and you selected " +
      userInput +
      " so....";
    await interaction.reply(finalBufferResponseToUser + " " + statusMessage);
  },
};
