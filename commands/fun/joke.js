import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import axios from "axios";
import {errorEmbed} from "../../templates/embeds/errors/errorEmbed.js";
import redBright from 'chalk';
module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Replies with a lovely joke"),
  async execute(interaction) {
      axios({
          method: 'get',
          url: 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single',
          responseType: 'json'
      })
          .then(function (response) {
              const jokeEmbed = new EmbedBuilder()
                  .setColor(0x0099FF)
                  .setTitle("Jokes")
                  .addFields(
                      { name: "Category: " + response.data.category , value: response.data.joke },
                  )
                  .setTimestamp()
                  .setFooter({ text: "Sent using Hydra" })
              interaction.reply({embeds : [jokeEmbed]});
          })
          .catch((err) => {
              console.log(redBright(
                  `Woah there has been an error with the joke command. Here it is: 
` + err,
              ));
              interaction.editReply({ embeds: [errorEmbed] });
      });
  },
};
