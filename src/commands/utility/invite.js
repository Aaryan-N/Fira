import { ActionRowBuilder, SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { inviteUrl, userInstallUrl } from '../../lib/invite.js';
import { card, linkButton, message } from '../../lib/ui.js';

export default {
 cooldown: 5,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('invite')
   .setDescription('Add Fira to a server or your account'),
 ),
 async execute(interaction) {
  const id = interaction.client.user.id;
  await interaction.reply(
   message(
    card({
     title: '➕ Invite Fira',
     description:
      '**Add to a server** to unlock everything, including economy, birthdays and tickets.\n' +
      '**Add to my apps** to use the fun and utility commands anywhere on Discord, even in DMs.',
     rows: [
      new ActionRowBuilder().addComponents(
       linkButton('Add to server', inviteUrl(id), '🏠'),
       linkButton('Add to my apps', userInstallUrl(id), '👤'),
      ),
     ],
    }),
   ),
  );
 },
};
