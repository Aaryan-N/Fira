import { bold, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { rando } from '@nastyox/rando.js';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'fun',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('coinflip')
  .setDescription('Flip a coin!'),
 async execute(interaction) {
  try {
   let result;
   const cf = rando(1);
   if (cf === 0) {
    result = 'Heads';
   } else if (cf === 1) {
    result = 'Tails';
   } else {
    console.log('Woah something went wrong with the coin flip command!');
    interaction.reply({ embeds: [errorEmbed] });
   }
   const coinEmbed = new EmbedBuilder()
    .setColor([255, 231, 188])
    .setTitle(bold(result))
    .setTimestamp()
    .setFooter({
     text: 'Sent using Fira',
     iconURL:
      'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
    });
   interaction.reply({ embeds: [coinEmbed] });
  } catch (e) {
   console.log(
    `Woah there has been an error with the coin flip command. Here it is: 
 ` + err,
   );
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
