import { ActionRowBuilder } from 'discord.js';
import { domainSearchSelectMenu } from '../../selectMenu/help/domainSearchSelectMenu.js';

export const domainSearchRow = new ActionRowBuilder()
 .addComponents(domainSearchSelectMenu);
