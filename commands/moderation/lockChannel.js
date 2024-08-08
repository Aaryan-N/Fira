import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import validator from 'validator';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import { invalidServer } from '../../templates/embeds/motd/invalidServer.js';
import { invalidUrl } from '../../templates/embeds/motd/invalidUrl.js';
import redBright from 'chalk';

function isValidUrl(str) {
 return validator.isURL(str);
}

export default {
 category: 'minecraft',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('motd')
  .setDescription('Checks the message of the day of a minecraft server!')
  .addStringOption(option =>
   option
    .setName('serveraddress')
    .setDescription('The address of the server (url or ip)')
    .setRequired(true),
  ),
 async execute(interaction) {
  try {
    
 } catch (e) {
   console.log("fweah")
  }
 }
 };
