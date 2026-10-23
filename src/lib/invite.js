import { OAuth2Scopes, PermissionFlagsBits, PermissionsBitField } from 'discord.js';

/** The permissions Fira's features need: messages, attachments, and ticket threads. */
export const BOT_PERMISSIONS = new PermissionsBitField([
 PermissionFlagsBits.ViewChannel,
 PermissionFlagsBits.SendMessages,
 PermissionFlagsBits.EmbedLinks,
 PermissionFlagsBits.AttachFiles,
 PermissionFlagsBits.ReadMessageHistory,
 PermissionFlagsBits.UseExternalEmojis,
 PermissionFlagsBits.CreatePrivateThreads,
 PermissionFlagsBits.SendMessagesInThreads,
 PermissionFlagsBits.ManageThreads,
]);

export function inviteUrl(clientId) {
 const params = new URLSearchParams({
  client_id: clientId,
  permissions: BOT_PERMISSIONS.bitfield.toString(),
  integration_type: '0',
  scope: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands].join(' '),
 });
 return `https://discord.com/oauth2/authorize?${params}`;
}

/** Link for installing Fira to a user account (user-installable commands). */
export function userInstallUrl(clientId) {
 const params = new URLSearchParams({
  client_id: clientId,
  integration_type: '1',
  scope: OAuth2Scopes.ApplicationsCommands,
 });
 return `https://discord.com/oauth2/authorize?${params}`;
}
