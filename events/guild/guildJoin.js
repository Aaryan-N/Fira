const { Events, Guild } = require("discord.js");
const guildJoinSchema = require("../../schemas/guild/guildJoinSchema");

module.exports = {
  name: Events.GuildCreate,
  once: true,
  async execute() {
      let guildCreatedProfile = await guildJoinSchema.findOne({
          guildId: Guild.id,
          guildCreatedAt: Guild.createdAt,
          guildCreatedAtTimestamp: Guild.createdTimestamp,
          guildClientJoinedAt: Guild.joinedAt,
      });

      if (guildCreatedProfile) {
          const guildCreatedProfileId = guildCreatedProfile.guildId;
          if (guildCreatedProfileId !== null) {
              console.log("Guild has already been registered somehow. Investigate")
              return;
          }
      }

      else {
          const guildSetId = Guild.id;
          const guildSetCreatedAt = Guild.createdAt;
          const guildSetCreatedAtTimestamp = Guild.createdTimestamp;
          const guildClientJoinedAt = Guild.joinedAt;

          guildCreatedProfile = new guildJoinSchema({
              guildId: guildSetId,
              guildCreatedAt: guildSetCreatedAt,
              guildCreatedAtTimestamp: guildSetCreatedAtTimestamp,
              guildClientJoinedAt: guildClientJoinedAt,
          });

          guildCreatedProfile.save();
      }
  }
};
