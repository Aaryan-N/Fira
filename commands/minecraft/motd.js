const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
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

        const motdEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Minecraft Server Message of the Day")
            .addFields(
                { name: "Server: " + serverAddress , value: response },
            )
            .setTimestamp()
            .setFooter({ text: "Sent using Hydra!" })
        interaction.reply({embeds : [motdEmbed]});

      })
      .catch((err) => {
        console.log(err);
        interaction.reply("Did you type that in right?");
      });
  },
};
