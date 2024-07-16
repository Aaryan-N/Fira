import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import 'dotenv/config';
import fileUrl from 'file-url';

const __dirname = import.meta.dirname;

const commands = [];
const foldersPath = path.join(__dirname, '../commands/');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
 const commandsPath = path.join(foldersPath, folder);
 const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
 for (const file of commandFiles) {
  const filePath = fileUrl(path.join(commandsPath, file));
  const command = await import(filePath);
  commands.push(command.default.data.toJSON());
 }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
 try {
  console.log(`Started refreshing ${commands.length} application (/) commands.`);

  const data = await rest.put(
   Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
   { body: commands },
  );

  console.log(`Successfully reloaded ${data.length} application (/) commands.`);
 } catch (error) {
  console.error(chalk.redBright(error));
 }
})();
