import {EmbedBuilder} from "discord.js";

export const invalidUrl = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("The value you have entered is not a valid URL! Please try again.")
    .setTimestamp()
    .setFooter({ text: "Sent using Inferna" })