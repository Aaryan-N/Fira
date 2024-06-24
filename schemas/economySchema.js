const { Schema, model} = require("mongoose");

const economySchema = new Schema({
    userId: {
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
},
    {timestamps:true}
);

module.exports = model("economySchema", economySchema);