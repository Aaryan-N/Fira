import { ApplicationIntegrationType, InteractionContextType } from 'discord.js';

/** Usable in servers, the bot's DMs and group DMs, and installable to user accounts. */
export function everywhere(builder) {
 return builder
  .setIntegrationTypes(
   ApplicationIntegrationType.GuildInstall,
   ApplicationIntegrationType.UserInstall,
  )
  .setContexts(
   InteractionContextType.Guild,
   InteractionContextType.BotDM,
   InteractionContextType.PrivateChannel,
  );
}

/** Only usable inside servers where Fira itself has been added. */
export function guildOnly(builder) {
 return builder
  .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
  .setContexts(InteractionContextType.Guild);
}
