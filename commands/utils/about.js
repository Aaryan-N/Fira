import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getInfo } from 'discord-hybrid-sharding';

export default {
 data: new SlashCommandBuilder().setName('about').setDescription('Replies with some information about Fira!'),
 async execute(interaction) {
  const statsPromises = [
   interaction.client.cluster.fetchClientValues('guilds.cache.size'),
   interaction.client.cluster.fetchClientValues('channels.cache.size'),
   interaction.client.cluster.fetchClientValues('channels.cache'),
   interaction.client.cluster.fetchClientValues('guilds.cache')
  ];

  Promise.all(statsPromises).then(results => {
   const guildServed = results[0].reduce((firstValueInArray, otherVals) => firstValueInArray + otherVals);
   const totalChannelsServed = results[1].reduce((firstValueInArray, otherVals) => firstValueInArray + otherVals);
   const channelListPull = results[2];
   const totalUsers = results[3];

   const channelList = [].concat(...channelListPull);
   const totalUsersList = [].concat(...totalUsers);

   console.log(totalUsersList)

   function numberOfMembers(firstMemberMap) {
    let counter = 0;
    for (let index = 0; index < firstMemberMap.length; index++) {
     counter = firstMemberMap[index].members
    } 
    return counter;
   }

   function numberOfTextChannels(firstChannelMapFunc) {
    let counter = 0;
    for (let index = 0; index < firstChannelMapFunc.length; index++) {
     if (firstChannelMapFunc[index].type === 0 || firstChannelMapFunc[index].type === 5 || firstChannelMapFunc[index].type === 15) {
      counter++;
     }
    }
    return counter;
   }

   function numberOfVoiceChannels(firstChannelMapFunc) {
    let counter = 0;
    for (let index = 0; index < firstChannelMapFunc.length; index++) {
     if (firstChannelMapFunc[index].type === 2 || firstChannelMapFunc[index].type === 13) {
      counter++;
     }
    }
    return counter;
   }

   console.log(numberOfMembers(totalUsersList))

   const statsEmbed = new EmbedBuilder()
    .setTitle('About Me!')
    .setColor(0x0099ff)
    .setAuthor({
     name: 'navygood12',
     iconURL: 'https://cdn.discordapp.com/avatars/652433042153144321/1f214c012718abc36181d4c88ac75e0b.webp?size=100',
    })
    .addFields(
     {
      name: 'Servers:',
      value: guildServed.toString() + ' servers',
      inline: true,
     },
     {
      name: 'Shards:',
      value: getInfo().TOTAL_SHARDS.toString() + ' shards' + '\n' + getInfo().CLUSTER_COUNT.toString() + ' clusters',
      inline: true,
     },
     {
      name: 'Channels:',
      value: totalChannelsServed.toString() + ' total' + "\n" + numberOfTextChannels(channelList).toString() + " text channels" +"\n" + numberOfVoiceChannels(channelList).toString() + " voice channels",
      inline: true,
     },
     { name: 'Owner:', value: 'navygood12', inline: true },
    )
    .setFooter({
     text: 'Made with 💖 and mostly tears with discord.js',
     iconURL: 'https://i.imgur.com/AfFp7pu.png',
    });
   interaction.reply({ embeds: [statsEmbed] });
  });
 },
};
