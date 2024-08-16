import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'fun',
 cooldown: 5,
 data: new SlashCommandBuilder().setName('memes').setDescription('Replies with an alright meme!'),
 async execute(interaction) {
  try {
   axios({
    method: 'get',
    url: 'https://meme-api.com/gimme?nsfw=false',
    responseType: 'json',
   })
    .then(function(response) {
     const memesEmbed = new EmbedBuilder()
      .setColor([255, 231, 188])
      .setTitle(response.data.title)
      .setURL(response.data.postLink)
      .setImage(response.data.url)
      .setTimestamp()
      .setFooter({
       text: 'Sent using Fira',
       iconURL:
        'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
      });
     interaction.reply({ embeds: [memesEmbed] });
    })
    .catch(err => {
     console.log(
      `Woah there has been an error with the message of the day command. Here it is: 
` + err,
     );
     interaction.editReply({ embeds: [errorEmbed] });
    });
  } catch (e) {
   console.log(
    `Woah there has been an error with the memes command. Here it is: 
 ` + err,
   );
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
