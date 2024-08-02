import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

export const helpSelectMenu = new StringSelectMenuBuilder()
 .setCustomId('helpselectmenu')
 .setPlaceholder('Categories')
 .addOptions(
  new StringSelectMenuOptionBuilder()
   .setLabel('Animals 🐕')
   .setValue('animalhelp'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Arcade 🎮')
   .setValue('arcadehelp'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Birthday 🎂')
   .setValue('birthdayhelp'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Economy💲')
   .setValue('economyhelp'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Fun 😁')
   .setValue('funhelp'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Minecraft 🪓')
   .setValue('minecrafthelp'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Ticketing 🎫')
   .setValue('tickethelp'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Utility ⚙️')
   .setValue('utilityhelp'),
 );