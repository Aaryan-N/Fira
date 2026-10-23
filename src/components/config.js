import { MessageFlags, PermissionFlagsBits } from 'discord.js';
import { configPanel } from '../commands/admin/config.js';
import { message, notice } from '../lib/ui.js';
import { getGuildConfig, GuildConfig } from '../models/GuildConfig.js';
import { ticketPanel } from '../services/tickets.js';

const SETTINGS = new Set(['ticketChannel', 'ticketStaffRole', 'birthdayChannel']);

async function updatePanel(interaction, config) {
 const payload = configPanel(interaction.guild, config);
 return interaction.update({ ...payload, flags: payload.flags & ~MessageFlags.Ephemeral });
}

const ACTIONS = {
 async set(interaction, [setting]) {
  if (!SETTINGS.has(setting) || !interaction.isAnySelectMenu()) return;
  const [value = ''] = interaction.values;
  const config = await GuildConfig.findOneAndUpdate(
   { guildId: interaction.guildId },
   { $set: { [setting]: value } },
   { upsert: true, returnDocument: 'after' },
  );
  return updatePanel(interaction, config);
 },

 async refresh(interaction) {
  return updatePanel(interaction, await getGuildConfig(interaction.guildId));
 },

 async panel(interaction) {
  const permissions = interaction.channel?.permissionsFor(interaction.guild.members.me);
  if (!permissions?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages])) {
   return interaction.reply(
    notice.error(`I can't send messages in ${interaction.channel}.`, 'Missing permissions'),
   );
  }
  await interaction.channel.send(message(ticketPanel(interaction.guild.name)));
  return interaction.reply(notice.success('Ticket panel posted in this channel.', 'Panel posted'));
 },
};

export default {
 id: 'config',
 async execute(interaction, [action, ...args]) {
  if (!interaction.inCachedGuild()) return;
  // Re-check on every click: the panel may outlive a permission change.
  if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
   return interaction.reply(
    notice.error('You need the **Manage Server** permission to change settings.'),
   );
  }
  return ACTIONS[action]?.(interaction, args);
 },
};
