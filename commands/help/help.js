import { ComponentType, SlashCommandBuilder } from 'discord.js';
import { mainMenuHelp } from '../../templates/embeds/help/mainMenuHelp.js';
import { helpRow } from '../../templates/actionRows/help/helpActionRow.js';
import { economyMenuHelp } from '../../templates/embeds/help/economyHelp.js';
import { birthdayMenuHelp } from '../../templates/embeds/help/birthdayHelp.js';
import { arcadeMenuHelp } from '../../templates/embeds/help/arcadeHelp.js';
import { animalMenuHelp } from '../../templates/embeds/help/animalHelp.js';
import { utilityMenuHelp } from '../../templates/embeds/help/utilityHelp.js';
import { ticketMenuHelp } from '../../templates/embeds/help/ticketHelp.js';
import { minecraftMenuHelp } from '../../templates/embeds/help/minecraftHelp.js';
import { funMenuHelp } from '../../templates/embeds/help/funHelp.js';
import { expiredMenuHelp } from '../../templates/embeds/help/expiredHelp.js';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'help',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('help')
  .setDescription('Replies with information about the various commands and features of Fira!'),
 async execute(interaction) {
  try {
   const helpResponse = await interaction.reply({ embeds: [mainMenuHelp], components: [helpRow] });

   const collectorFilter = i => i.user.id === interaction.user.id;

   const collector = await helpResponse.createMessageComponentCollector({
    components: ComponentType.StringSelect,
    filter: collectorFilter,
    idle: 60_000,
    time: 1_20_000,
   });

   collector.on('collect', async interact => {
    const selection = interact.values[0];
    if (selection === 'animalhelp') {
     await interact.update({ embeds: [animalMenuHelp], components: [helpRow] });
    } else if (selection === 'arcadehelp') {
     await interact.update({ embeds: [arcadeMenuHelp], components: [helpRow] });
    } else if (selection === 'birthdayhelp') {
     await interact.update({ embeds: [birthdayMenuHelp], components: [helpRow] });
    } else if (selection === 'economyhelp') {
     await interact.update({ embeds: [economyMenuHelp], components: [helpRow] });
    } else if (selection === 'funhelp') {
     await interact.update({ embeds: [funMenuHelp], components: [helpRow] });
    } else if (selection === 'minecrafthelp') {
     await interact.update({ embeds: [minecraftMenuHelp], components: [helpRow] });
    } else if (selection === 'tickethelp') {
     await interact.update({ embeds: [ticketMenuHelp], components: [helpRow] });
    } else if (selection === 'utilityhelp') {
     await interact.update({ embeds: [utilityMenuHelp], components: [helpRow] });
    }

    collector.on('end', async collected => {
     const collectedMap = collected.map(x => x);
     const channelId = collectedMap[0].message.channelId;
     const messageId = collectedMap[0].message.id;
     interaction.client.channels.fetch(channelId).then(channel => {
      channel.messages.edit(messageId, { embeds: [expiredMenuHelp], components: [] });
     });
    });
   });
  } catch (e) {
   console.log(
    `Woah there has been an error with the help command. Here it is: 
 ` + err,
   );
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
