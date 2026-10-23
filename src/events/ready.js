import { ActivityType, Events, PresenceUpdateStatus } from 'discord.js';
import { log } from '../lib/logger.js';
import { startBirthdayScheduler } from '../services/birthdays.js';

export default {
 name: Events.ClientReady,
 once: true,
 async execute(client) {
  client.user.setPresence({
   status: PresenceUpdateStatus.Online,
   activities: [{ name: 'custom', type: ActivityType.Custom, state: '✨ /help to get started' }],
  });

  // Cache global command IDs so help menus can render clickable </command:id> mentions.
  await client.application.commands
   .fetch()
   .catch(error => log.warn('Could not fetch application commands:', error.message));

  startBirthdayScheduler(client);
  log.ok(`Ready as ${client.user.tag} in ${client.guilds.cache.size} guilds`);
 },
};
