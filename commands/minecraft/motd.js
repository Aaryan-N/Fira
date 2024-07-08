import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import axios from "axios";
import validator from "validator";
import {errorEmbed} from "../../templates/embeds/errors/errorEmbed.js";
import {invalidServer} from "../../templates/embeds/motd/invalidServer.js"
import {invalidUrl} from "../../templates/embeds/motd/invalidUrl.js";
import redBright from "chalk";
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
                const unformattedResponse = res.data.motd.clean.toString();
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
