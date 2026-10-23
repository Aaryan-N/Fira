import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { sendProfileCard } from './profilecard.js';

export default {
 cooldown: 5,
 data: everywhere(
  new ContextMenuCommandBuilder().setName('Profile Card').setType(ApplicationCommandType.User),
 ),
 async execute(interaction) {
  await sendProfileCard(interaction, interaction.targetUser, { ephemeral: true });
 },
};
