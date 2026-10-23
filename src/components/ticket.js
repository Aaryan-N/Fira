import mongoose from 'mongoose';
import { showTicketModal } from '../commands/tickets/ticket.js';
import { notice } from '../lib/ui.js';
import { Ticket } from '../models/Ticket.js';
import { checkTicketAccess, claimTicket, closeTicket, createTicket } from '../services/tickets.js';

async function loadTicket(id) {
 return mongoose.isValidObjectId(id) ? Ticket.findById(id) : null;
}

const ACTIONS = {
 // "Open a ticket" button on a panel.
 open: interaction => showTicketModal(interaction),

 // Ticket modal submitted.
 submit: interaction => createTicket(interaction),

 async claim(interaction, [id]) {
  const ticket = await loadTicket(id);
  const denied = await checkTicketAccess(interaction, ticket, { staffOnly: true });
  if (denied) return interaction.reply(denied);
  if (ticket.claimedBy) {
   return interaction.reply(
    notice.info(`<@${ticket.claimedBy}> already claimed this ticket.`, 'Already claimed'),
   );
  }
  await interaction.deferUpdate();
  await claimTicket(interaction.channel, ticket, interaction.user.id);
 },

 async close(interaction, [id]) {
  const ticket = await loadTicket(id);
  const denied = await checkTicketAccess(interaction, ticket);
  if (denied) return interaction.reply(denied);
  await interaction.deferUpdate();
  await closeTicket(interaction.channel, ticket, interaction.user.id);
 },
};

export default {
 id: 'ticket',
 async execute(interaction, [action, ...args]) {
  if (!interaction.inCachedGuild()) return;
  return ACTIONS[action]?.(interaction, args);
 },
};
