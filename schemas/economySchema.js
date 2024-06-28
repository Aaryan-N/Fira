const { connectDBs } = require("../hydra");
const { default : mongoose } = require("mongoose");

const economySchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    lastDailyCollected: {
        type: Date,
    },
})

const { economyDb } = connectDBs()
    
module.exports = economyDb.model('economyDailies', economySchema)

