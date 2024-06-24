const { Events } = require('discord.js');
const mongoose = require('mongoose')
const mongoURL = process.env.MONGODB_URL

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(
            "Client ready and logged in as " +
            client.user.username
        );
        if (!mongoURL) return;

        await mongoose.connect(mongoURL || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        if (mongoose.connect) {
            console.log("I have connected to the db!")
        } else {
            console.log("Failed to connect to the db!");
        }
    },
};