import { ComponentType, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import { domainSearchRow } from '../../templates/actionRows/domains/domainSearchActionRow.js';
import { expiredDomainHelp } from '../../templates/embeds/domain/expiredDomainHelp.js';
import { domainInvalidUrl } from '../../templates/embeds/domain/invalidUrl.js';
import validator from 'validator';
import { domainInactiveUrl } from '../../templates/embeds/domain/inactiveUrl.js';
import redBright from 'chalk';

function isValidUrl(str) {
 return validator.isURL(str);
}

export default {
 category: 'domain',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('domainsearch')
  .setDescription('Lookup a domain using WHOIS')
  .addStringOption(option =>
   option.setName('query').setDescription('Domain to WHOIS Lookup! (example.com)').setRequired(true),
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
      let registrantOrganization;
      let registrantEmail;
      let registrantStreet;
      let registrantCity;
      let registrantCountry;
      let registrantProvince;
      let registrantPostalCode;
      let registrantPhone;

      if (response.data.registrant === undefined) {
       registrantName = 'None Provided';
       registrantOrganization = 'None Provided';
       registrantEmail = 'None Provided';
       registrantStreet = 'None Provided';
       registrantCity = 'None Provided';
       registrantProvince = 'None Provided';
       registrantPostalCode = 'None Provided';
       registrantPhone = 'None Provided';
       registrantCountry = 'None Provided';
      } else {
       if (response.data.registrant.name === undefined) {
        registrantName = 'None provided';
       } else {
        registrantName = response.data.registrant.name;
       }


       if (response.data.registrant.organization === undefined) {
        registrantOrganization = 'None provided';
       } else {
        registrantOrganization = response.data.registrant.organization;
       }
       if (response.data.registrant.email === undefined) {
        registrantEmail = 'None provided';
       } else {
        registrantEmail = response.data.registrant.email;
       }


       if (response.data.registrant.street === undefined) {
        registrantStreet = 'None provided';
       } else {
        registrantStreet = response.data.registrant.street;
       }


       if (response.data.registrant.city === undefined) {
        registrantCity = 'None provided';
       } else {
        registrantCity = response.data.registrant.city;
       }

       if (response.data.registrant.country === undefined) {
        registrantCountry = 'None provided';
       } else {
        registrantCountry = response.data.registrant.country;
       }


       if (response.data.registrant.province === undefined) {
        registrantProvince = 'None provided';
       } else {
        registrantProvince = response.data.registrant.province;
       }


       if (response.data.registrant.postal_code === undefined) {
        registrantPostalCode = 'None provided';
       } else {
        registrantPostalCode = response.data.registrant.postal_code;
       }


       if (response.data.registrant.phone === undefined) {
        registrantPhone = 'None provided';
       } else {
        registrantPhone = response.data.registrant.phone;
       }
      }
      // ---------------------------------------------------------------------------
      let administrativeName;
      let administrativeStreet;
      let administrativeOrganization;
      let administrativeEmail;
      let administrativeCity;
      let administrativeProvince;
      let administrativePostalCode;
      let administrativePhone;
      let administrativeCountry;

      if (response.data.administrative === undefined) {
       administrativeName = 'None Provided';
       administrativeStreet = 'None Provided';
       administrativeOrganization = 'None Provided';
       administrativeEmail = 'None Provided';
       administrativeCity = 'None Provided';
       administrativeProvince = 'None Provided';
       administrativePostalCode = 'None Provided';
       administrativePhone = 'None Provided';
       administrativeCountry = 'None Provided';
      } else {
       if (response.data.administrative.name === undefined) {
        administrativeName = 'None provided';
       } else {
        administrativeName = response.data.administrative.name;
       }


       if (response.data.administrative.street === undefined) {
        administrativeStreet = 'None provided';
       } else {
        administrativeStreet = response.data.administrative.street;
       }

       if (response.data.administrative.country === undefined) {
        administrativeCountry = 'None provided';
       } else {
        administrativeCountry = response.data.administrative.country;
       }


       if (response.data.administrative.organization === undefined) {
        administrativeOrganization = 'None provided';
       } else {
        administrativeOrganization = response.data.administrative.organization;
       }


       if (response.data.administrative.email === undefined) {
        administrativeEmail = 'None provided';
       } else {
        administrativeEmail = response.data.administrative.email;
       }


       if (response.data.administrative.city === undefined) {
        administrativeCity = 'None provided';
       } else {
        administrativeCity = response.data.administrative.city;
       }


       if (response.data.administrative.province === undefined) {
        administrativeProvince = 'None provided';
       } else {
        administrativeProvince = response.data.administrative.province;
       }


       if (response.data.administrative.postal_code === undefined) {
        administrativePostalCode = 'None provided';
       } else {
        administrativePostalCode = response.data.administrative.postal_code;
       }


       if (response.data.administrative.phone === undefined) {
        administrativePhone = 'None provided';
       } else {
        administrativePhone = response.data.administrative.phone;
       }
      }
      // -------------------------------------------------------------------------------
      let technicalName;
      let technicalStreet;
      let technicalOrganization;
      let technicalEmail;
      let technicalCity;
      let technicalProvince;
      let technicalPostalCode;
      let technicalPhone;
      let technicalCountry;

      if (response.data.technical === undefined) {
       technicalName = 'None provided';
       technicalStreet = 'None provided';
       technicalOrganization = 'None provided';
       technicalEmail = 'None provided';
       technicalCity = 'None provided';
       technicalProvince = 'None provided';
       technicalPostalCode = 'None provided';
       technicalPhone = 'None provided';
       technicalCountry = 'None provided';
      } else {
       if (response.data.technical.name === undefined) {
        technicalName = 'None provided';
       } else {
        technicalName = response.data.technical.name;
       }


       if (response.data.technical.street === undefined) {
        technicalStreet = 'None provided';
       } else {
        technicalStreet = response.data.technical.street;
       }


       if (response.data.technical.organization === undefined) {
        technicalOrganization = 'None provided';
       } else {
        technicalOrganization = response.data.technical.organization;
       }


       if (response.data.technical.email === undefined) {
        technicalEmail = 'None provided';
       } else {
        technicalEmail = response.data.technical.email;
       }


       if (response.data.technical.city === undefined) {
        technicalCity = 'None provided';
       } else {
        technicalCity = response.data.technical.city;
       }


       if (response.data.technical.province === undefined) {
        technicalProvince = 'None provided';
       } else {
        technicalProvince = response.data.technical.province;
       }


       if (response.data.technical.postal_code === undefined) {
        technicalPostalCode = 'None provided';
       } else {
        technicalPostalCode = response.data.technical.postal_code;
       }

       if (response.data.technical.country === undefined) {
        technicalCountry = 'None provided';
       } else {
        technicalCountry = response.data.technical.country;
       }


       if (response.data.technical.phone === undefined) {
        technicalPhone = 'None provided';
       } else {
        technicalPhone = response.data.technical.phone;
       }
      }
      // ------------------------------------------------------------------------------
      let registrarName;
      let registrarPhone;
      let registrarEmail;
      let registrarUrl;

      if (response.data.registrar === undefined) {
       registrarName = 'None Provided';
       registrarPhone = 'None Provided';
       registrarEmail = 'None Provided';
       registrarUrl = 'None Provided';
      } else {
       if (response.data.registrar.name === undefined) {
        registrarName = 'None provided';
       } else {
        registrarName = response.data.registrar.name;
       }


       if (response.data.registrar.phone === undefined) {
        registrarPhone = 'None provided';
       } else {
        registrarPhone = response.data.registrar.phone;
       }


       if (response.data.registrar.email === undefined) {
        registrarEmail = 'None provided';
       } else {
        registrarEmail = response.data.registrar.email;
       }

       if (response.data.registrar.referral_url === undefined) {
        registrarUrl = 'None provided';
       } else {
        registrarUrl = response.data.registrar.referral_url;
       }
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
        { name: 'Registrar Name:', value: registrarName },
        { name: 'Registrar Phone:', value: registrarPhone },
        { name: 'Registrar Email:', value: registrarEmail },
        { name: 'Registrar URL:', value: registrarUrl },
       )
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });

      const domainRegistrantAddress = registrantStreet + ', ' + registrantCity + ', ' + registrantProvince + ', ' + registrantPostalCode + ' ' + registrantCountry;

      const domainRegistrantEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Domain: ' + response.data.domain.domain + ' | ' + 'Registrant Info')
       .addFields(
        { name: 'Registrant Name:', value: registrantName },
        { name: 'Registrant Organization:', value: registrantOrganization },
        { name: 'Registrant Address:', value: domainRegistrantAddress },
        { name: 'Registrant Phone:', value: registrantPhone, inline: true },
        { name: 'Registrant Email:', value: registrantEmail, inline: true },
       )
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });

      const domainAdministrativeAddress = administrativeStreet + ', ' + administrativeCity + ', ' + administrativeProvince + ', ' + administrativePostalCode + ' ' + administrativeCountry;

      const domainAdministrativeEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Domain: ' + response.data.domain.domain + ' | ' + 'Administrator Info')
       .addFields(
        { name: 'Adminstrator Name:', value: administrativeName },
        { name: 'Adminstrator Organization:', value: administrativeOrganization },
        { name: 'Adminstrator Address:', value: domainAdministrativeAddress },
        { name: 'Adminstrator Phone:', value: administrativePhone, inline: true },
        { name: 'Adminstrator Email:', value: administrativeEmail, inline: true },
       )
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });

      const domainTechnicalAddress = technicalStreet + ', ' + technicalCity + ', ' + technicalProvince + ', ' + technicalPostalCode + ' ' + technicalCountry;

      const domainTechnicalEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .setTitle('Domain: ' + response.data.domain.domain + ' | ' + 'Technical Info')
       .addFields(
        { name: 'Technical Adminstrator Name:', value: technicalName },
        { name: 'Technical Adminstrator Organization:', value: technicalOrganization },
        { name: 'Technical Adminstrator Address:', value: domainTechnicalAddress },
        { name: 'Technical Adminstrator Phone:', value: technicalPhone, inline: true },
        { name: 'Technical Adminstrator Email:', value: technicalEmail, inline: true },
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

      collector.on('end', collected => {
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
      console.log(
       redBright('Woah there has been an error with the domain search command. Here it is: \n' + err),
      );
      interaction.reply({ embeds: [errorEmbed] });
     }
    });
   } else {
    interaction.reply({ embeds: [domainInvalidUrl], ephemeral: true });
   }
  } catch (err) {
   console.log(
    redBright('Woah there has been an error with the domain search command. Here it is: \n' + err),
   );
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
