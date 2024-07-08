import { SlashCommandBuilder, EmbedBuilder} from "discord.js";
import axios from 'axios';
import {errorEmbed} from "../../templates/embeds/errors/errorEmbed.js";
import redBright from 'chalk';
export default {
    data: new SlashCommandBuilder()
        .setName("fact")
        .setDescription("Replies with a fact!"),
    async execute(interaction) {
        axios({
            method: 'get',
            url: 'https://uselessfacts.jsph.pl/api/v2/facts/random',
            responseType: 'json'
        })
            .then(function (response) {
                const factsEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .addFields(
                        { name: "Fact", value: response.data.text },
                    )
                    .setTimestamp()
                    .setFooter({ text: "Sent using Inferna" })
                interaction.reply({embeds : [factsEmbed]});
            }).catch((err) => {
            console.log(redBright(
                `Woah there has been an error with the facts command. Here it is: 
` + err,
            ));
            interaction.reply({ embeds: [errorEmbed] });
        });

    },
};
