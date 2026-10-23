import { USER_AGENT } from '../config.js';

export class HttpError extends Error {
 constructor(status, url) {
  super(`Request to ${url} failed with status ${status}`);
  this.status = status;
 }
}

export async function fetchJson(url, { timeout = 8_000, headers = {}, ...init } = {}) {
 const response = await fetch(url, {
  ...init,
  headers: { Accept: 'application/json', 'User-Agent': USER_AGENT, ...headers },
  signal: AbortSignal.timeout(timeout),
 });
 if (!response.ok) throw new HttpError(response.status, url);
 return response.json();
}

export async function fetchBuffer(url, { timeout = 8_000 } = {}) {
 const response = await fetch(url, {
  headers: { 'User-Agent': USER_AGENT },
  signal: AbortSignal.timeout(timeout),
 });
 if (!response.ok) throw new HttpError(response.status, url);
 return Buffer.from(await response.arrayBuffer());
}
