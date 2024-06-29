const {connectDBs} = require("../../hydra");
const { default : mongoose } = require("mongoose");

const guildSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    }, guildName: {
        type: String,
        required: true
    }, guildCreatedAt: {
        type: Date,
    }, guildCreatedAtTimestamp: {
        type: Number,
    }, guildClientJoinedAt: {
        type: Date,
    }, guildJoinedCurrently: {
        type: Boolean,
        required: true,
    }
})

const { usersDb } = connectDBs();

module.exports = usersDb.model('guilds', guildSchema)

