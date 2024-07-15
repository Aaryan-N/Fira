import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import Canvas, { GlobalFonts } from '@napi-rs/canvas';
import { request } from 'undici';

export default {
 data: new SlashCommandBuilder().setName('canvas').setDescription('yup canvas'),
 async execute(interaction) {
  const canvas = Canvas.createCanvas(700, 250);
  const context = canvas.getContext('2d');
  const background = await Canvas.loadImage('./wallpaper.jpg');
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  context.strokeStyle = '#FFE7BC';

  context.strokeRect(0, 0, canvas.width, canvas.height);

  const { body } = await request(interaction.user.displayAvatarURL({ extension: 'jpg' }));
  const avatar = await Canvas.loadImage(await body.arrayBuffer());

  context.drawImage(avatar, 25, 25, 200, 200);
  context.beginPath();
  context.arc(125, 125, 100, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();

  const attachment = new AttachmentBuilder(await canvas.encode('png'), {
   name: 'profile-image.png',
  });
  interaction.reply({ files: [attachment] });
 },
};
