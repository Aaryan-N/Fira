const { SlashCommandBuilder } = require("discord.js");
const axios = require('axios');
module.exports = {
    data: new SlashCommandBuilder()
        .setName("motd")
        .setDescription("Checks the message of the day of a minecraft server!")
        .addStringOption(option => option.setName("mcaddress").setDescription("The address of the server (url or ip)").setRequired(true)),
    async execute(interaction) {
        await interaction.reply({ content:"Fetching..." });
        const serverAddress = interaction.options.getString('mcaddress');
        axios({
            method: 'get',
            url: `https://api.mcsrvstat.us/3/${serverAddress}`,
            responseType: 'json'
        })
            .then(function (response) {
                interaction.editReply(response.data.motd.clean);
            });
    },
};