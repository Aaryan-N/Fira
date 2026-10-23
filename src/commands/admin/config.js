import {
 ActionRowBuilder,
 ButtonBuilder,
 ButtonStyle,
 ChannelSelectMenuBuilder,
 ChannelType,
 PermissionFlagsBits,
 RoleSelectMenuBuilder,
 SlashCommandBuilder,
} from 'discord.js';
import { guildOnly } from '../../lib/commands.js';
import { card, message } from '../../lib/ui.js';
import { getGuildConfig } from '../../models/GuildConfig.js';
import { missingPermissions } from '../../services/tickets.js';

const notSet = '*Not set*';

const BIRTHDAY_PERMISSIONS = [
 [PermissionFlagsBits.ViewChannel, 'View Channel'],
 [PermissionFlagsBits.SendMessages, 'Send Messages'],
];

function channelWarnings(guild, config) {
 const warnings = [];
 const check = (channelId, label, required) => {
  if (!channelId) return;
  const channel = guild.channels.cache.get(channelId);
  if (!channel) return warnings.push(`The ${label} channel no longer exists.`);
  const missing = missingPermissions(channel, required);
  if (missing.length) warnings.push(`I'm missing **${missing.join(', ')}** in <#${channelId}>.`);
 };
 check(config.ticketChannel, 'ticket', undefined);
 check(config.birthdayChannel, 'birthday', BIRTHDAY_PERMISSIONS);
 return warnings;
}

/** The interactive settings panel. Each select menu writes straight to the guild config. */
export function configPanel(guild, config) {
 const ticketChannel = new ChannelSelectMenuBuilder()
  .setCustomId('config:set:ticketChannel')
  .setPlaceholder('🎫 Ticket channel: where private ticket threads are created')
  .setChannelTypes(ChannelType.GuildText)
  .setMinValues(0)
  .setMaxValues(1);
 if (config.ticketChannel) ticketChannel.setDefaultChannels(config.ticketChannel);

 const staffRole = new RoleSelectMenuBuilder()
  .setCustomId('config:set:ticketStaffRole')
  .setPlaceholder('🛡️ Ticket staff role: added to every new ticket')
  .setMinValues(0)
  .setMaxValues(1);
 if (config.ticketStaffRole) staffRole.setDefaultRoles(config.ticketStaffRole);

 const birthdayChannel = new ChannelSelectMenuBuilder()
  .setCustomId('config:set:birthdayChannel')
  .setPlaceholder('🎂 Birthday channel: where birthdays are announced')
  .setChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
  .setMinValues(0)
  .setMaxValues(1);
 if (config.birthdayChannel) birthdayChannel.setDefaultChannels(config.birthdayChannel);

 const warnings = channelWarnings(guild, config);

 return message(
  card({
   title: `⚙️ Fira settings for ${guild.name}`,
   description:
    'Pick options from the menus below; changes save instantly. Clear a menu to turn that feature off.',
   thumbnail: guild.iconURL({ size: 128 }) ?? undefined,
   fields: [
    {
     name: '🎫 Ticket channel',
     value: config.ticketChannel ? `<#${config.ticketChannel}>` : notSet,
     inline: true,
    },
    {
     name: '🛡️ Ticket staff',
     value: `${config.ticketStaffRole ? `<@&${config.ticketStaffRole}>` : notSet} (plus anyone with Manage Threads)`,
     inline: true,
    },
    {
     name: '🎂 Birthday channel',
     value: config.birthdayChannel ? `<#${config.birthdayChannel}>` : notSet,
     inline: true,
    },
    warnings.length && {
     name: '⚠️ Needs attention',
     value: warnings.map(line => `- ${line}`).join('\n'),
    },
   ],
   rows: [
    new ActionRowBuilder().addComponents(ticketChannel),
    new ActionRowBuilder().addComponents(staffRole),
    new ActionRowBuilder().addComponents(birthdayChannel),
    new ActionRowBuilder().addComponents(
     new ButtonBuilder()
      .setCustomId('config:panel')
      .setLabel('Post ticket panel here')
      .setEmoji('📨')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(!config.ticketChannel),
     new ButtonBuilder()
      .setCustomId('config:refresh')
      .setLabel('Refresh')
      .setEmoji('🔄')
      .setStyle(ButtonStyle.Secondary),
    ),
   ],
   footer: 'Only members with Manage Server can change these settings.',
  }),
  { ephemeral: true },
 );
}

export default {
 cooldown: 3,
 data: guildOnly(
  new SlashCommandBuilder()
   .setName('config')
   .setDescription("Open Fira's settings panel for this server")
   .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
 ),
 async execute(interaction) {
  const config = await getGuildConfig(interaction.guildId);
  await interaction.reply(configPanel(interaction.guild, config));
 },
};
