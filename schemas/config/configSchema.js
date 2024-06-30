const { connectDBs } = require("../../hydra");
const { default : mongoose } = require("mongoose");

const configGuildSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    }, guildCreatedAt: {
        type: Date,
        required: true
    }, guildCreatedAtTimestamp: {
        type: Number,
        required: true
    }, ticketChannel: {
        type: String,
        required: true
    }, updateChannel: {
        type: String,
        required: true
    }
})

const { configDb } = connectDBs()

module.exports = configDb.model('guildconfigs', configGuildSchema)

