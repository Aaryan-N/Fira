import {
 ActionRowBuilder,
 ApplicationCommandOptionType,
 ApplicationCommandType,
 SlashCommandBuilder,
 StringSelectMenuBuilder,
} from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { env } from '../../config.js';
import { inviteUrl } from '../../lib/invite.js';
import { card, linkButton, message } from '../../lib/ui.js';

export const CATEGORIES = {
 fun: { label: 'Fun & games', emoji: '🎉', description: 'Games, jokes, memes and the 8-ball' },
 animals: { label: 'Animals', emoji: '🐾', description: 'Cute cats and dogs' },
 writing: { label: 'Writing', emoji: '✍️', description: 'Poems and quotes' },
 economy: { label: 'Economy', emoji: '💰', description: 'Coins, dailies and leaderboards' },
 birthday: { label: 'Birthdays', emoji: '🎂', description: 'Birthday reminders and announcements' },
 tickets: { label: 'Tickets', emoji: '🎫', description: 'Private support tickets' },
 color: { label: 'Colours', emoji: '🎨', description: 'Colour conversion and inspiration' },
 domain: { label: 'Domains', emoji: '🌐', description: 'Domain registration lookups' },
 minecraft: { label: 'Minecraft', emoji: '⛏️', description: 'Server status checks' },
 utility: { label: 'Utility', emoji: '🧰', description: 'Info about Fira, servers and users' },
 admin: { label: 'Admin', emoji: '⚙️', description: 'Server configuration' },
};

function mention(client, name, subcommand) {
 const full = subcommand ? `${name} ${subcommand}` : name;
 const id = client.application?.commands.cache.find(command => command.name === name)?.id;
 return id ? `</${full}:${id}>` : `\`/${full}\``;
}

function describeCommand(client, command) {
 const json = command.data.toJSON();
 if (json.type === ApplicationCommandType.User)
  return [`**${json.name}**: right-click a user → *Apps*`];
 if (json.type === ApplicationCommandType.Message)
  return [`**${json.name}**: right-click a message → *Apps*`];

 const subcommands = (json.options ?? []).filter(
  option => option.type === ApplicationCommandOptionType.Subcommand,
 );
 if (!subcommands.length) return [`${mention(client, json.name)}: ${json.description}`];
 return subcommands.map(sub => `${mention(client, json.name, sub.name)}: ${sub.description}`);
}

function categoryOf(command) {
 return command.category in CATEGORIES ? command.category : 'utility';
}

function menuRow(selected) {
 return new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
   .setCustomId('help:category')
   .setPlaceholder('Browse a category')
   .addOptions(
    { label: 'Overview', value: 'overview', emoji: '🏠', default: selected === 'overview' },
    ...Object.entries(CATEGORIES).map(([value, { label, emoji, description }]) => ({
     label,
     value,
     emoji,
     description,
     default: selected === value,
    })),
   ),
 );
}

function linksRow(client) {
 const buttons = [
  linkButton('Add Fira', inviteUrl(client.user.id), '➕'),
  linkButton('Source code', 'https://github.com/Aaryan-N/Fira', '💻'),
 ];
 if (env.supportUrl) buttons.push(linkButton('Support server', env.supportUrl, '🛟'));
 return new ActionRowBuilder().addComponents(buttons);
}

export function helpMessage(client, selected = 'overview') {
 const commands = [...client.commands.values()];

 if (selected !== 'overview' && CATEGORIES[selected]) {
  const { label, emoji, description } = CATEGORIES[selected];
  const lines = commands
   .filter(command => categoryOf(command) === selected)
   .flatMap(command => describeCommand(client, command));
  return message(
   card({
    title: `${emoji} ${label}`,
    description: `${description}\n\n${lines.join('\n') || 'No commands here yet.'}`,
    rows: [menuRow(selected), linksRow(client)],
   }),
  );
 }

 const counts = Object.entries(CATEGORIES)
  .map(([key, { label, emoji }]) => [
   label,
   emoji,
   commands.filter(command => categoryOf(command) === key).length,
  ])
  .filter(([, , count]) => count)
  .map(([label, emoji, count]) => `${emoji} **${label}** (${count})`);

 return message(
  card({
   title: '✨ Fira help',
   description:
    'Fira is a friendly all-rounder: games, an economy, birthdays, tickets and handy tools.\n' +
    'Pick a category below to see its commands.',
   thumbnail: client.user.displayAvatarURL({ size: 128 }),
   fields: [{ name: 'Categories', value: counts.join('\n') }],
   rows: [menuRow('overview'), linksRow(client)],
  }),
 );
}

export default {
 cooldown: 3,
 data: everywhere(
  new SlashCommandBuilder().setName('help').setDescription('Browse everything Fira can do'),
 ),
 async execute(interaction) {
  await interaction.reply(helpMessage(interaction.client));
 },
};
