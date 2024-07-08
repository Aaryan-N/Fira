import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {economySchemaExport} from "../../schemas/fun/economySchema.js";
import {errorEmbed} from "../../templates/embeds/errors/errorEmbed.js";
import redBright from 'chalk';

const dailyAmount = 500;

export default {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Collect your daily coins!"),
  async execute(interaction) {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "This command can only be run in servers!",
        ephemeral: true,
      });
      return;
    }
    try {
      await interaction.deferReply();

      let userProfile = await economySchemaExport.findOne({
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      });

      if (userProfile) {
        const lastDailyDate = userProfile.lastDailyCollected?.toDateString();
        const currentDate = new Date().toDateString();

        if (currentDate === lastDailyDate) {
          const dailyCollectedTodayEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(
              "You have already collected your daily coins today! Come back tomorrow!",
            )
            .setTimestamp()
            .setFooter({ text: "Sent using Inferna!" });
          interaction.editReply({ embeds: [dailyCollectedTodayEmbed] });
          return;
        }
      } else {
        userProfile = new economySchemaExport({
          userId: interaction.member.id,
          guildId: interaction.guild.id,
        });
      }

      userProfile.balance += dailyAmount;
      userProfile.lastDailyCollected = new Date();

      await userProfile.save();

      const dailiesEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .addFields(
          { name: "Amount added", value: dailyAmount.toString() },
          { name: "Current Balance", value: userProfile.balance.toString() },
        )
        .setTimestamp()
        .setFooter({ text: "Sent using Inferna" });

      interaction.editReply({ embeds: [dailiesEmbed] });
    } catch (err) {
      console.log(redBright("Woah there has been an error with the economy daily command. Here it is: \n" + err));
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};