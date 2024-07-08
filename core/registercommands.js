import { REST } from "discord.js";
import Routes from 'discord.js'
import path from "node:path";
import fs from "node:fs";
import chalk from "chalk";
import 'dotenv/config'
import fileUrl from "file-url";
const __dirname = import.meta.dirname;

const commands = [];
const foldersPath = path.join(__dirname, "../commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = fileUrl(path.join(commandsPath, file));
    const command = await import(filePath);
    if ("data" in command.default && "execute" in command.default) {
      commands.push(command.default.data.toJSON());
    } else {
      console.log(chalk.redBright(`WARNING - The command at ${filePath} is missing a data or execute property`));
    }
  }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.TOKEN), {body: commands});

    console.log("Successfully reloaded application (/) commands.");

  } catch (error) {
    console.error(chalk.redBright(error));
  }
})();
