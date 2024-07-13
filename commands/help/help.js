import { ComponentType, SlashCommandBuilder } from 'discord.js';
import { mainMenuHelp } from '../../templates/embeds/help/mainMenuHelp.js';
import { helpRow } from '../../templates/actionRows/helpActionRow.js';

export default {
 category: 'help',
 data: new SlashCommandBuilder()
  .setName('help')
  .setDescription('Replies with information about the bot!'),
 async execute(interaction) {

  const helpResponse = await interaction.reply({ embeds: [mainMenuHelp], components: [helpRow] });

  const collectorFilter = i => i.user.id === interaction.user.id;

  const collector = await helpResponse.createMessageComponentCollector({
    components: ComponentType.StringSelect,
    filter: collectorFilter,
    time: 1_20_000,
   });

  collector.on('collect', async interact => {
   const selection = interact.values[0];
   if (selection === "animalhelp") {
    await interact.update({ content: "rizz", components: [helpRow]})
   } else if (selection === "arcadehelp") {
    await interact.update({ content: "arcade", components: [helpRow]})
   }
  });
 },
};
