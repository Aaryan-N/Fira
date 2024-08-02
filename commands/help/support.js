import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'help',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('support')
  .setDescription('Link to support server!'),

 async execute(interaction) {
  try {
   const supportEmbed = new EmbedBuilder()
    .setColor([255, 231, 188])
    .setTitle('Support Server')
    .setDescription('To Be Added')
    .setTimestamp()
    .setFooter({
     text: 'Sent using Fira',
     iconURL:
      'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
    });
   interaction.reply({ embeds: [supportEmbed] });
  } catch (e) {
   console.log('Woah there has been an error with the support command');
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
