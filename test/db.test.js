// Database-backed command tests. Skipped unless MONGO_TEST_URI points at a disposable MongoDB:
//   MONGO_TEST_URI=mongodb://localhost:27017/fira-test npm test
import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import { Collection, MessageFlags } from 'discord.js';

const uri = process.env.MONGO_TEST_URI;

describe('database flows', { skip: !uri && 'set MONGO_TEST_URI to run' }, () => {
 let db;
 let models;
 let commands;
 let birthdays;
 let tickets;
 const guildId = 'guild-1';

 before(async () => {
  for (const name of [
   'MONGOURLECONOMY',
   'MONGOURLBIRTHDAY',
   'MONGOURLUSERS',
   'MONGOURLTICKET',
   'MONGOURLCONFIG',
  ]) {
   delete process.env[name];
  }
  process.env.MONGO_URI = uri;
  db = await import('../src/lib/db.js');
  await db.connectDatabases();
  await db.db.economy.dropDatabase();
  models = {
   ...(await import('../src/models/Economy.js')),
   ...(await import('../src/models/Birthday.js')),
   ...(await import('../src/models/GuildConfig.js')),
   ...(await import('../src/models/Ticket.js')),
  };
  await Promise.all([models.Economy.init(), models.Birthday.init(), models.GuildConfig.init()]);
  const { loadCommands } = await import('../src/lib/loader.js');
  commands = await loadCommands();
  birthdays = await import('../src/services/birthdays.js');
  tickets = await import('../src/services/tickets.js');
 });

 after(async () => {
  await db.db.economy.dropDatabase();
  await db.closeDatabases();
 });

 beforeEach(async () => {
  await Promise.all([
   models.Economy.deleteMany({}),
   models.Birthday.deleteMany({}),
   models.GuildConfig.deleteMany({}),
   models.Ticket.deleteMany({}),
  ]);
 });

 function interaction(userId, options = {}, subcommand) {
  const sent = [];
  return {
   sent,
   guildId,
   user: { id: userId, displayName: userId, displayAvatarURL: () => 'https://example.com/a.png' },
   guild: { name: 'Test', iconURL: () => null },
   deferred: false,
   replied: false,
   options: {
    getSubcommand: () => subcommand,
    getUser: name => options[name] ?? null,
    getInteger: name => options[name] ?? null,
   },
   async deferReply() {
    this.deferred = true;
   },
   async reply(payload) {
    this.replied = true;
    sent.push(payload);
   },
   async editReply(payload) {
    sent.push(payload);
   },
  };
 }

 const text = payload =>
  JSON.stringify(payload.components.map(component => component.toJSON?.() ?? component));

 it('pays the daily reward exactly once per day, even when requests race', async () => {
  const runs = Array.from({ length: 5 }, () => interaction('alice'));
  await Promise.all(runs.map(run => commands.get('daily').execute(run)));
  const wallet = await models.Economy.findOne({ guildId, userId: 'alice' });
  assert.equal(wallet.balance, 500);
  assert.equal(wallet.dailyStreak, 1);
  assert.equal(await models.Economy.countDocuments({ guildId, userId: 'alice' }), 1);
 });

 it('continues a streak from yesterday', async () => {
  const yesterday = new Date(Date.now() - 86_400_000);
  await models.Economy.create({
   guildId,
   userId: 'bob',
   balance: 0,
   lastDailyCollected: yesterday,
   dailyStreak: 3,
  });
  await commands.get('daily').execute(interaction('bob'));
  const wallet = await models.Economy.findOne({ guildId, userId: 'bob' });
  assert.equal(wallet.dailyStreak, 4);
  assert.equal(wallet.balance, 650);
 });

 it('transfers coins and refuses overdrafts', async () => {
  await models.Economy.create({ guildId, userId: 'alice', balance: 100 });
  const bob = { id: 'bob', bot: false };

  const ok = interaction('alice', { user: bob, amount: 60 });
  await commands.get('pay').execute(ok);
  const tooMuch = interaction('alice', { user: bob, amount: 60 });
  await commands.get('pay').execute(tooMuch);

  assert.equal((await models.Economy.findOne({ guildId, userId: 'alice' })).balance, 40);
  assert.equal((await models.Economy.findOne({ guildId, userId: 'bob' })).balance, 60);
  assert.ok(tooMuch.sent[0].flags & MessageFlags.Ephemeral);
  assert.match(text(tooMuch.sent[0]), /Insufficient funds/);
 });

 it('stores, replaces and removes birthdays', async () => {
  await commands
   .get('birthday')
   .execute(interaction('alice', { day: 14, month: 3, year: 2000 }, 'set'));
  await commands.get('birthday').execute(interaction('alice', { day: 15, month: 3 }, 'set'));
  const stored = await models.Birthday.find({ guildId, userId: 'alice' });
  assert.equal(stored.length, 1);
  assert.equal(stored[0].day, 15);
  assert.equal(stored[0].year, undefined);

  const invalid = interaction('alice', { day: 31, month: 2 }, 'set');
  await commands.get('birthday').execute(invalid);
  assert.match(text(invalid.sent[0]), /Invalid date/);

  await commands.get('birthday').execute(interaction('alice', {}, 'remove'));
  assert.equal(await models.Birthday.countDocuments({ guildId }), 0);
 });

 it('announces birthdays once per day in the configured channel', async () => {
  const today = new Date();
  await models.GuildConfig.create({ guildId, birthdayChannel: 'channel-1' });
  await models.Birthday.create({
   guildId,
   userId: 'alice',
   day: today.getUTCDate(),
   month: today.getUTCMonth() + 1,
   birthDateConcat: 'x',
  });

  const posted = [];
  const client = {
   guilds: { cache: new Collection([[guildId, {}]]) },
   channels: {
    fetch: async () => ({ type: 0, send: async payload => posted.push(payload) }),
   },
  };

  await birthdays.runBirthdayCheck(client);
  await birthdays.runBirthdayCheck(client);

  assert.equal(posted.length, 1);
  assert.match(text(posted[0]), /<@alice>/);
  assert.deepEqual(posted[0].allowedMentions, { users: ['alice'] });
 });

 it('runs a ticket from modal submission through claim and close', async () => {
  await models.GuildConfig.create({ guildId, ticketChannel: 'tickets', ticketStaffRole: 'staff' });

  const threadLog = [];
  const thread = {
   id: 'thread-1',
   toString: () => '<#thread-1>',
   members: { add: async id => threadLog.push(['add', id]) },
   send: async payload => {
    threadLog.push(['send', payload]);
    return { id: `msg-${threadLog.length}` };
   },
   messages: { edit: async (id, payload) => threadLog.push(['edit', id, payload]) },
   setLocked: async locked => threadLog.push(['locked', locked]),
   setArchived: async archived => threadLog.push(['archived', archived]),
  };
  const channel = {
   type: 0,
   guild: { members: { me: {} } },
   permissionsFor: () => ({ has: () => true }),
   toString: () => '<#tickets>',
   threads: { create: async options => (threadLog.push(['create', options]), thread) },
  };

  const submit = interaction('alice');
  Object.assign(submit, {
   user: { id: 'alice', username: 'alice!', tag: 'alice' },
   guild: { channels: { fetch: async () => channel } },
   fields: {
    getTextInputValue: id => ({ subject: 'Help me', details: 'Something is broken here' })[id],
    getStringSelectValues: () => ['report'],
   },
  });
  await tickets.createTicket(submit);

  const ticket = await models.Ticket.findOne({ guildId, userId: 'alice' });
  assert.equal(ticket.isOpen, true);
  assert.equal(ticket.category, 'report');
  assert.equal(ticket.threadId, 'thread-1');
  assert.equal(ticket.number, 1);
  assert.ok(ticket.messageId);
  assert.equal(threadLog[0][1].name, 'ticket-0001-alice');
  assert.match(text(submit.sent.at(-1)), /Ticket opened/);
  const pingMessage = threadLog.find(
   ([kind, payload]) => kind === 'send' && payload.allowedMentions.roles?.length,
  );
  assert.deepEqual(pingMessage[1].allowedMentions, { users: ['alice'], roles: ['staff'] });

  // A non-staff member who isn't the owner can't close it; the owner can.
  const stranger = {
   ...interaction('mallory'),
   member: { permissions: { has: () => false }, roles: { cache: new Map() } },
  };
  assert.ok(await tickets.checkTicketAccess(stranger, ticket));
  const owner = {
   ...interaction('alice'),
   member: { permissions: { has: () => false }, roles: { cache: new Map() } },
  };
  assert.equal(await tickets.checkTicketAccess(owner, ticket), null);
  assert.ok(
   await tickets.checkTicketAccess(owner, ticket, { staffOnly: true }),
   'owners cannot claim',
  );

  const staff = {
   ...interaction('sam'),
   member: { permissions: { has: () => false }, roles: { cache: new Map([['staff', {}]]) } },
  };
  assert.equal(await tickets.checkTicketAccess(staff, ticket, { staffOnly: true }), null);
  await tickets.claimTicket(thread, ticket, 'sam');
  await tickets.closeTicket(thread, ticket, 'alice');

  const closed = await models.Ticket.findById(ticket._id);
  assert.equal(closed.isOpen, false);
  assert.equal(closed.claimedBy, 'sam');
  assert.equal(closed.closedBy, 'alice');
  assert.deepEqual(threadLog.slice(-2), [
   ['locked', true],
   ['archived', true],
  ]);

  // Owners are limited to MAX_OPEN_TICKETS open tickets.
  await models.Ticket.insertMany(
   Array.from({ length: tickets.MAX_OPEN_TICKETS }, () => ({
    guildId,
    userId: 'alice',
    ticketSubjectContent: 's',
    ticketBodyContent: 'b',
    timeTicketCreated: new Date(),
    isOpen: true,
   })),
  );
  const blocked = interaction('alice');
  Object.assign(blocked, { user: { id: 'alice' }, guild: submit.guild, fields: submit.fields });
  await tickets.createTicket(blocked);
  assert.match(text(blocked.sent.at(-1)), /Too many open tickets/);
 });
});
