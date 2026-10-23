import { fetchJson, HttpError } from '../lib/http.js';

// rdap.org redirects to the authoritative registry's RDAP server for the TLD.
// RDAP replaced WHOIS as ICANN's required lookup protocol for gTLDs in 2025.
const RDAP_BOOTSTRAP = 'https://rdap.org/domain/';
const CACHE_TTL_MS = 10 * 60_000;
const cache = new Map();

export const DOMAIN_PATTERN = /^(?=.{1,253}$)(?:(?!-)[a-z0-9-]{1,63}(?<!-)\.)+[a-z]{2,63}$/i;

export function normaliseDomain(input) {
 let value = String(input).trim().toLowerCase();
 value = value
  .replace(/^[a-z]+:\/\//, '')
  .split(/[/?#]/)[0]
  .replace(/\.$/, '');
 value = value.replace(/^www\./, '');
 try {
  value = new URL(`http://${value}`).hostname; // punycode-encodes internationalised names
 } catch {
  return null;
 }
 return DOMAIN_PATTERN.test(value) ? value : null;
}

function vcardValue(vcardArray, field) {
 const entry = vcardArray?.[1]?.find(([name]) => name === field);
 if (!entry) return undefined;
 const value = entry[3];
 if (Array.isArray(value)) return value.flat().filter(Boolean).join(', ') || undefined;
 return value || undefined;
}

function describeEntity(entity) {
 const vcard = entity.vcardArray;
 const contact = {
  name: vcardValue(vcard, 'fn'),
  organization: vcardValue(vcard, 'org'),
  email: vcardValue(vcard, 'email'),
  phone: vcardValue(vcard, 'tel')?.replace(/^tel:/, ''),
  address: vcardValue(vcard, 'adr'),
  url: entity.links?.find(link => link.rel === 'about')?.href,
  ianaId: entity.publicIds?.find(id => id.type === 'IANA Registrar ID')?.identifier,
 };
 return Object.fromEntries(Object.entries(contact).filter(([, value]) => value));
}

function findEntities(entities = [], role, found = []) {
 for (const entity of entities) {
  if (entity.roles?.includes(role)) found.push(entity);
  findEntities(entity.entities, role, found);
 }
 return found;
}

/** Converts a raw RDAP domain response into the shape the /domain command renders. */
export function parseRdap(data) {
 const event = action => data.events?.find(item => item.eventAction === action)?.eventDate;
 const contact = role => {
  const entity = findEntities(data.entities, role)[0];
  return entity ? describeEntity(entity) : {};
 };

 return {
  domain: (data.ldhName ?? data.unicodeName ?? '').toLowerCase(),
  status: data.status ?? [],
  dnssec: data.secureDNS?.delegationSigned ?? null,
  nameservers: (data.nameservers ?? []).map(ns => ns.ldhName?.toLowerCase()).filter(Boolean),
  dates: {
   registered: event('registration'),
   updated: event('last changed'),
   expires: event('expiration'),
  },
  registrar: contact('registrar'),
  registrant: contact('registrant'),
  administrative: contact('administrative'),
  technical: contact('technical'),
  abuse: contact('abuse'),
 };
}

export class DomainNotFoundError extends Error {}

export async function lookupDomain(domain) {
 const cached = cache.get(domain);
 if (cached && cached.expires > Date.now()) return cached.value;

 try {
  const value = parseRdap(
   await fetchJson(RDAP_BOOTSTRAP + encodeURIComponent(domain), {
    headers: { Accept: 'application/rdap+json, application/json' },
    timeout: 10_000,
   }),
  );
  cache.set(domain, { value, expires: Date.now() + CACHE_TTL_MS });
  if (cache.size > 500) cache.delete(cache.keys().next().value);
  return value;
 } catch (error) {
  if (error instanceof HttpError && error.status === 404) throw new DomainNotFoundError(domain);
  throw error;
 }
}
