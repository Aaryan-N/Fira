import {EmbedBuilder} from "discord.js";
export const invalidServer = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("The value you have entered is not a valid Minecraft Server! Please try again.")
    .setTimestamp()
    .setFooter({ text: "Sent using Hydra" })