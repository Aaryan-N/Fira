import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'fun',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('dadjoke')
  .setDescription('Replies with a (slightly corny) dad joke'),
 async execute(interaction) {
  axios({
   method: 'get',
   url: 'https://icanhazdadjoke.com/',
   responseType: 'json',
   headers: {
    Accept: 'application/json',
   },
  })
   .then(function (response) {
    const dadJokeEmbed = new EmbedBuilder()
     .setColor([255, 231, 188])
     .addFields({ name: 'Dad Joke', value: response.data.joke })
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira',
      iconURL:
       'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });
    interaction.reply({ embeds: [dadJokeEmbed] });
   })
   .catch(err => {
    console.log(
     `Woah there has been an error with the dad joke command. Here it is: 
` + err,
    );
    interaction.editReply({ embeds: [errorEmbed] });
   });
 },
};
