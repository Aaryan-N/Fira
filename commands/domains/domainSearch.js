import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import { rando } from '@nastyox/rando.js';

export default {
 category: 'poetry',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('domain')
  .setDescription('Rasssss')
  .addStringOption(option =>
   option.setName('query').setDescription('Domain to search! (example.com)').setRequired(true),
  ),

 async execute(interaction) {
  const query = interaction.options.getString('query');
  axios({
   method: 'get',
   url: `https://who-dat.as93.net/${query}`,
   responseType: 'json',
  })
   .then(function (response) {
    const domainSearchEmbed = new EmbedBuilder()
     .setColor([255, 231, 188])
     .setTitle('Domain: ' + response.data.domain.domain + " | " + "Registrar Info")
     .addFields(
      { name: "Registrar Name:", value: response.data.registrar.name, inline: true },
      { name: "Registrar Phone:", value: response.data.registrar.phone, inline: true },
      { name: "Registrar Email:", value: response.data.registrar.email, inline: true },
      { name: "Registrar URL:", value: response.data.registrar.referral_url, inline: true },
     )
     .addFields(
      { name: "Registrar Name:", value: response.data.registrar.name, inline: true },
            { name: "Registrar Phone:", value: response.data.registrar.phone, inline: true },
            { name: "Registrar Email:", value: response.data.registrar.email, inline: true },
           { name: "Registrar URL:", value: response.data.registrar.referral_url, inline: true },
     )
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira',
      iconURL:
       'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });
    interaction.reply({ embeds: [domainSearchEmbed] });
   }).catch(err => {
   console.log(
    `Woah there has been an error with the domain search command. Here it is: 
` + err,
   );
   interaction.reply({ embeds: [errorEmbed] });
  });
 },
};
