import { randomInt } from 'node:crypto';

/** Inclusive random integer in [min, max]. */
export function randomBetween(min, max) {
 return randomInt(min, max + 1);
}

export function pick(items) {
 return items[randomInt(items.length)];
}
