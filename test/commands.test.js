import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';
import { ApplicationCommandType } from 'discord.js';
import { closeDatabases } from '../src/lib/db.js';
import { loadCommands, loadComponents } from '../src/lib/loader.js';
import { CATEGORIES } from '../src/commands/utility/help.js';

const SRC = path.join(import.meta.dirname, '..', 'src');
let commands;
let components;

before(async () => {
 commands = await loadCommands();
 components = await loadComponents();
});
after(() => closeDatabases());

function walkOptions(options = [], visit) {
 for (const option of options) {
  visit(option);
  walkOptions(option.options, visit);
 }
}

describe('command definitions', () => {
 it('serialise to valid Discord payloads', () => {
  for (const [name, command] of commands) {
   assert.doesNotThrow(() => command.data.toJSON(), `/${name} failed validation`);
  }
 });

 it('stay within Discord limits', () => {
  const json = [...commands.values()].map(command => command.data.toJSON());
  const slash = json.filter(
   command =>
    (command.type ?? ApplicationCommandType.ChatInput) === ApplicationCommandType.ChatInput,
  );
  assert.ok(slash.length <= 100, 'too many slash commands');
  assert.ok(json.length - slash.length <= 10, 'too many context menu commands');
  for (const command of slash) {
   assert.match(command.name, /^[-_\p{L}\p{N}]{1,32}$/u);
   assert.ok(command.description.length >= 1 && command.description.length <= 100, command.name);
   walkOptions(command.options, option => {
    assert.ok(option.description.length <= 100, `${command.name}.${option.name}`);
    assert.ok(
     (option.choices?.length ?? 0) <= 25,
     `${command.name}.${option.name} has too many choices`,
    );
   });
  }
 });

 it('declare install types and contexts', () => {
  for (const [name, command] of commands) {
   const json = command.data.toJSON();
   assert.ok(json.integration_types?.length, `${name} is missing integration types`);
   assert.ok(json.contexts?.length, `${name} is missing contexts`);
  }
 });

 it('belong to a help category', () => {
  for (const [name, command] of commands) {
   assert.ok(
    command.category in CATEGORIES,
    `${name} is in unknown category "${command.category}"`,
   );
  }
 });

 it('use cooldowns that are positive numbers', () => {
  for (const [name, command] of commands) {
   if (command.cooldown !== undefined) assert.ok(command.cooldown > 0, name);
  }
 });
});

describe('component routing', () => {
 it('has a handler for every customId prefix used in the source', () => {
  const prefixes = new Set();
  const visit = directory => {
   for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(full);
    else if (entry.name.endsWith('.js')) {
     const source = fs.readFileSync(full, 'utf8');
     for (const [, id] of source.matchAll(/setCustomId\(\s*[`'"]([a-z]+):/g)) prefixes.add(id);
    }
   }
  };
  visit(SRC);
  prefixes.add('again'); // built by againRow()
  for (const prefix of prefixes)
   assert.ok(components.has(prefix), `no handler for "${prefix}:" customIds`);
 });

 it('only uses "again" buttons on commands that can render', () => {
  for (const name of [
   'animal',
   'coinflip',
   'dice',
   'joke',
   'dadjoke',
   'fact',
   'meme',
   'poem',
   'quote',
   'color',
   'minecraft',
  ]) {
   assert.equal(typeof commands.get(name)?.render, 'function', name);
  }
 });
});

describe('deprecated API usage', () => {
 it('never uses the removed ephemeral/fetchReply options', () => {
  const offenders = [];
  const visit = directory => {
   for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) visit(full);
    else if (
     // message(..., { ephemeral }) is Fira's own helper option; raw interaction payloads must use flags.
     /\b(reply|followUp|deferReply|editReply|update)\(\s*\{[^}]*\bephemeral\b|\bfetchReply\b|\bsetDMPermission\b/.test(
      fs.readFileSync(full, 'utf8'),
     )
    ) {
     offenders.push(path.relative(SRC, full));
    }
   }
  };
  visit(SRC);
  assert.deepEqual(offenders, []);
 });
});
