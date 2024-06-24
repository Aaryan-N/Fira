const { SlashCommandBuilder } = require("discord.js");
const economySchema = require('../../schemas/economySchema')

const dailyAmount = 500;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Collect your daily coins!"),
    async execute(interaction) {
        if (!interaction.inGuild()) {
            interaction.reply({ content: "This command can only be run in servers!", ephemeral: true})
            return;
        }

        try {
            await interaction.deferReply();

            let userProfile = await economySchema.findOne({
                userId: interaction.member.id
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
               });
            }

            userProfile.balance += dailyAmount;
            userProfile.lastDailyCollected = new Date();

            await userProfile.save();

            interaction.editReply(
                `${dailyAmount} was added to your balance!`
            )
        } catch(err) {
            console.log(
                "Woah there has been an error with the rps command. Here it is: \n" + err,
            );
            await interaction.reply(
                "We are sorry, something has gone terribly wrong. The developer has been notified!",
            );
        }

        await interaction.reply("Collecting the dailies!");
    },
};
