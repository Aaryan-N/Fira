import { SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { randomBetween } from '../../lib/random.js';
import { againRow, card, message } from '../../lib/ui.js';

export default {
 cooldown: 2,
 data: everywhere(new SlashCommandBuilder().setName('coinflip').setDescription('Flip a coin')),
 render() {
  const heads = randomBetween(0, 1) === 0;
  return message(
   card({
    title: heads ? '🪙 Heads!' : '🪙 Tails!',
    description: `The coin landed on **${heads ? 'heads' : 'tails'}**.`,
    rows: [againRow('coinflip', [], { label: 'Flip again' })],
   }),
  );
 },
 async execute(interaction) {
  await interaction.reply(this.render());
 },
};
