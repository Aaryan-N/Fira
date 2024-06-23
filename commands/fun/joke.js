const { SlashCommandBuilder } = require("discord.js");
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Replies with a lovely joke"),
  async execute(interaction) {
      await interaction.reply({ content:"Thinking...", ephemeral: true });
      axios({
          method: 'get',
          url: 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en',
          responseType: 'json'
      })
          .then(function (response) {
              interaction.editReply(response.data.text);
          });
  },
};
