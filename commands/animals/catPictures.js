import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import redBright from 'chalk';

export default {
 data: new SlashCommandBuilder()
  .setName('catpic')
  .setDescription('Replies with a random picture of a cat!'),
 async execute(interaction) {
  axios({
   method: 'get',
   url: 'https://api.thecatapi.com/v1/images/search',
  })
   .then(function(response) {

    const catEmbed = new EmbedBuilder()
     .setColor([255, 231, 188])
     .setTitle('Cat Pic!')
     .setImage(response.data[0].url)
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira, thanks to thecatapi.com',
      iconURL:
       'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });
    interaction.reply({ embeds: [catEmbed] });
   })
   .catch(err => {
    console.log(
     redBright(`Woah there has been an error with the cat pictures command. Here it is:` + err),
    );
    interaction.reply({ embeds: [errorEmbed] });
   });
 },
};
