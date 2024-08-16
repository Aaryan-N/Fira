import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import * as https from 'node:https';

export default {
 category: 'fun',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('Play a game of 8 ball!')
  .addStringOption(option =>
   option.setName('query').setDescription('Ask the 8 Ball what you want!').setRequired(true),
  )
  .addBooleanOption(option =>
   option.setName('lucky').setDescription('Feeling lucky? Set this to true!'),
  ),

 async execute(interaction) {
  try {
   const userLuckyChoice = interaction.options.get('lucky')?.value;
   const userBallQuery = interaction.options.getString('query');
   const formattedUserBallQuery = userBallQuery.replace(/ /g, '+');

   const agent = new https.Agent({
    rejectUnauthorized: false,
   });

   axios({
    method: 'get',
    url: `https://eightballapi.com/api?question=${formattedUserBallQuery}&lucky=${userLuckyChoice}`,
    httpsAgent: agent,
    responseType: 'json',
   })
    .then(function(response) {
     const ballEmbed = new EmbedBuilder()
      .setColor([255, 231, 188])
      .setTitle('8 Ball')
      .addFields({ name: 'The 8 Ball\'s verdict:', value: response.data.reading })
      .setTimestamp()
      .setFooter({
       text: 'Sent using Fira',
       iconURL:
        'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
      });
     interaction.reply({ embeds: [ballEmbed] });
    })
    .catch(err => {
     console.log(
      `Woah there has been an error with the 8 ball command. Here it is: 
 ` + err,
     );
     interaction.reply({ embeds: [errorEmbed] });
    });
  } catch (e) {
   console.log(
    `Woah there has been an error with the 8 ball command. Here it is: 
 ` + err,
   );
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
