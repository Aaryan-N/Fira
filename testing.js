const mongoose = require("mongoose");

const connectDBs = () => {
    try {
        const economyDb = mongoose.createConnection(process.env.mongoURlEconomy, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        return { economyDb }
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
    module.exports = { connectDBs }
}