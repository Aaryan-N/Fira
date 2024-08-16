import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'writing',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('poetry')
  .setDescription('A nice bit of poetry!')
 ,

 async execute(interaction) {
  await interaction.deferReply();
  axios({
   method: 'get',
   url: `https://poetrydb.org/linecount/20`,
   responseType: 'json',
  })
   .then(async function(response) {
    try {

     let lineContent = '';

     for (let index = 0; index < response.data[0].lines.length; index++) {
      lineContent += response.data[0].lines[index] + ' ';
     }

     const poetryEmbed = new EmbedBuilder()
      .setColor([255, 231, 188])
      .setTitle('Poetry: ' + '\"' + response.data[0].title + '\"')
      .setAuthor({ name: response.data[0].author })
      .addFields({ name: 'Content:', value: lineContent })
      .setTimestamp()
      .setFooter({
       text: 'Sent using Fira, thanks to poetrydb.org!',
       iconURL:
        'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
      });
     interaction.editReply({ embeds: [poetryEmbed] });


    } catch (err) {
     console.log(
      `Woah there has been an error with the poetry command. Here it is: 
 ` + err,
     );
     interaction.reply({ embeds: [errorEmbed] });
    }
   });
 },
};
