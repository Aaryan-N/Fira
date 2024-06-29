const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const ticketSchema = require("../../schemas/guild/guildSchema");
const errorEmbed = require("../../templates/embeds/errors/errorEmbed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createticket")
    .setDescription("Create a ticket for mods to review!"),
  async execute(interaction) {
    try {
      if (!interaction.inGuild()) {
        interaction.reply({
          content: "This command can only be run in servers!",
          ephemeral: true,
        });
        return;
      }

      let ticketingProfile = await ticketSchema.findOne({
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      });

      const ticketingModal = new ModalBuilder()
        .setCustomId(`ticketModal-${interaction.user.id}`)
        .setTitle("Create a ticket for mods to review!");

      const ticketSubjectInput = new TextInputBuilder()
        .setCustomId("ticketInputSubject")
        .setLabel("Enter the subject of your ticket here!")
        .setStyle(TextInputStyle.Short);

      const ticketMainInput = new TextInputBuilder()
        .setCustomId("ticketInput")
        .setLabel("Enter the body of your ticket here!")
        .setStyle(TextInputStyle.Paragraph);

      const ticketSubjectInputActionRow = new ActionRowBuilder().addComponents(
        ticketSubjectInput,
      );
      const ticketMainInputActionRow = new ActionRowBuilder().addComponents(
        ticketMainInput,
      );

      ticketingModal.addComponents(ticketSubjectInputActionRow, ticketMainInputActionRow,);

      await interaction.showModal(ticketingModal);


      let ticketSubjectContent;
      let ticketMainInputContent;

      const filter = (interaction) => interaction.customId === `ticketModal-${interaction.user.id}`;

      interaction.awaitModalSubmit({ filter, time: 30_000})
          .then((modalInteraction) => {
              ticketSubjectContent = modalInteraction.field.getTextInputValue("ticketInputSubject")
              ticketMainInputContent = modalInteraction.field.getTextInputValue("ticketMainInput")
              modalInteraction.reply("Your request has been sent!")
          })

        console.log(ticketSubjectContent)
        console.log(ticketMainInputContent)

      ticketingProfile = new ticketSchema({
        userId: interaction.member.id,
        guildId: interaction.guild.id,
        ticketSubjectContent: ticketSubjectContent,
        ticketBodyContent: ticketMainInputContent,
        timeTicketCreated: interaction.createdAt,
      });
    } catch (err) {
      console.error(
        "Something went badly wrong in the ticketing command. Here it is!" +
          err,
      );
      interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
