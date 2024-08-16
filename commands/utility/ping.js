import { bold, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { rando } from '@nastyox/rando.js';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'fun',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check the websocket ping times'),
 async execute(interaction) {
  try {
   const pingingEmbed = new EmbedBuilder()
    .setColor([255, 231, 188])
    .setTitle(`Pinging Fira...`)
    .setTimestamp()
    .setFooter({
     text: 'Sent using Fira',
     iconURL:
      'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
    });

   const sent = await interaction.reply({ embeds: [pingingEmbed], fetchReply: true });

   const pingEmbed = new EmbedBuilder()
    .setColor([255, 231, 188])
    .setTitle(`Ping to Fira: ${sent.createdTimestamp - interaction.createdTimestamp} ms`)
    .setTimestamp()
    .setFooter({
     text: 'Sent using Fira',
     iconURL:
      'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
    });
   interaction.editReply({ embeds: [pingEmbed] });
  } catch (err) {
   console.log(
    `Woah there has been an error with the ping command. Here it is: 
 ` + err,
   );
   interaction.editReply({ embeds: [errorEmbed] });
  }
 },
};
