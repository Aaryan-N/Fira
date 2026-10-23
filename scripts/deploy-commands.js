// Registers slash/context-menu commands with Discord.
//   npm run deploy           -> dev guild (GUILDID), updates instantly
//   npm run deploy:global    -> every server and user install
//   npm run deploy -- --clear  (or deploy:global -- --clear) removes all commands at that scope
import { REST, Routes } from 'discord.js';
import { requireEnv } from '../src/config.js';
import { loadCommands } from '../src/lib/loader.js';
import { log } from '../src/lib/logger.js';

const flags = new Set(process.argv.slice(2));
const isGlobal = flags.has('--global');
const clear = flags.has('--clear');

requireEnv('TOKEN', 'CLIENTID', ...(isGlobal ? [] : ['GUILDID']));

const commands = await loadCommands();
const body = clear
 ? []
 : [...commands.values()].map(command => {
    const json = command.data.toJSON();
    // Guild-scoped commands are always guild-installed; install/context settings only apply globally.
    if (!isGlobal) {
     delete json.integration_types;
     delete json.contexts;
    }
    return json;
   });

const rest = new REST().setToken(process.env.TOKEN);
const route = isGlobal
 ? Routes.applicationCommands(process.env.CLIENTID)
 : Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID);
const scope = isGlobal ? 'global' : `guild ${process.env.GUILDID}`;

log.info(`${clear ? 'Clearing' : `Deploying ${body.length}`} ${scope} commands…`);
const result = await rest.put(route, { body });
log.ok(`${clear ? 'Cleared' : `Deployed ${result.length}`} ${scope} commands`);
