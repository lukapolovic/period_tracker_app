/**
 * Calendar-date helpers.
 *
 * Cycle data is stored as calendar dates ('YYYY-MM-DD'), never timestamps, so travel
 * and daylight-saving changes can never shift a logged day. All arithmetic runs in UTC.
 */

export type ISODate = string;

const DAY_MS = 86_400_000;
const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

const MONTHS = [
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
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const pad = (n: number) => String(n).padStart(2, '0');

export function isISODate(value: unknown): value is ISODate {
  if (typeof value !== 'string' || !ISO_RE.test(value)) return false;
  return fromUTC(toUTC(value)) === value;
}

function toUTC(iso: ISODate): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function fromUTC(ms: number): ISODate {
  const dt = new Date(ms);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

/** Today's calendar date in the device's local time zone. */
export function todayISO(now: Date = new Date()): ISODate {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function makeISO(year: number, monthIndex: number, day: number): ISODate {
  return fromUTC(Date.UTC(year, monthIndex, day));
}

export function addDays(iso: ISODate, days: number): ISODate {
  return fromUTC(toUTC(iso) + days * DAY_MS);
}

/** Whole days from `b` to `a` (positive when `a` is later). */
export function diffDays(a: ISODate, b: ISODate): number {
  return Math.round((toUTC(a) - toUTC(b)) / DAY_MS);
}

export function eachDay(from: ISODate, to: ISODate): ISODate[] {
  const out: ISODate[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

export function parts(iso: ISODate) {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, monthIndex: month - 1, day };
}

/** 0 = Sunday … 6 = Saturday */
export function weekdayOf(iso: ISODate): number {
  return new Date(toUTC(iso)).getUTCDay();
}

/** Weeks of the month as rows of 7; days outside the month are null. */
export function monthMatrix(year: number, monthIndex: number, weekStartsOn: 0 | 1): (ISODate | null)[][] {
  const first = makeISO(year, monthIndex, 1);
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const lead = (weekdayOf(first) - weekStartsOn + 7) % 7;
  const cells: (ISODate | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(makeISO(year, monthIndex, d));
  while (cells.length % 7) cells.push(null);
  const rows: (ISODate | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

export function weekdayInitials(weekStartsOn: 0 | 1): string[] {
  const initials = WEEKDAYS.map((w) => w.slice(0, 1));
  return [...initials.slice(weekStartsOn), ...initials.slice(0, weekStartsOn)];
}

type FormatOptions = { weekday?: boolean; month?: 'short' | 'long'; year?: boolean };

/** "3 Nov", "Tuesday, 3 November", "3 Nov 2026" */
export function formatDay(iso: ISODate, opts: FormatOptions = {}): string {
  const { year, monthIndex, day } = parts(iso);
  const monthName = opts.month === 'long' ? MONTHS[monthIndex] : MONTHS[monthIndex].slice(0, 3);
  let out = `${day} ${monthName}`;
  if (opts.year) out += ` ${year}`;
  if (opts.weekday) out = `${WEEKDAYS[weekdayOf(iso)]}, ${out}`;
  return out;
}

/** "3–6 Nov", "28 Nov – 4 Dec", "28 Dec 2026 – 3 Jan 2027" */
export function formatRange(from: ISODate, to: ISODate, opts: { year?: boolean } = {}): string {
  const a = parts(from);
  const b = parts(to);
  const withYear = opts.year || a.year !== b.year;
  if (from === to) return formatDay(from, { year: withYear });
  if (a.year === b.year && a.monthIndex === b.monthIndex) {
    return `${a.day}–${formatDay(to, { year: withYear })}`;
  }
  return `${formatDay(from, { year: withYear })} – ${formatDay(to, { year: withYear })}`;
}

export function formatMonthYear(year: number, monthIndex: number): string {
  return `${MONTHS[monthIndex]} ${year}`;
}

export function weekdayName(iso: ISODate): string {
  return WEEKDAYS[weekdayOf(iso)];
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}
