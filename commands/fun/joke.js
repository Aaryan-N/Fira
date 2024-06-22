const { SlashCommandBuilder } = require("discord.js");
const axios = require('axios');

let finalJoke = "";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("joke")
        .setDescription("Replies with a lovely joke"),
    async execute(interaction) {
        axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en')
            .then(response => {console.log(response.data)})
            .catch(error => {console.log(error)})
    await interaction.reply(finalJoke.text);
},
};