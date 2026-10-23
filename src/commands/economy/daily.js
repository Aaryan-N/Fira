import { SlashCommandBuilder } from 'discord.js';
import { BRAND } from '../../config.js';
import { guildOnly } from '../../lib/commands.js';
import { coins, dailyReward } from '../../lib/economy.js';
import { timestamp } from '../../lib/format.js';
import { card, message } from '../../lib/ui.js';
import { Economy, getWallet } from '../../models/Economy.js';

function alreadyCollected(interaction, nextAt) {
 return interaction.editReply(
  message(
   card({
    title: '⏳ Already collected',
    description: `You've claimed today's coins. Come back ${timestamp(nextAt, 'R')}!`,
    color: BRAND.warning,
   }),
  ),
 );
}

export default {
 cooldown: 5,
 data: guildOnly(
  new SlashCommandBuilder().setName('daily').setDescription('Collect your daily coins'),
 ),
 async execute(interaction) {
  await interaction.deferReply();
  const wallet = await getWallet(interaction.guildId, interaction.user.id);
  const result = dailyReward(wallet.lastDailyCollected, wallet.dailyStreak);
  if (!result.available) return alreadyCollected(interaction, result.nextAt);

  // Conditional update so double-clicks or parallel requests can only pay out once.
  const updated = await Economy.findOneAndUpdate(
   {
    _id: wallet._id,
    $or: [{ lastDailyCollected: null }, { lastDailyCollected: { $lt: result.today } }],
   },
   {
    $inc: { balance: result.reward },
    $set: { lastDailyCollected: new Date(), dailyStreak: result.streak },
   },
   { returnDocument: 'after' },
  );
  if (!updated) return alreadyCollected(interaction, result.nextAt);

  await interaction.editReply(
   message(
    card({
     title: '🎁 Daily reward collected!',
     color: BRAND.success,
     fields: [
      { name: 'Reward', value: coins(result.reward), inline: true },
      {
       name: 'Streak',
       value: `🔥 ${result.streak} day${result.streak === 1 ? '' : 's'}`,
       inline: true,
      },
      result.bonus && { name: 'Streak bonus', value: coins(result.bonus), inline: true },
      { name: 'New balance', value: coins(updated.balance), inline: true },
     ],
     footer: 'Your next daily unlocks at 00:00 UTC. Keep your streak going!',
    }),
   ),
  );
 },
};
