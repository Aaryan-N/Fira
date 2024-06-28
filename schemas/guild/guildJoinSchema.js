const {connectDBs} = require("../../hydra");
const { default : mongoose } = require("mongoose");

const guildJoinSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    guildCreatedAt: {
        type: Date,
        required: true,
    }, guildCreatedAtTimestamp: {
        type: Number,
        required: true,
    }, guildClientJoinedAt: {
        type: Date,
        required: true,
    }
})

const { usersDb } = connectDBs();

module.exports = usersDb.model('guilds', guildJoinSchema)

