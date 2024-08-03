import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import Canvas from '@napi-rs/canvas';
import { request } from 'undici';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 category: 'fun',
 cooldown: 5,
 data: new SlashCommandBuilder().setName('canvas').setDescription('yup canvas'),
 async execute(interaction) {
  try {
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
 } catch(e) {
   console.log(
    `Woah there has been an error with the canvas command. Here it is: 
 ` + err,
   );
   interaction.reply({ embeds: [errorEmbed] });
 }
},};
