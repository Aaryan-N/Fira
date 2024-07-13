import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { alreadyActiveSession } from '../../templates/embeds/arcade/alreadyActiveSession.js';
import axios from 'axios';
import 'dotenv/config';
import redBright from 'chalk';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 data: new SlashCommandBuilder()
  .setName('newarcadesession')
  .setDescription('Create a new arcade session!')
  .addStringOption(option =>
   option
    .setName('title')
    .setDescription('The description of what you are about to work on!')
    .setRequired(true),
  )
  .addStringOption(option =>
   option.setName('slackid').setDescription('Your slack id!').setRequired(true),
  ),
 async execute(interaction) {
  const slackId = interaction.options.getString('slackid');
  const sessionDesc = interaction.options.getString('title');
  axios({
   method: 'post',
   url: `https://hackhour.hackclub.com/api/start/${slackId}`,
   headers: { Authorization: `Bearer ${process.env.HCBAPIKEY}` },
   data: {
    work: sessionDesc,
   },
  }).then(() => {
   const successfulStartArcade = new EmbedBuilder()
    .setTitle('The arcade session has been started!')
    .setColor([255, 231, 188])
    .setTimestamp()
    .setFooter({
     text: 'Sent using Fira!',
     iconURL:
      'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
    });
   interaction.reply({ embeds: [successfulStartArcade] });
  }).catch((err) => {
   if (err.response.data.ok === false && err.response.data.error == 'You already have an active session') {
    interaction.reply({ embeds: [alreadyActiveSession] });
   } else {
    console.log(redBright(`Woah there has been an error with the new arcade session command. Here it is:` + err));
    interaction.reply({ embeds: [errorEmbed] });
   }
  });
 },
};
