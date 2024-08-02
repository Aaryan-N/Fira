import {
 ActionRowBuilder,
 EmbedBuilder,
 ModalBuilder,
 SlashCommandBuilder,
 TextInputBuilder,
 TextInputStyle,
} from 'discord.js';
import { ticketSchemaExport } from '../../schemas/ticketing/ticketSchema.js';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import { configSchemaExport } from '../../schemas/config/configSchema.js';
import { unConfiguredTicketChannel } from '../../templates/embeds/ticketing/errors/unConfiguredTicketChannel.js';

export default {
 category: 'ticket',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('createticket')
  .setDescription('Create a ticket for mods to review!'),
 async execute(interaction) {
  try {
   if (!interaction.inGuild()) {
    interaction.reply({
     content: 'This command can only be run in servers!',
     ephemeral: true,
    });
    return;
   }

   let ticketingProfile = await ticketSchemaExport.findOne({
    userId: interaction.member.id,
    guildId: interaction.guild.id,
   });

   const ticketingModal = new ModalBuilder()
    .setCustomId(`ticketModal`)
    .setTitle('Create a ticket for mods to review!');

   const ticketSubjectInput = new TextInputBuilder()
    .setCustomId('ticketInputSubject')
    .setLabel('Enter the subject of your ticket here!')
    .setStyle(TextInputStyle.Short);

   const ticketMainInput = new TextInputBuilder()
    .setCustomId('ticketInputMain')
    .setLabel('Enter the body of your ticket here!')
    .setStyle(TextInputStyle.Paragraph);

   const ticketSubjectInputActionRow = new ActionRowBuilder().addComponents(ticketSubjectInput);
   const ticketMainInputActionRow = new ActionRowBuilder().addComponents(ticketMainInput);

   ticketingModal.addComponents(ticketSubjectInputActionRow, ticketMainInputActionRow);

   interaction.showModal(ticketingModal);

   let modalSubjectContent;
   let modalMainContent;
   let guildConfigProfile = await configSchemaExport.findOne({
    guildId: interaction.guild.id,
   });

   const filter = interaction => interaction.customId === 'ticketModal';
   interaction
    .awaitModalSubmit({ filter, time: 30_000 })
    .then(async interaction => {
     modalSubjectContent = interaction.fields.getTextInputValue('ticketInputSubject');
     modalMainContent = interaction.fields.getTextInputValue('ticketInputMain');
     if (guildConfigProfile.ticketChannel === '') {
      interaction.reply({ embeds: [unConfiguredTicketChannel], ephemeral: true });
      throw new Error('unConfigChannel');
     }
     interaction.reply({
      content: 'Your ticket was successfully created!',
      ephemeral: true,
     });
    })
    .then(() => {
     ticketingProfile = new ticketSchemaExport({
      userId: interaction.member.id,
      guildId: interaction.guild.id,
      ticketSubjectContent: modalSubjectContent,
      ticketBodyContent: modalMainContent,
      timeTicketCreated: interaction.createdAt,
      isOpen: true,
     });
     ticketingProfile.save();
    })
    .then(async () => {
     const channelTicketConfig = guildConfigProfile.ticketChannel;
     const channel = interaction.client.channels.cache.get(channelTicketConfig);
     const ticketEmbed = new EmbedBuilder()
      .setTitle('Ticket')
      .setTimestamp()
      .setFooter({
       text: 'Sent using Fira',
       iconURL:
        'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
      });

     channel.send('Skbidi will be mine');
    }).catch((err) => {
    if (err.message === 'unConfigChannel') {
    }
   });
  } catch (err) {
   if (err.message === 'unConfigChannel') {
    return;
   }
   console.error('Something went badly wrong in the ticketing command. Here it is!' + err);
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
