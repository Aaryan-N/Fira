const { Events, PresenceUpdateStatus } = require('discord.js');
const mongoose = require('mongoose')
require('dotenv').config()

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);
        console.log(
            "Client ready and logged in as " +
            client.user.username
        );

        mongoose.connect(process.env.mongoURL || '', {
        }).then(() => console.log("Connected to the database!"))
    },
};