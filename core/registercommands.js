const { REST, Routes } = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
require('dotenv').config()

const commands = [];
const foldersPath = path.join(__dirname, "../commands");
const commandFolders= fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`WARNING - The command at ${filePath} is missing a data or execute property`);
    }
  }
}

const rest = new REST().setToken(process.env.token);

(async ()=> {
  try {
  console.log("Started refreshing application (/) commands.");
  console.log(commands);

  const data = await rest.put(Routes.applicationCommands(process.env.clientID), {
    body: commands});

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
})();
