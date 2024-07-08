const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const validator = require("validator");
const errorEmbed = require("../../templates/embeds/errors/errorEmbed");
const invalidServer = require("../../templates/embeds/motd/invalidServer")
const invalidUrl = require("../../templates/embeds/motd/invalidUrl");
const {redBright} = require("chalk");
function isValidUrl(str) {
    return validator.isURL(str);
}
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
    if (isValidUrl(serverAddress) === true) {
      axios({
        method: "get",
        url: `https://api.mcsrvstat.us/3/${serverAddress}`,
        responseType: "json",
      })
        .then(async function (res) {
            if (res.data.debug.ping === true) {
                unformattedResponse = res.data.motd.clean.toString();
                const response = unformattedResponse
                    .replace(/^\s+|\s+$/g, "")
                    .replace(/,/g, "");

                const motdEmbed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle("Minecraft Server Message of the Day")
                    .addFields({name: "Server: " + serverAddress, value: response})
                    .setTimestamp()
                    .setFooter({text: "Sent using Hydra!"});

                interaction.reply({embeds: [motdEmbed]});
            } else {
                interaction.reply({embeds: [invalidServer]})
            }
        })
        .catch(async (err) => {
                console.log(redBright(`Woah there has been an error with the message of the day command. Here it is:` + err));
                await interaction.reply({embeds: [errorEmbed]});
        });
    } else {
      interaction.reply({embeds: [invalidUrl]});
    }
  },
};
