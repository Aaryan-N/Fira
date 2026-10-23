import { SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { fetchJson } from '../../lib/http.js';
import { againRow, card, message } from '../../lib/ui.js';

export default {
 cooldown: 3,
 data: everywhere(new SlashCommandBuilder().setName('quote').setDescription('An inspiring quote')),
 async render() {
  const [quote] = await fetchJson('https://zenquotes.io/api/random');
  return message(
   card({
    title: '💬 Quote',
    description: `> ${quote.q}\n\n— **${quote.a}**`,
    rows: [againRow('quote')],
    footer: 'Inspirational quotes provided by zenquotes.io',
   }),
  );
 },
 async execute(interaction) {
  await interaction.deferReply();
  await interaction.editReply(await this.render());
 },
};
