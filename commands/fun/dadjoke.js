const { SlashCommandBuilder } = require("discord.js");
const axios = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("dadjoke")
        .setDescription("Replies with a (slightly corny) dad joke"),
    async execute(interaction) {
        axios({
            method: 'get',
            url: 'https://icanhazdadjoke.com/',
            responseType: 'json',
            headers: {
                'Accept': "application/json"
            }
        })
            .then(function (response) {
                interaction.reply(response.data.joke);
            })
            .catch((err) => {
                console.log("Hey champ! Something went wrong here. Check it out! \n" + err)
                interaction.editReply("We are sorry, something has gone terribly wrong. The developer has been notified!");
            });
    },
};
