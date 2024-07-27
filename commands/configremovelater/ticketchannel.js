import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { configSchemaExport } from '../../schemas/config/configSchema.js';
import redBright from 'chalk';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'ticketconfig',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('ticketconfig')
  .setDescription('Register the ticket config!')
  .addChannelOption(option =>
   option
    .setName('channel')
   .setDescription('The channel to echo into')
  .setRequired(true)
  ),
 async execute(interaction) {
    const userChannel = interaction.options.getChannel("channel")
    const userChannelId = userChannel.id;
    const guildId = interaction.guild.id;

  let guildConfigProfile = await configSchemaExport.findOne({
   guildId: guildId,
  })

  if (guildConfigProfile) {
   guildConfigProfile.ticketChannel = userChannelId;
   await guildConfigProfile.save();
   interaction.reply("Call John Pork. Mr Beast just bought Ohio.")
  }
  }
};
