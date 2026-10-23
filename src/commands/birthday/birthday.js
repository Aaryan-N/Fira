import { SlashCommandBuilder } from 'discord.js';
import { BRAND } from '../../config.js';
import { guildOnly } from '../../lib/commands.js';
import { formatBirthday, isValidBirthday, MONTHS, nextOccurrence } from '../../lib/dates.js';
import { timestamp } from '../../lib/format.js';
import { card, message, notice } from '../../lib/ui.js';
import { Birthday } from '../../models/Birthday.js';
import { getGuildConfig } from '../../models/GuildConfig.js';

async function setBirthday(interaction) {
 const day = interaction.options.getInteger('day', true);
 const month = interaction.options.getInteger('month', true);
 const year = interaction.options.getInteger('year') ?? undefined;

 if (!isValidBirthday(day, month, year)) {
  return interaction.reply(
   notice.error(
    `${day} ${MONTHS[month - 1]}${year ? ` ${year}` : ''} isn't a valid date.`,
    'Invalid date',
   ),
  );
 }

 await Birthday.findOneAndUpdate(
  { guildId: interaction.guildId, userId: interaction.user.id },
  {
   $set: { day, month, birthDateConcat: `${day} ${month}`, ...(year && { year }) },
   ...(!year && { $unset: { year: '' } }),
  },
  { upsert: true },
 );

 const config = await getGuildConfig(interaction.guildId);
 const next = nextOccurrence(day, month);
 return interaction.reply(
  message(
   card({
    title: '🎂 Birthday saved!',
    color: BRAND.success,
    fields: [
     { name: 'Birthday', value: formatBirthday({ day, month, year }), inline: true },
     { name: 'Next celebration', value: timestamp(next, 'R'), inline: true },
    ],
    footer: config.birthdayChannel
     ? 'Fira will celebrate in this server on the day (UTC).'
     : 'Ask an admin to set a birthday channel with /config so Fira can celebrate!',
   }),
   { ephemeral: true },
  ),
 );
}

async function viewBirthday(interaction) {
 const user = interaction.options.getUser('user') ?? interaction.user;
 const birthday = await Birthday.findOne({ guildId: interaction.guildId, userId: user.id });
 if (!birthday) {
  const self = user.id === interaction.user.id;
  return interaction.reply(
   notice.info(
    self
     ? 'Set yours with `/birthday set`.'
     : `${user.displayName} hasn't shared their birthday here.`,
    'No birthday registered',
   ),
  );
 }
 const next = nextOccurrence(birthday.day, birthday.month);
 return interaction.reply(
  message(
   card({
    title: `🎂 ${user.displayName}'s birthday`,
    thumbnail: user.displayAvatarURL({ size: 128 }),
    fields: [
     // Only show the year to the birthday owner.
     {
      name: 'Birthday',
      value: formatBirthday(
       user.id === interaction.user.id ? birthday : { ...birthday.toObject(), year: undefined },
      ),
      inline: true,
     },
     {
      name: 'Next celebration',
      value: `${timestamp(next, 'D')} (${timestamp(next, 'R')})`,
      inline: true,
     },
    ],
   }),
  ),
 );
}

async function removeBirthday(interaction) {
 const { deletedCount } = await Birthday.deleteOne({
  guildId: interaction.guildId,
  userId: interaction.user.id,
 });
 return interaction.reply(
  deletedCount
   ? notice.success('Your birthday has been removed from this server.', 'Birthday removed')
   : notice.info("You didn't have a birthday registered here.", 'Nothing to remove'),
 );
}

async function upcomingBirthdays(interaction) {
 const birthdays = await Birthday.find({ guildId: interaction.guildId }).limit(5_000);
 const upcoming = birthdays
  .map(birthday => ({ birthday, next: nextOccurrence(birthday.day, birthday.month) }))
  .sort((a, b) => a.next - b.next)
  .slice(0, 10);

 return interaction.reply(
  message(
   card({
    title: '📅 Upcoming birthdays',
    description: upcoming.length
     ? upcoming
        .map(
         ({ birthday, next }) =>
          `${timestamp(next, 'D')}: <@${birthday.userId}> (${timestamp(next, 'R')})`,
        )
        .join('\n')
     : 'No birthdays registered yet. Add yours with `/birthday set`!',
    footer: `${birthdays.length} birthday${birthdays.length === 1 ? '' : 's'} registered in this server`,
   }),
  ),
 );
}

const HANDLERS = {
 set: setBirthday,
 view: viewBirthday,
 remove: removeBirthday,
 upcoming: upcomingBirthdays,
};

export default {
 cooldown: 3,
 data: guildOnly(
  new SlashCommandBuilder()
   .setName('birthday')
   .setDescription('Birthday reminders')
   .addSubcommand(sub =>
    sub
     .setName('set')
     .setDescription('Register your birthday in this server')
     .addIntegerOption(option =>
      option
       .setName('day')
       .setDescription('Day of the month')
       .setRequired(true)
       .setMinValue(1)
       .setMaxValue(31),
     )
     .addIntegerOption(option =>
      option
       .setName('month')
       .setDescription('Month')
       .setRequired(true)
       .addChoices(MONTHS.map((name, index) => ({ name, value: index + 1 }))),
     )
     .addIntegerOption(option =>
      option
       .setName('year')
       .setDescription('Birth year (optional, only shown to you; enables age in announcements)')
       .setMinValue(1900)
       .setMaxValue(new Date().getUTCFullYear()),
     ),
   )
   .addSubcommand(sub =>
    sub
     .setName('view')
     .setDescription("See your birthday or someone else's")
     .addUserOption(option => option.setName('user').setDescription('Whose birthday')),
   )
   .addSubcommand(sub =>
    sub.setName('remove').setDescription('Remove your birthday from this server'),
   )
   .addSubcommand(sub =>
    sub.setName('upcoming').setDescription('The next birthdays in this server'),
   ),
 ),
 async execute(interaction) {
  return HANDLERS[interaction.options.getSubcommand()](interaction);
 },
};
