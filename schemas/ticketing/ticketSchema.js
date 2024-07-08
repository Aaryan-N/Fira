const { connectDBs } = require("../../hydra");
const { default: mongoose } = require("mongoose");
const ticketSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    ticketSubjectContent: {
        type: String,
        required: true,
    },
    ticketBodyContent: {
        type: String,
        required: true,
    },
    timeTicketCreated: {
        type: Date,
        required: true,
    }, isOpen: {
        type: Boolean,
        required: true,
    }
});
const { ticketingDb } = connectDBs();
module.exports = ticketingDb.model("tickets", ticketSchema);
