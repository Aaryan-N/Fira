import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import redBright from 'chalk';

export default {
 data: new SlashCommandBuilder().setName('fact').setDescription('Replies with a fact!'),
 async execute(interaction) {
  axios({
   method: 'get',
   url: 'https://uselessfacts.jsph.pl/api/v2/facts/random',
   responseType: 'json',
  })
   .then(function (response) {
    const factsEmbed = new EmbedBuilder()
     .setColor(0x0099ff)
     .addFields({ name: 'Fact', value: response.data.text })
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira',
      iconURL:
       'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });
    interaction.reply({ embeds: [factsEmbed] });
   })
   .catch(err => {
    console.log(
     redBright(
      `Woah there has been an error with the facts command. Here it is: 
` + err,
     ),
    );
    interaction.reply({ embeds: [errorEmbed] });
   });
 },
};
