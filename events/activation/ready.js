const { Events, PresenceUpdateStatus } = require('discord.js');
const chalk = require('chalk');
require('dotenv').config()

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);
        console.log(chalk.greenBright(
            "Client ready as " +
            client.user.username + "!"
        ));
    },
};

