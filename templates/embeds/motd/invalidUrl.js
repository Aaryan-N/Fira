import { EmbedBuilder } from 'discord.js';

export const invalidUrl = new EmbedBuilder()
  .setColor([255, 231, 188])
  .setTitle('The value you have entered is not a valid URL! Please try again.')
  .setTimestamp()
  .setFooter({
    text: 'Sent using Fira',
    iconURL: 'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
  });