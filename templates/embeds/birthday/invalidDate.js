import { EmbedBuilder } from 'discord.js';

export const invalidDate = new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('The value you have entered is not a valid date! Please try again.')
  .setTimestamp()
  .setFooter({
    text: 'Sent using Inferna',
    iconURL: 'https://cdn.discordapp.com/attachments/1126688226590085230/1260169728073404469/InfernaLogo.jpeg?ex=668e5803&is=668d0683&hm=e84b1cec8c78ae2142842ba9b7154b65d8e9801bc21f0dd4c2b7a860cf2e4d18&',
  });