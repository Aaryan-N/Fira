const guildJoinSchema = require("./schemas/guild/guildJoinSchema");
let guildCreatedProfile = await guildJoinSchema.findOne({
    guildId: guildSetId,
    guildCreatedAt: guildSetCreatedAt,
    guildCreatedAtTimestamp: guildSetCreatedAtTimestamp,
    guildClientJoinedAt: guildClientJoinedAt,
});

if (guildCreatedProfile) {
    const guildCreatedProfileId = guildCreatedProfile.guildId;
    if (guildCreatedProfileId !== null) {
        console.log("Guild has already been registered somehow. Investigate")
        return;
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