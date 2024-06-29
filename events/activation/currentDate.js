const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    execute() {
        module.exports = new Date();
    },
};

