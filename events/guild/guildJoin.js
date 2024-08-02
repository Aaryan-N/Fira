import { Events } from 'discord.js';
import { guildSchemaExport } from '../../schemas/guild/guildSchema.js';
import { configSchemaExport } from '../../schemas/config/configSchema.js';

export default {
 name: Events.GuildCreate,
 async execute(args) {
  const guild = args;
  const guildSetId = guild.id;
  const guildSetName = guild.name;
  const guildSetCreatedAt = guild.createdAt;
  const guildSetCreatedAtTimestamp = guild.createdTimestamp;
  const guildSetClientJoinedAt = guild.joinedAt;
  const guildSetJoinedCurrently = true;

  let guildCreatedProfile = await guildSchemaExport.findOne({
   guildId: guildSetId,
   guildCreatedAt: guildSetCreatedAt,
  });

  let guildConfigProfile = await configSchemaExport.findOne({
   guildId: guildSetId,
  });

  if (guildCreatedProfile) {
   const guildJoinedChecker = guildCreatedProfile.guildJoinedCurrently;
   if (guildJoinedChecker === false) {
    guildCreatedProfile.guildJoinedCurrently = true;
    guildCreatedProfile.guildClientJoinedAt = guildSetClientJoinedAt;
    guildCreatedProfile.save();
   }
  } else {
   guildConfigProfile = new configSchemaExport({
    guildId: guildSetId,
   });
   await guildConfigProfile.save();
   guildCreatedProfile = new guildSchemaExport({
    guildId: guildSetId,
    guildName: guildSetName,
    guildCreatedAt: guildSetCreatedAt,
    guildCreatedAtTimestamp: guildSetCreatedAtTimestamp,
    guildClientJoinedAt: guildSetClientJoinedAt,
    guildJoinedCurrently: guildSetJoinedCurrently,
   });
   await guildCreatedProfile.save();
  }
 },
};
