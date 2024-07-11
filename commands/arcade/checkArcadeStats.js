import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import 'dotenv/config';

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
  let goalName = '';
  let minuteInGoal = '';
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
    }).then(res => {
     const goalArray = res.data.data;
     goalName = goalArray.forEach((goals) => {
      return goals.name
     })}).then(() => {
     console.log(sessionCount)
     console.log(totalTimeSessionCount)
     console.log(goalName)
     })
   })},}