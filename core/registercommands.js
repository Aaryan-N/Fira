import { REST, Routes } from "discord.js";
import path from "node:path";
import fs from "node:fs";
require('dotenv').config()

dotenv.config();

const rest = new REST({ version: "10" }).setToken(process.env.token);

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders= fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(commandPath, folder);
  const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.name, command);
    } else {
      console.log(
          `WARNING - The command at ${filePath} is missing a data or execute property`,
      );
    }
  }
}



try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.clientID), {
    body: helpCommand,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
