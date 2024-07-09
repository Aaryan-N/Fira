import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import axios from "axios";
import {errorEmbed} from "../../templates/embeds/errors/errorEmbed.js";
import redBright from 'chalk';

export default {
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
                  .setFooter({ text: "Sent using Inferna", iconURL: "https://cdn.discordapp.com/attachments/1126688226590085230/1260169728073404469/InfernaLogo.jpeg?ex=668e5803&is=668d0683&hm=e84b1cec8c78ae2142842ba9b7154b65d8e9801bc21f0dd4c2b7a860cf2e4d18&" })
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
