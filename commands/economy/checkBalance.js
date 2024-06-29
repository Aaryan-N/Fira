const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const economySchema = require("../../schemas/fun/economySchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("checkbalance")
        .setDescription("Check your balance!"),
    async execute(interaction) {
            let economyProfile = await economySchema.findOne({
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
