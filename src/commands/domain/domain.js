import { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder } from 'discord.js';
import { everywhere } from '../../lib/commands.js';
import { capitalize, timestamp } from '../../lib/format.js';
import { card, fitsCustomId, linkButton, message, notice, respond } from '../../lib/ui.js';
import { DomainNotFoundError, lookupDomain, normaliseDomain } from '../../services/rdap.js';

export const SECTIONS = {
 overview: { label: 'Overview', emoji: '🌐' },
 nameservers: { label: 'Nameservers', emoji: '🗂️' },
 registrar: { label: 'Registrar', emoji: '🏢' },
 registrant: { label: 'Registrant', emoji: '👤' },
 administrative: { label: 'Administrative contact', emoji: '🛠️' },
 technical: { label: 'Technical contact', emoji: '⚙️' },
};

const REDACTED = '*Not disclosed (often redacted for privacy)*';

const date = value => (value ? `${timestamp(value, 'D')} (${timestamp(value, 'R')})` : 'Unknown');

function contactFields(contact) {
 const fields = [
  { name: 'Name', value: contact.name },
  { name: 'Organisation', value: contact.organization },
  { name: 'Email', value: contact.email },
  { name: 'Phone', value: contact.phone },
  { name: 'Address', value: contact.address },
  { name: 'IANA ID', value: contact.ianaId },
  { name: 'Website', value: contact.url },
 ].filter(field => field.value);
 return fields.length ? fields : [{ name: 'Details', value: REDACTED }];
}

function sectionFields(info, section) {
 switch (section) {
  case 'nameservers':
   return [
    {
     name: `Nameservers (${info.nameservers.length})`,
     value: info.nameservers.map(ns => `\`${ns}\``).join('\n') || 'None listed',
    },
    {
     name: 'DNSSEC',
     value: info.dnssec === null ? 'Unknown' : info.dnssec ? 'Signed ✅' : 'Unsigned',
     inline: true,
    },
   ];
  case 'registrar':
  case 'registrant':
  case 'administrative':
  case 'technical':
   return contactFields(info[section]);
  default:
   return [
    { name: 'Registrar', value: info.registrar.name ?? 'Unknown', inline: true },
    { name: 'Registered', value: date(info.dates.registered), inline: true },
    { name: 'Last updated', value: date(info.dates.updated), inline: true },
    { name: 'Expires', value: date(info.dates.expires), inline: true },
    {
     name: 'Status',
     value: info.status.map(status => `\`${status}\``).join(' ') || 'Unknown',
    },
    { name: 'Abuse contact', value: info.abuse.email ?? info.abuse.phone, inline: true },
   ];
 }
}

export function domainMessage(info, section = 'overview') {
 const { label, emoji } = SECTIONS[section] ?? SECTIONS.overview;
 const rows = [];

 if (fitsCustomId('domain', 'view', info.domain)) {
  rows.push(
   new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
     .setCustomId(`domain:view:${info.domain}`)
     .setPlaceholder('Choose what to look at')
     .addOptions(
      Object.entries(SECTIONS).map(([value, option]) => ({
       value,
       label: option.label,
       emoji: option.emoji,
       default: value === section,
      })),
     ),
   ),
  );
 }
 rows.push(
  new ActionRowBuilder().addComponents(
   linkButton(
    'Open in ICANN Lookup',
    `https://lookup.icann.org/en/lookup?name=${encodeURIComponent(info.domain)}`,
   ),
  ),
 );

 return message(
  card({
   title: `${emoji} ${info.domain}: ${capitalize(label)}`,
   fields: sectionFields(info, section),
   rows,
   footer: 'Data from the registry via RDAP',
  }),
 );
}

export default {
 cooldown: 5,
 data: everywhere(
  new SlashCommandBuilder()
   .setName('domain')
   .setDescription('Domain name tools')
   .addSubcommand(sub =>
    sub
     .setName('lookup')
     .setDescription('Look up a domain registration (RDAP / WHOIS)')
     .addStringOption(option =>
      option
       .setName('domain')
       .setDescription('e.g. example.com')
       .setRequired(true)
       .setMaxLength(253),
     ),
   ),
 ),
 async execute(interaction) {
  const domain = normaliseDomain(interaction.options.getString('domain', true));
  if (!domain) {
   return interaction.reply(
    notice.error('Enter a domain name like `example.com` (no spaces or paths).', 'Invalid domain'),
   );
  }

  await interaction.deferReply();
  try {
   await interaction.editReply(domainMessage(await lookupDomain(domain)));
  } catch (error) {
   if (!(error instanceof DomainNotFoundError)) throw error;
   await respond(
    interaction,
    notice.error(
     `\`${domain}\` isn't registered, or its registry doesn't support RDAP.`,
     'Domain not found',
    ),
   );
  }
 },
};
