import { ActionRowBuilder } from 'discord.js';
import { helpSelectMenu } from '../selectMenu/helpSelectMenu.js';

export const helpRow = new ActionRowBuilder()
 .addComponents(helpSelectMenu);
