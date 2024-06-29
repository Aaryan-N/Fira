const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");

const errorEmbed = require("../../templates/embeds/errors/errorEmbed")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("createticket")
        .setDescription("Create a ticket for mods to review!"),
    async execute(interaction) {
        if (!interaction.inGuild()) {
            interaction.reply({ content: "This command can only be run in servers!", ephemeral: true})
            return;
        }

        try {
            await interaction.deferReply();

            let userProfile = await economySchema.findOne({
                userId: interaction.member.id,
                guildId: interaction.guild.id
            });

            if (userProfile) {
                const lastDailyDate = userProfile.lastDailyCollected?.toDateString();
                const currentDate = new Date().toDateString();

                if (currentDate === lastDailyDate) {
                    interaction.editReply("You have already collected your daily today. Come back tomorrow!")
                    return;
                }
            } else {
                userProfile = new economySchema({
                    userId: interaction.member.id,
                    guildId: interaction.guild.id,
                });
            }

            userProfile.balance += dailyAmount;
            userProfile.lastDailyCollected = new Date();

            await userProfile.save();

            const dailiesEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .addFields(
                    { name: "Amount added" , value: dailyAmount.toString() },
                    { name: "Current Balance" , value: userProfile.balance.toString() },
                )
                .setTimestamp()
                .setFooter({ text: "Sent using Hydra" })

            interaction.editReply({embeds : [dailiesEmbed]});
        } catch(err) {
            console.log(
                "Woah there has been an error with the economy daily command. Here it is: \n" + err,
            );
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
