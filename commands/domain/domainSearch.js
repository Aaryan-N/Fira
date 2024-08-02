import { ComponentType, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import { domainSearchRow } from '../../templates/actionRows/domains/domainSearchActionRow.js';
import { expiredDomainHelp } from '../../templates/embeds/domain/expiredDomainHelp.js';
import { domainInvalidUrl } from '../../templates/embeds/domain/invalidUrl.js';
import validator from 'validator';
import { domainInactiveUrl } from '../../templates/embeds/domain/inactiveUrl.js';

function isValidUrl(str) {
 return validator.isURL(str);
}

export default {
 category: 'domain',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('domainsearch')
  .setDescription('Rasssss')
  .addStringOption(option =>
   option.setName('query').setDescription('Domain to search! (example.com)').setRequired(true),
  ),
 async execute(interaction) {
  try {
   const query = interaction.options.getString('query');

   if (isValidUrl(query) === true) {
    axios({
     method: 'get',
     url: `https://fira-whois.vercel.app/${query}`,
     responseType: 'json',
    })
     .then(async function(response) {
      let registrantName;
      if (response.data.registrant.name === undefined) {
       registrantName = 'None provided';
      } else {
       registrantName = response.data.registrant.name;
      }

      let registrantStreet;
      if (response.data.registrant.street === undefined) {
       registrantStreet = 'None provided';
      } else {
       registrantStreet = response.data.registrant.street;
      }

      let registrantCity;
      if (response.data.registrant.city === undefined) {
       registrantCity = 'None provided';
      } else {
       registrantCity = response.data.registrant.city;
      }

      let registrantProvince;
      if (response.data.registrant.province === undefined) {
       registrantProvince = 'None provided';
      } else {
       registrantProvince = response.data.registrant.province;
      }

      let registrantPostalCode;
      if (response.data.registrant.postal_code === undefined) {
       registrantPostalCode = 'None provided';
      } else {
       registrantPostalCode = response.data.registrant.postal_code;
      }

      let registrantPhone;
      if (response.data.registrant.phone === undefined) {
       registrantPhone = 'None provided';
      } else {
       registrantPhone = response.data.registrant.phone;
      }

      // ---------------------------------------------------------------------------
      let administrativeName;
      if (response.data.administrative.name === undefined) {
       administrativeName = 'None provided';
      } else {
       administrativeName = response.data.administrative.name;
      }

      let administrativeStreet;
      if (response.data.administrative.street === undefined) {
       administrativeStreet = 'None provided';
      } else {
       administrativeStreet = response.data.administrative.street;
      }

      let administrativeCity;
      if (response.data.administrative.city === undefined) {
       administrativeCity = 'None provided';
      } else {
       administrativeCity = response.data.administrative.city;
      }

      let administrativeProvince;
      if (response.data.administrative.province === undefined) {
       administrativeProvince = 'None provided';
      } else {
       administrativeProvince = response.data.administrative.province;
      }

      let administrativePostalCode;
      if (response.data.administrative.postal_code === undefined) {
       administrativePostalCode = 'None provided';
      } else {
       administrativePostalCode = response.data.administrative.postal_code;
      }

      let administrativePhone;
      if (response.data.administrative.phone === undefined) {
       administrativePhone = 'None provided';
      } else {
       administrativePhone = response.data.administrative.phone;
      }

      // -------------------------------------------------------------------------------
      let technicalName;
      if (response.data.technical.name === undefined) {
       technicalName = 'None provided';
      } else {
       technicalName = response.data.technical.name;
      }

      let technicalStreet;
      if (response.data.technical.street === undefined) {
       technicalStreet = 'None provided';
      } else {
       technicalStreet = response.data.technical.street;
      }

      let technicalCity;
      if (response.data.technical.city === undefined) {
       technicalCity = 'None provided';
      } else {
       technicalCity = response.data.technical.city;
      }

      let technicalProvince;
      if (response.data.technical.province === undefined) {
       technicalProvince = 'None provided';
      } else {
       technicalProvince = response.data.technical.province;
      }

      let technicalPostalCode;
      if (response.data.technical.postal_code === undefined) {
       technicalPostalCode = 'None provided';
      } else {
       technicalPostalCode = response.data.technical.postal_code;
      }

      let technicalPhone;
      if (response.data.technical.phone === undefined) {
       technicalPhone = 'None provided';
      } else {
       technicalPhone = response.data.technical.phone;
      }
      // -------------------------------------------------------------------------------

      let nameserverList = '';

      for (let index = 0; index < response.data.domain.name_servers.length; index++) {
       nameserverList += response.data.domain.name_servers[index] + '\n';
      }

      const domainMainMenu = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Pick any one of the below categories to learn more about: ' + response.data.domain.domain)
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL: 'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });

      const domainNameserverEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Domain: ' + response.data.domain.domain + ' | ' + 'Nameserver Info')
       .addFields(
        { name: 'Nameserver:', value: nameserverList },
       )
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });

      const domainDatesEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Domain: ' + response.data.domain.domain + ' | ' + 'Date Info')
       .addFields(
        { name: 'Created Date:', value: response.data.domain.created_date },
        { name: 'Updated Date:', value: response.data.domain.updated_date },
        { name: 'Expiration Date:', value: response.data.domain.expiration_date },
       )
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });

      const domainRegistrarEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Domain: ' + response.data.domain.domain + ' | ' + 'Registrar Info')
       .addFields(
        { name: 'Registrar Name:', value: response.data.registrar.name },
        { name: 'Registrar Phone:', value: response.data.registrar.phone },
        { name: 'Registrar Email:', value: response.data.registrar.email },
        { name: 'Registrar URL:', value: response.data.registrar.referral_url },
       )
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });

      const domainRegistrantAddress = registrantStreet + ', ' + registrantCity + ', ' + registrantProvince + ', ' + registrantPostalCode + ' ' + response.data.registrant.country;

      const domainRegistrantEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Domain: ' + response.data.domain.domain + ' | ' + 'Registrant Info')
       .addFields(
        { name: 'Registrant Name:', value: registrantName },
        { name: 'Registrant Organization:', value: response.data.registrant.organization },
        { name: 'Registrar Address:', value: domainRegistrantAddress },
        { name: 'Registrar Phone:', value: registrantPhone, inline: true },
        { name: 'Registrar Email:', value: response.data.registrant.email, inline: true },
       )
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });

      const domainAdministrativeAddress = administrativeStreet + ', ' + administrativeCity + ', ' + administrativeProvince + ', ' + administrativePostalCode + ' ' + response.data.administrative.country;

      const domainAdministrativeEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Domain: ' + response.data.domain.domain + ' | ' + 'Administrator Info')
       .addFields(
        { name: 'Adminstrator Name:', value: administrativeName },
        { name: 'Adminstrator Organization:', value: response.data.administrative.organization },
        { name: 'Adminstrator Address:', value: domainAdministrativeAddress },
        { name: 'Adminstrator Phone:', value: administrativePhone, inline: true },
        { name: 'Adminstrator Email:', value: response.data.administrative.email, inline: true },
       )
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });

      const domainTechnicalAddress = technicalStreet + ', ' + technicalCity + ', ' + technicalProvince + ', ' + technicalPostalCode + ' ' + response.data.technical.country;

      const domainTechnicalEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Domain: ' + response.data.domain.domain + ' | ' + 'Technical Info')
       .addFields(
        { name: 'Technical Adminstrator Name:', value: technicalName },
        { name: 'Technical Adminstrator Organization:', value: response.data.technical.organization },
        { name: 'Technical Adminstrator Address:', value: domainTechnicalAddress },
        { name: 'Technical Adminstrator Phone:', value: technicalPhone, inline: true },
        { name: 'Technical Adminstrator Email:', value: response.data.technical.email, inline: true },
       )
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });


      // ---------------------------------------------------------------------------------

      const domainSearchResponse = await interaction.reply({
       embeds: [domainMainMenu],
       components: [domainSearchRow],
      });

      const collectorFilter = i => i.user.id === interaction.user.id;

      const collector = await domainSearchResponse.createMessageComponentCollector({
       components: ComponentType.StringSelect,
       filter: collectorFilter,
       idle: 60_000,
       time: 1_20_000,
      });

      collector.on('collect', async interact => {
       const selection = interact.values[0];
       if (selection === 'nameserver') {
        await interact.update({ embeds: [domainNameserverEmbed], components: [domainSearchRow] });
       } else if (selection === 'dates') {
        await interact.update({ embeds: [domainDatesEmbed], components: [domainSearchRow] });
       } else if (selection === 'registrar') {
        await interact.update({ embeds: [domainRegistrarEmbed], components: [domainSearchRow] });
       } else if (selection === 'registrant') {
        await interact.update({ embeds: [domainRegistrantEmbed], components: [domainSearchRow] });
       } else if (selection === 'administrative') {
        await interact.update({ embeds: [domainAdministrativeEmbed], components: [domainSearchRow] });
       } else if (selection === 'technical') {
        await interact.update({ embeds: [domainTechnicalEmbed], components: [domainSearchRow] });
       }
      });

      collector.on('end', async collected => {
       const collectedMap = collected.map(x => x);
       const channelId = collectedMap[0].message.channelId;
       const messageId = collectedMap[0].message.id;
       interaction.client.channels.fetch(channelId).then(channel => {
        channel.messages.edit(messageId, { embeds: [expiredDomainHelp], components: [] });
       });
      });
     }).catch(err => {
     if (err.code === 'ERR_BAD_RESPONSE') {
      interaction.reply({ embeds: [domainInactiveUrl], ephemeral: true });
     } else {
      console.log(err);
     }
    });
   } else {
    interaction.reply({ embeds: [domainInvalidUrl], ephemeral: true });
   }
  } catch (err) {
   console.log(`Woah there has been an error with the domain search command. Here it is:` + err);
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
