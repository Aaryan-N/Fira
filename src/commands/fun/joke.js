import { SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { fetchJson } from '../../lib/http.js';
import { againRow, card, message } from '../../lib/ui.js';

const CATEGORIES = ['Any', 'Programming', 'Misc', 'Pun', 'Spooky', 'Christmas'];

export default {
 cooldown: 3,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('joke')
   .setDescription('A random (safe for work) joke')
   .addStringOption(option =>
    option
     .setName('category')
     .setDescription('Pick a joke category')
     .addChoices(CATEGORIES.map(category => ({ name: category, value: category }))),
   ),
 ),
 async render(interaction, [categoryArg]) {
  const category = CATEGORIES.includes(categoryArg) ? categoryArg : 'Any';
  const joke = await fetchJson(`https://v2.jokeapi.dev/joke/${category}?safe-mode`);
  if (joke.error) throw new Error(joke.message);

  const text = joke.type === 'twopart' ? `${joke.setup}\n\n||${joke.delivery}||` : joke.joke;
  return message(
   card({
    title: `😂 ${joke.category} joke`,
    description: text,
    rows: [againRow('joke', [category])],
    footer: 'Jokes from jokeapi.dev',
   }),
  );
 },
 async execute(interaction) {
  await interaction.deferReply();
  await interaction.editReply(
   await this.render(interaction, [interaction.options.getString('category')]),
  );
 },
};
