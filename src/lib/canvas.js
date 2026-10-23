import path from 'node:path';
import { AttachmentBuilder } from 'discord.js';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { fetchBuffer } from './http.js';

const ASSETS = path.join(import.meta.dirname, '..', '..', 'assets');
const FONT = '"Segoe UI", "DejaVu Sans", Arial, sans-serif';

/** Relative luminance check so swatch text stays readable on any colour. */
function textColorFor([r, g, b]) {
 return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#111111' : '#ffffff';
}

export async function colorSwatch(rgb, hex, name = 'swatch.png') {
 const canvas = createCanvas(480, 200);
 const context = canvas.getContext('2d');
 context.fillStyle = hex;
 context.fillRect(0, 0, canvas.width, canvas.height);
 context.fillStyle = textColorFor(rgb);
 context.font = `bold 44px ${FONT}`;
 context.textAlign = 'center';
 context.textBaseline = 'middle';
 context.fillText(hex.toUpperCase(), canvas.width / 2, canvas.height / 2);
 return new AttachmentBuilder(await canvas.encode('png'), { name });
}

function roundedRect(context, x, y, width, height, radius) {
 context.beginPath();
 context.roundRect(x, y, width, height, radius);
 context.closePath();
}

function fitText(context, text, maxWidth, startSize, weight = 'bold') {
 let size = startSize;
 do {
  context.font = `${weight} ${size}px ${FONT}`;
  size -= 2;
 } while (context.measureText(text).width > maxWidth && size > 12);
}

/**
 * Renders a profile card.
 * @param {{ avatarUrl: string, displayName: string, username: string, accent?: string,
 *           stats: {label: string, value: string}[] }} profile
 */
export async function profileCard({ avatarUrl, displayName, username, accent = '#ffe7bc', stats }) {
 const canvas = createCanvas(900, 300);
 const context = canvas.getContext('2d');

 const background = await loadImage(path.join(ASSETS, 'wallpaper.jpg'));
 context.drawImage(background, 0, 0, canvas.width, canvas.height);
 context.fillStyle = 'rgba(10, 10, 20, 0.6)';
 context.fillRect(0, 0, canvas.width, canvas.height);

 roundedRect(context, 16, 16, canvas.width - 32, canvas.height - 32, 24);
 context.lineWidth = 4;
 context.strokeStyle = accent;
 context.stroke();

 const avatar = await loadImage(await fetchBuffer(avatarUrl));
 const centre = { x: 150, y: canvas.height / 2, r: 100 };
 context.save();
 context.beginPath();
 context.arc(centre.x, centre.y, centre.r, 0, Math.PI * 2);
 context.closePath();
 context.clip();
 context.drawImage(avatar, centre.x - centre.r, centre.y - centre.r, centre.r * 2, centre.r * 2);
 context.restore();

 context.beginPath();
 context.arc(centre.x, centre.y, centre.r + 3, 0, Math.PI * 2);
 context.lineWidth = 6;
 context.strokeStyle = accent;
 context.stroke();

 const textX = 290;
 const textWidth = canvas.width - textX - 48;
 context.fillStyle = '#ffffff';
 context.textBaseline = 'alphabetic';
 fitText(context, displayName, textWidth, 48);
 context.fillText(displayName, textX, 100);

 context.fillStyle = '#c8c8d0';
 fitText(context, `@${username}`, textWidth, 26, 'normal');
 context.fillText(`@${username}`, textX, 140);

 const columnWidth = textWidth / Math.max(stats.length, 1);
 stats.forEach(({ label, value }, index) => {
  const x = textX + index * columnWidth;
  context.fillStyle = accent;
  context.font = `bold 18px ${FONT}`;
  context.fillText(label.toUpperCase(), x, 205);
  context.fillStyle = '#ffffff';
  fitText(context, value, columnWidth - 16, 30);
  context.fillText(value, x, 245);
 });

 return new AttachmentBuilder(await canvas.encode('png'), { name: 'profile.png' });
}
