import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { economySchemaExport } from '../../schemas/fun/economySchema.js';
import redBright from 'chalk';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'economy',
 cooldown: 5,
 data: new SlashCommandBuilder().setName('checkbalance').setDescription('Check your balance!'),
 async execute(interaction) {
  try {
   let economyProfile = await economySchemaExport.findOne({
    userId: interaction.member.id,
    guildId: interaction.guild.id,
   });
   const currentUserBalance = economyProfile.balance.toString();
   const ballEmbed = new EmbedBuilder()
    .setColor([255, 231, 188])
    .setTitle('Your current balance:')
    .setDescription(currentUserBalance)
    .setTimestamp()
    .setFooter({
     text: 'Sent using Fira',
     iconURL:
      'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
    });
   interaction.reply({ embeds: [ballEmbed] });
 } catch (err) {
   console.log(
    redBright('Woah there has been an error with the check balance command. Here it is: \n' + err),
   );
   interaction.reply({ embeds: [errorEmbed] });
  }
},}