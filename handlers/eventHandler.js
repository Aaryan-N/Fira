import path from "path";
import fs from "node:fs";
import fileUrl from 'file-url';

const __dirname = import.meta.dirname;


export const eventHandler = async (client) => {
    const eventsFoldersPath = path.join(__dirname, '../events/');
    const eventFolders = fs.readdirSync(eventsFoldersPath);

    for (const folder of eventFolders) {
        const eventsPath = path.join(eventsFoldersPath, folder);
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"))
        for (const file of eventFiles) {
            const eventFile = fileUrl(path.join(eventsPath, file));
            const event = await import(eventFile)
            if (event.once) {
                client.once(event.default.name, (...args) => event.default.execute(...args));
            } else {
                client.on(event.default.name, (...args) => event.default.execute(...args));
            }

        }
    }
}

