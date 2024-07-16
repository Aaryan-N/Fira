import {
 ActionRowBuilder,
 ModalBuilder,
 SlashCommandBuilder,
 TextInputBuilder,
 TextInputStyle,
} from 'discord.js';
import { ticketSchemaExport } from '../../schemas/ticketing/ticketSchema.js';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

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

   const filter = interaction => interaction.customId === 'ticketModal';
   interaction
    .awaitModalSubmit({ filter, time: 30_000 })
    .then(interaction => {
     interaction.reply({
      content: 'Your ticket was successfully created!',
      ephemeral: true,
     });
     modalSubjectContent = interaction.fields.getTextInputValue('ticketInputSubject');
     modalMainContent = interaction.fields.getTextInputValue('ticketInputMain');
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
     //TODO Change this to go to mongo db instead
     const channelTicketConfig = interaction.channel.id;
     const channel = interaction.client.channels.cache.get(channelTicketConfig);
     await channel.send('Nsdfs');
    })
    .catch(console.error);
  } catch (err) {
   console.error('Something went badly wrong in the ticketing command. Here it is!' + err);
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
