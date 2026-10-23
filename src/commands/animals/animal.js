import { SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { fetchJson } from '../../lib/http.js';
import { againRow, card, message } from '../../lib/ui.js';

const ANIMALS = {
 cat: {
  title: '🐱 Here kitty kitty',
  credit: 'thecatapi.com',
  async fetchImage() {
   const [image] = await fetchJson('https://api.thecatapi.com/v1/images/search');
   return image.url;
  },
 },
 dog: {
  title: '🐶 Who is a good dog?',
  credit: 'dog.ceo',
  async fetchImage() {
   const data = await fetchJson('https://dog.ceo/api/breeds/image/random');
   if (data.status !== 'success') throw new Error('dog.ceo returned an error');
   return data.message;
  },
 },
};

export default {
 cooldown: 3,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('animal')
   .setDescription('Cute animal pictures')
   .addSubcommand(sub => sub.setName('cat').setDescription('A random picture of a cat'))
   .addSubcommand(sub => sub.setName('dog').setDescription('A random picture of a dog')),
 ),
 async render(interaction, [kind]) {
  const animal = ANIMALS[kind];
  return message(
   card({
    title: animal.title,
    image: await animal.fetchImage(),
    rows: [againRow('animal', [kind])],
    footer: `Photo from ${animal.credit}`,
   }),
  );
 },
 async execute(interaction) {
  await interaction.deferReply();
  await interaction.editReply(
   await this.render(interaction, [interaction.options.getSubcommand()]),
  );
 },
};
