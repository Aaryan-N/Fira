import {
 ActionRowBuilder,
 ButtonBuilder,
 ButtonStyle,
 ChannelType,
 LabelBuilder,
 MessageFlags,
 ModalBuilder,
 PermissionFlagsBits,
 StringSelectMenuBuilder,
 TextInputBuilder,
 TextInputStyle,
 ThreadAutoArchiveDuration,
} from 'discord.js';
import { BRAND } from '../config.js';
import { timestamp, truncate } from '../lib/format.js';
import { card, message, notice, respond } from '../lib/ui.js';
import { getGuildConfig } from '../models/GuildConfig.js';
import { Ticket } from '../models/Ticket.js';

export const MAX_OPEN_TICKETS = 3;

export const TICKET_CATEGORIES = [
 { value: 'general', label: 'General help', emoji: '💬' },
 { value: 'report', label: 'Report a user', emoji: '🚩' },
 { value: 'appeal', label: 'Appeal a punishment', emoji: '⚖️' },
 { value: 'feedback', label: 'Feedback or suggestion', emoji: '💡' },
 { value: 'other', label: 'Something else', emoji: '📝' },
];

const REQUIRED_CHANNEL_PERMISSIONS = [
 [PermissionFlagsBits.ViewChannel, 'View Channel'],
 [PermissionFlagsBits.SendMessages, 'Send Messages'],
 [PermissionFlagsBits.CreatePrivateThreads, 'Create Private Threads'],
 [PermissionFlagsBits.SendMessagesInThreads, 'Send Messages in Threads'],
 [PermissionFlagsBits.ManageThreads, 'Manage Threads'],
];

export function categoryLabel(value) {
 const category = TICKET_CATEGORIES.find(item => item.value === value) ?? TICKET_CATEGORIES.at(-1);
 return `${category.emoji} ${category.label}`;
}

export function buildTicketModal() {
 return new ModalBuilder()
  .setCustomId('ticket:submit')
  .setTitle('Open a support ticket')
  .addLabelComponents(
   new LabelBuilder()
    .setLabel('Category')
    .setDescription('What is this ticket about?')
    .setStringSelectMenuComponent(
     new StringSelectMenuBuilder()
      .setCustomId('category')
      .setPlaceholder('Pick a category')
      .addOptions(TICKET_CATEGORIES.map(({ value, label, emoji }) => ({ value, label, emoji }))),
    ),
   new LabelBuilder()
    .setLabel('Subject')
    .setTextInputComponent(
     new TextInputBuilder()
      .setCustomId('subject')
      .setStyle(TextInputStyle.Short)
      .setMinLength(3)
      .setMaxLength(100)
      .setPlaceholder('A short summary'),
    ),
   new LabelBuilder()
    .setLabel('Details')
    .setDescription('Include anything the moderators need to help you.')
    .setTextInputComponent(
     new TextInputBuilder()
      .setCustomId('details')
      .setStyle(TextInputStyle.Paragraph)
      .setMinLength(10)
      .setMaxLength(2000),
    ),
  );
}

export function isTicketStaff(member, config) {
 if (!member) return false;
 if (member.permissions?.has(PermissionFlagsBits.ManageThreads)) return true;
 return Boolean(config.ticketStaffRole && member.roles?.cache?.has(config.ticketStaffRole));
}

export function ticketCard(ticket) {
 const id = ticket._id.toString();
 const status = ticket.isOpen
  ? ticket.claimedBy
    ? `🟡 Open, claimed by <@${ticket.claimedBy}>`
    : '🟢 Open, waiting for staff'
  : `🔴 Closed by <@${ticket.closedBy}> ${timestamp(ticket.closedAt, 'R')}`;

 return card({
  title: `🎫 Ticket #${String(ticket.number ?? 0).padStart(4, '0')}: ${truncate(ticket.ticketSubjectContent, 80)}`,
  color: ticket.isOpen ? BRAND.color : BRAND.muted,
  fields: [
   { name: 'Opened by', value: `<@${ticket.userId}>`, inline: true },
   { name: 'Category', value: categoryLabel(ticket.category), inline: true },
   { name: 'Opened', value: timestamp(ticket.timeTicketCreated, 'R'), inline: true },
   { name: 'Status', value: status, inline: true },
   { name: 'Details', value: truncate(ticket.ticketBodyContent, 2000) },
  ],
  rows: [
   new ActionRowBuilder().addComponents(
    new ButtonBuilder()
     .setCustomId(`ticket:claim:${id}`)
     .setLabel(ticket.claimedBy ? 'Claimed' : 'Claim')
     .setEmoji('🙋')
     .setStyle(ButtonStyle.Secondary)
     .setDisabled(!ticket.isOpen || Boolean(ticket.claimedBy)),
    new ButtonBuilder()
     .setCustomId(`ticket:close:${id}`)
     .setLabel(ticket.isOpen ? 'Close ticket' : 'Closed')
     .setEmoji('🔒')
     .setStyle(ButtonStyle.Danger)
     .setDisabled(!ticket.isOpen),
   ),
  ],
  footer: 'Only the ticket owner and staff can see this thread.',
 });
}

export function ticketPanel(guildName) {
 return card({
  title: '🎫 Need help?',
  description: `Open a private ticket to talk with the ${guildName} moderators. Only you and staff will be able to see it.`,
  rows: [
   new ActionRowBuilder().addComponents(
    new ButtonBuilder()
     .setCustomId('ticket:open')
     .setLabel('Open a ticket')
     .setEmoji('📨')
     .setStyle(ButtonStyle.Primary),
   ),
  ],
 });
}

export function missingPermissions(channel, required = REQUIRED_CHANNEL_PERMISSIONS) {
 const permissions = channel.permissionsFor(channel.guild.members.me);
 return required.filter(([flag]) => !permissions?.has(flag)).map(([, name]) => name);
}

/** Handles the ticket modal submission: creates a private thread and records the ticket. */
export async function createTicket(interaction) {
 await interaction.deferReply({ flags: MessageFlags.Ephemeral });

 const config = await getGuildConfig(interaction.guildId);
 if (!config.ticketChannel) {
  return respond(
   interaction,
   notice.error(
    'Tickets have not been set up here yet. Ask a server admin to pick a ticket channel with `/config`.',
    'Tickets are not configured',
   ),
  );
 }

 const openCount = await Ticket.countDocuments({
  guildId: interaction.guildId,
  userId: interaction.user.id,
  isOpen: true,
 });
 if (openCount >= MAX_OPEN_TICKETS) {
  return respond(
   interaction,
   notice.error(
    `You already have ${openCount} open tickets. Please close one before opening another.`,
    'Too many open tickets',
   ),
  );
 }

 const channel = await interaction.guild.channels.fetch(config.ticketChannel).catch(() => null);
 if (!channel || channel.type !== ChannelType.GuildText) {
  return respond(
   interaction,
   notice.error(
    'The configured ticket channel no longer exists. Ask a server admin to update it with `/config`.',
    'Ticket channel missing',
   ),
  );
 }

 const missing = missingPermissions(channel);
 if (missing.length) {
  return respond(
   interaction,
   notice.error(
    `I need these permissions in ${channel}: **${missing.join(', ')}**.`,
    'Missing permissions',
   ),
  );
 }

 const subject = interaction.fields.getTextInputValue('subject').trim();
 const details = interaction.fields.getTextInputValue('details').trim();
 const [category = 'other'] = interaction.fields.getStringSelectValues('category');
 const number = (await Ticket.countDocuments({ guildId: interaction.guildId })) + 1;
 const safeName = interaction.user.username.replace(/[^a-z0-9_-]/gi, '').slice(0, 20) || 'user';

 const thread = await channel.threads.create({
  name: `ticket-${String(number).padStart(4, '0')}-${safeName}`,
  type: ChannelType.PrivateThread,
  invitable: false,
  autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
  reason: `Ticket opened by ${interaction.user.tag}`,
 });
 await thread.members.add(interaction.user.id);

 const ticket = await Ticket.create({
  userId: interaction.user.id,
  guildId: interaction.guildId,
  number,
  category,
  ticketSubjectContent: subject,
  ticketBodyContent: details,
  timeTicketCreated: new Date(),
  isOpen: true,
  threadId: thread.id,
 });

 const ticketMessage = await thread.send(message(ticketCard(ticket)));
 ticket.messageId = ticketMessage.id;
 await ticket.save();

 // Mentioning users/roles inside a private thread adds them to it.
 const staffMention = config.ticketStaffRole ? ` <@&${config.ticketStaffRole}>` : '';
 await thread.send(
  message(
   card({ description: `<@${interaction.user.id}>${staffMention}, a new ticket is waiting.` }),
   {
    allowedMentions: {
     users: [interaction.user.id],
     roles: config.ticketStaffRole ? [config.ticketStaffRole] : [],
    },
   },
  ),
 );

 return respond(
  interaction,
  notice.success(
   `Your ticket is ready in ${thread}. A moderator will be with you soon.`,
   'Ticket opened',
  ),
 );
}

async function refreshTicketCard(thread, ticket) {
 if (!ticket.messageId) return;
 await thread.messages.edit(ticket.messageId, message(ticketCard(ticket))).catch(() => {});
}

/** Returns an error payload when the member may not act on the ticket, otherwise null. */
export async function checkTicketAccess(interaction, ticket, { staffOnly = false } = {}) {
 if (!ticket || ticket.guildId !== interaction.guildId) {
  return notice.error("I couldn't find that ticket.", 'Unknown ticket');
 }
 if (!ticket.isOpen) return notice.info('This ticket is already closed.', 'Ticket closed');
 const config = await getGuildConfig(interaction.guildId);
 const staff = isTicketStaff(interaction.member, config);
 if (staffOnly ? !staff : !staff && interaction.user.id !== ticket.userId) {
  return notice.error(
   staffOnly ? 'Only ticket staff can do that.' : 'Only the ticket owner or staff can do that.',
   'Not allowed',
  );
 }
 return null;
}

export async function claimTicket(thread, ticket, staffId) {
 ticket.claimedBy = staffId;
 await ticket.save();
 await refreshTicketCard(thread, ticket);
 await thread.send(
  message(
   card({ description: `🙋 <@${staffId}> has claimed this ticket and will help you shortly.` }),
   {
    allowedMentions: { users: [ticket.userId] },
   },
  ),
 );
}

/** Marks the ticket closed, posts a notice, then locks and archives the thread. */
export async function closeTicket(thread, ticket, closerId) {
 ticket.isOpen = false;
 ticket.closedBy = closerId;
 ticket.closedAt = new Date();
 await ticket.save();
 await refreshTicketCard(thread, ticket);
 await thread.send(
  message(
   card({
    title: '🔒 Ticket closed',
    description: `Closed by <@${closerId}> ${timestamp(ticket.closedAt, 'R')}. This thread is now locked.`,
    color: BRAND.muted,
   }),
  ),
 );
 await thread.setLocked(true, `Ticket closed by ${closerId}`).catch(() => {});
 await thread.setArchived(true, `Ticket closed by ${closerId}`).catch(() => {});
}
