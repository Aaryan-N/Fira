import { REST, Routes } from "discord.js";
import { helpCommand } from "../commands/helpCommand.js";
import dotenv from "dotenv";

dotenv.config();

const rest = new REST({ version: "10" }).setToken(process.env.token);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.clientID), {
    body: helpCommand,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}
