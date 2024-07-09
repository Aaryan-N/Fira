import {bold, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {rando} from "@nastyox/rando.js";
import {errorEmbed} from "../../templates/embeds/errors/errorEmbed.js";
import redBright from 'chalk';

export default {
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
      console.log(redBright(`Woah there has been an error with the message of the day command. Here it is:` + err))
      interaction.editReply({ embeds: [errorEmbed] });
    }

    const unformattedPcChoice = pcOptions[pcChoice];

    const formattedPcChoice = unformattedPcChoice.charAt(0).toUpperCase() + unformattedPcChoice.slice(1);

    const formattedUserInput = userInput.charAt(0).toUpperCase()
        + userInput.slice(1)

    const rpsEmbed = new EmbedBuilder()
        .setTitle("RPS")
        .addFields(
            { name: "Your choice"  , value: formattedUserInput },
            { name: "The computer's choice", value: formattedPcChoice },
            { name: "Result", value: bold(statusMessage)}
        )
        .setTimestamp()
        .setFooter({ text: "Sent using Inferna", iconURL: "https://cdn.discordapp.com/attachments/1126688226590085230/1260169728073404469/InfernaLogo.jpeg?ex=668e5803&is=668d0683&hm=e84b1cec8c78ae2142842ba9b7154b65d8e9801bc21f0dd4c2b7a860cf2e4d18&" })

    if(statusMessage.includes("won") === true) {
      rpsEmbed.setColor(0x00FF00)
    } else if(statusMessage.includes("lost") === true) {
      rpsEmbed.setColor(0xFF0000)
    } else if(statusMessage.includes("draw") === true) {
      rpsEmbed.setColor(0x808080)
    } else {
      rpsEmbed.setColor(0x0099FF)
    }

    interaction.reply({embeds : [rpsEmbed]});

  },
};
