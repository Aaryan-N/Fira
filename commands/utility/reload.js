import { SlashCommandBuilder } from 'discord.js';

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
  delete [import.meta.resolve(`../${command.default.category}/${command.default.data.name}.js`)];

  await interaction.client.commands.delete(command.default.data.name);

  const newCommand = import(`../${command.default.category}/${command.default.data.name}.js`);

  interaction.client.commands.set(newCommand.default.data.name, newCommand);
  await interaction.reply(`The command ${newCommand.default.data.name} was reloaded!`);

 },
};