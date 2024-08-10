import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'fun',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('riddle')
  .setDescription('A random riddle for you to answer!'),
 
 async execute(interaction) {
  try {
   axios({
    method: 'get',
    url: 'https://riddles-api.vercel.app/random',
    responseType: 'json',
    headers: {
     Accept: 'application/json',
    },
   })
    .then(async function(response) {
     const riddleEmbed = new EmbedBuilder()
      .setColor([255, 231, 188])
      .addFields({ name: 'Riddle', value: response.data.riddle })
      .setTimestamp()
      .setFooter({
       text: 'Sent using Fira',
       iconURL:
        'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
      });

     await interaction.reply({ embeds: [riddleEmbed] });

     const collectorFilter = m => m.content.includes(response.data.answer);

     const collector = interaction.channel.createMessageCollector(
      { filter: collectorFilter, time: 15_000 }
     );

     const riddleCorrectEmbed = new EmbedBuilder()
      .setColor([255, 231, 188])
      .setTitle("Correct Answer!")
      .setTimestamp()
      .setFooter({
       text: 'Sent using Fira',
       iconURL:
        'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
      });

     collector.on('collect', async m => {
      await m.update({ embeds: [riddleCorrectEmbed] });
     });

     const riddleExpiredEmbed = new EmbedBuilder()
      .setColor([255, 231, 188])
      .setTitle("This embed has expired! Please re-run the command!")
      .setTimestamp()
      .setFooter({
       text: 'Sent using Fira',
       iconURL:
        'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
      });


     collector.on('end', async collected => {
      const collectedMap = collected.map(x => x);
      const channelId = collectedMap[0].message.channelId;
      const messageId = collectedMap[0].message.id;
      interaction.client.channels.fetch(channelId).then(channel => {
       channel.messages.edit(messageId, { embeds: [riddleExpiredEmbed] });
      })
     });

    })
    .catch(err => {
     console.log(
      `Woah there has been an error with the dad joke command. Here it is: 
` + err,
     );
     interaction.editReply({ embeds: [errorEmbed] });
})} catch (err) {
   console.log(
    `Woah there has been an error with the dad joke command. Here it is: 
` + err,
   );
   interaction.editReply({ embeds: [errorEmbed] });
}}}