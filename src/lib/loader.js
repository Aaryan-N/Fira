import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SRC = path.join(import.meta.dirname, '..');

function walk(directory) {
 if (!fs.existsSync(directory)) return [];
 return fs
  .readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => {
   const fullPath = path.join(directory, entry.name);
   if (entry.isDirectory()) return walk(fullPath);
   return entry.name.endsWith('.js') ? [fullPath] : [];
  })
  .sort();
}

async function importAll(folder) {
 const files = walk(path.join(SRC, folder));
 return Promise.all(
  files.map(async file => ({ file, module: (await import(pathToFileURL(file).href)).default })),
 );
}

/** Loads every command module, keyed by its registered name. */
export async function loadCommands() {
 const commands = new Map();
 for (const { file, module } of await importAll('commands')) {
  if (!module?.data || typeof module.execute !== 'function') {
   throw new Error(`Command at ${file} must export default { data, execute }`);
  }
  const { name } = module.data;
  if (commands.has(name)) throw new Error(`Duplicate command name "${name}" in ${file}`);
  module.category ??= path.basename(path.dirname(file));
  commands.set(name, module);
 }
 return commands;
}

/** Loads component handlers (buttons, selects, modals), keyed by customId prefix. */
export async function loadComponents() {
 const components = new Map();
 for (const { file, module } of await importAll('components')) {
  if (!module?.id || typeof module.execute !== 'function') {
   throw new Error(`Component handler at ${file} must export default { id, execute }`);
  }
  if (components.has(module.id)) throw new Error(`Duplicate component id "${module.id}"`);
  components.set(module.id, module);
 }
 return components;
}

export async function loadEvents() {
 return (await importAll('events')).map(({ module }) => module);
}
