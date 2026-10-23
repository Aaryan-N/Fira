import { RPS_CHOICES } from '../lib/games.js';
import { rerender } from '../lib/ui.js';
import { playRound } from '../commands/fun/rps.js';

export default {
 id: 'rps',
 async execute(interaction, [action, choice]) {
  if (action !== 'play' || !(choice in RPS_CHOICES)) return;
  return rerender(interaction, () => playRound(choice));
 },
};
