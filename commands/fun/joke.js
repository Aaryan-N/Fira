import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import redBright from 'chalk';

export default {
 data: new SlashCommandBuilder().setName('joke').setDescription('Replies with a lovely joke'),
 async execute(interaction) {
  axios({
   method: 'get',
   url: 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single',
   responseType: 'json',
  })
   .then(function(response) {
    const jokeEmbed = new EmbedBuilder()
     .setColor([255, 231, 188])
     .setTitle('Jokes')
     .addFields({
      name: 'Category: ' + response.data.category,
      value: response.data.joke,
     })
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira',
      iconURL:
       'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });
    interaction.reply({ embeds: [jokeEmbed] });
   })
   .catch(err => {
    console.log(
     redBright(
      `Woah there has been an error with the joke command. Here it is: 
` + err,
     ),
    );
    interaction.editReply({ embeds: [errorEmbed] });
   });
 },
};
