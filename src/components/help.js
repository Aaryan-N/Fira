import { helpMessage } from '../commands/utility/help.js';
import { rerender } from '../lib/ui.js';

export default {
 id: 'help',
 async execute(interaction, [action]) {
  if (action !== 'category' || !interaction.isStringSelectMenu()) return;
  return rerender(interaction, () => helpMessage(interaction.client, interaction.values[0]));
 },
};
