import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {economySchemaExport} from "../../schemas/fun/economySchema.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checkbalance")
        .setDescription("Check your balance!"),
    async execute(interaction) {
            let economyProfile = await economySchemaExport.findOne({
            userId: interaction.member.id,
            guildId: interaction.guild.id,
            });
            const currentUserBalance = economyProfile.balance.toString();
                const ballEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle("Your current balance:")
                    .setDescription(currentUserBalance)
                    .setTimestamp()
                    .setFooter({ text: "Sent using Hydra" })
                interaction.reply({embeds : [ballEmbed]});
    },
};
