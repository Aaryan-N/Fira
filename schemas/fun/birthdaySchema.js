const { connectDBs } = require("../../hydra");
const { default : mongoose } = require("mongoose");

const birthdaySchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    birth_date: {
        type: Date,
        required: true
    },
})

const { birthdayDb } = connectDBs()

module.exports = birthdayDb.model('birthday', birthdaySchema)

