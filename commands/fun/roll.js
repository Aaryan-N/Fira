import { bold, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { rando } from '@nastyox/rando.js';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'fun',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('dice')
  .setDescription('Roll a dice!'),
 async execute(interaction) {
  try {
   const result = rando(1,6);

   const diceEmbed = new EmbedBuilder()
    .setColor([255, 231, 188])
    .setTitle('Dice Roll:')
    .setDescription("Result: " + bold(result.toString()))
    .setTimestamp()
    .setFooter({
     text: 'Sent using Fira',
     iconURL:
      'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
    });
   interaction.reply({ embeds: [diceEmbed] });
  } catch (err) {
   console.log(
    `Woah there has been an error with the dice command. Here it is: 
 ` + err,
   );
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
