<p align="center"><img src="assets/FiraBannerResized.png" alt="Fira" /></p>

# Fira

A friendly all-round Discord bot: games, an economy, birthday announcements, private support tickets and handy lookup tools. Built on discord.js v14 with Components V2 interfaces, user-installable commands and hybrid sharding.

## Commands

| Category | Commands |
| --- | --- |
| 🎉 Fun & games | `/8ball` · `/coinflip` · `/dice` · `/rps` (button game) · `/joke` · `/dadjoke` · `/fact` · `/meme` · `/profilecard` · **Profile Card** (right-click a user) |
| 🐾 Animals | `/animal cat` · `/animal dog` |
| ✍️ Writing | `/poem` · `/quote` |
| 💰 Economy | `/balance` · `/daily` (with streaks) · `/pay` · `/leaderboard` |
| 🎂 Birthdays | `/birthday set` · `/birthday view` · `/birthday remove` · `/birthday upcoming` · automatic daily announcements |
| 🎫 Tickets | `/ticket create` · `/ticket close` · `/ticket panel` · Claim / Close buttons in each ticket |
| 🎨 Colours | `/color random` · `/color convert` |
| 🌐 Domains | `/domain lookup` (RDAP, the registry protocol that replaced WHOIS) |
| ⛏️ Minecraft | `/minecraft server` (Java & Bedrock status, players, MOTD, icon) |
| 🧰 Utility | `/help` · `/ping` · `/about` · `/serverinfo` · `/userinfo` · **User Info** (right-click a user) · `/invite` · `/support` |
| ⚙️ Admin | `/config`: an interactive settings panel (Manage Server) |

Fun, animal, writing, colour, domain, Minecraft and utility commands can also be **installed to a user account** and used anywhere on Discord, including DMs. Economy, birthdays, tickets and config only work in servers where Fira has been added.

### Interfaces

- **`/help`**: browse categories from a select menu; the pages are generated from the command list, so they never go stale.
- **`/config`**: select menus for the ticket channel, ticket staff role and birthday channel. Changes save instantly, and the panel warns when Fira is missing permissions in a chosen channel.
- **Tickets**: a modal with a category picker opens a private thread visible only to the member and staff, with **Claim** and **Close** buttons. Admins can post a persistent **Open a ticket** panel. Buttons keep working after restarts.
- **"Another one" buttons** on jokes, facts, memes, animals, dice, coin flips and colours. Whoever ran the command updates the message in place; anyone else gets their own private copy.

## Setup

Requirements: **Node.js 22.12+** and **MongoDB**.

1. Create an application at the [Discord Developer Portal](https://discord.com/developers/applications). Under _Installation_, enable both **Guild Install** and **User Install**. No privileged gateway intents are needed.
2. Install dependencies and configure the environment:
   ```bash
   npm install
   cp .env.example .env   # then fill it in
   ```
3. Register the commands:
   ```bash
   npm run deploy          # your dev server (GUILDID), updates instantly
   npm run deploy:global   # everywhere, including user installs
   ```
   Append `-- --clear` to either command to remove the commands registered at that scope.
4. Start the bot (this spawns sharded clusters automatically):
   ```bash
   npm start
   ```
5. In your server, run `/config` to choose a ticket channel and a birthday channel.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `TOKEN` | ✅ | Bot token |
| `CLIENTID` | ✅ for deploy | Application ID |
| `GUILDID` | for `npm run deploy` | Dev server ID |
| `MONGO_URI` | ✅* | MongoDB connection string used for all data |
| `MONGOURLECONOMY` `MONGOURLBIRTHDAY` `MONGOURLUSERS` `MONGOURLTICKET` `MONGOURLCONFIG` | * | Optional per-feature databases (the v1 layout); each overrides `MONGO_URI` |
| `SUPPORT_URL` |  | Support server invite shown in `/support`, `/help` and `/about` |
| `SHARDS_PER_CLUSTER` |  | Shards per process (default 2) |

### Docker

```bash
docker build -t fira .
docker run --env-file .env fira
```

## Development

```bash
npm run lint           # ESLint
npm run format         # Prettier
npm test               # unit tests (node:test, no network or database needed)
MONGO_TEST_URI=mongodb://localhost:27017/fira-test npm test   # also run the database tests
npm run smoke          # runs commands against the real third-party APIs
npm run check          # lint + format check + tests (what CI runs)
```

Project layout:

```
src/
  index.js        cluster manager (entry point)
  bot.js          per-cluster Discord client
  commands/<category>/   slash & context-menu commands (category = help section)
  components/     button / select / modal handlers, routed by customId prefix
  events/         gateway event handlers
  models/         Mongoose models
  services/       tickets, birthdays, RDAP, Minecraft
  lib/            UI (Components V2), HTTP, canvas, dates, economy helpers
scripts/          deploy-commands.js, smoke.js
test/             unit tests
```

Adding a command means dropping a file into `src/commands/<category>/` that exports `{ data, execute }`, with optional `cooldown`, `render` (for "another one" buttons) and `autocomplete`. Interactive components use customIds shaped like `handler:action:args`, and each prefix maps to a file in `src/components/`.

## Upgrading from v1

- Existing MongoDB data is kept: the models use the same collections, and the old `MONGOURL*` variables still work.
- Re-run `npm run deploy:global` once. Several commands were renamed or grouped (`/catpic` → `/animal cat`, `/checkbalance` → `/balance`, `/registerbirthday` → `/birthday set`, `/createticket` → `/ticket create`, `/motd` → `/minecraft server`, `/domainsearch` → `/domain lookup`, `/stats` → `/serverinfo`, `/memes` → `/meme`, `/poetry` → `/poem`, `/quotes` → `/quote`, `/ticketconfig` → `/config`). Re-deploying removes the old names.
- The Hack Club Arcade commands were removed because the Hack Hour API has shut down, so `HCBAPIKEY` is no longer used.
- The **Message Content** and **Server Members** privileged intents are no longer required.

Contributions and suggestions are welcome!
