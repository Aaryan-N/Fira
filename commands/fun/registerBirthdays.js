const { SlashCommandBuilder} = require("discord.js");
const errorEmbed = require("../../templates/embeds/errorEmbed")
const birthdaySchema = require("../../schemas/birthdaySchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("registerbirthday")
        .setDescription("Register your birthday to Hydra!")
        .addIntegerOption((option) =>
        option
            .setName("year")
            .setDescription("The year of your birthday as a number")
            .setRequired(true),
    )   .addIntegerOption((option) =>
            option
                .setName("month")
                .setDescription("The month of your birthday as a number (1-12)")
                .setRequired(true),
        ).addIntegerOption((option) =>
            option
                .setName("day")
                .setDescription("The day of your birthday as a number (1-31)")
                .setRequired(true),
        ),

    async execute(interaction) {
        if (!interaction.inGuild()) {
            interaction.reply({ content: "This command can only be run in servers!", ephemeral: true})
            return;
        }
        try {
            await interaction.deferReply();

            let userProfileBirthday = await birthdaySchema.findOne({
                userId: interaction.member.id,
                guildId: interaction.guild.id
            });

            if(userProfileBirthday) {
                const analyseBirthDate = userProfileBirthday.birth_date;
                if (analyseBirthDate !== null) {}
                interaction.editReply("Your birthday has already been set and recorded for this guild!");
                return;
            }
            else {
                userProfileBirthday = new birthdaySchema({
                    userId: interaction.member.id,
                    guildId: interaction.guild.id,
                    birth_date: ""
                });
            }

            const birthYear = interaction.options.getInteger("year");
            const birthMonthUnformatted = interaction.options.getInteger("month");
            const birthMonth = birthMonthUnformatted -1;
            const birthDay = interaction.options.getInteger("day");

            userProfileBirthday.birth_date = new Date(birthYear, birthMonth, birthDay);

            await userProfileBirthday.save();

            interaction.editReply("Skbidi will be mine!");
        } catch(err) {
            console.log(
                "Woah there has been an error with the economy daily command. Here it is: \n" + err,
            );
            await interaction.editReply({ embeds: [errorEmbed] });
        }


    },
};
