import { SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { timestamp } from '../../lib/format.js';
import { card, message } from '../../lib/ui.js';

export async function userInfoMessage(interaction, user, { ephemeral = false } = {}) {
 const fetched = await user.fetch(true).catch(() => user); // banner & accent colour need a fresh fetch
 const member = interaction.inCachedGuild()
  ? await interaction.guild.members.fetch(user.id).catch(() => null)
  : null;

 const roles = member?.roles.cache
  .filter(role => role.id !== interaction.guildId)
  .sort((a, b) => b.position - a.position)
  .map(role => `<@&${role.id}>`);

 return message(
  card({
   title: `${fetched.displayName}${fetched.bot ? ' 🤖' : ''}`,
   description: `@${fetched.username}`,
   color: fetched.accentColor ?? member?.displayColor ?? undefined,
   thumbnail: (member ?? fetched).displayAvatarURL({ size: 256 }),
   image: fetched.bannerURL({ size: 1024 }) ?? undefined,
   fields: [
    { name: 'User', value: `<@${fetched.id}>`, inline: true },
    { name: 'ID', value: `\`${fetched.id}\``, inline: true },
    {
     name: 'Account created',
     value: `${timestamp(fetched.createdAt, 'D')} (${timestamp(fetched.createdAt, 'R')})`,
     inline: true,
    },
    member?.joinedAt && {
     name: 'Joined server',
     value: `${timestamp(member.joinedAt, 'D')} (${timestamp(member.joinedAt, 'R')})`,
     inline: true,
    },
    member?.premiumSince && {
     name: 'Boosting since',
     value: timestamp(member.premiumSince, 'R'),
     inline: true,
    },
    roles?.length && {
     name: `Roles (${roles.length})`,
     value: roles.slice(0, 20).join(' ') + (roles.length > 20 ? ` +${roles.length - 20} more` : ''),
    },
   ],
  }),
  { ephemeral },
 );
}

export default {
 cooldown: 3,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('userinfo')
   .setDescription('Info about a user')
   .addUserOption(option =>
    option.setName('user').setDescription('Who to look up (defaults to you)'),
   ),
 ),
 async execute(interaction) {
  const user = interaction.options.getUser('user') ?? interaction.user;
  await interaction.reply(await userInfoMessage(interaction, user));
 },
};
