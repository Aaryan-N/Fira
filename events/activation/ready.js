import { Events, PresenceUpdateStatus } from 'discord.js';
import chalk from 'chalk';
import 'dotenv/config';

export default {
 name: Events.ClientReady,
 once: true,
 execute(client) {
  client.user.setStatus(PresenceUpdateStatus.DoNotDisturb);
  console.log(chalk.greenBright(
   'Client ready as ' +
   client.user.username + '!',
  ));
 },
};

