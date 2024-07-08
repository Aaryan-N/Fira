import { SlashCommandBuilder, EmbedBuilder} from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Replies with information about the bot!"),
  async execute(interaction) {
    await interaction.reply("Hey there champ we are still setting up here!");
  },
};
