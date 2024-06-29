const { Events } = require("discord.js");
const guildJoinSchema = require("../../schemas/guild/guildSchema");

module.exports = {
    name: Events.GuildDelete,
    async execute(args) {
        const guild = args;
        const guildSetId = guild.id;

        let guildLeftProfile = await guildJoinSchema.findOne({
            guildId: guildSetId,
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
