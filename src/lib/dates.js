export const MONTHS = [
 'January',
 'February',
 'March',
 'April',
 'May',
 'June',
 'July',
 'August',
 'September',
 'October',
 'November',
 'December',
];

export function isLeapYear(year) {
 return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(month, year = 2000) {
 return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/** Validates a calendar date. Year is optional; Feb 29 is allowed when no year is given. */
export function isValidBirthday(day, month, year) {
 if (!Number.isInteger(day) || !Number.isInteger(month)) return false;
 if (month < 1 || month > 12 || day < 1) return false;
 if (year !== undefined && year !== null) {
  const currentYear = new Date().getUTCFullYear();
  if (!Number.isInteger(year) || year < 1900 || year > currentYear) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date > new Date()) return false;
  return day <= daysInMonth(month, year);
 }
 return day <= daysInMonth(month, 2000); // 2000 is a leap year, so Feb 29 is accepted.
}

export function formatBirthday({ day, month, year }) {
 return `${day} ${MONTHS[month - 1]}${year ? ` ${year}` : ''}`;
}

export function utcDateKey(date = new Date()) {
 return date.toISOString().slice(0, 10);
}

/** Birthdays that should be celebrated on `date` (Feb 29 birthdays move to Feb 28 in common years). */
export function birthdayMatchers(date = new Date()) {
 const day = date.getUTCDate();
 const month = date.getUTCMonth() + 1;
 const matchers = [{ day, month }];
 if (month === 2 && day === 28 && !isLeapYear(date.getUTCFullYear())) {
  matchers.push({ day: 29, month: 2 });
 }
 return matchers;
}

/** Next occurrence (UTC midnight) of a day/month on or after `from`. */
export function nextOccurrence(day, month, from = new Date()) {
 const today = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
 for (let offset = 0; offset < 9; offset++) {
  const year = from.getUTCFullYear() + offset;
  const effectiveDay = month === 2 && day === 29 && !isLeapYear(year) ? 28 : day;
  const candidate = Date.UTC(year, month - 1, effectiveDay);
  if (candidate >= today) return new Date(candidate);
 }
 throw new Error(`No upcoming occurrence for ${day}/${month}`);
}

export function ageOn(birthday, date) {
 if (!birthday.year) return null;
 return date.getUTCFullYear() - birthday.year;
}
