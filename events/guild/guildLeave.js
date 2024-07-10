import { Events } from 'discord.js';
import { guildSchemaExport } from '../../schemas/guild/guildSchema.js';

export default {
  name: Events.GuildDelete,
  async execute(args) {
    const guild = args;
    const guildSetId = guild.id;
    const guildSetName = guild.name;

    let guildLeftProfile = await guildSchemaExport.findOne({
      guildId: guildSetId,
      guildJoinedCurrently: true,
    });

    const guildCreatedProfileId = guildLeftProfile.guildId;

    if (
      guildCreatedProfileId === null ||
      guildLeftProfile.guildJoinedCurrently === false
    ) {
      console.log('Guild does not exist. Investigate');
    }

    guildLeftProfile.guildJoinedCurrently = false;
    await guildLeftProfile.save();
  },
};
