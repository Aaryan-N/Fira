import { ChannelType, GuildVerificationLevel, SlashCommandBuilder } from 'discord.js';
import { guildOnly } from '../../lib/commands.js';
import { formatNumber, timestamp } from '../../lib/format.js';
import { card, message } from '../../lib/ui.js';

const VERIFICATION = {
 [GuildVerificationLevel.None]: 'None',
 [GuildVerificationLevel.Low]: 'Low',
 [GuildVerificationLevel.Medium]: 'Medium',
 [GuildVerificationLevel.High]: 'High',
 [GuildVerificationLevel.VeryHigh]: 'Highest',
};

export default {
 cooldown: 5,
 data: guildOnly(
  new SlashCommandBuilder().setName('serverinfo').setDescription('Handy stats about this server'),
 ),
 async execute(interaction) {
  const { guild } = interaction;
  const channels = guild.channels.cache;
  const count = (...types) => channels.filter(channel => types.includes(channel.type)).size;

  await interaction.reply(
   message(
    card({
     title: guild.name,
     description: guild.description ?? undefined,
     thumbnail: guild.iconURL({ size: 256 }) ?? undefined,
     image: guild.bannerURL({ size: 1024 }) ?? undefined,
     fields: [
      { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
      {
       name: 'Created',
       value: `${timestamp(guild.createdAt, 'D')} (${timestamp(guild.createdAt, 'R')})`,
       inline: true,
      },
      { name: 'Members', value: formatNumber(guild.memberCount), inline: true },
      {
       name: 'Channels',
       value: `💬 ${count(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildForum)} text • 🔊 ${count(ChannelType.GuildVoice, ChannelType.GuildStageVoice)} voice • 📁 ${count(ChannelType.GuildCategory)} categories`,
       inline: true,
      },
      { name: 'Roles', value: formatNumber(guild.roles.cache.size - 1), inline: true },
      { name: 'Emojis', value: formatNumber(guild.emojis.cache.size), inline: true },
      {
       name: 'Boosts',
       value: `${guild.premiumSubscriptionCount ?? 0} (tier ${guild.premiumTier})`,
       inline: true,
      },
      {
       name: 'Verification',
       value: VERIFICATION[guild.verificationLevel] ?? 'Unknown',
       inline: true,
      },
      { name: 'Server ID', value: `\`${guild.id}\``, inline: true },
     ],
    }),
   ),
  );
 },
};
