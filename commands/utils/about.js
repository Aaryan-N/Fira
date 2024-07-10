import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getInfo } from 'discord-hybrid-sharding';

export default {
 data: new SlashCommandBuilder().setName('about').setDescription('Replies with some information about Inferna!'),
 async execute(interaction) {
  const statsPromises = [
   interaction.client.cluster.fetchClientValues('guilds.cache.size'),
   interaction.client.cluster.fetchClientValues('channels.cache.size'),
   interaction.client.cluster.fetchClientValues('channels.cache')
  ];

  Promise.all(statsPromises).then(results => {
   const guildServed = results[0].reduce((firstValueInArray, otherVals) => firstValueInArray + otherVals);
   const totalChannelsServed = results[1].reduce((firstValueInArray, otherVals) => firstValueInArray + otherVals);
   const channelCheck = results[2];
   console.log(channelCheck)
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
      value: totalChannelsServed.toString() + ' total',
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
