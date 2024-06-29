const { Events } = require("discord.js");
const guildJoinSchema = require("../../schemas/guild/guildJoinSchema");


module.exports = {
  name: Events.GuildCreate,
  async execute(args) {
      const guild = args;
      const guildSetId = guild.id;
      const guildSetCreatedAt = guild.createdAt;
      const guildSetCreatedAtTimestamp = guild.createdTimestamp;
      const guildClientJoinedAt = guild.joinedAt;

      let guildCreatedProfile = await guildJoinSchema.findOne({
          guildId: guildSetId,
          guildCreatedAt: guildSetCreatedAt,
          guildCreatedAtTimestamp: guildSetCreatedAtTimestamp,
          guildClientJoinedAt: guildClientJoinedAt,
      });

      if (guildCreatedProfile) {
          const guildCreatedProfileId = guildCreatedProfile.guildId;
          if (guildCreatedProfileId !== null) {
              console.log("Guild has already been registered somehow. Investigate");
          }
      }

      else {
          guildCreatedProfile = new guildJoinSchema({
              guildId: guildSetId,
              guildCreatedAt: guildSetCreatedAt,
              guildCreatedAtTimestamp: guildSetCreatedAtTimestamp,
              guildClientJoinedAt: guildClientJoinedAt,
          });

          guildCreatedProfile.save();
      }
  }
}
