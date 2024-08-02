import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import Canvas from '@napi-rs/canvas';
import { rando } from '@nastyox/rando.js';
import convert from 'color-convert';

export default {
 category: 'color',
 cooldown: 5,
 data: new SlashCommandBuilder().setName('randomcolor').setDescription('A random color'),
 async execute(interaction) {
  const canvas = Canvas.createCanvas(200, 200);
  const context = canvas.getContext('2d');

  const redRgb = rando(255);
  const blueRgb = rando(255);
  const greenRbg = rando(255);

  const randoFill = convert.rgb.hex([redRgb, blueRgb, greenRbg]);
  const hslRandoFill = convert.rgb.hsl([redRgb, blueRgb, greenRbg]);
  const cmykRandoFill = convert.rgb.cmyk([redRgb, blueRgb, greenRbg]);

  context.strokeStyle = '#' + randoFill;
  context.fillStyle = '#' + randoFill;

  context.strokeRect(0, 0, canvas.width, canvas.height);
  context.fillRect(0, 0, canvas.width, canvas.height);

  const attachment = new AttachmentBuilder(await canvas.encode('png'), {
   name: 'random-color.png',
  });

  const randomColorEmbed = new EmbedBuilder()
   .setColor([255, 231, 188])
   .setTitle('Random Color')
   .addFields({ name: 'Hex Code:', value: '#' + randoFill, inline: true },
    { name: 'RGB Code:', value: redRgb + ' ' + blueRgb + ' ' + greenRbg, inline: true },
    { name: 'HSL Code:', value: hslRandoFill.toString(), inline: true },
    { name: 'CMYK Code:', value: cmykRandoFill.toString(), inline: true })
   .setTimestamp()
   .setFooter({
    text: 'Sent using Fira',
    iconURL:
     'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
   });
  interaction.reply({ embeds: [randomColorEmbed], files: [attachment] });
 },
};
