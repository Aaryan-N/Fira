const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("motd")
    .setDescription("Checks the message of the day of a minecraft server!")
    .addStringOption((option) =>
      option
        .setName("serveraddress")
        .setDescription("The address of the server (url or ip)")
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.reply({ content: "Fetching..." });

    const serverAddress = interaction.options.getString("serveraddress");

    axios({
      method: "get",
      url: `https://api.mcsrvstat.us/3/${serverAddress}`,
      responseType: "json",
    })
      .then(function (res) {
        unformattedResponse = res.data.motd.clean.toString();
        const response = unformattedResponse
          .replace(/^\s+|\s+$/g, "")
          .replace(/,/g, "");
        interaction.editReply(response);
      })
      .catch((err) => {
        console.log(err);
        interaction.editReply("Did you type that in right?");
      });
  },
};
