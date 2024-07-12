import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import 'dotenv/config';

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
   url: `https://api.mcsrvstat.us/3/${slackId}`,
   headers: { Authorization: `Bearer ${process.env.HCBAPIKEY}` },
   data: {
    work : sessionDesc
   },
   responseType: 'json',
  }).then(() => {
   const succesful
   interaction
  })
 },
};
