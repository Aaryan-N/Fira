const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const birthdaySchema = require("../../schemas/");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("joke")
        .setDescription("Replies with a lovely joke"),
    async execute(interaction) {
    }
};