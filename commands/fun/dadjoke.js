const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
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
                const dadJokeEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .addFields(
                        { name: "Dad Joke" , value: response.data.joke },
                    )
                    .setTimestamp()
                    .setFooter({ text: "Sent using Scythe discord bot!" })
                interaction.reply({embeds : [dadJokeEmbed]});
            })
            .catch((err) => {
                console.log("Hey champ! Something went wrong here. Check it out! \n" + err)
                interaction.editReply("We are sorry, something has gone terribly wrong. The developer has been notified!");
            });
    },
};
