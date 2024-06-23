const { SlashCommandBuilder } = require("discord.js");
const axios = require('axios');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Replies with a lovely joke"),
  async execute(interaction) {
      axios({
          method: 'get',
          url: 'https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single',
          responseType: 'json'
      })
          .then(function (response) {
              interaction.reply(response.data.joke);
          })
          .catch((err) => {
          console.log(err)
          interaction.editReply("Did you type that in right?");
      });
  },
};
