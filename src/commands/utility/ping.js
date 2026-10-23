import { SlashCommandBuilder } from 'discord.js';
import { BRAND } from '../../config.js';
import { everywhere } from '../../lib/commands.js';
import { card, message } from '../../lib/ui.js';

function rating(ms) {
 if (ms < 150) return { emoji: '🟢', color: BRAND.success };
 if (ms < 400) return { emoji: '🟡', color: BRAND.warning };
 return { emoji: '🔴', color: BRAND.danger };
}

export default {
 cooldown: 5,
 data: everywhere(new SlashCommandBuilder().setName('ping').setDescription("Check Fira's latency")),
 async execute(interaction) {
  const started = Date.now();
  await interaction.deferReply();
  const roundTrip = Date.now() - started;
  const gateway = interaction.client.ws.ping;
  const { emoji, color } = rating(Math.max(roundTrip, gateway));

  await interaction.editReply(
   message(
    card({
     title: `${emoji} Pong!`,
     color,
     fields: [
      { name: 'Round trip', value: `${roundTrip} ms`, inline: true },
      {
       name: 'Gateway heartbeat',
       value: gateway >= 0 ? `${gateway} ms` : 'Measuring…',
       inline: true,
      },
      { name: 'Shard', value: `#${interaction.guild?.shardId ?? 0}`, inline: true },
     ],
    }),
   ),
  );
 },
};
