import { SlashCommandBuilder } from 'discord.js';

export default {
 data: new SlashCommandBuilder().setName('help').setDescription('Replies with information about the bot!'),
 async execute(interaction) {
  await interaction.reply('Hey there champ we are still setting up here!');
 },
};
