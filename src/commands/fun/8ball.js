import { SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { truncate } from '../../lib/format.js';
import { EIGHT_BALL_ANSWERS, LUCKY_ANSWERS } from '../../lib/games.js';
import { pick } from '../../lib/random.js';
import { card, message } from '../../lib/ui.js';

export default {
 cooldown: 3,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('8ball')
   .setDescription('Ask the magic 8-ball a question')
   .addStringOption(option =>
    option
     .setName('question')
     .setDescription('What do you want to know?')
     .setRequired(true)
     .setMaxLength(256),
   )
   .addBooleanOption(option =>
    option.setName('lucky').setDescription('Feeling lucky? Only positive answers'),
   ),
 ),
 async execute(interaction) {
  const question = interaction.options.getString('question', true);
  const lucky = interaction.options.getBoolean('lucky') ?? false;
  await interaction.reply(
   message(
    card({
     title: '🎱 Magic 8-Ball',
     fields: [
      { name: 'Question', value: truncate(question, 256) },
      { name: 'Answer', value: `**${pick(lucky ? LUCKY_ANSWERS : EIGHT_BALL_ANSWERS)}**` },
     ],
     footer: lucky ? 'Lucky mode 🍀' : undefined,
    }),
   ),
  );
 },
};
