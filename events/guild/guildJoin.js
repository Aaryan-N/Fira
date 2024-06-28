const { Events, Guild } = require("discord.js");
const guildJoinSchema = require("../../schemas/guild/guildJoinSchema");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').Guild} guild
 */

module.exports = {
  name: Events.GuildCreate,
  once: true,
  async execute(client, guild) {
      const guildSetId = guild.id.toString();
      const guildSetCreatedAt = guild.createdAt;
      const guildSetCreatedAtTimestamp = guild.createdTimestamp;
      const guildClientJoinedAt = guild.joinedAt;
      console.log(guildSetId);
      console.log(guildSetCreatedAt);
      console.log(guildSetCreatedAtTimestamp);
      console.log(guildClientJoinedAt);
}}
