import { ActionRowBuilder, SlashCommandBuilder, version as djsVersion } from 'discord.js';
import { getInfo } from 'discord-hybrid-sharding';
import { env } from '../../config.js';
import { everywhere } from '../../lib/commands.js';
import { formatBytes, formatDuration, formatNumber } from '../../lib/format.js';
import { inviteUrl, userInstallUrl } from '../../lib/invite.js';
import { card, linkButton, message } from '../../lib/ui.js';

const sum = values => values.reduce((total, value) => total + value, 0);

export default {
 cooldown: 10,
 data: everywhere(
  new SlashCommandBuilder().setName('about').setDescription('Stats and info about Fira'),
 ),
 async execute(interaction) {
  await interaction.deferReply();
  const { client } = interaction;

  const [clusters, application] = await Promise.all([
   client.cluster.broadcastEval(c => ({
    guilds: c.guilds.cache.size,
    members: c.guilds.cache.reduce((total, guild) => total + (guild.memberCount ?? 0), 0),
    channels: c.channels.cache.size,
    memory: process.memoryUsage().rss,
   })),
   client.application.fetch(),
  ]);

  const owner = application.owner?.members?.first()?.user ?? application.owner;
  const info = getInfo();

  const links = [
   linkButton('Add to server', inviteUrl(client.user.id), '➕'),
   linkButton('Add to my apps', userInstallUrl(client.user.id), '👤'),
   linkButton('Source', 'https://github.com/Aaryan-N/Fira', '💻'),
  ];
  if (env.supportUrl) links.push(linkButton('Support', env.supportUrl, '🛟'));

  await interaction.editReply(
   message(
    card({
     title: `👋 Hi, I'm ${client.user.username}!`,
     description: application.description || 'A friendly all-round Discord bot.',
     thumbnail: client.user.displayAvatarURL({ size: 256 }),
     fields: [
      { name: 'Servers', value: formatNumber(sum(clusters.map(c => c.guilds))), inline: true },
      { name: 'Members', value: formatNumber(sum(clusters.map(c => c.members))), inline: true },
      { name: 'Channels', value: formatNumber(sum(clusters.map(c => c.channels))), inline: true },
      {
       name: 'Shards / clusters',
       value: `${info.TOTAL_SHARDS} / ${info.CLUSTER_COUNT}`,
       inline: true,
      },
      { name: 'Uptime', value: formatDuration(client.uptime ?? 0), inline: true },
      { name: 'Memory', value: formatBytes(sum(clusters.map(c => c.memory))), inline: true },
      owner && { name: 'Made by', value: owner.username ?? owner.name, inline: true },
      {
       name: 'Running on',
       value: `Node.js ${process.version} • discord.js v${djsVersion}`,
       inline: true,
      },
     ],
     rows: [new ActionRowBuilder().addComponents(links)],
     footer: 'Made with 💖 (and mostly tears) using discord.js',
    }),
   ),
  );
 },
};
