import {Collection} from "discord.js";
import path from "path";
import fs from "node:fs";
import chalk from 'chalk';
import fileUrl from "file-url";

const __dirname = import.meta.dirname;

export const commandHandler = async (client) => {
    client.commands = new Collection();
    const foldersPath = path.join(__dirname, `../commands/`);
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = fileUrl(path.join(commandsPath, file));
            const command = await import(filePath);
            if ('data' in command.default && 'execute' in command.default) {
                client.commands.set(command.default.data.name, command);
            } else {
                console.log(chalk.redBright(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`));
            }
        }
    }
}
