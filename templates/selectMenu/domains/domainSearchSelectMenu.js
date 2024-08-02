import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

export const domainSearchSelectMenu = new StringSelectMenuBuilder()
 .setCustomId('domainSearchSelectMenu')
 .setPlaceholder('Category')
 .addOptions(
  new StringSelectMenuOptionBuilder()
   .setLabel('Nameserver')
   .setValue('nameserver'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Dates')
   .setValue('dates'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Registrar')
   .setValue('registrar'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Registrant')
   .setValue('registrant'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Administrative')
   .setValue('administrative'),
  new StringSelectMenuOptionBuilder()
   .setLabel('Technical')
   .setValue('technical'),
 );