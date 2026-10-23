import { fetchJson } from '../lib/http.js';

const HOST_PATTERN =
 /^(?:(?:(?!-)[a-z0-9-]{1,63}(?<!-)\.)+[a-z]{2,63}|(?:\d{1,3}\.){3}\d{1,3})(?::\d{1,5})?$/i;

export function isValidServerAddress(address) {
 const value = String(address).trim();
 if (!HOST_PATTERN.test(value)) return false;
 const [host, port] = value.split(':');
 if (port !== undefined && (Number(port) < 1 || Number(port) > 65_535)) return false;
 if (/^[\d.]+$/.test(host)) return host.split('.').every(octet => Number(octet) <= 255);
 return true;
}

/** Fetches server status from mcsrvstat.us (Java or Bedrock edition). */
export async function fetchServerStatus(address, edition = 'java') {
 const base =
  edition === 'bedrock' ? 'https://api.mcsrvstat.us/bedrock/3/' : 'https://api.mcsrvstat.us/3/';
 const data = await fetchJson(base + encodeURIComponent(address.trim()), { timeout: 10_000 });
 return {
  online: Boolean(data.online),
  host: data.hostname ?? address,
  ip: data.ip,
  port: data.port,
  version: data.version,
  software: data.software,
  players: data.players ? { online: data.players.online, max: data.players.max } : null,
  playerSample: data.players?.list?.map(player => player.name).slice(0, 10) ?? [],
  motd:
   data.motd?.clean
    ?.map(line => line.trim())
    .filter(Boolean)
    .join('\n') ?? '',
  icon: data.icon?.startsWith('data:image/png;base64,')
   ? Buffer.from(data.icon.split(',')[1], 'base64')
   : null,
 };
}
