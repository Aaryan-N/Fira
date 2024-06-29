const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const axios = require('axios');
const errorEmbed = require("../../templates/embeds/errors/errorEmbed");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Create a ticket for the mods to review!"),
    async execute(interaction) {
            try {

            }
            catch(err) {
                console.log(
                    `Woah there has been an error with the dad joke command. Here it is:` + err)
                interaction.editReply({ embeds: [errorEmbed] });
            }
    },
};
