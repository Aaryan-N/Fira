const { Events } = require("discord.js");
const guildJoinSchema = require("../../schemas/guild/guildSchema");


module.exports = {
  name: Events.GuildCreate,
  async execute(args) {
      const guild = args;
      const guildSetId = guild.id;
      const guildSetName = guild.name;
      const guildSetCreatedAt = guild.createdAt;
      const guildSetCreatedAtTimestamp = guild.createdTimestamp;
      const guildSetClientJoinedAt = guild.joinedAt;
      const guildSetJoinedCurrently = true;

      let guildCreatedProfile = await guildJoinSchema.findOne({
          guildId: guildSetId,
          guildJoinedCurrently: guildSetJoinedCurrently,
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
              guildName: guildSetName,
              guildCreatedAt: guildSetCreatedAt,
              guildCreatedAtTimestamp: guildSetCreatedAtTimestamp,
              guildClientJoinedAt: guildSetClientJoinedAt,
              guildJoinedCurrently: guildSetJoinedCurrently,
          });

          await guildCreatedProfile.save();
      }
  }
}
