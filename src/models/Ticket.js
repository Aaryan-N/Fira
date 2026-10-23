import mongoose from 'mongoose';
import { db } from '../lib/db.js';

const ticketSchema = new mongoose.Schema({
 userId: { type: String, required: true },
 guildId: { type: String, required: true },
 number: Number,
 category: { type: String, default: 'general' },
 ticketSubjectContent: { type: String, required: true },
 ticketBodyContent: { type: String, required: true },
 timeTicketCreated: { type: Date, required: true },
 isOpen: { type: Boolean, required: true },
 threadId: String,
 // The thread message holding the ticket card, so it can be refreshed on claim/close.
 messageId: String,
 claimedBy: String,
 closedBy: String,
 closedAt: Date,
});

ticketSchema.index({ guildId: 1, userId: 1, isOpen: 1 });
ticketSchema.index({ threadId: 1 });

export const Ticket = db.ticket.model('tickets', ticketSchema);
