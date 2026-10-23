export const BRAND = {
 name: 'Fira',
 color: 0xffe7bc,
 success: 0x57f287,
 warning: 0xfee75c,
 danger: 0xed4245,
 muted: 0x99aab5,
};

export const USER_AGENT = 'Fira-Discord-Bot (+https://github.com/Aaryan-N/Fira)';

export const DEFAULT_COOLDOWN_SECONDS = 3;

export const env = {
 get token() {
  return process.env.TOKEN;
 },
 get clientId() {
  return process.env.CLIENTID;
 },
 get devGuildId() {
  return process.env.GUILDID;
 },
 get supportUrl() {
  return process.env.SUPPORT_URL;
 },
};

export function requireEnv(...names) {
 const missing = names.filter(name => !process.env[name]);
 if (missing.length) {
  throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
 }
}
