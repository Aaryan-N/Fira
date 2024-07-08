import { connectDBs } from "../../inferna.js";
import mongoose from "mongoose";

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

const { economyDb } = connectDBs();
    
export const economySchemaExport = economyDb.model('economyDailies', economySchema)

