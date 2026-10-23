import { ChannelType } from 'discord.js';
import { ageOn, birthdayMatchers, utcDateKey } from '../lib/dates.js';
import { log } from '../lib/logger.js';
import { card, message } from '../lib/ui.js';
import { Birthday } from '../models/Birthday.js';
import { GuildConfig } from '../models/GuildConfig.js';

const CHECK_INTERVAL_MS = 15 * 60_000;

function ordinal(value) {
 const suffix = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
 return `${value}${suffix[new Intl.PluralRules('en-US', { type: 'ordinal' }).select(value)]}`;
}

async function announceForGuild(client, config, today) {
 const birthdays = await Birthday.find({ guildId: config.guildId, $or: birthdayMatchers(today) });
 if (!birthdays.length) return;

 const channel = await client.channels.fetch(config.birthdayChannel).catch(() => null);
 if (!channel || ![ChannelType.GuildText, ChannelType.GuildAnnouncement].includes(channel.type)) {
  log.warn(`Birthday channel ${config.birthdayChannel} missing in guild ${config.guildId}`);
  return;
 }

 const lines = birthdays.map(birthday => {
  const age = ageOn(birthday, today);
  return `🎂 <@${birthday.userId}>${age ? `, happy ${ordinal(age)}!` : ''}`;
 });

 await channel.send(
  message(
   card({
    title: '🎉 Happy birthday!',
    description: `Wishing a wonderful day to:\n${lines.join('\n')}`,
    footer: 'Register yours with /birthday set',
   }),
   { allowedMentions: { users: birthdays.map(birthday => birthday.userId) } },
  ),
 );
}

/** Posts birthday announcements once per UTC day for every guild on this cluster. */
export async function runBirthdayCheck(client) {
 const today = new Date();
 const key = utcDateKey(today);
 const configs = await GuildConfig.find({
  guildId: { $in: [...client.guilds.cache.keys()] },
  birthdayChannel: { $ne: '' },
  lastBirthdayAnnouncement: { $ne: key },
 });

 for (const config of configs) {
  // Claim the day atomically so restarts or overlapping runs never double-post.
  const claim = await GuildConfig.updateOne(
   { _id: config._id, lastBirthdayAnnouncement: { $ne: key } },
   { $set: { lastBirthdayAnnouncement: key } },
  );
  if (!claim.modifiedCount) continue;
  await announceForGuild(client, config, today).catch(error =>
   log.error(`Birthday announcement failed for guild ${config.guildId}:`, error),
  );
 }
}

export function startBirthdayScheduler(client) {
 const run = () =>
  runBirthdayCheck(client).catch(error => log.error('Birthday check failed:', error));
 run();
 return setInterval(run, CHECK_INTERVAL_MS);
}
