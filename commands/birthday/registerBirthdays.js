import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import {errorEmbed} from "../../templates/embeds/errors/errorEmbed.js";
import {birthdaySchemaExport} from "../../schemas/fun/birthdaySchema.js";
import {invalidDate} from "../../templates/embeds/birthday/invalidDate.js";
import moment from "moment";
import redBright from 'chalk';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("registerbirthday")
        .setDescription("Register your birthday to Hydra!")
        .addIntegerOption((option) =>
            option
                .setName("day")
                .setDescription("The day of your birthday as a number (1-31)")
                .setRequired(true),
        )
    .addIntegerOption((option) =>
            option
                .setName("month")
                .setDescription("The month of your birthday as a number (1-12)")
                .setRequired(true),
        )
        .addIntegerOption((option) =>
                option
                    .setName("year")
                    .setDescription("The year of your birthday as a number")
                    .setRequired(true),
        ),

    async execute(interaction) {
        if (!interaction.inGuild()) {
            interaction.reply({ content: "This command can only be run in servers!", ephemeral: true})
            return;
        }
        try {
            await interaction.deferReply();

            let userProfileBirthday = await birthdaySchemaExport.findOne({
                userId: interaction.member.id,
                guildId: interaction.guild.id
            });

            if(userProfileBirthday) {
                const analyseBirthDate = userProfileBirthday.birth_date;
                const preexistingBirthdayRegisterEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle("Your birthday has already been registered in this guild!")
                    .setTimestamp()
                    .setFooter({ text: "Sent using Hydra" });

                if (analyseBirthDate !== null) {
                    interaction.editReply({ embeds: [preexistingBirthdayRegisterEmbed] });
                    return;
                }

            }
            else {
                userProfileBirthday = new birthdaySchemaExport({
                    userId: interaction.member.id,
                    guildId: interaction.guild.id,
                    birth_date: ""
                });
            }

            const birthYear = interaction.options.getInteger("year");
            const birthMonth = interaction.options.getInteger("month");
            const birthDay = interaction.options.getInteger("day");
            const birthDateFormatted = birthDay.toString() + "/" + birthMonth.toString()+ "/" + birthYear.toString();
            const jsDateValidator = birthYear+"-"+birthMonth+"-"+birthDay
            const formattedBirthDateJoined = birthDay.toString() + " " + birthMonth.toString();
            const momentJsDateValidator = moment(jsDateValidator, "YYYY MM DD");
            if (momentJsDateValidator.isValid() === false) {
                await interaction.editReply({embeds: [invalidDate]})
            } else {
                userProfileBirthday.birthDateConcat = formattedBirthDateJoined;
                userProfileBirthday.day = birthDay;
                userProfileBirthday.month = birthMonth;
                userProfileBirthday.year = birthYear;

                await userProfileBirthday.save();

                const successfulBirthdayRegisterEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle("Birthday Registered!")
                    .addFields(
                        {name: "Your birthday has been set to:", value: birthDateFormatted}
                    )
                    .setTimestamp()
                    .setFooter({text: "Sent using Hydra"})

                interaction.editReply({embeds: [successfulBirthdayRegisterEmbed]});
            }
        } catch(err) {
            console.log(redBright("Woah there has been an error with the birthday daily command. Here it is: \n" + err))
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
