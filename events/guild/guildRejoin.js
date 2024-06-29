const { Events } = require("discord.js");
const guildJoinSchema = require("../../schemas/guild/guildSchema");

module.exports = {
    name: Events.GuildCreate,
    async execute(args) {
        const guild = args;
        const guildSetId = guild.id;
        const guildSetName = guild.name;
        const guildSetJoinedCurrently = true;

        let guildCreatedProfile = await guildJoinSchema.findOne({
            guildId: guildSetId,
            guildName: guildSetName,
            guildJoinedCurrently: guildSetJoinedCurrently,
        });

        const guildJoinedCurrentlyBoolean = guildCreatedProfile.guildJoinedCurrently;
        if (guildJoinedCurrentlyBoolean === false) {
            guildCreatedProfile.guildJoinedCurrently = true;
            await guildCreatedProfile.save();
        }
        }
}
