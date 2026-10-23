import { Events } from 'discord.js';
import { log } from '../lib/logger.js';
import { Guild } from '../models/Guild.js';

export default {
 name: Events.GuildDelete,
 async execute(guild) {
  // GuildDelete also fires during Discord outages; only record genuine removals.
  if (!guild.available) return;
  await Guild.updateOne({ guildId: guild.id }, { $set: { guildJoinedCurrently: false } });
  log.info(`Left guild ${guild.name ?? 'unknown'} (${guild.id})`);
 },
};
