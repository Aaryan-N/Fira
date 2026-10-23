import { SlashCommandBuilder } from 'discord.js';
import { guildOnly } from '../../lib/commands.js';
import { coins } from '../../lib/economy.js';
import { timestamp } from '../../lib/format.js';
import { card, message } from '../../lib/ui.js';
import { Economy } from '../../models/Economy.js';

export default {
 cooldown: 3,
 data: guildOnly(
  new SlashCommandBuilder()
   .setName('balance')
   .setDescription("Check your coin balance, or someone else's")
   .addUserOption(option => option.setName('user').setDescription('Whose balance to check')),
 ),
 async execute(interaction) {
  const user = interaction.options.getUser('user') ?? interaction.user;
  const wallet = await Economy.findOne({ guildId: interaction.guildId, userId: user.id });
  const balance = wallet?.balance ?? 0;
  const rank =
   (await Economy.countDocuments({ guildId: interaction.guildId, balance: { $gt: balance } })) + 1;

  await interaction.reply(
   message(
    card({
     title: `💰 ${user.displayName}'s wallet`,
     thumbnail: user.displayAvatarURL({ size: 128 }),
     fields: [
      { name: 'Balance', value: coins(balance), inline: true },
      { name: 'Server rank', value: balance ? `#${rank}` : 'Unranked', inline: true },
      { name: 'Daily streak', value: `🔥 ${wallet?.dailyStreak ?? 0} days`, inline: true },
      wallet?.lastDailyCollected && {
       name: 'Last daily',
       value: timestamp(wallet.lastDailyCollected, 'R'),
       inline: true,
      },
     ],
     footer: 'Earn coins with /daily',
    }),
   ),
  );
 },
};
