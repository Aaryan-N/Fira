const { Events, PresenceUpdateStatus } = require('discord.js');
require('dotenv').config()

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);
        console.log(
            "Client ready as " +
            client.user.username + "!"
        );
    },
};

