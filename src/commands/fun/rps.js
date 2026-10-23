import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js';
import { BRAND } from '../../config.js';
import { everywhere } from '../../lib/commands.js';
import { capitalize } from '../../lib/format.js';
import { RPS_CHOICES, rpsOutcome } from '../../lib/games.js';
import { pick } from '../../lib/random.js';
import { card, message } from '../../lib/ui.js';

const OUTCOMES = {
 win: { title: '🏆 You won!', color: BRAND.success },
 lose: { title: '💀 You lost!', color: BRAND.danger },
 draw: { title: "🤝 It's a draw!", color: BRAND.muted },
};

export function choiceRow() {
 return new ActionRowBuilder().addComponents(
  Object.entries(RPS_CHOICES).map(([choice, { emoji }]) =>
   new ButtonBuilder()
    .setCustomId(`rps:play:${choice}`)
    .setLabel(capitalize(choice))
    .setEmoji(emoji)
    .setStyle(ButtonStyle.Primary),
  ),
 );
}

export function playRound(player) {
 const computer = pick(Object.keys(RPS_CHOICES));
 const outcome = OUTCOMES[rpsOutcome(player, computer)];
 return message(
  card({
   title: outcome.title,
   color: outcome.color,
   fields: [
    { name: 'You', value: `${RPS_CHOICES[player].emoji} ${capitalize(player)}`, inline: true },
    { name: 'Fira', value: `${RPS_CHOICES[computer].emoji} ${capitalize(computer)}`, inline: true },
   ],
   rows: [choiceRow()],
   footer: 'Pick again to play another round',
  }),
 );
}

export default {
 cooldown: 2,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('rps')
   .setDescription('Play rock, paper, scissors against Fira')
   .addStringOption(option =>
    option
     .setName('choice')
     .setDescription('Skip the buttons and play straight away')
     .addChoices(
      Object.keys(RPS_CHOICES).map(choice => ({ name: capitalize(choice), value: choice })),
     ),
   ),
 ),
 async execute(interaction) {
  const choice = interaction.options.getString('choice');
  if (choice) return interaction.reply(playRound(choice));
  return interaction.reply(
   message(
    card({
     title: '🪨📄✂️ Rock, paper, scissors',
     description: 'Make your move!',
     rows: [choiceRow()],
    }),
   ),
  );
 },
};
