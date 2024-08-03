import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'writing',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('quotes')
  .setDescription('A inspiring quote!')
 ,

 async execute(interaction) {
  axios({
   method: 'get',
   url: `https://zenquotes.io/api/random`,
   responseType: 'json',
  })
   .then(async function(response) {
    try {

     const quotesEmbed = new EmbedBuilder()
      .setColor([255, 231, 188])
      .setTitle('Quotes')
      .setAuthor({ name: response.data[0].a })
      .setDescription(response.data[0].q)
      .setTimestamp()
      .setFooter({
       text: 'Sent using Fira, thanks to zenquotes.io',
       iconURL:
        'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
      });
     interaction.reply({ embeds: [quotesEmbed] });

    } catch (err) {
     console.log(
      `Woah there has been an error with the poetry command. Here it is: 
 ` + err,
     );
     interaction.reply({ embeds: [errorEmbed] });
    }
   });
 }
};
