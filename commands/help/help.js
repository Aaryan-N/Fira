import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

export default {
 category: 'help',
 data: new SlashCommandBuilder().setName('help').setDescription('Replies with information about the bot!'),
 async execute(interaction) {
  const animalsCommandList = new ButtonBuilder()
   .setCustomId('animalcommand')
   .setLabel('Animals 🐕')
   .setStyle(ButtonStyle.Primary)

  const arcadeCommandsList = new ButtonBuilder()
   .setCustomId('arcadecommand')
   .setLabel('Arcade 🎮')
   .setStyle(ButtonStyle.Primary)


  const helpRow = new ActionRowBuilder()
   .addComponents(animalsCommandList, arcadeCommandsList);

  const helpResponse = await interaction.reply({
   content: "alright mr sigma",
   components: [helpRow]
   });

  const collectorFilter = i => i.user.id === interaction.user.id;

  try {
   const confirmation = await helpResponse.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
   // write checks here
  } catch (e) {
   await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
  }
 },
};
