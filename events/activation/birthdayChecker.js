import Events from 'discord.js';
const currentDate = new Date();
import birthdaySchema from '../../schemas/fun/birthdaySchema.js';
import {blueBright} from "chalk";

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
}
}

