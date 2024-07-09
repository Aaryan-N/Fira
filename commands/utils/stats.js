import {EmbedBuilder, SlashCommandBuilder} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Replies with some handy stats about the server!"),
    async execute(interaction) {
        interaction.client.cluster.fetchClientValues('guilds.cache.size')
            .then(results => {
                const parsedGuildSize = results.reduce((prev, val) => prev + val, 0)
                const owner = interaction.guild.ownerId;
                const ownerDisplayName = interaction.client.users.cache.get(owner)

                const statsEmbed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .addFields(
                            { name: "Amount of guilds the bot is currently in:", value: parsedGuildSize.toString() },
                            { name: "Owner of server:", value: ownerDisplayName.username}
                        )
                        .setTimestamp()
                        .setFooter({ text: "Sent using Inferna", iconURL: "https://cdn.discordapp.com/attachments/1126688226590085230/1260169728073404469/InfernaLogo.jpeg?ex=668e5803&is=668d0683&hm=e84b1cec8c78ae2142842ba9b7154b65d8e9801bc21f0dd4c2b7a860cf2e4d18&"})
                    interaction.reply({embeds : [statsEmbed]});
            })
            .catch(console.error);
    },
};
