export function truncate(text, max) {
 const value = String(text ?? '');
 return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function capitalize(text) {
 return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatNumber(value) {
 return new Intl.NumberFormat('en-US').format(value);
}

export function formatDuration(ms) {
 const seconds = Math.floor(ms / 1000);
 const parts = [
  [Math.floor(seconds / 86_400), 'd'],
  [Math.floor((seconds % 86_400) / 3_600), 'h'],
  [Math.floor((seconds % 3_600) / 60), 'm'],
  [seconds % 60, 's'],
 ];
 const shown = parts.filter(([amount]) => amount > 0).map(([amount, unit]) => `${amount}${unit}`);
 return shown.length ? shown.join(' ') : '0s';
}

export function formatBytes(bytes) {
 const units = ['B', 'KB', 'MB', 'GB'];
 let value = bytes;
 let unit = 0;
 while (value >= 1024 && unit < units.length - 1) {
  value /= 1024;
  unit++;
 }
 return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`;
}

/** Discord timestamp markup, e.g. <t:1700000000:R>. */
export function timestamp(date, style = 'f') {
 return `<t:${Math.floor(new Date(date).getTime() / 1000)}:${style}>`;
}
