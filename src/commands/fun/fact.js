import { SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { fetchJson } from '../../lib/http.js';
import { againRow, card, message } from '../../lib/ui.js';

const SOURCES = {
 random: {
  title: '🧠 Random fact',
  credit: 'uselessfacts.jsph.pl',
  fetch: async () =>
   (await fetchJson('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en')).text,
 },
 cat: {
  title: '🐱 Cat fact',
  credit: 'catfact.ninja',
  fetch: async () => (await fetchJson('https://catfact.ninja/fact')).fact,
 },
 dog: {
  title: '🐶 Dog fact',
  credit: 'dogapi.dog',
  fetch: async () =>
   (await fetchJson('https://dogapi.dog/api/v2/facts?limit=1')).data[0].attributes.body,
 },
};

export default {
 cooldown: 3,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('fact')
   .setDescription('Learn something new')
   .addStringOption(option =>
    option
     .setName('type')
     .setDescription('What kind of fact?')
     .addChoices(
      { name: 'Random', value: 'random' },
      { name: 'Cat', value: 'cat' },
      { name: 'Dog', value: 'dog' },
     ),
   ),
 ),
 async render(interaction, [typeArg]) {
  const type = typeArg in SOURCES ? typeArg : 'random';
  const source = SOURCES[type];
  return message(
   card({
    title: source.title,
    description: await source.fetch(),
    rows: [againRow('fact', [type])],
    footer: `Fact from ${source.credit}`,
   }),
  );
 },
 async execute(interaction) {
  await interaction.deferReply();
  await interaction.editReply(
   await this.render(interaction, [interaction.options.getString('type')]),
  );
 },
};
