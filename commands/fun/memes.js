const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
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
                const memesEmbed = new EmbedBuilder()
                    .setTitle(response.data.title)
                    .setURL(response.data.postLink)
                    .setImage(response.data.url)
                    .setTimestamp()
                    .setFooter({ text: "Sent using Scythe discord bot!" })
                interaction.reply({ embeds: [memesEmbed] });
            })
            .catch((err) => {
                console.log(err)
                interaction.editReply("Did you type that in right?");
            });
    },
};
