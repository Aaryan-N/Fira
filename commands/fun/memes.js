import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import axios from 'axios';
import { errorEmbed } from '../../templates/embeds/errors/errorEmbed.js';

export default {
 data: new SlashCommandBuilder().setName('memes').setDescription('Replies with an alright meme'),
 async execute(interaction) {
  axios({
   method: 'get',
   url: 'https://meme-api.com/gimme?nsfw=false',
   responseType: 'json',
  })
   .then(function (response) {
    const memesEmbed = new EmbedBuilder()
     .setColor(0x0099ff)
     .setTitle(response.data.title)
     .setURL(response.data.postLink)
     .setImage(response.data.url)
     .setTimestamp()
     .setFooter({
      text: 'Sent using Inferna',
      iconURL:
       'https://cdn.discordapp.com/attachments/1126688226590085230/1260169728073404469/InfernaLogo.jpeg?ex=668e5803&is=668d0683&hm=e84b1cec8c78ae2142842ba9b7154b65d8e9801bc21f0dd4c2b7a860cf2e4d18&',
     });
    interaction.reply({ embeds: [memesEmbed] });
   })
   .catch(err => {
    console.log(
     `Woah there has been an error with the message of the day command. Here it is: 
` + err,
    );
    interaction.editReply({ embeds: [errorEmbed] });
   });
 },
};
