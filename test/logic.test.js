import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { describeColor, parseColor } from '../src/lib/color.js';
import { birthdayMatchers, isValidBirthday, nextOccurrence } from '../src/lib/dates.js';
import { DAILY_BASE, dailyReward } from '../src/lib/economy.js';
import { formatDuration, truncate } from '../src/lib/format.js';
import { RPS_CHOICES, rpsOutcome } from '../src/lib/games.js';
import { isValidServerAddress } from '../src/services/minecraft.js';
import { normaliseDomain, parseRdap } from '../src/services/rdap.js';

describe('rps', () => {
 it('scores every combination', () => {
  assert.equal(rpsOutcome('rock', 'scissors'), 'win');
  assert.equal(rpsOutcome('rock', 'paper'), 'lose');
  assert.equal(rpsOutcome('paper', 'paper'), 'draw');
  for (const choice of Object.keys(RPS_CHOICES)) {
   assert.equal(rpsOutcome(choice, RPS_CHOICES[choice].beats), 'win');
  }
 });
 it('rejects unknown moves', () => assert.throws(() => rpsOutcome('lizard', 'rock')));
});

describe('colours', () => {
 it('parses hex and rgb input', () => {
  assert.deepEqual(parseColor('#ffe7bc'), [255, 231, 188]);
  assert.deepEqual(parseColor('FFE7BC'), [255, 231, 188]);
  assert.deepEqual(parseColor('#fc0'), [255, 204, 0]);
  assert.deepEqual(parseColor('255, 231, 188'), [255, 231, 188]);
  assert.deepEqual(parseColor('rgb(1 2 3)'), [1, 2, 3]);
 });
 it('rejects non-colours', () => {
  for (const bad of ['#ggg', 'hello', '256,0,0', '#12345', '']) assert.equal(parseColor(bad), null);
 });
 it('describes a colour in every format', () => {
  const color = describeColor([255, 0, 0]);
  assert.equal(color.hex, '#FF0000');
  assert.equal(color.int, 0xff0000);
  assert.equal(color.hsl, 'hsl(0, 100%, 50%)');
  assert.equal(color.name, 'red');
 });
});

describe('birthdays', () => {
 it('validates dates', () => {
  assert.ok(isValidBirthday(29, 2)); // allowed without a year
  assert.ok(isValidBirthday(29, 2, 2004));
  assert.ok(!isValidBirthday(29, 2, 2003));
  assert.ok(!isValidBirthday(31, 4));
  assert.ok(!isValidBirthday(0, 1));
  assert.ok(!isValidBirthday(1, 13));
  assert.ok(!isValidBirthday(1, 1, 1800));
  assert.ok(!isValidBirthday(1, 1, new Date().getUTCFullYear() + 1));
 });
 it('celebrates leap-day birthdays on 28 Feb in common years', () => {
  assert.deepEqual(birthdayMatchers(new Date('2026-02-28T12:00:00Z')), [
   { day: 28, month: 2 },
   { day: 29, month: 2 },
  ]);
  assert.deepEqual(birthdayMatchers(new Date('2028-02-28T12:00:00Z')), [{ day: 28, month: 2 }]);
 });
 it('finds the next occurrence', () => {
  const from = new Date('2026-10-23T15:00:00Z');
  assert.equal(nextOccurrence(23, 10, from).toISOString(), '2026-10-23T00:00:00.000Z');
  assert.equal(nextOccurrence(1, 1, from).toISOString(), '2027-01-01T00:00:00.000Z');
  assert.equal(nextOccurrence(29, 2, from).toISOString(), '2027-02-28T00:00:00.000Z');
 });
});

describe('daily rewards', () => {
 const now = new Date('2026-10-23T15:00:00Z');
 it('pays the base reward for a first claim', () => {
  const result = dailyReward(undefined, 0, now);
  assert.equal(result.available, true);
  assert.equal(result.streak, 1);
  assert.equal(result.reward, DAILY_BASE);
 });
 it('blocks a second claim on the same UTC day', () => {
  const result = dailyReward(new Date('2026-10-23T00:30:00Z'), 3, now);
  assert.equal(result.available, false);
  assert.equal(result.nextAt.toISOString(), '2026-10-24T00:00:00.000Z');
 });
 it('extends streaks on consecutive days and resets after a gap', () => {
  assert.equal(dailyReward(new Date('2026-10-22T23:59:00Z'), 4, now).streak, 5);
  assert.equal(dailyReward(new Date('2026-10-21T10:00:00Z'), 4, now).streak, 1);
 });
 it('caps the streak bonus', () => {
  assert.equal(dailyReward(new Date('2026-10-22T10:00:00Z'), 100, now).bonus, 500);
 });
});

describe('domains', () => {
 it('normalises user input', () => {
  assert.equal(normaliseDomain('https://www.Example.com/path?q=1'), 'example.com');
  assert.equal(normaliseDomain('sub.example.co.uk.'), 'sub.example.co.uk');
  assert.equal(normaliseDomain('bücher.de'), 'xn--bcher-kva.de');
 });
 it('rejects invalid domains', () => {
  for (const bad of ['localhost', 'not a domain', '-bad.com', 'example', '']) {
   assert.equal(normaliseDomain(bad), null, bad);
  }
 });
 it('parses an RDAP response', () => {
  const info = parseRdap({
   ldhName: 'EXAMPLE.COM',
   status: ['client delete prohibited'],
   secureDNS: { delegationSigned: true },
   nameservers: [{ ldhName: 'A.IANA-SERVERS.NET' }],
   events: [
    { eventAction: 'registration', eventDate: '1995-08-14T04:00:00Z' },
    { eventAction: 'expiration', eventDate: '2027-08-13T04:00:00Z' },
   ],
   entities: [
    {
     roles: ['registrar'],
     publicIds: [{ type: 'IANA Registrar ID', identifier: '376' }],
     vcardArray: [
      'vcard',
      [
       ['version', {}, 'text', '4.0'],
       ['fn', {}, 'text', 'RESERVED-Internet Assigned Numbers Authority'],
      ],
     ],
     entities: [
      {
       roles: ['abuse'],
       vcardArray: [
        'vcard',
        [
         ['email', {}, 'text', 'abuse@example.com'],
         ['tel', {}, 'uri', 'tel:+1.555'],
        ],
       ],
      },
     ],
    },
   ],
  });
  assert.equal(info.domain, 'example.com');
  assert.deepEqual(info.nameservers, ['a.iana-servers.net']);
  assert.equal(info.dnssec, true);
  assert.equal(info.dates.registered, '1995-08-14T04:00:00Z');
  assert.equal(info.registrar.name, 'RESERVED-Internet Assigned Numbers Authority');
  assert.equal(info.registrar.ianaId, '376');
  assert.equal(info.abuse.email, 'abuse@example.com');
  assert.equal(info.abuse.phone, '+1.555');
  assert.deepEqual(info.registrant, {});
 });
});

describe('minecraft addresses', () => {
 it('accepts hostnames and IPs with optional ports', () => {
  for (const ok of ['play.hypixel.net', 'mc.example.co.uk:25565', '1.2.3.4', '10.0.0.1:19132']) {
   assert.ok(isValidServerAddress(ok), ok);
  }
 });
 it('rejects junk', () => {
  for (const bad of ['', 'localhost', '999.1.1.1', 'a.com:99999', 'http://x.com', 'a b.com']) {
   assert.ok(!isValidServerAddress(bad), bad);
  }
 });
});

describe('format', () => {
 it('truncates with an ellipsis', () => {
  assert.equal(truncate('abcdef', 4), 'abc…');
  assert.equal(truncate('abc', 4), 'abc');
 });
 it('formats durations', () => {
  assert.equal(formatDuration(0), '0s');
  assert.equal(formatDuration(90_061_000), '1d 1h 1m 1s');
 });
});
