import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import validator from 'validator';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import { invalidServer } from '../../templates/embeds/motd/invalidServer.js';
import { invalidUrl } from '../../templates/embeds/motd/invalidUrl.js';
import redBright from 'chalk';

function isValidUrl(str) {
 return validator.isURL(str);
}

export default {
 data: new SlashCommandBuilder()
  .setName('motd')
  .setDescription('Checks the message of the day of a minecraft server!')
  .addStringOption(option =>
   option.setName('serveraddress').setDescription('The address of the server (url or ip)').setRequired(true),
  ),
 async execute(interaction) {
  const serverAddress = interaction.options.getString('serveraddress');
  if (isValidUrl(serverAddress) === true) {
   axios({
    method: 'get',
    url: `https://api.mcsrvstat.us/3/${serverAddress}`,
    responseType: 'json',
   })
    .then(async function (res) {
     if (res.data.debug.ping === true) {
      const unformattedResponse = res.data.motd.clean.toString();
      const response = unformattedResponse.replace(/^\s+|\s+$/g, '').replace(/,/g, '');

      const motdEmbed = new EmbedBuilder()
       .setColor(0x0099ff)
       .setTitle('Minecraft Server Message of the Day')
       .addFields({ name: 'Server: ' + serverAddress, value: response })
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira!',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });

      interaction.reply({ embeds: [motdEmbed] });
     } else {
      interaction.reply({ embeds: [invalidServer] });
     }
    })
    .catch(async err => {
     console.log(redBright(`Woah there has been an error with the message of the day command. Here it is:` + err));
     await interaction.reply({ embeds: [errorEmbed] });
    });
  } else {
   interaction.reply({ embeds: [invalidUrl] });
  }
 },
};
