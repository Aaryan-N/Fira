import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Collection, MessageFlags } from 'discord.js';
import interactionCreate from '../src/events/interactionCreate.js';

function fakeClient({ commands = {}, components = {} } = {}) {
 return {
  commands: new Map(Object.entries(commands)),
  components: new Map(Object.entries(components)),
  cooldowns: new Collection(),
 };
}

function fakeInteraction(client, overrides = {}) {
 const sent = [];
 return {
  sent,
  client,
  user: { id: 'user-1' },
  deferred: false,
  replied: false,
  isChatInputCommand: () => false,
  isContextMenuCommand: () => false,
  isAutocomplete: () => false,
  isMessageComponent: () => false,
  isModalSubmit: () => false,
  isRepliable: () => true,
  async reply(payload) {
   this.replied = true;
   sent.push(['reply', payload]);
  },
  async editReply(payload) {
   sent.push(['editReply', payload]);
  },
  async followUp(payload) {
   sent.push(['followUp', payload]);
  },
  ...overrides,
 };
}

const slash = (client, commandName) =>
 fakeInteraction(client, { commandName, isChatInputCommand: () => true });

describe('interaction router', () => {
 it('runs commands and enforces cooldowns per user', async () => {
  let runs = 0;
  const client = fakeClient({
   commands: { hello: { data: { name: 'hello' }, cooldown: 60, execute: async () => runs++ } },
  });

  await interactionCreate.execute(slash(client, 'hello'));
  const second = slash(client, 'hello');
  await interactionCreate.execute(second);

  assert.equal(runs, 1);
  const [[method, payload]] = second.sent;
  assert.equal(method, 'reply');
  assert.ok(payload.flags & MessageFlags.Ephemeral, 'cooldown notice should be ephemeral');
 });

 it('reports command errors with an ephemeral notice', async () => {
  const client = fakeClient({
   commands: {
    boom: {
     data: { name: 'boom' },
     execute: async () => {
      throw new Error('kaboom');
     },
    },
   },
  });
  const interaction = slash(client, 'boom');
  const originalError = console.error;
  console.error = () => {};
  try {
   await interactionCreate.execute(interaction);
  } finally {
   console.error = originalError;
  }
  assert.equal(interaction.sent.length, 1);
  assert.ok(interaction.sent[0][1].flags & MessageFlags.Ephemeral);
 });

 it('edits the deferred reply when a deferred command fails', async () => {
  const client = fakeClient({
   commands: {
    slow: {
     data: { name: 'slow' },
     async execute(interaction) {
      interaction.deferred = true;
      throw new Error('late failure');
     },
    },
   },
  });
  const interaction = slash(client, 'slow');
  const originalError = console.error;
  console.error = () => {};
  try {
   await interactionCreate.execute(interaction);
  } finally {
   console.error = originalError;
  }
  const [[method, payload]] = interaction.sent;
  assert.equal(method, 'editReply');
  assert.equal(
   payload.flags & MessageFlags.Ephemeral,
   0,
   'edits must not carry the ephemeral flag',
  );
 });

 it('routes components by customId prefix and passes the remaining segments', async () => {
  let received;
  const client = fakeClient({
   components: { dice: { id: 'dice', execute: async (_interaction, args) => (received = args) } },
  });
  await interactionCreate.execute(
   fakeInteraction(client, { customId: 'dice:roll:20:3', isMessageComponent: () => true }),
  );
  assert.deepEqual(received, ['roll', '20', '3']);
 });

 it('tells users when a component no longer has a handler', async () => {
  const interaction = fakeInteraction(fakeClient(), {
   customId: 'helpselectmenu',
   isMessageComponent: () => true,
  });
  await interactionCreate.execute(interaction);
  assert.equal(interaction.sent[0][0], 'reply');
 });
});
