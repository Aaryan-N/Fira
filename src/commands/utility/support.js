import { ActionRowBuilder, SlashCommandBuilder } from 'discord.js';
import { env } from '../../config.js';
import { everywhere } from '../../lib/commands.js';
import { card, linkButton, message } from '../../lib/ui.js';

const ISSUES_URL = 'https://github.com/Aaryan-N/Fira/issues';

export default {
 cooldown: 5,
 data: everywhere(
  new SlashCommandBuilder().setName('support').setDescription('Get help with Fira'),
 ),
 async execute(interaction) {
  const buttons = [linkButton('Report an issue', ISSUES_URL, '🐛')];
  if (env.supportUrl) buttons.unshift(linkButton('Join the support server', env.supportUrl, '🛟'));

  await interaction.reply(
   message(
    card({
     title: '🛟 Need a hand?',
     description: env.supportUrl
      ? 'Join the support server to chat with the team, or report a bug on GitHub.'
      : 'Report bugs or request features on GitHub.',
     rows: [new ActionRowBuilder().addComponents(buttons)],
    }),
    { ephemeral: true },
   ),
  );
 },
};
