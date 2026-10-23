import { ChannelType, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { guildOnly } from '../../lib/commands.js';
import { message, notice } from '../../lib/ui.js';
import { getGuildConfig } from '../../models/GuildConfig.js';
import { Ticket } from '../../models/Ticket.js';
import {
 buildTicketModal,
 checkTicketAccess,
 closeTicket,
 ticketPanel,
} from '../../services/tickets.js';

export async function showTicketModal(interaction) {
 const config = await getGuildConfig(interaction.guildId);
 if (!config.ticketChannel) {
  return interaction.reply(
   notice.error(
    'Tickets have not been set up here yet. Ask a server admin to pick a ticket channel with `/config`.',
    'Tickets are not configured',
   ),
  );
 }
 return interaction.showModal(buildTicketModal());
}

async function postPanel(interaction) {
 if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageGuild)) {
  return interaction.reply(
   notice.error('You need the **Manage Server** permission to post the ticket panel.'),
  );
 }
 const channel = interaction.options.getChannel('channel') ?? interaction.channel;
 const permissions = channel.permissionsFor(interaction.guild.members.me);
 if (!permissions?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages])) {
  return interaction.reply(
   notice.error(`I can't send messages in ${channel}.`, 'Missing permissions'),
  );
 }
 await channel.send(message(ticketPanel(interaction.guild.name)));
 return interaction.reply(notice.success(`Ticket panel posted in ${channel}.`, 'Panel posted'));
}

async function closeFromThread(interaction) {
 const ticket = interaction.channel?.isThread()
  ? await Ticket.findOne({ threadId: interaction.channelId })
  : null;
 if (!ticket) {
  return interaction.reply(notice.error('Run this inside a ticket thread.', 'Not a ticket'));
 }
 const denied = await checkTicketAccess(interaction, ticket);
 if (denied) return interaction.reply(denied);

 // Reply before archiving: responses can't be sent into an archived thread.
 await interaction.reply({ content: '🔒 Closing ticket…', flags: MessageFlags.Ephemeral });
 await closeTicket(interaction.channel, ticket, interaction.user.id);
}

const HANDLERS = { create: showTicketModal, panel: postPanel, close: closeFromThread };

export default {
 cooldown: 5,
 data: guildOnly(
  new SlashCommandBuilder()
   .setName('ticket')
   .setDescription('Private support tickets with the server moderators')
   .addSubcommand(sub => sub.setName('create').setDescription('Open a new support ticket'))
   .addSubcommand(sub =>
    sub.setName('close').setDescription('Close the ticket this thread belongs to'),
   )
   .addSubcommand(sub =>
    sub
     .setName('panel')
     .setDescription('Post an "Open a ticket" button panel (Manage Server)')
     .addChannelOption(option =>
      option
       .setName('channel')
       .setDescription('Where to post it (defaults to this channel)')
       .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement),
     ),
   ),
 ),
 async execute(interaction) {
  return HANDLERS[interaction.options.getSubcommand()](interaction);
 },
};
