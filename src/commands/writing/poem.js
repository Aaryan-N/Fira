import { SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { truncate } from '../../lib/format.js';
import { fetchJson } from '../../lib/http.js';
import { againRow, card, message } from '../../lib/ui.js';

const MAX_LINES = 40;

export default {
 cooldown: 3,
 data: everywhere(
  new SlashCommandBuilder().setName('poem').setDescription('A random classic poem'),
 ),
 async render() {
  const poems = await fetchJson('https://poetrydb.org/random/10');
  const poem = poems.find(item => Number(item.linecount) <= MAX_LINES) ?? poems[0];
  const lines = poem.lines.slice(0, MAX_LINES).join('\n');
  const more = poem.lines.length > MAX_LINES ? '\n*…*' : '';

  return message(
   card({
    title: `📜 ${truncate(poem.title, 200)}`,
    description: `*by ${poem.author}*\n\n${truncate(lines, 3_400)}${more}`,
    rows: [againRow('poem')],
    footer: 'Poems from poetrydb.org',
   }),
  );
 },
 async execute(interaction) {
  await interaction.deferReply();
  await interaction.editReply(await this.render());
 },
};
