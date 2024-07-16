import { bold, codeBlock, EmbedBuilder } from 'discord.js';

export const funMenuHelp = new EmbedBuilder()
 .setColor([255, 231, 188])
 .setTitle('Fun Commands 😁')
 .setFields(
  { name: bold(codeBlock('/8ball')), value: 'Ask the 8 Ball a question! Thanks to eightballapi.com!' },
  { name: bold(codeBlock('/dadjoke')), value: 'A (slight corny) dadjoke!' },
  { name: bold(codeBlock('/fact')), value: 'An interesting fact 🧐' },
  { name: bold(codeBlock('/joke')), value: 'A more funny joke!' },
  { name: bold(codeBlock('/memes')), value: 'An alright meme.' },
  { name: bold(codeBlock('/rps')), value: 'Play a game of rock,paper,scissors with Fira!' },
 )
 .setTimestamp()
 .setFooter({
  text: 'Sent using Fira',
  iconURL: 'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
 });