import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { BRAND } from '../../config.js';
import { everywhere } from '../../lib/commands.js';
import { formatNumber, truncate } from '../../lib/format.js';
import { againRow, card, message, notice } from '../../lib/ui.js';
import { fetchServerStatus, isValidServerAddress } from '../../services/minecraft.js';

export default {
 cooldown: 5,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('minecraft')
   .setDescription('Minecraft tools')
   .addSubcommand(sub =>
    sub
     .setName('server')
     .setDescription('Check a Minecraft server: status, players, version and MOTD')
     .addStringOption(option =>
      option
       .setName('address')
       .setDescription('Server address, e.g. play.example.com or 1.2.3.4:25565')
       .setRequired(true)
       .setMaxLength(80),
     )
     .addStringOption(option =>
      option
       .setName('edition')
       .setDescription('Java (default) or Bedrock')
       .addChoices({ name: 'Java', value: 'java' }, { name: 'Bedrock', value: 'bedrock' }),
     ),
   ),
 ),
 async render(interaction, [edition, ...addressParts]) {
  // The address may contain ":port", which also separates customId segments.
  const address = addressParts.join(':');
  const status = await fetchServerStatus(address, edition);
  const files = status.icon
   ? [new AttachmentBuilder(status.icon, { name: 'server-icon.png' })]
   : [];
  const refresh = againRow('minecraft', [edition, address], { label: 'Refresh', emoji: '🔄' });

  if (!status.online) {
   return message(
    card({
     title: `🔴 ${address} is offline`,
     description: "The server didn't respond. It may be down, or the address may be wrong.",
     color: BRAND.danger,
     rows: [refresh],
     footer: 'Status from mcsrvstat.us',
    }),
   );
  }

  return message(
   card({
    title: `🟢 ${address}`,
    description: status.motd ? `\`\`\`\n${truncate(status.motd, 500)}\n\`\`\`` : undefined,
    color: BRAND.success,
    thumbnail: files.length ? 'attachment://server-icon.png' : undefined,
    fields: [
     status.players && {
      name: 'Players',
      value: `${formatNumber(status.players.online)} / ${formatNumber(status.players.max)}`,
      inline: true,
     },
     { name: 'Version', value: truncate(status.version ?? 'Unknown', 100), inline: true },
     { name: 'Edition', value: edition === 'bedrock' ? 'Bedrock' : 'Java', inline: true },
     status.software && { name: 'Software', value: status.software, inline: true },
     status.ip && { name: 'IP', value: `\`${status.ip}:${status.port}\``, inline: true },
     status.playerSample.length && {
      name: 'Online now',
      value: status.playerSample.map(name => `\`${name}\``).join(' '),
     },
    ],
    rows: [refresh],
    footer: 'Status from mcsrvstat.us • may be cached for a few minutes',
   }),
   { files },
  );
 },
 async execute(interaction) {
  const address = interaction.options.getString('address', true).trim().toLowerCase();
  const edition = interaction.options.getString('edition') ?? 'java';
  if (!isValidServerAddress(address)) {
   return interaction.reply(
    notice.error(
     'Use a hostname or IP, optionally with a port, like `play.example.com:25565`.',
     'Invalid address',
    ),
   );
  }
  await interaction.deferReply();
  await interaction.editReply(await this.render(interaction, [edition, address]));
 },
};
