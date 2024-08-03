import { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import Canvas from '@napi-rs/canvas';
import { invalidHex } from '../../templates/embeds/color/invalidHex.js';
import convert from 'color-convert';
import redBright from 'chalk';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import validator from 'validator';

export default {
 category: 'color',
 cooldown: 2,
 data: new SlashCommandBuilder().setName('colorconvert').setDescription('Convert HEX Code to other color types!').addStringOption(option =>
  option.setName('hexcolor').setDescription('Enter a hex code to be converted to other types!').setRequired(true).setMinLength(6),
 ),
 async execute(interaction) {
  try {
   const query = interaction.options.getString('hexcolor');
   if (validator.isHexColor(query) === false) {
     interaction.reply({ embeds: [invalidHex] })
   }
   const canvas = Canvas.createCanvas(200, 200);
   const context = canvas.getContext('2d');

   const rgb = convert.hex.rgb(query);
   const hsl = convert.hex.hsl(query);
   const cmyk = convert.hex.cmyk(query);

   context.strokeStyle = query;
   context.fillStyle = query;

   context.strokeRect(0, 0, canvas.width, canvas.height);
   context.fillRect(0, 0, canvas.width, canvas.height);

   const attachment = new AttachmentBuilder(await canvas.encode('png'), {
    name: 'color-convert-fira.png',
   });

   const randomColorEmbed = new EmbedBuilder()
    .setColor([255, 231, 188])
    .setTitle('Converted Color')
    .addFields({ name: 'Hex Code:', value: query, inline:true },
     { name: 'RGB Code:', value: rgb.toString(), inline:true },
     { name: 'HSL Code:', value: hsl.toString(), inline: true },
     { name: 'CMYK Code:', value: cmyk.toString(), inline: true })
    .setTimestamp()
    .setFooter({
     text: 'Sent using Fira',
     iconURL:
      'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
    });
   interaction.reply({ embeds: [randomColorEmbed], files: [attachment] });
  } catch (err) {
   console.log(
    redBright('Woah there has been an error with the random color command. Here it is: \n' + err),
   );
   await interaction.reply({ embeds: [errorEmbed] });
  }
 },}
