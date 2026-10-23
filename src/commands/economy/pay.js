import { SlashCommandBuilder } from 'discord.js';
import { BRAND } from '../../config.js';
import { guildOnly } from '../../lib/commands.js';
import { coins } from '../../lib/economy.js';
import { card, message, notice } from '../../lib/ui.js';
import { Economy } from '../../models/Economy.js';

export default {
 cooldown: 5,
 data: guildOnly(
  new SlashCommandBuilder()
   .setName('pay')
   .setDescription('Send coins to another member')
   .addUserOption(option => option.setName('user').setDescription('Who to pay').setRequired(true))
   .addIntegerOption(option =>
    option
     .setName('amount')
     .setDescription('How many coins')
     .setRequired(true)
     .setMinValue(1)
     .setMaxValue(1_000_000_000),
   ),
 ),
 async execute(interaction) {
  const recipient = interaction.options.getUser('user', true);
  const amount = interaction.options.getInteger('amount', true);
  const { guildId } = interaction;

  if (recipient.id === interaction.user.id) {
   return interaction.reply(notice.error("You can't pay yourself.", 'Nice try'));
  }
  if (recipient.bot) {
   return interaction.reply(notice.error("Bots don't need coins.", 'Invalid recipient'));
  }

  // Debit first, guarded by the balance check, so the sender can never go negative.
  const debit = await Economy.findOneAndUpdate(
   { guildId, userId: interaction.user.id, balance: { $gte: amount } },
   { $inc: { balance: -amount } },
   { returnDocument: 'after' },
  );
  if (!debit) {
   return interaction.reply(
    notice.error(`You don't have ${coins(amount)} to send.`, 'Insufficient funds'),
   );
  }

  await Economy.updateOne(
   { guildId, userId: recipient.id },
   { $inc: { balance: amount }, $setOnInsert: { guildId, userId: recipient.id } },
   { upsert: true },
  );

  await interaction.reply(
   message(
    card({
     title: '💸 Payment sent',
     color: BRAND.success,
     description: `<@${interaction.user.id}> sent ${coins(amount)} to <@${recipient.id}>.`,
     fields: [{ name: 'Your new balance', value: coins(debit.balance), inline: true }],
    }),
    { allowedMentions: { users: [recipient.id] } },
   ),
  );
 },
};
