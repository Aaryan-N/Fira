const { Events } = require("discord.js");
const guildJoinSchema = require("../../schemas/guild/guildSchema");

module.exports = {
    name: Events.GuildDelete,
    async execute(args) {
        const guild = args;
        const guildSetId = guild.id;
        const guildSetCreatedAt = guild.createdAt;
        const guildSetCreatedAtTimestamp = guild.createdTimestamp;
        const guildSetClientJoinedAt = guild.joinedAt;

        let guildLeftProfile = await guildJoinSchema.findOne({
            guildId: guildSetId,
            guildCreatedAt: guildSetCreatedAt,
            guildCreatedAtTimestamp: guildSetCreatedAtTimestamp,
            guildClientJoinedAt: guildSetClientJoinedAt,
            guildJoinedCurrently: true,
        });

        if (guildLeftProfile) {
            const guildCreatedProfileId = guildLeftProfile.guildId;
            if (guildCreatedProfileId === null || guildLeftProfile.guildJoinedCurrently === false) {
                console.log("Guild does not exist. Investigate");
            }
        }

        guildLeftProfile.guildJoinedCurrently = false;

        await guildLeftProfile.save();
        }
}
