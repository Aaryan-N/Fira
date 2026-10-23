import convert from 'color-convert';
import { randomBetween } from './random.js';

/**
 * Parses "#ffcc00", "ffcc00", "#fc0" or "255, 204, 0" into an RGB triple.
 * Returns null when the input is not a colour.
 */
export function parseColor(input) {
 const value = String(input).trim().toLowerCase();

 const hex = value.replace(/^#/, '');
 if (/^[0-9a-f]{3}$/.test(hex)) {
  return [...hex].map(char => parseInt(char + char, 16));
 }
 if (/^[0-9a-f]{6}$/.test(hex)) {
  return [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
 }

 const rgb = value
  .replace(/^rgb\(|\)$/g, '')
  .split(/[\s,]+/)
  .filter(Boolean);
 if (rgb.length === 3 && rgb.every(part => /^\d{1,3}$/.test(part))) {
  const channels = rgb.map(Number);
  if (channels.every(channel => channel <= 255)) return channels;
 }

 return null;
}

export function randomRgb() {
 return [randomBetween(0, 255), randomBetween(0, 255), randomBetween(0, 255)];
}

export function describeColor(rgb) {
 const hex = `#${convert.rgb.hex(rgb)}`;
 const [h, s, l] = convert.rgb.hsl(rgb);
 const [c, m, y, k] = convert.rgb.cmyk(rgb);
 const [hh, ss, vv] = convert.rgb.hsv(rgb);
 return {
  hex,
  int: parseInt(hex.slice(1), 16),
  rgb: `rgb(${rgb.join(', ')})`,
  hsl: `hsl(${h}, ${s}%, ${l}%)`,
  hsv: `hsv(${hh}, ${ss}%, ${vv}%)`,
  cmyk: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`,
  name: convert.rgb.keyword(rgb),
 };
}
