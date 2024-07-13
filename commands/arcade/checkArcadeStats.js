import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import 'dotenv/config';
import redBright from 'chalk';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 data: new SlashCommandBuilder()
  .setName('arcadestats')
  .setDescription(
   'Replies with your arcade stats! Api key is in the .env file so change that lol!',
  )
  .addStringOption(option =>
   option.setName('slackid').setDescription('Your slack id!').setRequired(true),
  ),
 async execute(interaction) {
  const slackId = interaction.options.getString('slackid');
  let sessionCount = '';
  let totalTimeSessionCount = '';
  let goalName = [];
  let goalTime = [];
  axios({
   method: 'get',
   url: `https://hackhour.hackclub.com/api/stats/${slackId}`,
   headers: { Authorization: `Bearer ${process.env.HCBAPIKEY}` },
   responseType: 'json',
  }).then(response => {
   sessionCount = response.data.data.sessions.toString();
   totalTimeSessionCount = response.data.data.total.toString();
   axios({
    method: 'get',
    url: `https://hackhour.hackclub.com/api/goals/${slackId}`,
    headers: { Authorization: `Bearer ${process.env.HCBAPIKEY}` },
    responseType: 'json',
   }).then((res) => {
    const goalArray = res.data.data;
    goalArray.forEach((goals) => {
      goalName.push(goals.name + ': ');
      goalName.push(goals.minutes + ' minutes' + '\n');
     },
    );
   }).then(() => {
    const formattedGoals = goalName.toString();
    const commandRemovedGoals = formattedGoals.split(',').join('');
    const arcadeStats = new EmbedBuilder()
     .setTitle('Your Arcade Stats!')
     .setColor([255, 231, 188])
     .addFields({ name: 'Total number of sessions completed: ', value: sessionCount.toString() + ' sessions' },
      { name: 'Total time on Arcade: ', value: totalTimeSessionCount.toString() + ' minutes' },
      { name: 'Goals: ', value: commandRemovedGoals },
     )
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira!',
      iconURL:
       'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });
    interaction.reply({ embeds: [arcadeStats] });
   }).catch(async err => {
    console.log(redBright(`Woah there has been an error with the arcade stats command. Here it is:` + err));
    await interaction.reply({ embeds: [errorEmbed] });
   });
  });
 },
};