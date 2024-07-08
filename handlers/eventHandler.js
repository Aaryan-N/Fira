import path from "path";
import fs from "node:fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export const eventHandler = (client) => {
    const eventsFoldersPath = path.join(__dirname, '../events/');
    const eventFolders = fs.readdirSync(eventsFoldersPath);

    for (const folder of eventFolders) {
        const eventsPath = path.join(eventsFoldersPath, folder);
        const eventFiles= fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"))
        for (const file of eventFiles) {
            const eventFile = path.join(eventsPath, file);
            const event = require(eventFile);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}

