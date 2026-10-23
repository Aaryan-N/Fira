import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { userInfoMessage } from './userinfo.js';

export default {
 cooldown: 3,
 data: everywhere(
  new ContextMenuCommandBuilder().setName('User Info').setType(ApplicationCommandType.User),
 ),
 async execute(interaction) {
  await interaction.reply(
   await userInfoMessage(interaction, interaction.targetUser, { ephemeral: true }),
  );
 },
};
