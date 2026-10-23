import { SlashCommandBuilder } from 'discord.js';
import { guildOnly } from '../../lib/commands.js';
import { coins } from '../../lib/economy.js';
import { card, message } from '../../lib/ui.js';
import { Economy } from '../../models/Economy.js';

const MEDALS = ['🥇', '🥈', '🥉'];

export default {
 cooldown: 5,
 data: guildOnly(
  new SlashCommandBuilder()
   .setName('leaderboard')
   .setDescription('The richest members of this server'),
 ),
 async execute(interaction) {
  const { guildId } = interaction;
  const [top, mine] = await Promise.all([
   Economy.find({ guildId, balance: { $gt: 0 } })
    .sort({ balance: -1 })
    .limit(10),
   Economy.findOne({ guildId, userId: interaction.user.id }),
  ]);

  const lines = top.map(
   (wallet, index) =>
    `${MEDALS[index] ?? `\`#${index + 1}\``} <@${wallet.userId}>: ${coins(wallet.balance)}`,
  );

  let footer = 'Collect /daily to climb the ranks';
  if (mine?.balance) {
   const rank = (await Economy.countDocuments({ guildId, balance: { $gt: mine.balance } })) + 1;
   footer = `You are #${rank} with ${mine.balance.toLocaleString('en-US')} coins`;
  }

  await interaction.reply(
   message(
    card({
     title: `🏆 ${interaction.guild.name} leaderboard`,
     thumbnail: interaction.guild.iconURL({ size: 128 }) ?? undefined,
     description: lines.length
      ? lines.join('\n')
      : 'Nobody has any coins yet. Be the first with `/daily`!',
     footer,
    }),
   ),
  );
 },
};
