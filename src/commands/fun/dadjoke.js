import { SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { fetchJson } from '../../lib/http.js';
import { againRow, card, message } from '../../lib/ui.js';

export default {
 cooldown: 3,
 data: everywhere(
  new SlashCommandBuilder().setName('dadjoke').setDescription('A (slightly corny) dad joke'),
 ),
 async render() {
  const { joke } = await fetchJson('https://icanhazdadjoke.com/');
  return message(
   card({
    title: '👨 Dad joke',
    description: joke,
    rows: [againRow('dadjoke', [], { label: 'Groan, another' })],
    footer: 'Jokes from icanhazdadjoke.com',
   }),
  );
 },
 async execute(interaction) {
  await interaction.deferReply();
  await interaction.editReply(await this.render());
 },
};
