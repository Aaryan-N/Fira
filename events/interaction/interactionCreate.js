import { Events } from 'discord.js';
import chalk from 'chalk';

export default {
 name: Events.InteractionCreate,
 async execute(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
   console.error(chalk.redBright(`No command matching ${interaction.commandName} was found.`));
   return;
  }

  try {
   await command.default.execute(interaction);
  } catch (error) {
   console.error(chalk.redBright(error));
   if (interaction.replied || interaction.deferred) {
    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
   } else {
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
   }
  }
 },
};
