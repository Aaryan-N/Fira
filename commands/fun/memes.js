const { SlashCommandBuilder } = require("discord.js");
const axios = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("memes")
        .setDescription("Replies with an alright meme"),
    async execute(interaction) {
        axios({
            method: 'get',
            url: 'https://meme-api.com/gimme?nsfw=false',
            responseType: 'json'
        })
            .then(function (response) {
                interaction.reply(response.data.title + "\n" + response.data.url);
            })
            .catch((err) => {
                console.log(err)
                interaction.editReply("Did you type that in right?");
            });
    },
};
