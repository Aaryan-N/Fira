import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getInfo } from 'discord-hybrid-sharding';

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
 },
};
