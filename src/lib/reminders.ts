/**
 * What to remind about and when, worked out from the prediction. Pure, so it can be tested without a phone.
 * Everything is a local notification (MARKET_ANALYSIS.md §12.4): nothing leaves the device.
 */
import type { Prediction } from './cycle';
import { addDays, diffDays, parts, type ISODate } from './dates';

export type ReminderKind = 'period-soon' | 'period-over' | 'ovulation-soon' | 'ovulation-over';

export type Reminder = {
  id: string;
  kind: ReminderKind;
  at: Date;
  body: string;
};

const MORNING = 9;
const EVENING = 20;

/** What shows on a lock screen by default: nothing a passer-by could read anything into. */
const NEUTRAL: Record<ReminderKind, string> = {
  'period-soon': 'You have a reminder',
  'ovulation-soon': 'You have a reminder',
  'period-over': 'Time to check in',
  'ovulation-over': 'Time to check in',
};

const DETAILED: Record<Exclude<ReminderKind, 'period-soon'>, string> = {
  'period-over': 'Your period is likely ending today.',
  'ovulation-soon': 'Your estimated ovulation window starts tomorrow.',
  'ovulation-over': 'Your estimated ovulation window ends today.',
};

function bodyOf(kind: ReminderKind, detailed: boolean, windowDays: number): string {
  if (!detailed) return NEUTRAL[kind];
  return kind === 'period-soon' ? `Your period is likely in 1–${windowDays} days.` : DETAILED[kind];
}

/** One of each, for trying them out. */
export const sampleBodies = (detailed: boolean): string[] =>
  (['period-soon', 'period-over', 'ovulation-soon', 'ovulation-over'] as const).map((kind) => bodyOf(kind, detailed, 5));

function timeOn(date: ISODate, hour: number): Date {
  const { year, monthIndex, day } = parts(date);
  return new Date(year, monthIndex, day, hour);
}

/**
 * The day before each predicted period and ovulation window, the last day of each ovulation window, and the
 * estimated last day of a period in progress. A period you've already ended needs no reminder.
 */
export function buildReminders(p: Prediction, detailed: boolean, now: Date): Reminder[] {
  const reminders: Reminder[] = [];
  const add = (kind: ReminderKind, date: ISODate, hour: number, windowDays = 0) => {
    reminders.push({ id: `${kind}-${date}`, kind, at: timeOn(date, hour), body: bodyOf(kind, detailed, windowDays) });
  };

  for (const w of p.upcoming) {
    add('period-soon', addDays(w.from, -1), MORNING, diffDays(w.to, w.from) + 1);
  }
  if (p.currentPeriod?.endEstimated) {
    add('period-over', p.currentPeriod.end, EVENING);
  }
  for (const w of p.ovulation) {
    add('ovulation-soon', addDays(w.from, -1), MORNING);
    add('ovulation-over', w.to, EVENING);
  }

  return reminders.filter((r) => r.at > now).sort((a, b) => a.at.getTime() - b.at.getTime());
}
