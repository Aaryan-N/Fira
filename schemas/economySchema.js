const { economyConnection } = require("../events/ready");
const { mongoose, Schema, model } = require("mongoose");

const economyDailiesSchema = new mongoose.Schema({
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
 {timestamps: true}
)


const economyDailiesModel = mongoose.models?.economydailies || mongoose.model('economydailies', economyDailiesSchema)

module.exports = economyDailiesModel;