import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'utility',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('stats')
  .setDescription('Replies with some handy stats about the server!'),
 async execute(interaction) {
  try {
   const guildMemberPromise = [
    interaction.guild.members.fetch(),
    interaction.client.cluster.fetchClientValues('guilds.cache.size'),
   ];

   Promise.all(guildMemberPromise).then(results => {
    const totalUsers = results[0];
    const totalUsersFetch = totalUsers.map(x => x);

    const owner = interaction.guild.ownerId;
    const ownerDisplayName = interaction.client.users.cache.get(owner);

    const statsEmbed = new EmbedBuilder()
     .setColor([255, 231, 188])
     .addFields(
      {
       name: 'Owner of server:',
       value: ownerDisplayName.username,
      },
      { name: 'Amount of members:', value: totalUsersFetch[0].guild.memberCount.toString() },
     )
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira',
      iconURL:
       'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });
    interaction.reply({ embeds: [statsEmbed] });
   });
  } catch (e) {
   console.log(
    `Woah there has been an error with the stats command. Here it is: 
 ` + err,
   );
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
