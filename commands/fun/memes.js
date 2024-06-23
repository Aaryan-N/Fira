const { SlashCommandBuilder } = require("discord.js");
const axios = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("meme")
        .setDescription("Replies with a alright meme"),
    async execute(interaction) {
        await interaction.reply({ content:"Thinking..." });
        axios({
            method: 'get',
            url: 'https://meme-api.com/gimme?nsfw=false',
            responseType: 'json'
        })
            .then(function (response) {
                interaction.editReply(response.data.title + "\n" + response.data.url);
            })
            .catch((err) => {
                console.log(err)
                interaction.editReply("Did you type that in right?");
            });
    },
};
