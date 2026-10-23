// Runs commands against a fake interaction, calling the real third-party APIs, and validates
// the Components V2 payloads they produce. Needs network access but no Discord token or database.
//   npm run smoke
import { Collection, ComponentType, MessageFlags } from 'discord.js';
import { closeDatabases } from '../src/lib/db.js';
import { loadCommands } from '../src/lib/loader.js';

const commands = await loadCommands();

const fakeUser = {
 id: '652433042153144321',
 username: 'fira-smoke',
 displayName: 'Fira Smoke',
 bot: false,
 createdAt: new Date('2020-01-01T00:00:00Z'),
 displayAvatarURL: () => 'https://cdn.discordapp.com/embed/avatars/0.png',
 fetch: async () => fakeUser,
};

const fakeClient = {
 commands,
 user: { ...fakeUser, id: '1000000000000000000', username: 'Fira' },
 application: { commands: { cache: new Collection() } },
 ws: { ping: 42 },
};

function countText(components) {
 let total = 0;
 let count = 0;
 const visit = component => {
  count++;
  if (component.type === ComponentType.TextDisplay) total += component.content.length;
  component.components?.forEach(visit);
  if (component.accessory) visit(component.accessory);
 };
 components.forEach(visit);
 return { total, count };
}

function validate(name, payload) {
 if (!payload) throw new Error('no response sent');
 const json = (payload.components ?? []).map(component => component.toJSON?.() ?? component);
 if (payload.flags & MessageFlags.IsComponentsV2) {
  const { total, count } = countText(json);
  if (total > 4000) throw new Error(`text displays total ${total} chars (limit 4000)`);
  if (count > 40) throw new Error(`${count} components (limit 40)`);
  if (payload.content || payload.embeds?.length)
   throw new Error('V2 messages cannot have content or embeds');
 }
 return json;
}

function fakeInteraction(options = {}, subcommand) {
 const sent = [];
 return {
  sent,
  user: fakeUser,
  client: fakeClient,
  guild: null,
  guildId: null,
  deferred: false,
  replied: false,
  inCachedGuild: () => false,
  inGuild: () => false,
  options: {
   getSubcommand: () => subcommand,
   getString: name => options[name] ?? null,
   getInteger: name => options[name] ?? null,
   getBoolean: name => options[name] ?? null,
   getUser: name => options[name] ?? null,
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

const CASES = [
 ['animal', {}, 'cat'],
 ['animal', {}, 'dog'],
 ['8ball', { question: 'Will this pass?', lucky: true }],
 ['coinflip'],
 ['dice', { sides: 20, count: 5 }],
 ['rps', { choice: 'rock' }],
 ['rps'],
 ['joke', { category: 'Programming' }],
 ['dadjoke'],
 ['fact', { type: 'random' }],
 ['fact', { type: 'cat' }],
 ['fact', { type: 'dog' }],
 ['meme'],
 ['poem'],
 ['quote'],
 ['color', {}, 'random'],
 ['color', { value: '#ffe7bc' }, 'convert'],
 ['color', { value: 'not a colour' }, 'convert'],
 ['domain', { domain: 'example.com' }, 'lookup'],
 ['domain', { domain: 'github.com' }, 'lookup'],
 ['domain', { domain: 'definitely-not-registered-fira-test-12345.com' }, 'lookup'],
 ['minecraft', { address: 'mc.hypixel.net' }, 'server'],
 ['minecraft', { address: 'not valid!' }, 'server'],
 ['ping'],
 ['help'],
 ['invite'],
 ['support'],
];

let failures = 0;
for (const [name, options, subcommand] of CASES) {
 const label = `/${name}${subcommand ? ` ${subcommand}` : ''} ${JSON.stringify(options ?? {})}`;
 const interaction = fakeInteraction(options, subcommand);
 try {
  await commands.get(name).execute(interaction);
  const payload = interaction.sent.at(-1);
  validate(name, payload);
  const files = payload.files?.length ? ` +${payload.files.length} file(s)` : '';
  console.log(`✅ ${label}${files}`);
 } catch (error) {
  failures++;
  console.log(`❌ ${label}: ${error.message}`);
 }
}

await closeDatabases();
console.log(failures ? `\n${failures} case(s) failed` : '\nAll smoke cases passed');
process.exit(failures ? 1 : 0);
