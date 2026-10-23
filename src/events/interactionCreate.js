import { Collection, Events } from 'discord.js';
import { DEFAULT_COOLDOWN_SECONDS } from '../config.js';
import { log } from '../lib/logger.js';
import { notice, respond } from '../lib/ui.js';

function cooldownRemaining(interaction, command) {
 const { cooldowns } = interaction.client;
 if (!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Collection());

 const timestamps = cooldowns.get(command.data.name);
 const duration = (command.cooldown ?? DEFAULT_COOLDOWN_SECONDS) * 1_000;
 const now = Date.now();
 const expires = (timestamps.get(interaction.user.id) ?? 0) + duration;

 if (now < expires) return expires;
 timestamps.set(interaction.user.id, now);
 setTimeout(() => timestamps.delete(interaction.user.id), duration).unref?.();
 return 0;
}

async function reportError(interaction, error, label) {
 log.error(`Error while handling ${label}:`, error);
 if (!interaction.isRepliable()) return;
 await respond(
  interaction,
  notice.error('Something went wrong while running that. Please try again in a moment.'),
 ).catch(() => {});
}

async function handleCommand(interaction) {
 const command = interaction.client.commands.get(interaction.commandName);
 if (!command) {
  log.warn(`No command matching "${interaction.commandName}"`);
  return;
 }

 const expires = cooldownRemaining(interaction, command);
 if (expires) {
  return interaction.reply(
   notice.error(
    `You can use this command again <t:${Math.ceil(expires / 1_000)}:R>.`,
    'Slow down!',
   ),
  );
 }

 try {
  await command.execute(interaction);
 } catch (error) {
  await reportError(interaction, error, `/${interaction.commandName}`);
 }
}

async function handleAutocomplete(interaction) {
 const command = interaction.client.commands.get(interaction.commandName);
 try {
  await command?.autocomplete?.(interaction);
 } catch (error) {
  log.error(`Autocomplete failed for /${interaction.commandName}:`, error);
 }
}

/** customIds are "<handler>:<action>:<args...>"; the first segment selects the handler. */
async function handleComponent(interaction) {
 const [id, ...args] = interaction.customId.split(':');
 const handler = interaction.client.components.get(id);
 if (!handler) {
  // Usually a message left over from a v1 feature that no longer exists.
  if (!interaction.deferred && !interaction.replied) {
   await interaction
    .reply(notice.error('This menu has expired. Please run the command again.', 'Expired'))
    .catch(() => {});
  }
  return;
 }
 try {
  await handler.execute(interaction, args);
 } catch (error) {
  await reportError(interaction, error, `component ${interaction.customId}`);
 }
}

export default {
 name: Events.InteractionCreate,
 async execute(interaction) {
  if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
   return handleCommand(interaction);
  }
  if (interaction.isAutocomplete()) return handleAutocomplete(interaction);
  if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
   return handleComponent(interaction);
  }
 },
};
