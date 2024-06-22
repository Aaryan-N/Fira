const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(
            "Client ready and logged in as " +
            client.user.username +
            " is now logged in.",
        );

        if (client.user.verified === true) {
            console.log("Scythe is a verified bot");
        } else {
            console.log("The bot is currently not verified");
        }
    },
};