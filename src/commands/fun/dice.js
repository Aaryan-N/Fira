import { SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { randomBetween } from '../../lib/random.js';
import { againRow, card, message } from '../../lib/ui.js';

export default {
 cooldown: 2,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('dice')
   .setDescription('Roll some dice')
   .addIntegerOption(option =>
    option
     .setName('sides')
     .setDescription('Sides per die (default 6)')
     .setMinValue(2)
     .setMaxValue(1000),
   )
   .addIntegerOption(option =>
    option
     .setName('count')
     .setDescription('How many dice (default 1)')
     .setMinValue(1)
     .setMaxValue(20),
   ),
 ),
 render(interaction, [sidesArg, countArg]) {
  const sides = Number(sidesArg) || 6;
  const count = Number(countArg) || 1;
  const rolls = Array.from({ length: count }, () => randomBetween(1, sides));
  const total = rolls.reduce((sum, roll) => sum + roll, 0);

  return message(
   card({
    title: `🎲 Rolled ${count}d${sides}`,
    fields: [
     count > 1 && { name: 'Rolls', value: rolls.map(roll => `\`${roll}\``).join(' ') },
     { name: count > 1 ? 'Total' : 'Result', value: `**${total}**` },
    ],
    rows: [againRow('dice', [sides, count], { label: 'Roll again' })],
   }),
  );
 },
 async execute(interaction) {
  await interaction.reply(
   this.render(interaction, [
    interaction.options.getInteger('sides'),
    interaction.options.getInteger('count'),
   ]),
  );
 },
};
