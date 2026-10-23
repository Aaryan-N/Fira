export const DAILY_BASE = 500;
export const DAILY_STREAK_BONUS = 50;
export const DAILY_STREAK_CAP = 10;
export const CURRENCY = '🪙';

const DAY_MS = 86_400_000;

export function startOfUtcDay(date = new Date()) {
 return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Works out whether the daily reward is available and what it pays.
 * Collecting on consecutive UTC days builds a streak worth up to +500 coins.
 */
export function dailyReward(lastCollected, currentStreak = 0, now = new Date()) {
 const today = startOfUtcDay(now);
 const nextAt = new Date(today.getTime() + DAY_MS);

 if (lastCollected && lastCollected >= today) {
  return { available: false, nextAt, streak: currentStreak };
 }

 const continued = lastCollected && lastCollected >= new Date(today.getTime() - DAY_MS);
 const streak = continued ? currentStreak + 1 : 1;
 const bonus = Math.min(streak - 1, DAILY_STREAK_CAP) * DAILY_STREAK_BONUS;
 return { available: true, nextAt, streak, bonus, reward: DAILY_BASE + bonus, today };
}

export function coins(amount) {
 return `${CURRENCY} **${new Intl.NumberFormat('en-US').format(amount)}**`;
}
