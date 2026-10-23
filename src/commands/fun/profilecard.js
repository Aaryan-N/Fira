import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { profileCard } from '../../lib/canvas.js';
import { everywhere } from '../../lib/commands.js';
import { formatBirthday, MONTHS } from '../../lib/dates.js';
import { formatNumber } from '../../lib/format.js';
import { Birthday } from '../../models/Birthday.js';
import { Economy } from '../../models/Economy.js';

export async function sendProfileCard(interaction, user, { ephemeral = false } = {}) {
 await interaction.deferReply(ephemeral ? { flags: MessageFlags.Ephemeral } : {});

 const stats = [
  {
   label: 'Joined Discord',
   value: `${MONTHS[user.createdAt.getUTCMonth()].slice(0, 3)} ${user.createdAt.getUTCFullYear()}`,
  },
 ];

 // Server-specific stats are only available where Fira is installed in the guild.
 if (interaction.inCachedGuild()) {
  const [wallet, birthday] = await Promise.all([
   Economy.findOne({ guildId: interaction.guildId, userId: user.id }),
   Birthday.findOne({ guildId: interaction.guildId, userId: user.id }),
  ]);
  stats.push({ label: 'Coins', value: formatNumber(wallet?.balance ?? 0) });
  if (birthday)
   stats.push({
    label: 'Birthday',
    value: formatBirthday({ day: birthday.day, month: birthday.month }),
   });
 }

 const fetched = await user.fetch(true).catch(() => user);
 const attachment = await profileCard({
  avatarUrl: user.displayAvatarURL({ extension: 'png', size: 256 }),
  displayName: user.displayName,
  username: user.username,
  accent: fetched.hexAccentColor ?? undefined,
  stats,
 });

 await interaction.editReply({ files: [attachment] });
}

export default {
 cooldown: 5,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('profilecard')
   .setDescription('Generate a profile card image')
   .addUserOption(option => option.setName('user').setDescription('Whose card (defaults to you)')),
 ),
 async execute(interaction) {
  await sendProfileCard(interaction, interaction.options.getUser('user') ?? interaction.user);
 },
};
