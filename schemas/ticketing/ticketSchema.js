const { connectDBs } = require("../../hydra");
const { default : mongoose } = require("mongoose");

const ticketSchema = mongoose.Schema({
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
    }, guildJoinedCurrently: {
        type: Boolean,
        required: true,
    }
})

const { ticketingDb } = connectDBs();

module.exports = ticketingDb.model('tickets', ticketSchema)

