const { EmbedBuilder } = require("discord.js");
module.exports = errorEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("We are sorry, something has gone terribly wrong. The developer has been notified!")
    .setTimestamp()
    .setFooter({ text: "Sent using Hydra" });
