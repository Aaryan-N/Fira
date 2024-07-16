import { Collection, EmbedBuilder, Events } from 'discord.js';
import chalk from 'chalk';


export default {
 name: Events.InteractionCreate,
 async execute(interaction) {
  if (!interaction.isChatInputCommand()) return;
  const { cooldowns } = interaction.client;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
   console.error(chalk.redBright(`No command matching ${interaction.commandName} was found.`));
   return;
  }

  if (!cooldowns.has(command.default.data.name)) {
   cooldowns.set(command.default.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.default.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount = (command.default.cooldown ?? defaultCooldownDuration) * 1_000;

  if (timestamps.has(interaction.user.id)) {
   const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

   if (now < expirationTime) {
    const expiredTimestamp = Math.round(expirationTime / 1_000);
    const cooldownEmbed = new EmbedBuilder()
     .setColor(0xFF0000)
     .setTitle(`Please wait, you are on a cooldown!. You can use it again <t:${expiredTimestamp}:R>.`)
     .setTimestamp()
     .setFooter({
      text: 'Sent using Fira',
      iconURL: 'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
     });
    return interaction.reply({ embeds: [cooldownEmbed], ephemeral: true });
   }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);


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
