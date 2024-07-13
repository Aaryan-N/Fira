import { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { mainMenuHelp} from '../../templates/embeds/help/mainMenuHelp.js';

export default {
 category: 'help',
 data: new SlashCommandBuilder().setName('help').setDescription('Replies with information about the bot!'),
 async execute(interaction) {
  const mainMenuCommandList = new ButtonBuilder()
   .setCustomId('mainmenu')
   .setLabel("Main Menu")
   .setStyle(ButtonStyle.Primary)

  const animalsCommandList = new ButtonBuilder()
   .setCustomId('animalcommands')
   .setLabel('Animals 🐕')
   .setStyle(ButtonStyle.Primary)

  const arcadeCommandsList = new ButtonBuilder()
   .setCustomId('arcadecommands')
   .setLabel('Arcade 🎮')
   .setStyle(ButtonStyle.Primary)

  const birthdayCommandsList = new ButtonBuilder()
   .setCustomId('birthdaycommands')
   .setLabel('Birthday 🎂')
   .setStyle(ButtonStyle.Primary)

  const economyCommandsList = new ButtonBuilder()
   .setCustomId('economycommands')
   .setLabel('Economy 💲')
   .setStyle(ButtonStyle.Primary)

  const funCommandsList = new ButtonBuilder()
   .setCustomId('funcommands')
   .setLabel('Fun 😁')
   .setStyle(ButtonStyle.Primary)

  const minecraftCommandsList = new ButtonBuilder()
   .setCustomId('minecraftcommands')
   .setLabel('Minecraft 🪓')
   .setStyle(ButtonStyle.Primary)

  const ticketCommandsList = new ButtonBuilder()
   .setCustomId('ticketcommands')
   .setLabel('Ticketing 🎫')
   .setStyle(ButtonStyle.Primary)

  const utilityCommandsList = new ButtonBuilder()
   .setCustomId('utilitycommands')
   .setLabel('Utility ⚙️')
   .setStyle(ButtonStyle.Primary)

  const nextRowCommandsList = new ButtonBuilder()
   .setCustomId('nextrowcommands')
   .setLabel('Next Row ➡️')
   .setStyle(ButtonStyle.Primary)

  const helpRow = new ActionRowBuilder()
   .addComponents(animalsCommandList, arcadeCommandsList, birthdayCommandsList, economyCommandsList, nextRowCommandsList);

  const helpRowNextRow = new ActionRowBuilder()
   .addComponents(funCommandsList, minecraftCommandsList, ticketCommandsList, utilityCommandsList)

  const animalsRow = new ActionRowBuilder()
   .addComponents(mainMenuCommandList, arcadeCommandsList, birthdayCommandsList)

  const helpResponse = await interaction.reply({ embeds: [mainMenuHelp], components: [helpRow] });

  const collectorFilter = i => i.user.id === interaction.user.id;

  try {
   const confirmation = await helpResponse.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
   if (confirmation.customId === 'animalcommands') {
    await confirmation.update({ content:"Fweah", components: [animalsRow]})
   } else if (confirmation.customId === 'birthdaycommands') {

   }
  } catch (e) {
   birthdayCommandsList.setDisabled(true)
   await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
  }
 },
};
