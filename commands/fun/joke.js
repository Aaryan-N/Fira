const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

let finalJoke = "";
axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en").then((response) => {finalJoke = response.data}).catch(error => {
    console.log(error);
});



module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Replies with a lovely joke"),
  async execute(interaction) {
      await interaction.reply("skbiid")
  },
};
