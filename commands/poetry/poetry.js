import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

export default {
 category: 'poetry',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('poetry')
  .setDescription('A nice bit of poetry!')
 ,

 async execute(interaction) {
  axios({
   method: 'get',
   url: `https://poetrydb.org/random`,
   responseType: 'json',
  })
   .then(function(response) {
    let lineContent = '';

    for (let index = 0; index < response.data[0].lines.length; index++) {
     lineContent += response.data[0].lines[index] + ' ';
    }

    const poetryEmbed = new EmbedBuilder()
     .setColor([255, 231, 188])
     .setTitle('Poetry: ' + '"' + response.data[0].title + '"')
     .setAuthor({ name: response.data[0].author })
     .addFields({ name: 'Content:', value: lineContent })
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira, thanks to poetrydb.org!',
      iconURL:
       'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });
    interaction.reply({ embeds: [poetryEmbed] });
   });
 },
};
