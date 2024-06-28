const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const axios = require('axios');
const errorEmbed = require("../../templates/embeds/errorEmbed");
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
                const dadJokeEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .addFields(
                        { name: "Dad Joke" , value: response.data.joke },
                    )
                    .setTimestamp()
                    .setFooter({ text: "Sent using Hydra" })
                interaction.reply({embeds : [dadJokeEmbed]});
            })
            .catch((err) => {
                console.log(
                    `Woah there has been an error with the dad joke command. Here it is: 
` + err,
                )
                interaction.editReply({ embeds: [errorEmbed] });
            });
    },
};
