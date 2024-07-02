const { Events } = require('discord.js');
const currentDate = require('./currentDate');
const birthdaySchema = require('../../schemas/fun/birthdaySchema');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute() {
        const fetchCurrentDateMonth = currentDate.getMonth();
        const fetchCurrentDateDate = currentDate.getDate();
        const formattedDateMonth = fetchCurrentDateMonth.toString();
        const formattedDateDate = fetchCurrentDateDate.toString();
        const formattedDate = formattedDateDate.concat(" ")
        const formattedDateAndMonth = formattedDate.concat(formattedDateMonth)

        birthdaySchema

}



















    },
};

