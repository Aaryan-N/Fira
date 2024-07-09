import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import axios from "axios";
import {errorEmbed} from "../../templates/embeds/errors/errorEmbed.js";

export default {
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Play a game of 8 ball!")
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("Ask the 8 Ball what you want!")
                .setRequired(true),
        )
        .addBooleanOption(option => option.setName('lucky').setDescription("Feeling lucky? Set this to true!")),

    async execute(interaction) {
        const userLuckyChoice = interaction.options.get("lucky")?.value;
        const userBallQuery = interaction.options.getString("query");
        const formattedUserBallQuery = userBallQuery.replace(/ /g, '+')

        axios({
            method: "get",
            url: `https://eightballapi.com/api?question=${formattedUserBallQuery}&lucky=${userLuckyChoice}`,
            responseType: "json",
        })
            .then(function (response) {
                const ballEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle("8 Ball")
                    .addFields(
                        { name: "The 8 Ball's verdict:" , value: response.data.reading },
                    )
                    .setTimestamp()
                    .setFooter({ text: "Sent using Inferna", iconURL: "https://cdn.discordapp.com/attachments/1126688226590085230/1260169728073404469/InfernaLogo.jpeg?ex=668e5803&is=668d0683&hm=e84b1cec8c78ae2142842ba9b7154b65d8e9801bc21f0dd4c2b7a860cf2e4d18&" })
                interaction.reply({embeds : [ballEmbed]});

            })
            .catch((err) => {
                console.log(
                    `Woah there has been an error with the 8 ball command. Here it is: 
` + err,
                )
                interaction.editReply({ embeds: [errorEmbed] });
            });
    },
};
