import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { economySchemaExport } from '../../schemas/fun/economySchema.js';

export default {
 data: new SlashCommandBuilder().setName('checkbalance').setDescription('Check your balance!'),
 async execute(interaction) {
  let economyProfile = await economySchemaExport.findOne({
   userId: interaction.member.id,
   guildId: interaction.guild.id,
  });
  const currentUserBalance = economyProfile.balance.toString();
  const ballEmbed = new EmbedBuilder()
   .setColor(0x0099ff)
   .setTitle('Your current balance:')
   .setDescription(currentUserBalance)
   .setTimestamp()
   .setFooter({
    text: 'Sent using Inferna',
    iconURL:
     'https://cdn.discordapp.com/attachments/1126688226590085230/1260169728073404469/InfernaLogo.jpeg?ex=668e5803&is=668d0683&hm=e84b1cec8c78ae2142842ba9b7154b65d8e9801bc21f0dd4c2b7a860cf2e4d18&',
   });
  interaction.reply({ embeds: [ballEmbed] });
 },
};
