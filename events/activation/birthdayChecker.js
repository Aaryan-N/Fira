const { Events } = require('discord.js');
const currentDate = require('./currentDate');
const birthdayDb = require('../../hydra')

module.exports = {
    name: Events.MessageUpdate,
    once: true,
    execute() {


        function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, 79200000);
            });

        while (1 === 1) {
            if (birthdayDb.birth_date == currentDate) [

            ]
            sleep(ms).then(r => 32)
        }
        }




















    },
};

