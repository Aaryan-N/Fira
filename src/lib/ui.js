import {
 ActionRowBuilder,
 ButtonBuilder,
 ButtonStyle,
 ContainerBuilder,
 MediaGalleryBuilder,
 MediaGalleryItemBuilder,
 MessageFlags,
 SectionBuilder,
 SeparatorBuilder,
 SeparatorSpacingSize,
 TextDisplayBuilder,
 ThumbnailBuilder,
} from 'discord.js';
import { BRAND } from '../config.js';
import { truncate } from './format.js';

// Components V2 messages share a 4000 character budget across all text displays.
const TEXT_LIMIT = 3_900;

const text = content => new TextDisplayBuilder().setContent(content);

function renderFields(fields) {
 return fields
  .filter(field => field && field.value !== undefined && field.value !== null && field.value !== '')
  .map(({ name, value, inline }) => (inline ? `**${name}:** ${value}` : `**${name}**\n${value}`))
  .join('\n');
}

/**
 * Builds a Components V2 container, Fira's standard "card" layout.
 *
 * @param {object} options
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {{name: string, value: string, inline?: boolean}[]} [options.fields]
 * @param {string} [options.thumbnail] URL shown beside the header
 * @param {string|string[]} [options.image] URL(s) shown in a media gallery
 * @param {number} [options.color] accent colour
 * @param {string} [options.footer] small text at the bottom
 * @param {import('discord.js').ActionRowBuilder[]} [options.rows] interactive rows
 */
export function card({
 title,
 description,
 fields = [],
 thumbnail,
 image,
 color = BRAND.color,
 footer,
 rows = [],
} = {}) {
 const container = new ContainerBuilder().setAccentColor(color);

 const header = [title && `## ${title}`, description].filter(Boolean).join('\n');
 const body = renderFields(fields);

 if (thumbnail) {
  const section = new SectionBuilder()
   .addTextDisplayComponents(text(truncate(header || body || '​', TEXT_LIMIT)))
   .setThumbnailAccessory(new ThumbnailBuilder().setURL(thumbnail));
  container.addSectionComponents(section);
  if (header && body) container.addTextDisplayComponents(text(truncate(body, TEXT_LIMIT)));
 } else {
  const content = [header, body].filter(Boolean).join('\n\n');
  if (content) container.addTextDisplayComponents(text(truncate(content, TEXT_LIMIT)));
 }

 const images = [image].flat().filter(Boolean);
 if (images.length) {
  container.addMediaGalleryComponents(
   new MediaGalleryBuilder().addItems(
    ...images.slice(0, 10).map(url => new MediaGalleryItemBuilder().setURL(url)),
   ),
  );
 }

 const actionRows = rows.filter(Boolean);
 if (actionRows.length) {
  container.addSeparatorComponents(
   new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small),
  );
  container.addActionRowComponents(...actionRows);
 }

 if (footer) container.addTextDisplayComponents(text(`-# ${footer}`));

 return container;
}

/** Wraps containers into a reply/edit payload with the Components V2 flag set. */
export function message(containers, { ephemeral = false, files, allowedMentions } = {}) {
 let flags = MessageFlags.IsComponentsV2;
 if (ephemeral) flags |= MessageFlags.Ephemeral;
 return {
  components: [containers].flat(),
  flags,
  ...(files && { files }),
  allowedMentions: allowedMentions ?? { parse: [] },
 };
}

/** Short single-purpose cards for confirmations and errors. */
export const notice = {
 success: (description, title = 'Done') =>
  message(card({ title: `✅ ${title}`, description, color: BRAND.success }), { ephemeral: true }),
 error: (description, title = 'Something went wrong') =>
  message(card({ title: `⚠️ ${title}`, description, color: BRAND.danger }), { ephemeral: true }),
 info: (description, title) => message(card({ title, description }), { ephemeral: true }),
};

/**
 * Sends a payload using whichever response method is valid for the interaction's state.
 * Ephemerality can't be changed by an edit, so the flag is stripped for editReply.
 */
export function respond(interaction, payload) {
 if (interaction.deferred && !interaction.replied) {
  return interaction.editReply({
   ...payload,
   flags: (payload.flags ?? 0) & ~MessageFlags.Ephemeral,
  });
 }
 if (interaction.replied) return interaction.followUp(payload);
 return interaction.reply(payload);
}

/** True when the component interaction was triggered by whoever ran the original command. */
export function isOriginalUser(interaction) {
 const owner = interaction.message?.interactionMetadata?.user?.id;
 return !owner || owner === interaction.user.id;
}

/**
 * Re-renders a component's message. The command's author updates it in place;
 * anyone else gets their own ephemeral copy so they can't hijack someone else's message.
 *
 * @param {import('discord.js').MessageComponentInteraction} interaction
 * @param {() => Promise<object> | object} build produces a message() payload
 */
export async function rerender(interaction, build) {
 if (isOriginalUser(interaction)) await interaction.deferUpdate();
 else await interaction.deferReply({ flags: MessageFlags.Ephemeral });
 const payload = await build();
 return interaction.editReply({
  ...payload,
  flags: payload.flags & ~MessageFlags.Ephemeral,
  ...(payload.files && { attachments: [] }),
 });
}

/** customIds are limited to 100 characters. */
export function fitsCustomId(...parts) {
 return parts.join(':').length <= 100;
}

/** A "do it again" button routed through the generic `again` component handler. */
export function againRow(command, args = [], { label = 'Another one', emoji = '🔁' } = {}) {
 const customId = ['again', command, ...args].join(':');
 if (customId.length > 100) return null;
 return new ActionRowBuilder().addComponents(
  new ButtonBuilder()
   .setCustomId(customId)
   .setLabel(label)
   .setEmoji(emoji)
   .setStyle(ButtonStyle.Secondary),
 );
}

export function linkButton(label, url, emoji) {
 const button = new ButtonBuilder().setLabel(label).setURL(url).setStyle(ButtonStyle.Link);
 return emoji ? button.setEmoji(emoji) : button;
}
