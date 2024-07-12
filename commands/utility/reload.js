import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import chalk from 'chalk';

export default {
 data: new SlashCommandBuilder()
  .setName('reload')
  .setDescription('Reloads a command.')
  .addStringOption(option =>
   option.setName('command')
    .setDescription('The command to reload.')
    .setRequired(true)),
 async execute(interaction) {

  const commandName = interaction.options.getString('command', true).toLowerCase();
  const command = interaction.client.commands.get(commandName);

  if (!command) {
   return interaction.reply(`There is no command with name ${commandName}!`);
  }

   delete import.meta.cache[import.meta.resolve(`../commands/${command.default.category}/${command.default.data.name}.js`)];

   interaction.client.cluster.commands.delete(command.default.data.name);
   const newCommand = require(`../commands/${command.default.category}/${command.default.data.name}.js`);

   interaction.client.cluster.commands.set(newCommand.default.data.name, newCommand);
   await interaction.reply(`The command ${newCommand.default.data.name} was reloaded!`);

 },
};