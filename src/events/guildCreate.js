import { Events } from 'discord.js';
import { log } from '../lib/logger.js';
import { Guild } from '../models/Guild.js';
import { getGuildConfig } from '../models/GuildConfig.js';

export default {
 name: Events.GuildCreate,
 async execute(guild) {
  await Guild.updateOne(
   { guildId: guild.id },
   {
    $set: {
     guildName: guild.name,
     guildClientJoinedAt: guild.joinedAt,
     guildJoinedCurrently: true,
    },
    $setOnInsert: {
     guildId: guild.id,
     guildCreatedAt: guild.createdAt,
     guildCreatedAtTimestamp: guild.createdTimestamp,
    },
   },
   { upsert: true },
  );
  await getGuildConfig(guild.id);
  log.info(`Joined guild ${guild.name} (${guild.id})`);
 },
};
