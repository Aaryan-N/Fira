import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import redBright from 'chalk';

export default {
 category: 'animals',
 cooldown: 3,
 data: new SlashCommandBuilder()
  .setName('dogpic')
  .setDescription('Replies with a random picture of a dog!'),
 async execute(interaction) {
  try {
   axios({
    method: 'get',
    url: 'https://dog.ceo/api/breeds/image/random',
    responseType: 'json',
   })
    .then(function(response) {
     if (response.data.status === 'success') {
      const dogEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Dog Pic!')
       .setImage(response.data.message)
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira, thanks to dog.ceo',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });
      interaction.reply({ embeds: [dogEmbed] });
     } else {
      interaction.reply({ embeds: [errorEmbed] });
     }
    })
    .catch(err => {
     console.log(
      redBright(`Woah there has been an error with the dog picture command. Here it is:` + err),
     );
     interaction.reply({ embeds: [errorEmbed] });
    });
  } catch (err) {
   console.log(
    redBright(`Woah there has been an error with the dog picture command. Here it is:` + err),
   );
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
