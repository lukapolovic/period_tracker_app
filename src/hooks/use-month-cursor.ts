import { useState } from 'react';

import { parts, type ISODate } from '@/lib/dates';

/**
 * The month a calendar shows: it starts on today's month and steps back and forth. With `upToToday` it never goes
 * past today's month, for questions about the past.
 */
export function useMonthCursor(today: ISODate, { upToToday = false } = {}) {
  const { year, monthIndex } = parts(today);
  const current = year * 12 + monthIndex;
  // Months counted from year 0, so stepping across a new year is plain arithmetic.
  const [cursor, setCursor] = useState(current);

  return {
    year: Math.floor(cursor / 12),
    monthIndex: cursor % 12,
    isCurrent: cursor === current,
    canGoForward: !upToToday || cursor < current,
    shift: (delta: number) => setCursor((c) => (upToToday ? Math.min(c + delta, current) : c + delta)),
    reset: () => setCursor(current),
  };
}
