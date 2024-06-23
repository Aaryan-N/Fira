const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(
            "Client ready and logged in as " +
            client.user.username
        );
    },
};