const { connectDBs } = require("../../hydra");
const { default: mongoose } = require("mongoose");
const birthdaySchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    birthDateConcat: {
        type: String,
        required: true
    }, day: {
        type: Number,
        required: true
    }, month: {
        type: Number,
        required: true
    }, year: {
        type: Number,
        required: true
    }
});
const { birthdayDb } = connectDBs();
module.exports = birthdayDb.model('birthday', birthdaySchema);
