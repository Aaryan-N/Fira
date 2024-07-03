const { Events } = require('discord.js');
const currentDate = new Date();
const birthdaySchema = require('../../schemas/fun/birthdaySchema');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(interaction) {
        const fetchCurrentDateMonth = currentDate.getMonth();
        const fetchCurrentDateDate = currentDate.getDate();
        const formattedDateMonth = fetchCurrentDateMonth.toString();
        const formattedDateDate = fetchCurrentDateDate.toString();
        const formattedDate = formattedDateDate.concat(" ")
        const formattedDateAndMonth = formattedDate.concat(formattedDateMonth)

        for await (const birthdayPerson of birthdaySchema.find({ birthDateConcat: formattedDateAndMonth })) {
            console.log(birthdayPerson.userId);
        }

}
}

