const { Schema, model } = require("mongoose");

let birthdaySchema = new Schema({
    name: String
})

module.exports = model("birthdaySchema", birthdaySchema);