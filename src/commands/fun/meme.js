import { ActionRowBuilder, SlashCommandBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { formatNumber, truncate } from '../../lib/format.js';
import { fetchJson } from '../../lib/http.js';
import { againRow, card, linkButton, message } from '../../lib/ui.js';

const SUBREDDITS = ['memes', 'wholesomememes', 'me_irl', 'ProgrammerHumor', 'dankmemes'];

async function fetchSafeMeme(subreddit) {
 // meme-api returns a batch; keep only posts that are neither NSFW nor spoilers.
 const { memes } = await fetchJson(`https://meme-api.com/gimme/${subreddit}/10`);
 const meme = memes?.find(post => !post.nsfw && !post.spoiler && post.url);
 if (!meme) throw new Error(`No safe memes returned for r/${subreddit}`);
 return meme;
}

export default {
 cooldown: 3,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('meme')
   .setDescription('A fresh meme from Reddit')
   .addStringOption(option =>
    option
     .setName('subreddit')
     .setDescription('Where to look')
     .addChoices(SUBREDDITS.map(name => ({ name: `r/${name}`, value: name }))),
   ),
 ),
 async render(interaction, [subredditArg]) {
  const subreddit = SUBREDDITS.includes(subredditArg) ? subredditArg : 'memes';
  const meme = await fetchSafeMeme(subreddit);
  return message(
   card({
    title: truncate(meme.title, 200),
    image: meme.url,
    rows: [
     againRow('meme', [subreddit]),
     new ActionRowBuilder().addComponents(linkButton('View on Reddit', meme.postLink)),
    ],
    footer: `r/${meme.subreddit} • u/${meme.author} • ⬆️ ${formatNumber(meme.ups)}`,
   }),
  );
 },
 async execute(interaction) {
  await interaction.deferReply();
  await interaction.editReply(
   await this.render(interaction, [interaction.options.getString('subreddit')]),
  );
 },
};
