import { SlashCommandBuilder } from 'discord.js';
import { colorSwatch } from '../../lib/canvas.js';
import { describeColor, parseColor, randomRgb } from '../../lib/color.js';
import { everywhere } from '../../lib/commands.js';
import { againRow, card, message, notice } from '../../lib/ui.js';

async function colorMessage(rgb, { title, again }) {
 const color = describeColor(rgb);
 const swatch = await colorSwatch(rgb, color.hex);
 return message(
  card({
   title,
   color: color.int,
   thumbnail: `attachment://${swatch.name}`,
   fields: [
    { name: 'Hex', value: `\`${color.hex}\``, inline: true },
    { name: 'RGB', value: `\`${color.rgb}\``, inline: true },
    { name: 'HSL', value: `\`${color.hsl}\``, inline: true },
    { name: 'HSV', value: `\`${color.hsv}\``, inline: true },
    { name: 'CMYK', value: `\`${color.cmyk}\``, inline: true },
    { name: 'Closest name', value: color.name, inline: true },
    { name: 'Integer', value: `\`${color.int}\``, inline: true },
   ],
   rows: again ? [againRow('color', ['random'], { label: 'Another colour', emoji: '🎨' })] : [],
  }),
  { files: [swatch] },
 );
}

export default {
 cooldown: 2,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('color')
   .setDescription('Colour tools')
   .addSubcommand(sub => sub.setName('random').setDescription('Generate a random colour'))
   .addSubcommand(sub =>
    sub
     .setName('convert')
     .setDescription('Convert a colour between formats')
     .addStringOption(option =>
      option
       .setName('value')
       .setDescription('A hex code (#ffe7bc, #fc0) or RGB values (255, 231, 188)')
       .setRequired(true)
       .setMaxLength(32),
     ),
   ),
 ),
 render(interaction, [mode]) {
  if (mode === 'random')
   return colorMessage(randomRgb(), { title: '🎨 Random colour', again: true });
  throw new Error(`Unknown color render mode: ${mode}`);
 },
 async execute(interaction) {
  if (interaction.options.getSubcommand() === 'random') {
   return interaction.reply(await this.render(interaction, ['random']));
  }

  const input = interaction.options.getString('value', true);
  const rgb = parseColor(input);
  if (!rgb) {
   return interaction.reply(
    notice.error(
     'Try a hex code like `#ffe7bc` or `#fc0`, or RGB values like `255, 231, 188`.',
     "That doesn't look like a colour",
    ),
   );
  }
  return interaction.reply(await colorMessage(rgb, { title: '🎨 Colour converter' }));
 },
};
