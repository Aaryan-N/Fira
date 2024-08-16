import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';
import redBright from 'chalk';

export default {
 category: 'fun',
 cooldown: 5,
 data: new SlashCommandBuilder()
  .setName('fact')
  .setDescription('Replies with a fact!')
  .addStringOption(option =>
   option
    .setName('type')
    .setRequired(true)
    .setDescription('Type of fact!')
    .addChoices(
     { name: 'Random', value: 'random' },
     { name: 'Cat', value: 'cat' },
     { name: 'Dog', value: 'dog' },
    ),
  ),
 async execute(interaction) {
  try {
   const typeOfFact = interaction.options.getString('type');
   if (typeOfFact === 'random') {
    axios({
     method: 'get',
     url: 'https://uselessfacts.jsph.pl/api/v2/facts/random',
     responseType: 'json',
    })
     .then(function(response) {
      const factsEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .addFields({ name: 'Fact', value: response.data.text })
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });
      interaction.reply({ embeds: [factsEmbed] });
     })
     .catch(err => {
      console.log(
       redBright(
        `Woah there has been an error with the facts command. Here it is: 
` + err,
       ),
      );
      interaction.reply({ embeds: [errorEmbed] });
     });
   } else if (typeOfFact === 'cat') {
    axios({
     method: 'get',
     url: 'https://cat-fact.herokuapp.com/facts/random?animal_type=cat',
     responseType: 'json',
    })
     .then(function(response) {
      const catFactsEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .addFields({ name: 'Cat Fact', value: response.data.text })
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira, thanks to alexwohlbruck.github.io',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });
      interaction.reply({ embeds: [catFactsEmbed] });
     })
     .catch(err => {
      console.log(
       redBright(
        `Woah there has been an error with the facts command. Here it is: 
` + err,
       ),
      );
      interaction.reply({ embeds: [errorEmbed] });
     });
   } else if (typeOfFact === 'dog') {
    axios({
     method: 'get',
     url: 'https://cat-fact.herokuapp.com/facts/random?animal_type=dog',
     responseType: 'json',
    })
     .then(function(response) {
      const dogFactsEmbed = new EmbedBuilder()
       .setColor([255, 231, 188])
       .addFields({ name: 'Fact', value: response.data.text })
       .setTimestamp()
       .setFooter({
        text: 'Sent using Fira, thanks to alexwohlbruck.github.io',
        iconURL:
         'https://cdn.discordapp.com/attachments/1171358299409617011/1260485101905645568/FiraLogo.jpeg?ex=668f7dba&is=668e2c3a&hm=7c023e2a9df44ca40816a976179870f3b55941196a431c537a5768a330690032&',
       });
      interaction.reply({ embeds: [dogFactsEmbed] });
     })
     .catch(err => {
      console.log(
       redBright(
        `Woah there has been an error with the facts command. Here it is: 
` + err,
       ),
      );
      interaction.reply({ embeds: [errorEmbed] });
     });
   } else {
    interaction.reply({ embeds: [errorEmbed] });
   }
  } catch (e) {
   console.log(
    `Woah there has been an error with the facts command. Here it is: 
 ` + err,
   );
   interaction.reply({ embeds: [errorEmbed] });
  }
 },
};
