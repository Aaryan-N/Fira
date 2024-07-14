import { EmbedBuilder, codeBlock, bold } from 'discord.js';

export const animalMenuHelp = new EmbedBuilder()
 .setColor([255, 231, 188])
 .setTitle('Animal Commands 🐕')
 .setDescription('A bunch of commands that are related to the cute animals we love!')
 .setFields(
  { name: bold(codeBlock("/catPictures")),value:"Sends a picture of a cute cat! Thanks to thecatapi.com"},
  {name: bold(codeBlock("/dogPictures")),value:"Sends a picture of a cute dog! Thanks to the dog.ceo"}
 )
 .setTimestamp()
 .setFooter({
  text: 'Sent using Fira',
  iconURL: 'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
 });