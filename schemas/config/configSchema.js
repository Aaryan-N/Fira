const { connectDBs } = require("../../hydra");
const { default : mongoose } = require("mongoose");

const configGuildSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    birth_date: {
        type: Date,
        required: true
    },
})

const { configDb } = connectDBs()

module.exports = configDb.model('guild configs', configGuildSchema)

