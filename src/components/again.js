import { notice, rerender } from '../lib/ui.js';

// Generic "another one" button: customId again:<command>:<args...> re-runs the command's render().
export default {
 id: 'again',
 async execute(interaction, [commandName, ...args]) {
  const command = interaction.client.commands.get(commandName);
  if (typeof command?.render !== 'function') {
   return interaction.reply(notice.error('This button no longer works. Run the command again.'));
  }
  return rerender(interaction, () => command.render(interaction, args));
 },
};
