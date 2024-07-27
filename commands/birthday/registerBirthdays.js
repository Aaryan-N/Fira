import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import { invalidDate } from '../../templates/embeds/birthday/invalidDate.js';
const { birthdaySchemaExport } = await import('../../schemas/fun/birthdaySchema.js');
import moment from 'moment';
import redBright from 'chalk';

export default {
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('registerbirthday')
  .setDescription('Register your birthday to Fira!')
  .addIntegerOption(option =>
   option
    .setName('day')
    .setDescription('The day of your birthday as a number (1-31)')
    .setRequired(true),
  )
  .addIntegerOption(option =>
   option
    .setName('month')
    .setDescription('The month of your birthday as a number (1-12)')
    .setRequired(true),
  )
  .addIntegerOption(option =>
   option.setName('year').setDescription('The year of your birthday as a number').setRequired(true),
  ),

 async execute(interaction) {
  if (!interaction.inGuild()) {
   interaction.reply({
    content: 'This command can only be run in servers!',
    ephemeral: true,
   });
   return;
  }

  try {
   await interaction.deferReply();

   let userProfileBirthday = await birthdaySchemaExport.findOne({
    userId: interaction.member.id,
    guildId: interaction.guild.id,
   });

   if (userProfileBirthday) {
    const analyseBirthDate = userProfileBirthday.birth_date;
    const preexistingBirthdayRegisterEmbed = new EmbedBuilder()
     .setColor([255, 231, 188])
     .setTitle('Your birthday has already been registered in this guild!')
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira',
      iconURL:
       'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });

    if (analyseBirthDate !== null) {
     interaction.editReply({ embeds: [preexistingBirthdayRegisterEmbed] });
     return;
    }
   } else {
    userProfileBirthday = new birthdaySchemaExport({
     userId: interaction.member.id,
     guildId: interaction.guild.id,
     birth_date: '',
    });
   }

   const birthYear = interaction.options.getInteger('year');
   const birthMonth = interaction.options.getInteger('month');
   const birthDay = interaction.options.getInteger('day');
   const birthDateFormatted =
    birthDay.toString() + '/' + birthMonth.toString() + '/' + birthYear.toString();
   const jsDateValidator = birthYear + '-' + birthMonth + '-' + birthDay;
   const formattedBirthDateJoined = birthDay.toString() + ' ' + birthMonth.toString();
   const momentJsDateValidator = moment(jsDateValidator, 'YYYY MM DD');
   if (momentJsDateValidator.isValid() === false) {
    await interaction.editReply({ embeds: [invalidDate] });
   } else {
    userProfileBirthday.birthDateConcat = formattedBirthDateJoined;
    userProfileBirthday.day = birthDay;
    userProfileBirthday.month = birthMonth;
    userProfileBirthday.year = birthYear;

    await userProfileBirthday.save();

    const successfulBirthdayRegisterEmbed = new EmbedBuilder()
     .setColor([255, 231, 188])
     .setTitle('Birthday Registered!')
     .addFields({
      name: 'Your birthday has been set to:',
      value: birthDateFormatted,
     })
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira',
      iconURL:
       'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });

    interaction.editReply({ embeds: [successfulBirthdayRegisterEmbed] });
   }
  } catch (err) {
   console.log(
    redBright('Woah there has been an error with the birthday daily command. Here it is: \n' + err),
   );
   await interaction.editReply({ embeds: [errorEmbed] });
  }
 },
};
