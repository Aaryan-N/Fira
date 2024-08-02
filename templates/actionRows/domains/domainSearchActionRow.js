import { ActionRowBuilder } from 'discord.js';
import { domainSearchSelectMenu } from '../../selectMenu/domains/domainSearchSelectMenu.js';

export const domainSearchRow = new ActionRowBuilder()
 .addComponents(domainSearchSelectMenu);
