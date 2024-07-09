import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import { getInfo } from 'discord-hybrid-sharding'
import chalk from "chalk";

export default {
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Replies with some information about Inferna!"),
    async execute(interaction) {
        const statsPromises = [
            interaction.client.cluster.fetchClientValues('guilds.cache.size'),
            interaction.client.cluster.fetchClientValues('channels.cache.size')
        ]

        Promise.all(statsPromises).then((results) => {
            const guildServed = results[0].reduce((firstValueInArray, otherVals) => firstValueInArray + otherVals)
            const channelsServed = results[1].reduce((firstValueInArray, otherVals) => firstValueInArray + otherVals)
        const statsEmbed = new EmbedBuilder()
                .setTitle("About Me!")
                .setColor(0x0099FF)
                .setAuthor({
                    name: 'navygood12',
                    iconURL: 'https://cdn.discordapp.com/avatars/652433042153144321/1f214c012718abc36181d4c88ac75e0b.webp?size=100'
                })
                .addFields(
                    {name: "Amount of guilds Inferna is currently in:", value: guildServed.toString() },
                    {name: "Amount of shards active:", value: getInfo().TOTAL_SHARDS.toString()},
                    {name: "Amount of channels being served:", value: channelsServed.toString()},
                    {name: "Owner of Inferna:", value: "navygood12"}
                )
                .setFooter({
                    text: "Made with 💖 and mostly tears with discord.js",
                    iconURL: "https://i.imgur.com/AfFp7pu.png"
                })
            interaction.reply({embeds: [statsEmbed]});})
    },}

