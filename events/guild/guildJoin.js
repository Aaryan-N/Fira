const { Events, Guild } = require("discord.js");
const guildJoinSchema = require("../../schemas/guild/guildJoinSchema");


module.exports = {
  name: Events.GuildCreate,
  once: true,
  async execute(client, args) {
      const guild = new Guild(client, args)
      const guildSetId = guild.id;
      const guildSetCreatedAt = guild.createdAt;
      const guildCreatedAtTimestamp = guild.createdTimestamp;
      const guildClientJoinedAt = guild.joinedAt;

      console.log(`Id of guild joined: ${guildSetId}`);
      console.log(`Guild Created at: ${guildSetCreatedAt}`);
      console.log(`Guild Created at (epoch): ${guildCreatedAtTimestamp}`);
      console.log(`Client joined at ${guildClientJoinedAt}`)
}
}
